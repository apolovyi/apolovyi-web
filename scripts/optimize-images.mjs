#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const root = path.join(process.cwd(), 'public', 'img')

const targets = [
  { file: 'me-bg.jpg', maxW: 600 },
  { file: 'me-white-bg.jpg', maxW: 600 },
]

// include project images too
const projectsDir = path.join(root, 'projects')
if (fs.existsSync(projectsDir)) {
  for (const f of fs.readdirSync(projectsDir)) {
    if (/\.(png|jpe?g)$/i.test(f)) targets.push({ file: path.join('projects', f), maxW: 1200 })
  }
}

function outPath(input, ext) {
  const p = input.replace(/\.(png|jpe?g)$/i, '')
  return `${p}.${ext}`
}

async function optimizeOne(relPath, maxW) {
  const absPath = path.join(root, relPath)
  const baseDir = path.dirname(absPath)
  const baseRel = path.join('public', 'img', relPath)
  if (!fs.existsSync(absPath)) {
    console.warn('Skip, not found:', baseRel)
    return
  }
  const buf = fs.readFileSync(absPath)
  const img = sharp(buf).resize({ width: maxW, withoutEnlargement: true })

  const avifOut = path.join(baseDir, path.basename(outPath(absPath, 'avif')))
  const webpOut = path.join(baseDir, path.basename(outPath(absPath, 'webp')))

  await sharp(buf).resize({ width: maxW, withoutEnlargement: true }).avif({ quality: 45 }).toFile(avifOut)
  await img.webp({ quality: 60 }).toFile(webpOut)

  const origKB = Math.round(buf.length / 1024)
  const avifKB = Math.round(fs.statSync(avifOut).size / 1024)
  const webpKB = Math.round(fs.statSync(webpOut).size / 1024)
  console.log(`Optimized ${baseRel} -> ${path.relative(process.cwd(), avifOut)} (${avifKB}KB), ${path.relative(process.cwd(), webpOut)} (${webpKB}KB). Orig ${origKB}KB`)
}

async function main() {
  for (const t of targets) {
    await optimizeOne(t.file, t.maxW)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

