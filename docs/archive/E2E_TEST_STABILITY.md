# E2E Test Stability Improvements

## Status: Phase 3 Complete

Playwright best practices audit and implementation plan for improved test stability.

---

## Current State

- **Tests:** 25 total (consolidated from 70+)
- **Pass rate:** 100% (67 passed, 3 skipped)
- **Browsers:** Chrome, Safari, iPhone 15 (core); 8 total projects
- **CI time:** ~5 min

---

## Issues Identified

| Issue                  | Severity | Occurrences | Description                                       |
| ---------------------- | -------- | ----------- | ------------------------------------------------- |
| `.first()` overuse     | High     | 15+         | Fragile if DOM order changes                      |
| CSS selectors          | Medium   | 10+         | `input[name="x"]` instead of user-facing locators |
| JS evaluate clicks     | Medium   | 1           | Bypasses Playwright's actionability checks        |
| Swallowed errors       | Medium   | 1           | `catch(() => {})` hides real failures             |
| No `data-testid`       | Medium   | All         | No stable test-specific selectors                 |
| Missing config options | Low      | 1           | No screenshot/video on failure                    |

---

## Implementation Plan (Sorted by ROI)

### Phase 1: Quick Wins (20 min) - High ROI

| #   | Task                        | Status | Effort | Files                  |
| --- | --------------------------- | ------ | ------ | ---------------------- |
| 1   | Playwright config hardening | ✅     | 5 min  | `playwright.config.ts` |
| 2   | Fix JS evaluate workaround  | ✅     | 10 min | `navigation.spec.ts`   |
| 3   | Remove swallowed errors     | ✅     | 5 min  | `dark-mode.spec.ts`    |

**Task 1 Details - Playwright Config:**

```typescript
use: {
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10000,
  navigationTimeout: 30000,
}
```

**Task 2 Details - Mobile Menu Click:**
Replace `page.evaluate()` click with proper Playwright locator using `data-testid`.

**Task 3 Details - Error Handling:**
Replace `.catch(() => {})` with explicit state checks.

---

### Phase 2: Core Stability (50 min) - High ROI

| #   | Task                                    | Status | Effort | Files                  |
| --- | --------------------------------------- | ------ | ------ | ---------------------- |
| 4   | Add `data-testid` to components         | ✅     | 20 min | React components       |
| 5   | Replace `.first()` with testid locators | ✅     | 15 min | All spec files         |
| 6   | Use getByRole/getByLabel for forms      | ✅     | 15 min | `contact-form.spec.ts` |

**Task 4 Details - Components to Update:**

| Component        | Elements           | `data-testid`        |
| ---------------- | ------------------ | -------------------- |
| Header           | Theme toggle       | `theme-toggle`       |
| Header           | Mobile menu button | `mobile-menu-toggle` |
| Header           | Mobile menu        | `mobile-menu`        |
| GetInTouch       | Name input         | `contact-name`       |
| GetInTouch       | Email input        | `contact-email`      |
| GetInTouch       | Message textarea   | `contact-message`    |
| GetInTouch       | Submit button      | `contact-submit`     |
| GetInTouch       | Form               | `contact-form`       |
| LanguageSwitcher | Button             | `language-switcher`  |
| LanguageSwitcher | Menu               | `language-menu`      |

**Task 5 Details - Locator Replacements:**

```typescript
// Before:
page.locator('input[name="name"]').first()
page.locator('header button').first()
page.locator('form').first()

// After:
page.getByTestId('contact-name')
page.getByTestId('mobile-menu-toggle')
page.getByTestId('contact-form')
```

**Task 6 Details - Accessibility Locators:**

```typescript
// Before:
page.locator('input[name="email"], input[type="email"]').first()

// After:
page.getByLabel('Email')
// or
page.getByRole('textbox', { name: /email/i })
```

---

### Phase 3: Nice-to-Have (15 min) - Medium ROI

| #   | Task                        | Status | Effort | Files             |
| --- | --------------------------- | ------ | ------ | ----------------- |
| 7   | Create shared test fixtures | ✅     | 15 min | `e2e/fixtures.ts` |

**Task 7 Details - Test Fixtures:**

```typescript
// e2e/fixtures/index.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
	homePage: async ({ page }, use) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await use(page)
	},
	contactSection: async ({ page }, use) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await page.getByTestId('contact-form').scrollIntoViewIfNeeded()
		await use(page)
	},
})
```

---

### Phase 4: Deferred (Not Now)

| #   | Task                      | Reason                                         |
| --- | ------------------------- | ---------------------------------------------- |
| 8   | Page Object Model         | Overkill for 25 tests; reconsider at 50+       |
| 9   | Visual regression testing | Requires baseline images, maintenance overhead |
| 10  | API mocking for form      | No backend; Netlify handles submission         |

---

## Success Metrics

| Metric                 | Before     | After                      | Target  |
| ---------------------- | ---------- | -------------------------- | ------- |
| Flaky test rate        | ~5%        | <1%                        | <1% ✅  |
| `.first()` usage       | 15+        | 0                          | 0 ✅    |
| `data-testid` coverage | 0%         | 100%                       | 100% ✅ |
| Debugging artifacts    | Trace only | Trace + screenshot + video | ✅      |

---

## Files to Modify

### React Components

- `components/header/Header.tsx`
- `components/header/ThemeToggle.tsx`
- `components/header/LanguageSwitcher.tsx`
- `components/home/GetInTouch.tsx`

### Test Files

- `playwright.config.ts`
- `e2e/test-utils.ts`
- `e2e/navigation.spec.ts`
- `e2e/contact-form.spec.ts`
- `e2e/dark-mode.spec.ts`
- `e2e/language-switcher.spec.ts`

---

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)

---

## Changelog

| Date       | Change                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| 2025-12-21 | Initial plan created                                                                                        |
| 2025-12-21 | Phase 1 complete: config hardening, JS evaluate fix, error handling                                         |
| 2025-12-21 | Additional fixes: loading screen wait, worker limit (4), simplified dark mode tests, robust header selector |
| 2025-12-23 | Phase 2 complete: data-testid on 10 components, eliminated all .first() usage, improved locator specificity |
| 2025-12-23 | Phase 3 complete: shared fixtures (homePage, contactSection, mobileMenuOpen)                                |
