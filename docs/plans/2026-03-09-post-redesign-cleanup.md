# Post-Redesign Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Remove all dead code left behind by the White Room redesign and align configs with the actual site.

**Working directory:** `/Users/apolovyi/repos/private/apolovyi-web`

**Architecture:** The site is now a single-screen page with ~30 words and 3 links. Many files from the old multi-section portfolio (analytics, career data, contact form, screenshot tools, AI artifacts) have zero consumers and must be deleted. Configs and auto-doc generation must be updated to match.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, pnpm

---

## Task 1: Delete dead libraries

**Files:**

- Delete: `lib/analytics.ts`
- Delete: `lib/cookies.ts`
- Delete: `lib/career-data.ts`
- Delete: `lib/logger.ts`

**Step 1: Delete the files**

```bash
rm lib/analytics.ts lib/cookies.ts lib/career-data.ts lib/logger.ts
```

**Step 2: Verify no remaining imports**

```bash
pnpm exec eslint . --max-warnings=0 2>&1 | head -30
```

Expected: Will fail because files importing these still exist (LanguageDetector, WebVitals, error.tsx). That's expected — we fix those in Task 2.

---

## Task 2: Delete dead components and fix layout

**Files:**

- Delete: `components/LanguageDetector.tsx`
- Delete: `components/WebVitals.ts`
- Delete: `components/shared/DictionaryContext.tsx`
- Modify: `app/[lang]/layout.tsx` — remove 3 dead imports + usages

**Step 1: Delete the components**

```bash
rm components/LanguageDetector.tsx components/WebVitals.ts components/shared/DictionaryContext.tsx
```

**Step 2: Update layout.tsx**

Remove these imports:

```typescript
import LanguageDetector from '@/components/LanguageDetector'
import { WebVitals } from '@/components/WebVitals'
import { DictionaryProvider } from '@/components/shared/DictionaryContext'
```

Remove from JSX:

- `<WebVitals />`
- `<LanguageDetector />`
- `<DictionaryProvider dictionary={dictionary}>` wrapper (replace with just `{children}`)

Also remove the now-unused `dictionary` variable and `getServerDictionary` import in layout (only if layout no longer uses it — check: layout calls `getServerDictionary` for metadata too, so keep the import but remove the `dictionary` variable passed to DictionaryProvider).

Wait — layout uses `getServerDictionary` for `generateMetadata`. So keep the import. Just remove the DictionaryProvider wrapper and the `dictionary` const from `LangLayout`.

**Step 3: Verify lint passes**

```bash
pnpm exec eslint . --max-warnings=0
```

Expected: May still fail on error.tsx — fixed in Task 3.

---

## Task 3: Rewrite error.tsx

**Files:**

- Modify: `app/error.tsx`

**Step 1: Rewrite to match White Room aesthetic**

Replace entire file with:

```tsx
'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6 text-center">
			<div>
				<h1 className="text-4xl font-extralight tracking-tight text-[var(--text-primary)]">Something went wrong</h1>
				<p className="mt-4 text-sm text-[var(--text-body)]">An unexpected error occurred.</p>
				<button
					onClick={() => reset()}
					className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--text-link)] transition-colors hover:text-[var(--text-link-hover)]"
				>
					Try again
				</button>
			</div>
		</div>
	)
}
```

**Step 2: Verify lint passes**

```bash
pnpm exec eslint . --max-warnings=0
```

Expected: PASS — all dead imports are now resolved.

**Step 3: Commit**

```bash
git add -A && git commit -m "delete dead libraries, components, and fix error page"
```

---

## Task 4: Delete dead scripts and assets

**Files:**

- Delete: `scripts/validate-career-data.ts`
- Delete: `scripts/optimize-images.ts`
- Delete: `scripts/capture-screenshots.mjs`
- Delete: `scripts/test-utils.mjs`
- Delete: `public/__forms.html`

**Step 1: Delete the files**

```bash
rm scripts/validate-career-data.ts scripts/optimize-images.ts scripts/capture-screenshots.mjs scripts/test-utils.mjs public/__forms.html
```

**Step 2: Update package.json**

Remove these scripts:

- `"validate:career-data": "npx tsx scripts/validate-career-data.ts"`
- `"optimize:images": "npx tsx scripts/optimize-images.ts"`
- `"test:screenshots": "node scripts/capture-screenshots.mjs"`

Update prebuild — check what it runs:

- `"prebuild": "pnpm run validate:dictionaries"` — this is fine, keep it (validate:dictionaries still exists).

Remove `sharp` from devDependencies (only used by optimize-images.ts).

**Step 3: Verify**

```bash
pnpm install && pnpm run check
```

Expected: PASS

**Step 4: Commit**

```bash
git add -A && git commit -m "delete dead scripts, form asset, and sharp dependency"
```

---

## Task 5: Delete AI artifacts and planning docs

**Files:**

- Delete: `.agents/` directory (4 files)
- Delete: `.claude/skills/` directory (5 subdirs)
- Delete: `docs/plans/2026-03-08-white-room-design-spec.md`
- Delete: `docs/plans/2026-03-08-auto-docs-system.md`
- Modify: `.gitignore`

**Step 1: Delete the directories and files**

```bash
rm -rf .agents/
rm -rf .claude/skills/
rm docs/plans/2026-03-08-white-room-design-spec.md docs/plans/2026-03-08-auto-docs-system.md
```

**Step 2: Add .agents/ to .gitignore**

Add after the `.screenshots/` line:

```
.agents/
```

Note: `.claude/skills/` is already covered by `/.claude/*` in .gitignore.

**Step 3: Commit**

```bash
git add -A && git commit -m "remove AI artifacts and historical planning docs"
```

---

## Task 6: Update generate-claude-docs.mjs

**Files:**

- Modify: `scripts/generate-claude-docs.mjs`

**Step 1: Remove career-data generator**

Delete the entire `generateCareerData()` function (lines ~339-421) and remove `'career-data.md': generateCareerData` from the `generators` object (line ~508).

**Step 2: Update generateArchitecture()**

In the architecture generator:

- Remove the line `- **Client**: \`useDictionary()\` hook from \`DictionaryContext\`` (DictionaryContext was deleted)
- Remove the line `- **Forms**: Netlify Forms (\`data-netlify="true"\` in \`GetInTouch.tsx\`)` (GetInTouch was deleted)
- Remove the line `- **Forms**: Netlify Forms (registered via \`public/\_\_forms.html\`)` (forms.html was deleted)

**Step 3: Delete the stale generated doc**

```bash
rm .claude/docs/career-data.md
```

**Step 4: Regenerate docs and verify**

```bash
node scripts/generate-claude-docs.mjs
pnpm run check
```

**Step 5: Commit**

```bash
git add -A && git commit -m "remove career-data doc generation, update architecture refs"
```

---

## Task 7: Update tailwind.config.js

**Files:**

- Modify: `tailwind.config.js`

**Step 1: Fix font reference**

Change:

```javascript
sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
```

To:

```javascript
sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
```

**Step 2: Commit**

```bash
git add tailwind.config.js && git commit -m "fix tailwind font reference to Outfit"
```

---

## Task 8: Update CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Update Essential Commands**

Remove: `pnpm run generate:dictionaries`
Remove: `pnpm run validate:career-data`

**Step 2: Update Architecture section**

Remove: `- **Career data**: single source of truth in \`lib/career-data.ts\`, auto-generates dictionary content`Remove:`Details: \`.claude/docs/architecture.md\` | \`.claude/docs/career-data.md\``Replace with:`Details: \`.claude/docs/architecture.md\``

**Step 3: Update auto-generated docs table**

Remove the row: `| \`.claude/docs/career-data.md\` | Data flow, helper functions, workflow |`

**Step 4: Commit**

```bash
git add CLAUDE.md && git commit -m "update CLAUDE.md to reflect cleanup"
```

---

## Task 9: Final verification

**Step 1: Full check**

```bash
pnpm run check
pnpm run build
pnpm run test:smoke
CI=1 pnpm run test:e2e
```

All must pass.

**Step 2: Verify file count**

```bash
git diff --stat HEAD~8..HEAD
```

Expected: ~20+ files deleted, ~5 updated, net negative lines.

**Step 3: Push**

```bash
git push
```
