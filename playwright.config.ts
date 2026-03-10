import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	// Sequential execution for stability (both local and CI)
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: process.env.CI ? 'html' : 'line',
	// Global test timeout: 10s local, 20s CI
	timeout: process.env.CI ? 20000 : 10000,
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:3100',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'off',
		// Action timeout: 3s local, 6s CI
		actionTimeout: process.env.CI ? 6000 : 3000,
		// Navigation timeout: 5s local, 10s CI
		navigationTimeout: process.env.CI ? 10000 : 5000,
	},
	projects: [
		// Pareto: 3 projects cover 95%+ of real-world usage
		{
			name: 'chrome-desktop',
			use: { ...devices['Desktop Chrome'] }, // 65% of users
		},
		{
			name: 'safari-desktop',
			use: { ...devices['Desktop Safari'] }, // WebKit engine
		},
		{
			name: 'iphone-15',
			use: { ...devices['iPhone 15'] }, // Mobile responsive
		},
	],
	webServer: {
		// Use production build in CI for accurate testing, dev server locally
		command: process.env.CI ? 'npx serve out -l 3100' : 'npm run dev',
		url: 'http://localhost:3100',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
