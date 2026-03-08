# Auto-Documentation System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Create a self-maintaining documentation system where `.claude/docs/*.md` reference files are auto-generated from the codebase on every pre-commit, and CLAUDE.md is slimmed to ~120 lines of principles-only content.

**Architecture:** A Node.js script (`scripts/generate-claude-docs.mjs`) scans the codebase (package.json, component directories, config files, test files, CI workflows) and outputs 6 markdown files to `.claude/docs/`. The pre-commit hook runs this script and stages the output. CLAUDE.md is hand-written and references the generated docs.

**Tech Stack:** Node.js (ESM, no dependencies), Husky pre-commit hooks, Git

---

## Pre-Implementation: Understand Current State

**Current file layout:**

- `CLAUDE.md` — ~600 lines, gitignored, mixes principles with detailed reference
- `.claude/` — gitignored, contains `settings.local.json`, `agents/`, `commands/`
- `.todo/` — gitignored, contains `README.md`, `E2E_TEST_STABILITY.md`, `archive/` (8 files + 1 PNG)
- `.husky/pre-commit` — runs `npx lint-staged`
- `docs/` — does not exist yet

**Target file layout:**

- `CLAUDE.md` — ~120 lines, committed, principles + references only
- `.claude/docs/*.md` — 6 auto-generated files, committed
- `.claude/settings.local.json`, `.claude/agents/`, `.claude/commands/` — still gitignored
- `TODO.md` — hand-written task list, committed
- `docs/archive/` — historical plans moved from `.todo/archive/`
- `docs/plans/` — design documents (like this file)
- `.todo/` — deleted entirely

---

### Task 1: Create Directory Structure

**Files:**

- Create: `docs/archive/` (directory)
- Create: `.claude/docs/` (directory)

**Step 1: Create directories**

```bash
mkdir -p docs/archive
mkdir -p .claude/docs
```

**Step 2: Verify**

```bash
ls -d docs/archive .claude/docs
```

Expected: Both directories listed.

---

### Task 2: Move Archive Files

**Files:**

- Move: `.todo/archive/*.md` → `docs/archive/`
- Move: `.todo/archive/aurora-issue.PNG` → `docs/archive/`
- Move: `.todo/E2E_TEST_STABILITY.md` → `docs/archive/`

**Step 1: Move all archive files**

```bash
mv .todo/archive/* docs/archive/
mv .todo/E2E_TEST_STABILITY.md docs/archive/
```

**Step 2: Verify**

```bash
ls docs/archive/
```

Expected: 8 markdown files + 1 PNG + E2E_TEST_STABILITY.md (10 files total).

---

### Task 3: Create TODO.md

**Files:**

- Create: `TODO.md`

Extract active items from `.todo/README.md`. The project is in maintenance mode, so this is a short file.

**Step 1: Write TODO.md**

```markdown
# TODO

## Active

- [ ] Address animation timing inconsistency (low priority, multiple files, contextually appropriate variations 0.3-0.4s)

## Backlog

- [ ] Monitor Lighthouse scores

## Recently Completed

- [x] E2E stability Phase 1-3 (config, locators, fixtures)
- [x] Next.js 16 + Turbopack + React Compiler
- [x] Tailwind CSS v4 migration
- [x] pnpm migration
- [x] Dark mode toggle
- [x] Career Metro Map
- [x] Mobile train journey
- [x] Impact metrics callouts
- [x] Custom cursor system

## Archive

Detailed implementation docs for completed features: `docs/archive/`
```

**Step 2: Verify file exists and is readable**

```bash
cat TODO.md
```

---

### Task 4: Write the Generation Script

**Files:**

- Create: `scripts/generate-claude-docs.mjs`

This is the core piece. Plain Node.js ESM, no dependencies, <1 second execution.

**Step 1: Write `scripts/generate-claude-docs.mjs`**

```javascript
#!/usr/bin/env node

/**
 * Auto-generates .claude/docs/*.md reference files from the codebase.
 * Runs on pre-commit via .husky/pre-commit.
 *
 * Output:
 *   .claude/docs/architecture.md
 *   .claude/docs/dependencies.md
 *   .claude/docs/scripts-and-tools.md
 *   .claude/docs/e2e-testing.md
 *   .claude/docs/career-data.md
 *   .claude/docs/ci-pipelines.md
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DOCS_DIR = path.join(ROOT, '.claude', 'docs')

fs.mkdirSync(DOCS_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(relPath) {
	try {
		return fs.readFileSync(path.join(ROOT, relPath), 'utf-8')
	} catch {
		return null
	}
}

function readJSON(relPath) {
	const content = readFile(relPath)
	if (!content) return null
	try {
		return JSON.parse(content)
	} catch {
		return null
	}
}

function listDir(relPath) {
	const full = path.join(ROOT, relPath)
	if (!fs.existsSync(full)) return []
	return fs.readdirSync(full, { withFileTypes: true })
}

/** Build a tree string for a directory, max 2 levels deep. */
function buildTree(relPath, maxDepth = 2, depth = 0, prefix = '') {
	const entries = listDir(relPath)
		.filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules')
		.sort((a, b) => {
			if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
			return a.name.localeCompare(b.name)
		})

	const lines = []
	entries.forEach((entry, i) => {
		const isLast = i === entries.length - 1
		const connector = isLast ? '\u2514\u2500\u2500 ' : '\u251c\u2500\u2500 '
		const childPrefix = prefix + (isLast ? '    ' : '\u2502   ')
		const name = entry.isDirectory() ? entry.name + '/' : entry.name

		lines.push(prefix + connector + name)

		if (entry.isDirectory() && depth < maxDepth - 1) {
			lines.push(...buildTree(path.join(relPath, entry.name), maxDepth, depth + 1, childPrefix))
		}
	})
	return lines
}

/** Count test() calls in a spec file. */
function countTests(relPath) {
	const content = readFile(relPath)
	if (!content) return 0
	return (content.match(/\btest\s*\(/g) || []).length
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function generateArchitecture() {
	const nextConfig = readFile('next.config.js') || ''
	const tsConfig = readJSON('tsconfig.json') || {}
	const i18nConfig = readFile('i18n-config.ts') || ''
	const pkg = readJSON('package.json') || {}

	const isStaticExport = nextConfig.includes("output: 'export'")
	const paths = tsConfig.compilerOptions?.paths || {}
	const aliases = Object.entries(paths).map(([alias, targets]) => `- \`${alias}\` \u2192 \`${targets[0]}\``)

	const localeMatch = i18nConfig.match(/locales:\s*\[([^\]]+)\]/)
	const locales = localeMatch
		? localeMatch[1]
				.replace(/'/g, '')
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)
		: []

	const componentTree = buildTree('components')
	const deps = pkg.dependencies || {}

	return `# Architecture Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Static Export

- Output: ${isStaticExport ? '\`export\` (static site, no SSR)' : 'server-side'}
- Config: \`next.config.js\`

## i18n Routing

- Locales: ${locales.join(', ')}
- Route: \`app/[lang]/\` dynamic segment
- Dictionaries: \`dictionaries/*.json\` validated against Zod schema (\`lib/dictionary.schema.ts\`)
- Server: \`getDictionary()\` from \`lib/dictionary.server.ts\`
- Client: \`useDictionary()\` hook from \`DictionaryContext\`

## Path Aliases

${aliases.join('\n')}

## Component Tree

\`\`\`
components/
${componentTree.join('\n')}
\`\`\`

## Key Patterns

${deps.motion ? '- **Animations**: \`motion\` library (Framer Motion fork)' : ''}
${deps.lenis ? '- **Smooth scroll**: Lenis via \`SmoothScrollProvider\`' : ''}
${deps.three ? '- **3D**: Three.js (globe visualization)' : ''}
- **Styling**: Tailwind CSS v4 with \`class\` dark mode
- **Forms**: Netlify Forms (\`data-netlify="true"\` in \`GetInTouch.tsx\`)

## Deployment

- **Host**: Netlify (static, auto-deploys from \`main\`)
- **Analytics**: TinyAnalytics (production only)
- **Forms**: Netlify Forms (registered via \`public/__forms.html\`)
`
}

function generateDependencies() {
	const pkg = readJSON('package.json') || {}

	const formatTable = (deps) =>
		Object.entries(deps)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([name, version]) => `| \`${name}\` | ${version} |`)
			.join('\n')

	return `# Dependencies Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Runtime

| Key | Value |
|-----|-------|
| Package Manager | \`${pkg.packageManager || 'unknown'}\` |
| Node (CI) | See \`.github/workflows/ci.yml\` and \`netlify.toml\` |

## Dependencies

| Package | Version |
|---------|---------|
${formatTable(pkg.dependencies || {})}

## Dev Dependencies

| Package | Version |
|---------|---------|
${formatTable(pkg.devDependencies || {})}
`
}

function generateScripts() {
	const pkg = readJSON('package.json') || {}

	const scriptsTable = Object.entries(pkg.scripts || {})
		.map(([name, cmd]) => `| \`${name}\` | \`${cmd}\` |`)
		.join('\n')

	const lintStaged = pkg['lint-staged'] || {}
	const lintStagedTable = Object.entries(lintStaged)
		.map(([pattern, cmds]) => {
			const commands = Array.isArray(cmds) ? cmds.join(', ') : cmds
			return `| \`${pattern}\` | ${commands} |`
		})
		.join('\n')

	const sizeLimit = pkg['size-limit'] || []
	const sizeLimitTable = sizeLimit
		.map((entry) => `| ${entry.name || 'unnamed'} | \`${entry.path}\` | ${entry.limit || 'none'} |`)
		.join('\n')

	return `# Scripts & Tools Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Package Scripts

| Script | Command |
|--------|---------|
${scriptsTable}

## lint-staged (pre-commit)

| Pattern | Commands |
|---------|----------|
${lintStagedTable}

## Bundle Size Limits

| Name | Path | Limit |
|------|------|-------|
${sizeLimitTable}
`
}

function generateE2ETesting() {
	const e2eEntries = listDir('e2e')
	const specFiles = e2eEntries
		.filter((e) => e.name.endsWith('.spec.ts'))
		.map((e) => e.name)
		.sort()
	const supportFiles = e2eEntries
		.filter((e) => e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts'))
		.map((e) => e.name)
		.sort()

	const testInventory = specFiles.map((f) => {
		const count = countTests(path.join('e2e', f))
		return `| \`${f}\` | ${count} |`
	})
	const totalTests = specFiles.reduce((sum, f) => sum + countTests(path.join('e2e', f)), 0)

	// Extract timeouts from test-config.ts
	const testConfig = readFile('e2e/test-config.ts') || ''
	const timeoutLines = []
	const timeoutRegex = /\/\*\*\s*([^*]+?)\s*\*\/\s*\n\s*(\w+):\s*timeout\((\d+)\)/g
	let match
	while ((match = timeoutRegex.exec(testConfig)) !== null) {
		const [, comment, name, value] = match
		timeoutLines.push(`| \`${name}\` | ${value}ms | ${parseInt(value) * 2}ms | ${comment.trim()} |`)
	}

	// Extract projects from playwright.config.ts
	const playwrightConfig = readFile('playwright.config.ts') || ''
	const projectNames = [...playwrightConfig.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1])

	return `# E2E Testing Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Test Inventory (${totalTests} tests across ${specFiles.length} files)

| File | Tests |
|------|-------|
${testInventory.join('\n')}

## Browser Projects

${projectNames.map((p) => `- \`${p}\``).join('\n')}

Execution: Sequential (1 worker). CI uses 2x timeouts.

## Timeouts (\`e2e/test-config.ts\`)

| Name | Local | CI (2x) | Purpose |
|------|-------|---------|---------|
${timeoutLines.join('\n')}

## Support Files

${supportFiles.map((f) => `- \`e2e/${f}\``).join('\n')}

## Commands

\`\`\`bash
pnpm run test:e2e            # All tests (headless)
pnpm run test:e2e:ui         # Playwright UI mode
pnpm run test:e2e:headed     # Visible browser
pnpm run test:e2e:debug      # Debug with inspector
DEBUG_E2E=true pnpm run test:e2e  # Verbose logging
\`\`\`

## Writing Tests

Use centralized timeouts from \`e2e/test-utils.ts\`:

\`\`\`typescript
import { TIMEOUTS, waitForPageReady } from './test-utils'

test('example', async ({ page }) => {
  await page.goto('/en')
  await waitForPageReady(page)
  await expect(element).toBeVisible({ timeout: TIMEOUTS.visibility })
})
\`\`\`

## Visual Verification

\`\`\`bash
pnpm run test:screenshots
pnpm run test:screenshots -- --viewport=mobile-m --section=experience
\`\`\`

Max image dimension: 2000px (Claude API limit). Use \`.tmp/\` for output.
`
}

function generateCareerData() {
	const careerData = readFile('lib/career-data.ts')
	if (!careerData) return '# Career Data\n\nNo lib/career-data.ts found.\n'

	const stationCount = (careerData.match(/^\s+id:\s*'/gm) || []).length
	const certCount = (careerData.match(/id:\s*'cert-/g) || []).length
	const eduCount = (careerData.match(/id:\s*'edu-/g) || []).length

	const exportedFunctions = [...careerData.matchAll(/export\s+function\s+(\w+)\s*\(/g)].map((m) => m[1])
	const exportedTypes = [...careerData.matchAll(/export\s+(?:type|interface)\s+(\w+)/g)].map((m) => m[1])

	return `# Career Data Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Source

\`lib/career-data.ts\` \u2014 SINGLE SOURCE OF TRUTH for all career content.

## Data Summary

| Type | Count |
|------|-------|
| Career stations | ${stationCount} |
| Certifications | ${certCount} |
| Education entries | ${eduCount} |

## Exported Types

${exportedTypes.map((t) => `- \`${t}\``).join('\n')}

## Helper Functions

${exportedFunctions.map((f) => `- \`${f}()\``).join('\n')}

## Data Flow

\`\`\`
lib/career-data.ts (SINGLE SOURCE OF TRUTH)
        \u2502
        \u251c\u2500\u25b6 generate:dictionaries \u2500\u25b6 dictionaries/*.json
        \u2502                                    \u2502
        \u2502                                    \u25bc
        \u2502                              Dictionary Context
        \u2502                                    \u2502
        \u251c\u2500\u25b6 MyExperience.tsx \u25c4\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
        \u251c\u2500\u25b6 AboutMe.tsx \u25c4\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
        \u251c\u2500\u25b6 StructuredData.tsx (JSON-LD)    \u2502
        \u2514\u2500\u25b6 HeroSection.tsx \u25c4\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\`

## Workflow: Adding/Updating Career Data

1. Edit \`lib/career-data.ts\`
2. Run \`pnpm run generate:dictionaries\` to update \`dictionaries/*.json\`
3. Run \`pnpm run validate:career-data\` to check consistency
4. Run \`pnpm run build\` to verify

## What Gets Auto-Generated

The \`generate:dictionaries\` script updates:
- \`experienceSection.roles\` \u2014 job titles, dates, tasks
- \`heroSection.highlightedTerms\` \u2014 notable companies + current city
- \`heroSection.roles\` \u2014 typewriter animation roles
- \`aboutMeSection.highlightedTerms\` \u2014 technologies + companies

## Adding/Modifying Translations

1. Career/experience content: Edit \`lib/career-data.ts\`, then \`pnpm run generate:dictionaries\`
2. Other content: Edit \`dictionaries/*.json\` directly
3. New keys: Update \`lib/dictionary.schema.ts\`
4. Validate: \`pnpm run validate:dictionaries\`
`
}

function generateCIPipelines() {
	const workflowEntries = listDir('.github/workflows')
	const ymlFiles = workflowEntries
		.filter((e) => e.name.endsWith('.yml') || e.name.endsWith('.yaml'))
		.map((e) => e.name)
		.sort()

	const details = ymlFiles
		.map((f) => {
			const content = readFile(path.join('.github', 'workflows', f))
			if (!content) return null

			const nameMatch = content.match(/^name:\s*(.+)$/m)
			const name = nameMatch ? nameMatch[1].replace(/['"]/g, '').trim() : f

			// Extract trigger event names
			const triggers = []
			const onSection = content.match(/^on:\s*\n((?:\s+.+\n)*)/m)
			if (onSection) {
				const triggerMatches = [...onSection[1].matchAll(/^\s{2}(\w+)/gm)]
				triggers.push(...triggerMatches.map((m) => m[1]))
			} else {
				const inlineOn = content.match(/^on:\s*\[(.+)\]/m)
				if (inlineOn) triggers.push(...inlineOn[1].split(',').map((s) => s.trim()))
			}

			return { file: f, name, triggers }
		})
		.filter(Boolean)

	return `# CI Pipelines Reference

> Auto-generated by \`scripts/generate-claude-docs.mjs\` \u2014 do not edit manually.

## Workflows

${details
	.map(
		(w) => `### ${w.name} (\`${w.file}\`)

- **Triggers**: ${w.triggers.join(', ') || 'unknown'}
- **Config**: \`.github/workflows/${w.file}\``,
	)
	.join('\n\n')}

## Main CI Pipeline (\`ci.yml\`)

Runs on push/PR to \`main\`:
1. Dictionary validation
2. Career data validation
3. Check dictionaries in sync (regenerate + git diff)
4. Prettier check
5. ESLint strict (\`--max-warnings=0\`)
6. Build

## E2E Pipeline (\`e2e.yml\`)

- Draft PRs: core tests only (fast feedback)
- Non-draft PRs: full suite
- Manual dispatch: choice of core/full
`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const generators = {
	'architecture.md': generateArchitecture,
	'dependencies.md': generateDependencies,
	'scripts-and-tools.md': generateScripts,
	'e2e-testing.md': generateE2ETesting,
	'career-data.md': generateCareerData,
	'ci-pipelines.md': generateCIPipelines,
}

let changed = false

for (const [filename, generator] of Object.entries(generators)) {
	const filePath = path.join(DOCS_DIR, filename)
	const newContent = generator()
	const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''

	if (existing !== newContent) {
		fs.writeFileSync(filePath, newContent)
		console.log(`  updated: .claude/docs/${filename}`)
		changed = true
	}
}

if (!changed) {
	console.log('  claude docs: up to date')
}
```

**Step 2: Make it executable**

```bash
chmod +x scripts/generate-claude-docs.mjs
```

**Step 3: Run it and verify output**

```bash
node scripts/generate-claude-docs.mjs
```

Expected: 6 "updated" lines printed.

**Step 4: Verify generated files exist and look correct**

```bash
ls .claude/docs/
```

Expected: `architecture.md`, `career-data.md`, `ci-pipelines.md`, `dependencies.md`, `e2e-testing.md`, `scripts-and-tools.md`

**Step 5: Spot-check one file**

```bash
head -20 .claude/docs/architecture.md
```

Expected: Header with "Auto-generated" notice, Static Export section, i18n Routing section.

---

### Task 5: Add `generate:docs` Script to package.json

**Files:**

- Modify: `package.json`

**Step 1: Add the script**

In the `"scripts"` section of `package.json`, add:

```json
"generate:docs": "node scripts/generate-claude-docs.mjs",
```

Add it after the existing `generate:dictionaries` entry.

**Step 2: Verify it runs**

```bash
pnpm run generate:docs
```

Expected: "claude docs: up to date" (since we just ran it in Task 4).

---

### Task 6: Update .gitignore

**Files:**

- Modify: `.gitignore`

**Step 1: Apply changes**

Remove these lines:

```
/.claude
/CLAUDE.md
/.todo
```

Add in their place:

```
# Claude Code (keep docs/ committed, ignore local config)
/.claude/*
!/.claude/docs/
```

This means:

- `CLAUDE.md` — now tracked (removed from gitignore)
- `.claude/docs/` — tracked (un-ignored via negation)
- `.claude/settings.local.json`, `.claude/agents/`, `.claude/commands/` — still ignored
- `.todo/` — no longer referenced (folder will be deleted)

**Step 2: Verify gitignore works**

```bash
git status
```

Expected: `CLAUDE.md` and `.claude/docs/` files appear as untracked (ready to be committed). `.claude/settings.local.json` should NOT appear.

---

### Task 7: Update Pre-commit Hook

**Files:**

- Modify: `.husky/pre-commit`

**Step 1: Replace contents**

```bash
node scripts/generate-claude-docs.mjs && git add .claude/docs/
npx lint-staged
```

Line 1: Generate docs, stage any changes (no-op if unchanged).
Line 2: Run lint-staged on user's staged files (existing behavior).

**Step 2: Verify hook is executable**

```bash
ls -la .husky/pre-commit
```

Expected: Has execute permission.

---

### Task 8: Rewrite CLAUDE.md

**Files:**

- Rewrite: `CLAUDE.md`

**Step 1: Write new CLAUDE.md (~120 lines)**

````markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.
For detailed reference, see auto-generated docs in `.claude/docs/`.

## Core Principles

### Verify Assumptions First

**CRITICAL:** Before acting on assumptions about business logic, data relationships, or domain knowledge, ASK the user to verify. Do NOT invent data or relationships.

### Features Must Add Real Value

Before implementing any feature, ask: "Will this improve the product for a first-time visitor?"

- Half-implemented features look broken, not "in progress"
- Don't implement features that require assets you don't have
- State the expected value: "This will [benefit] for visitors because [reason]"

### Perfectionism & Quick Wins

Never skip a task if it adds value and is quick to implement. If a fix takes <10 min and improves quality, do it. Browser compatibility, edge cases, accessibility — handle them.

### Verify Before Pushing

Never push without local verification:

1. `pnpm build`
2. `npx serve out -l 3000`
3. `pnpm run test:e2e`
4. Only push after ALL tests pass

CI uses production build (`npx serve out`), not dev server. Behavior differs.

## Quick Reference

### Essential Commands

```bash
pnpm run dev              # Dev server (Turbopack)
pnpm run build            # Production build (static export)
pnpm run check            # Prettier + ESLint strict
pnpm run test:e2e         # E2E tests (headless)
pnpm run generate:dictionaries  # Regenerate i18n from career-data.ts
pnpm run generate:docs    # Regenerate .claude/docs/ reference files
```
````

Full command list: `.claude/docs/scripts-and-tools.md`

### Architecture

- **Static Next.js 16 export**, i18n via `app/[lang]/` (en, de, ch, uk)
- **Dictionary system**: `dictionaries/*.json` validated with Zod, accessed via `getDictionary()` / `useDictionary()`
- **Career data**: single source of truth in `lib/career-data.ts`, auto-generates dictionary content

Details: `.claude/docs/architecture.md` | `.claude/docs/career-data.md`

### Deployment

Production on Netlify (static, auto-deploys from `main`). Contact form via Netlify Forms. Analytics: TinyAnalytics.

## Auto-Generated Reference Docs

All files below are generated by `scripts/generate-claude-docs.mjs` on every pre-commit:

| File                                | Contents                                        |
| ----------------------------------- | ----------------------------------------------- |
| `.claude/docs/architecture.md`      | Component tree, routing, patterns, path aliases |
| `.claude/docs/dependencies.md`      | All dependencies with versions                  |
| `.claude/docs/scripts-and-tools.md` | Package scripts, lint-staged, size limits       |
| `.claude/docs/e2e-testing.md`       | Test inventory, config, timeouts, writing tests |
| `.claude/docs/career-data.md`       | Data flow, helper functions, workflow           |
| `.claude/docs/ci-pipelines.md`      | GitHub Actions workflows and steps              |

## Git Rules

### Branches

- **ALWAYS** use feature branches, **NEVER** commit to main
- Naming: `feature/<description>` or `fix/<description>`
- Merge to main only via PR after CI passes

### Commits

- Subject line only, ~10 words max, imperative
- NO AI attribution, NO emojis, NO `Co-Authored-By` AI lines
- Match existing repo style (capitalization, punctuation)
- Never commit or push unless the user explicitly asks

### Pull Requests

- Short, imperative, descriptive title
- Body: **Summary** (1-3 bullets) + **Testing** section
- No AI mentions unless explicitly requested

## Code Editing Rules

- Small, focused, correct changes over large rewrites
- Abstractions only when 2+ real call sites exist
- Comments only where logic is non-obvious
- Prefer adding tests for non-trivial changes
- Ask for clarification when requirements are ambiguous

## Session Workflow

**Starting:** Check `TODO.md` for pending tasks.

**During:** After completing each item, run `/review` for visual verification on all viewports.

**Ending:** Update `TODO.md`, document what was done, clean up `.tmp/` artifacts.

## Temporary Files

Use `.tmp/` (gitignored). Max image dimension: 2000px for Claude API. Never use system `/tmp/`.

````

---

### Task 9: Delete .todo/ Folder

**Files:**
- Delete: `.todo/` (entire folder — contents already moved in Task 2)

**Step 1: Verify archive files were moved**

```bash
ls docs/archive/
````

Expected: All files that were in `.todo/archive/` plus `E2E_TEST_STABILITY.md`.

**Step 2: Delete .todo/**

```bash
rm -rf .todo
```

**Step 3: Verify it's gone**

```bash
ls .todo 2>&1
```

Expected: "No such file or directory"

---

### Task 10: Full Verification

**Step 1: Run the generation script**

```bash
pnpm run generate:docs
```

Expected: "claude docs: up to date" (no changes).

**Step 2: Check git status**

```bash
git status
```

Expected: New/modified untracked files:

- `CLAUDE.md` (now tracked)
- `.claude/docs/` (6 files)
- `TODO.md`
- `docs/archive/` (10 files)
- `docs/plans/` (this plan file)
- `scripts/generate-claude-docs.mjs`
- Modified: `.gitignore`, `.husky/pre-commit`, `package.json`

**Step 3: Verify CLAUDE.md line count**

```bash
wc -l CLAUDE.md
```

Expected: ~120 lines (under 150).

**Step 4: Verify generated docs are readable**

```bash
wc -l .claude/docs/*.md
```

Expected: Each file 30-150 lines, total ~600 lines.

**Step 5: Test pre-commit hook works end-to-end**

Stage a trivial change and commit to test the hook:

```bash
git checkout -b feature/auto-docs-system
git add -A
git commit -m "Add auto-documentation system"
```

Expected: Pre-commit runs generate-claude-docs.mjs, then lint-staged. Commit succeeds.

---

### Task 11: Post-Implementation Cleanup

**Step 1: Delete stale root-level docs (if desired)**

Check if `ANALYSIS.md`, `OPTIMIZATION_PLAN.md`, `OPTIMIZATION_PLAN_REVIEW.md` in root should be moved to `docs/archive/` or deleted. These are historical analysis files.

**Step 2: Verify no references to `.todo/` remain**

Search codebase for `.todo` references and update any that remain (should only be in this plan doc and possibly old comments).
