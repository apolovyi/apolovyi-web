import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'
import zlib from 'zlib'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4173
const ROOT = path.resolve('out')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
}

function safeJoin(root, p) {
  const resolved = path.resolve(root, p)
  if (!resolved.startsWith(root)) return root
  return resolved
}

function cachingHeaders(reqPath, ext) {
  // Cache HTML minimally; long-cache static assets
  if (ext === '.html') return { 'Cache-Control': 'no-cache' }
  const longCache = ['.js', '.mjs', '.css', '.json', '.woff2', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico']
  if (reqPath.startsWith('/_next/') || longCache.includes(ext)) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' }
  }
  return { 'Cache-Control': 'public, max-age=3600' }
}

function shouldCompress(type) {
  return /^(text\/|application\/(javascript|json)|image\/svg\+xml)/.test(type)
}

function getCompressor(req, res) {
  const enc = (req.headers['accept-encoding'] || '').toString()
  if (enc.includes('br') && typeof zlib.createBrotliCompress === 'function') {
    res.setHeader('Content-Encoding', 'br')
    return zlib.createBrotliCompress()
  }
  if (enc.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip')
    return zlib.createGzip()
  }
  return null
}

function send(res, status, data, headers = {}) {
  res.writeHead(status, headers)
  res.end(data)
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/')
  // Decode percent-encodings so encoded URL segments (e.g., %5B%5B...lang%5D%5D) map to real filesystem paths like [[...lang]]
  let reqPath = decodeURIComponent(parsed.pathname || '/')

  // Default to index.html for root
  if (reqPath.endsWith('/')) reqPath += 'index.html'

  const relPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath
  let filePath = safeJoin(ROOT, relPath)
  let stat = null
  try {
    stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
      stat = fs.statSync(filePath)
    }
  } catch {
    // Fallback for SPA-style routes: try index.html
    filePath = path.join(ROOT, 'index.html')
    try {
      stat = fs.statSync(filePath)
    } catch {
      send(res, 404, 'Not Found')
      return
    }
  }

  const ext = path.extname(filePath)
  const type = mime[ext] || 'application/octet-stream'

  try {
    const stream = fs.createReadStream(filePath)
    const headers = { 'Content-Type': type, ...cachingHeaders(reqPath, ext) }

    // Compression for text-based content
    if (shouldCompress(type)) {
      const compressor = getCompressor(req, res)
      if (compressor) {
        res.writeHead(200, headers)
        stream.pipe(compressor).pipe(res)
        return
      }
    }

    res.writeHead(200, headers)
    stream.pipe(res)
  } catch {
    send(res, 500, 'Internal Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`STATIC_SERVER_READY on http://localhost:${PORT}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

