/**
 * E2E Test Configuration
 *
 * Environment-aware timeouts:
 * - Local: Minimal timeouts for fast feedback
 * - CI: Longer timeouts for slower Docker environment
 *
 * Debug mode: Set DEBUG_E2E=true to enable verbose logging
 */

const isCI = process.env.CI === 'true'
const isDebug = process.env.DEBUG_E2E === 'true'

// Multiplier for CI environment (Docker is ~2x slower)
const CI_MULTIPLIER = 2

/**
 * Get timeout value based on environment
 * @param localMs - Timeout in milliseconds for local environment
 * @returns Adjusted timeout for current environment
 */
function timeout(localMs: number): number {
	return isCI ? localMs * CI_MULTIPLIER : localMs
}

export const TIMEOUTS = {
	/** Page load and loading screen completion */
	pageReady: timeout(1500),

	/** Element visibility checks */
	visibility: timeout(1000),

	/** State changes (theme toggle, dropdown, navigation) */
	stateChange: timeout(800),

	/** Scroll and viewport checks */
	scroll: timeout(1000),

	/** Animation completion */
	animation: timeout(800),

	/** Navigation between pages (URL change) */
	navigation: timeout(2000),

	/** Scroll to section (observed: 14-846ms, use 1200ms with buffer) */
	scrollIntoView: timeout(1200),
} as const

export const DEBUG = isDebug

// Log timeout configuration on startup
if (isDebug) {
	console.log(`[E2E Config] Environment: ${isCI ? 'CI' : 'Local'}`)
	console.log(`[E2E Config] Debug mode: ENABLED`)
	console.log(`[E2E Config] Timeouts:`, TIMEOUTS)
}
