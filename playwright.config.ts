import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
	},
	projects: [
		// ===================
		// Desktop Browsers
		// ===================
		{
			name: 'chrome-desktop',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'safari-desktop',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'firefox-desktop',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'edge-desktop',
			use: { ...devices['Desktop Edge'] },
		},

		// ===================
		// iOS Devices (WebKit)
		// ===================
		// Small phones
		{
			name: 'iphone-se',
			use: { ...devices['iPhone SE'] },
		},
		// Standard phones
		{
			name: 'iphone-12',
			use: { ...devices['iPhone 12'] },
		},
		{
			name: 'iphone-13',
			use: { ...devices['iPhone 13'] },
		},
		{
			name: 'iphone-14',
			use: { ...devices['iPhone 14'] },
		},
		// Large phones (Pro Max)
		{
			name: 'iphone-12-pro-max',
			use: { ...devices['iPhone 12 Pro Max'] },
		},
		{
			name: 'iphone-14-pro-max',
			use: { ...devices['iPhone 14 Pro Max'] },
		},
		// Tablets
		{
			name: 'ipad-mini',
			use: { ...devices['iPad Mini'] },
		},
		{
			name: 'ipad',
			use: { ...devices['iPad (gen 7)'] },
		},
		{
			name: 'ipad-pro-11',
			use: { ...devices['iPad Pro 11'] },
		},

		// ===================
		// Android Devices (Chromium)
		// ===================
		// Standard phones
		{
			name: 'pixel-5',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'pixel-7',
			use: { ...devices['Pixel 7'] },
		},
		// Samsung
		{
			name: 'galaxy-s8',
			use: { ...devices['Galaxy S8'] },
		},
		{
			name: 'galaxy-s9-plus',
			use: { ...devices['Galaxy S9+'] },
		},
		// Tablets
		{
			name: 'galaxy-tab-s4',
			use: { ...devices['Galaxy Tab S4'] },
		},

		// ===================
		// Landscape orientations
		// ===================
		{
			name: 'iphone-12-landscape',
			use: { ...devices['iPhone 12 landscape'] },
		},
		{
			name: 'ipad-landscape',
			use: { ...devices['iPad (gen 7) landscape'] },
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
