import fs from 'fs'
import path from 'path'

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function pct(n) {
  return Math.round((n || 0) * 100)
}

function printCategoryScores(lhr) {
  const cats = lhr.categories
  const order = ['performance', 'accessibility', 'best-practices', 'seo']
  console.log('\n== Lighthouse Category Scores ==')
  for (const id of order) {
    const cat = cats[id]
    if (!cat) continue
    console.log(`- ${id}: ${pct(cat.score)}`)
  }
}

function printTopFailures(lhr, limit = 10) {
  const audits = lhr.audits || {}
  const failing = Object.values(audits)
    .filter(a => a.score !== 1 && a.score !== null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))

  if (!failing.length) {
    console.log('\nNo failing audits found (all passed).')
    return
  }

  console.log(`\n== Top ${Math.min(limit, failing.length)} failing audits ==`)
  for (const a of failing.slice(0, limit)) {
    const title = a.title || a.id
    const score = a.score === null ? 'n/a' : pct(a.score)
    const display = a.displayValue || ''
    console.log(`• ${title} | score: ${score} | ${display}`)
    const details = a.explanation || a.warning || ''
    if (details) console.log(`  ↳ ${details}`)
  }
}

function findLhrJsonFiles(dir) {
  return (fs.readdirSync(dir)
    .filter(f => f.startsWith('lhr-') && f.endsWith('.json'))
    .map(f => path.join(dir, f))
    .sort())
}

function main() {
  const dir = '.lighthouseci'
  if (!fs.existsSync(dir)) {
    console.error(`${dir} not found. Did you run lhci collect?`)
    process.exit(1)
  }

  let jsonFiles = []
  const manifestPath = path.join(dir, 'manifest.json')
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = readJSON(manifestPath)
      jsonFiles = manifest.map(r => path.join(dir, r.jsonPath)).filter(p => fs.existsSync(p))
    } catch (e) {
      if (process.env.CI || process.env.LHCI_DEBUG) console.warn('LH summary: manifest parse failed')
      void e
      // fallback to listing lhr-*.json
    }
  }
  if (jsonFiles.length === 0) {
    jsonFiles = findLhrJsonFiles(dir)
  }
  if (jsonFiles.length === 0) {
    console.error('No Lighthouse LHR JSON files found.')
    process.exit(1)
  }

  for (const jsonPath of jsonFiles) {
    const lhr = readJSON(jsonPath)
    const formFactor = lhr.configSettings?.formFactor || lhr.environment?.formFactor || 'unknown'
    console.log(`\n==== Report: ${lhr.requestedUrl} (${formFactor}) ====`)
    printCategoryScores(lhr)
    printTopFailures(lhr, 12)
  }
}

main()

