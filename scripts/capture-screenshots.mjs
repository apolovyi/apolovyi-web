#!/usr/bin/env node
/**
 * Capture screenshots across all viewports for review.
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs                  # All viewports
 *   node scripts/capture-screenshots.mjs --viewport=mobile-m
 *   node scripts/capture-screenshots.mjs --section=experience
 *   node scripts/capture-screenshots.mjs --help
 */

import { runViewportTests, VIEWPORTS, ensureDevServer } from './test-utils.mjs'

const SECTIONS = ['hero', 'about', 'experience', 'projects', 'contact']

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    viewports: null,
    sections: null,
    outputDir: '.tmp',
  }

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      console.log(`
Capture screenshots across viewports for review.

Options:
  --viewport=NAME    Single viewport (mobile-s, mobile-m, mobile-l, tablet, desktop, wide)
  --viewports=N1,N2  Multiple viewports, comma-separated
  --section=NAME     Single section (hero, about, experience, projects, contact)
  --sections=N1,N2   Multiple sections, comma-separated
  --output=DIR       Output directory (default: .tmp)
  --help, -h         Show this help

Examples:
  node scripts/capture-screenshots.mjs
  node scripts/capture-screenshots.mjs --viewport=mobile-m --section=experience
  node scripts/capture-screenshots.mjs --viewports=mobile-m,desktop --sections=hero,contact
`)
      process.exit(0)
    }

    const [key, value] = arg.replace('--', '').split('=')
    if (key === 'viewport') {
      options.viewports = [value]
    } else if (key === 'viewports') {
      options.viewports = value.split(',')
    } else if (key === 'section') {
      options.sections = [value]
    } else if (key === 'sections') {
      options.sections = value.split(',')
    } else if (key === 'output') {
      options.outputDir = value
    }
  }

  // Defaults
  if (!options.viewports) {
    options.viewports = Object.keys(VIEWPORTS)
  }
  if (!options.sections) {
    options.sections = SECTIONS
  }

  return options
}

async function captureSection(ctx, section, vpName, outputDir) {
  const { screenshot } = ctx

  // Navigate to section (except hero which is default)
  if (section !== 'hero') {
    await ctx.goToSection(section)
  }

  const filename = `${outputDir}/${vpName}-${section}.png`
  await screenshot(filename)
}

async function main() {
  const options = parseArgs()

  console.log('\n📸 Screenshot Capture')
  console.log('=====================')
  console.log(`Viewports: ${options.viewports.join(', ')}`)
  console.log(`Sections: ${options.sections.join(', ')}`)
  console.log(`Output: ${options.outputDir}/`)
  console.log('')

  // Ensure server is running before starting tests
  await ensureDevServer()

  await runViewportTests(
    'Screenshot Capture',
    async (ctx) => {
      for (const section of options.sections) {
        await captureSection(ctx, section, ctx.viewportName, options.outputDir)
      }
    },
    { viewports: options.viewports }
  )

  console.log(`\n✅ Screenshots saved to ${options.outputDir}/`)
  console.log('   Review with: open ' + options.outputDir + '/*.png\n')
}

main().catch((error) => {
  console.error('\n❌ Capture failed:', error.message)
  process.exit(1)
})
