import { spawn } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const LOCALES = ['en', 'de', 'ch', 'uk']
const OUT = 'out'
let passed = 0
let failed = 0

function run(cmd, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
		child.on('error', reject)
		child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))))
	})
}

function check(label, condition) {
	if (condition) {
		passed++
		console.log(`  ✓ ${label}`)
	} else {
		failed++
		console.error(`  ✗ ${label}`)
	}
}

function readFile(path) {
	const full = join(OUT, path)
	if (!existsSync(full)) return null
	return readFileSync(full, 'utf-8')
}

function fileExists(path) {
	return existsSync(join(OUT, path))
}

async function main() {
	console.log('▶ Building static site...')
	await run('npm', ['run', 'build'])

	console.log('\n▶ Checking build output...\n')

	// 1. Locale pages exist
	console.log('[Locale pages]')
	for (const locale of LOCALES) {
		check(`/${locale}.html exists`, fileExists(`${locale}.html`))
	}

	// 2. Root redirect page
	console.log('\n[Root page]')
	const root = readFile('index.html')
	check('/ exists with redirect', root !== null && root.includes('window.location.replace'))

	// 3. SEO & PWA files
	console.log('\n[SEO & PWA]')
	check('/robots.txt exists', fileExists('robots.txt'))
	check('/sitemap.xml exists', fileExists('sitemap.xml'))
	check('/manifest.webmanifest exists', fileExists('manifest.webmanifest'))

	// 4. Favicons
	console.log('\n[Favicons]')
	check('/favicon.ico exists', fileExists('favicon.ico'))
	check('/fav/apple-touch-icon.png exists', fileExists('fav/apple-touch-icon.png'))

	// 5. Content sanity (en page as reference)
	console.log('\n[Content - /en]')
	const en = readFile('en.html')
	if (en) {
		check('contains "Artem Polovyi"', en.includes('Artem Polovyi'))
		check('has structured data', en.includes('application/ld+json'))
		check('has dark mode script', en.includes('prefers-color-scheme'))
		check('has Outfit font variable', en.includes('--font-outfit'))
	}

	// 6. Next.js assets
	console.log('\n[Next.js assets]')
	check('/_next directory exists', fileExists('_next'))

	// Summary
	console.log(`\n${passed + failed} checks: ${passed} passed, ${failed} failed`)
	if (failed > 0) {
		console.error('\n❌ Smoke tests failed')
		process.exit(1)
	}
	console.log('\n✅ Smoke tests passed')
}

main().catch((err) => {
	console.error('❌ Smoke tests failed:', err)
	process.exit(1)
})
