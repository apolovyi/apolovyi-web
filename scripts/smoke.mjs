import { createServer } from 'http'
import { stat } from 'fs/promises'
import { createReadStream } from 'fs'
import { extname, join } from 'path'
import { spawn } from 'child_process'

const locales = ['en', 'de', 'ch', 'uk']
const PORT = 4173
const OUT_DIR = 'out'

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

function contentType(filePath) {
  const ext = extname(filePath)
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.js':
      return 'application/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    default:
      return 'application/octet-stream'
  }
}

function filePathForUrl(urlPath) {
  if (urlPath === '/' || urlPath === '') return join(OUT_DIR, 'index.html')
  // Map "/en" -> "en.html"
  const localeMatch = urlPath.match(/^\/([a-z]{2})$/)
  if (localeMatch) return join(OUT_DIR, `${localeMatch[1]}.html`)
  // Direct mapping to files inside out
  return join(OUT_DIR, urlPath)
}

async function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = (req.url || '/').split('?')[0]
      let target = filePathForUrl(urlPath)

      // If direct target isn't a file, try adding .html
      try {
        const s = await stat(target)
        if (s.isDirectory()) target = join(target, 'index.html')
      } catch {
        if (!target.endsWith('.html')) target = `${target}.html`
      }

      const ct = contentType(target)
      res.setHeader('Content-Type', ct)
      createReadStream(target)
        .on('error', () => {
          res.statusCode = 404
          res.end('Not found')
        })
        .pipe(res)
    } catch {
      res.statusCode = 500
      res.end('Server error')
    }
  })

  await new Promise((resolve) => server.listen(PORT, resolve))
  return server
}

async function httpGet(pathname) {
  const res = await fetch(`http://localhost:${PORT}${pathname}`)
  const text = await res.text()
  return { status: res.status, text }
}

function extractNextAssetUrls(html) {
  const re = /(src|href)=["'](\/[_]next\/[^"']+)["']/g
  const set = new Set()
  let m
  while ((m = re.exec(html))) {
    set.add(m[2])
    if (set.size >= 3) break
  }
  return [...set]
}


async function main() {
  console.log('▶ Building static site...')
  await run('npm', ['run', 'build'])

  console.log('▶ Starting static server...')
  const server = await startStaticServer()

  try {
    // 1) Pages respond with 200 + HTML and correct <html lang>
    // Root path redirects to /en via JS, so we only check locale paths
    const localePaths = locales.map((l) => `/${l}`)
    for (const p of localePaths) {
      const { status, text } = await httpGet(p)
      if (status !== 200) throw new Error(`GET ${p} -> ${status}`)
      if (!text.includes('<!DOCTYPE html>')) throw new Error(`GET ${p} did not return HTML`)
      const expectedLang = p.slice(1)
      if (!text.includes(`<html lang="${expectedLang}"`)) throw new Error(`GET ${p} missing <html lang="${expectedLang}">`)
      console.log(`✓ ${p} OK (lang=${expectedLang})`)
    }

    // Root path should exist and contain redirect script
    const { status: rootStatus, text: rootText } = await httpGet('/')
    if (rootStatus !== 200) throw new Error(`GET / -> ${rootStatus}`)
    if (!rootText.includes("window.location.replace('/en')")) throw new Error('GET / missing redirect script')
    console.log('✓ / OK (redirect to /en)')

    // 2) Critical top-level assets exist
    const assetPaths = ['/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/fav/favicon-32x32.png', '/img/me-bg.webp']
    for (const a of assetPaths) {
      const { status } = await httpGet(a)
      if (status !== 200) throw new Error(`GET ${a} -> ${status}`)
      console.log(`✓ ${a} OK`)
    }

    // 3) A few Next.js static assets referenced by index are fetchable
    const { text: indexHtml } = await httpGet('/')
    const nextAssets = extractNextAssetUrls(indexHtml)
    for (const url of nextAssets) {
      const { status } = await httpGet(url)
      if (status !== 200) throw new Error(`GET ${url} -> ${status}`)
      console.log(`✓ ${url} OK`)
    }

    console.log('✅ Smoke tests passed: routes and assets served without runtime errors')
  } finally {
    await new Promise((r) => server.close(r))
  }
}

main().catch((err) => {
  console.error('❌ Smoke tests failed:', err)
  process.exit(1)
})

