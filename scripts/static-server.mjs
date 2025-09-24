import http from 'http'
import fs from 'fs'
import path from 'path'
import url from 'url'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4173
const ROOT = path.resolve('out')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
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

function send(res, status, data, headers = {}) {
  res.writeHead(status, headers)
  res.end(data)
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/')
  let reqPath = decodeURIComponent(parsed.pathname || '/')

  // Default to index.html for root
  if (reqPath.endsWith('/')) reqPath += 'index.html'

  let filePath = safeJoin(ROOT, reqPath)
  let stat = null
  try {
    stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
      stat = fs.statSync(filePath)
    }
  } catch (e) {
    // Fallback for SPA-style routes: try index.html
    filePath = path.join(ROOT, 'index.html')
    try {
      stat = fs.statSync(filePath)
    } catch (e2) {
      send(res, 404, 'Not Found')
      return
    }
  }

  const ext = path.extname(filePath)
  const type = mime[ext] || 'application/octet-stream'

  try {
    const stream = fs.createReadStream(filePath)
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' })
    stream.pipe(res)
  } catch (e) {
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

