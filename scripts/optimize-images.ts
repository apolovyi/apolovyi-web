#!/usr/bin/env npx tsx

/**
 * Optimizes images in public/img for web delivery
 * Run: npm run optimize:images
 *
 * - Resizes to max 1600px width
 * - Generates WebP versions (much smaller than PNG/JPG)
 * - Keeps original files as fallback
 */
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

const PUBLIC_IMG = path.join(__dirname, '..', 'public', 'img')
const MAX_WIDTH = 1600
const WEBP_QUALITY = 85

interface OptimizeResult {
	file: string
	originalKB: number
	webpKB: number
	savings: string
}

async function optimizeImage(filePath: string): Promise<OptimizeResult | null> {
	const ext = path.extname(filePath).toLowerCase()
	if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

	const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp')

	// Skip if WebP already exists and is newer than source
	if (fs.existsSync(webpPath)) {
		const srcStat = fs.statSync(filePath)
		const webpStat = fs.statSync(webpPath)
		if (webpStat.mtime > srcStat.mtime) {
			return null // Already optimized
		}
	}

	const originalBuffer = fs.readFileSync(filePath)
	const originalKB = Math.round(originalBuffer.length / 1024)

	const webpBuffer = await sharp(originalBuffer)
		.resize({ width: MAX_WIDTH, withoutEnlargement: true })
		.webp({ quality: WEBP_QUALITY })
		.toBuffer()

	fs.writeFileSync(webpPath, new Uint8Array(webpBuffer))
	const webpKB = Math.round(webpBuffer.length / 1024)
	const savings = Math.round((1 - webpKB / originalKB) * 100)

	return {
		file: path.relative(PUBLIC_IMG, filePath),
		originalKB,
		webpKB,
		savings: `${savings}%`,
	}
}

async function walkDir(dir: string): Promise<string[]> {
	const files: string[] = []
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...(await walkDir(fullPath)))
		} else {
			files.push(fullPath)
		}
	}

	return files
}

async function main(): Promise<void> {
	console.log('Optimizing images...\n')

	const files = await walkDir(PUBLIC_IMG)
	const results: OptimizeResult[] = []

	for (const file of files) {
		const result = await optimizeImage(file)
		if (result) {
			results.push(result)
			console.log(`✓ ${result.file}: ${result.originalKB}KB → ${result.webpKB}KB (${result.savings} smaller)`)
		}
	}

	if (results.length === 0) {
		console.log('All images already optimized.')
	} else {
		const totalOriginal = results.reduce((sum, r) => sum + r.originalKB, 0)
		const totalWebp = results.reduce((sum, r) => sum + r.webpKB, 0)
		const totalSavings = Math.round((1 - totalWebp / totalOriginal) * 100)
		console.log(`\n${results.length} images optimized. Total: ${totalOriginal}KB → ${totalWebp}KB (${totalSavings}% smaller)`)
	}
}

main().catch((e) => {
	console.error('Error:', e)
	process.exit(1)
})
