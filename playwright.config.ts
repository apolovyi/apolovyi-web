import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 4 : undefined,
	reporter: 'html',
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:3000',
		trace: 'on-first-retry',
	},
	projects: [
		// ===================
		// Desktop Browsers (Chrome & Safari - covers 90%+ of users)
		// ===================
		{
			name: 'chrome-desktop',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'safari-desktop',
			use: { ...devices['Desktop Safari'] },
		},

		// ===================
		// iOS Devices (WebKit) - Representative set
		// ===================
		{
			name: 'iphone-se',
			use: { ...devices['iPhone SE'] }, // Small screen
		},
		{
			name: 'iphone-15',
			use: { ...devices['iPhone 15'] }, // Standard
		},
		{
			name: 'iphone-15-pro-max',
			use: { ...devices['iPhone 15 Pro Max'] }, // Large
		},
		{
			name: 'ipad-pro-11',
			use: { ...devices['iPad Pro 11'] }, // Tablet
		},

		// ===================
		// Android Devices (Chromium) - Representative set
		// ===================
		{
			name: 'pixel-5',
			use: { ...devices['Pixel 5'] }, // Standard Android
		},
		{
			name: 'galaxy-s9-plus',
			use: { ...devices['Galaxy S9+'] }, // Samsung
		},
	],
	webServer: {
		// Use production build in CI for accurate testing, dev server locally
		command: process.env.CI ? 'npx serve out -l 3000' : 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
