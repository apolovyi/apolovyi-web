import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	reporter: process.env.CI ? 'html' : 'line',
	timeout: process.env.CI ? 20000 : 10000,
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:3100',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'off',
		actionTimeout: process.env.CI ? 6000 : 3000,
		navigationTimeout: process.env.CI ? 10000 : 5000,
	},
	projects: [
		{
			name: 'chrome-desktop',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'safari-desktop',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'iphone-15',
			use: { ...devices['iPhone 15'] },
		},
	],
	webServer: {
		command: process.env.CI ? 'pnpm run serve' : 'pnpm run dev',
		url: 'http://localhost:3100',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
