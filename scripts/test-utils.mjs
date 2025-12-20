/**
 * Robust test utilities for local development testing.
 *
 * Features:
 * - Auto-detect running dev server on common ports
 * - Auto-start dev server if not running
 * - Wait for server with health checks and retries
 * - Screenshot capture with size validation
 * - Debug-friendly logging
 */

import { spawn } from 'child_process'
import { chromium } from 'playwright'
import { existsSync, mkdirSync, rmSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')

// Dev server ports: primary (3000) and fallback for parallel testing (3001)
const PORTS = [3000, 3001]

// Max image dimension for Claude API multi-image requests
const MAX_IMAGE_DIMENSION = 2000

/**
 * Configuration options
 */
const DEFAULT_CONFIG = {
  startServerIfNotRunning: true,
  serverStartTimeout: 30000,
  healthCheckRetries: 10,
  healthCheckInterval: 1000,
  verbose: true,
}

let serverProcess = null

/**
 * Log with timestamp and level
 */
function log(level, message, ...args) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  const prefix = {
    info: '\x1b[36mINFO\x1b[0m',
    warn: '\x1b[33mWARN\x1b[0m',
    error: '\x1b[31mERROR\x1b[0m',
    success: '\x1b[32mOK\x1b[0m',
    debug: '\x1b[90mDEBUG\x1b[0m',
  }[level] || level

  console.log(`[${timestamp}] ${prefix} ${message}`, ...args)
}

/**
 * Check if a port is responding to HTTP requests
 */
async function isPortResponding(port, path = '/en') {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)

    const response = await fetch(`http://localhost:${port}${path}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return response.status < 500
  } catch {
    return false
  }
}

/**
 * Find the first responding dev server port
 */
export async function findDevServerPort() {
  for (const port of PORTS) {
    if (await isPortResponding(port)) {
      log('success', `Found dev server on port ${port}`)
      return port
    }
  }
  return null
}

/**
 * Start the dev server and wait for it to be ready
 */
async function startDevServer(config) {
  log('info', 'Starting dev server...')

  // Clear .next cache first for clean start (cross-platform)
  try {
    rmSync(join(PROJECT_ROOT, '.next'), { recursive: true, force: true })
  } catch {
    // Ignore if .next doesn't exist
  }

  return new Promise((resolve, reject) => {
    serverProcess = spawn('pnpm', ['run', 'dev'], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    })

    let output = ''
    let resolved = false
    const timeout = setTimeout(() => {
      if (!resolved) {
        reject(new Error(`Server failed to start within ${config.serverStartTimeout}ms`))
      }
    }, config.serverStartTimeout)

    serverProcess.stdout.on('data', (data) => {
      output += data.toString()
      if (config.verbose) {
        process.stdout.write(data)
      }

      // Only process once
      if (resolved) return

      // Next.js prints "Local: http://localhost:PORT" - extract the actual port
      const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/)
      const actualPort = portMatch ? parseInt(portMatch[1], 10) : 3000

      // Next.js prints this when ready
      if (output.includes('Ready in')) {
        resolved = true
        clearTimeout(timeout)
        log('success', `Server started on port ${actualPort}`)
        // Give it a moment to stabilize
        setTimeout(() => resolve(actualPort), 500)
      }
    })

    serverProcess.stderr.on('data', (data) => {
      if (config.verbose) {
        process.stderr.write(data)
      }
    })

    serverProcess.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })

    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        clearTimeout(timeout)
        reject(new Error(`Server exited with code ${code}`))
      }
    })
  })
}

/**
 * Wait for server to be ready with retries
 */
async function waitForServer(port, config) {
  log('info', `Waiting for server on port ${port}...`)

  for (let i = 0; i < config.healthCheckRetries; i++) {
    if (await isPortResponding(port)) {
      log('success', `Server is ready on port ${port}`)
      return true
    }
    log('debug', `Health check ${i + 1}/${config.healthCheckRetries} failed, retrying...`)
    await new Promise((r) => setTimeout(r, config.healthCheckInterval))
  }

  throw new Error(`Server on port ${port} did not become ready`)
}

/**
 * Ensure dev server is running and return its port
 */
export async function ensureDevServer(options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options }

  // First, check if a server is already running
  let port = await findDevServerPort()

  if (port) {
    log('success', `Using existing dev server on port ${port}`)
    return port
  }

  if (!config.startServerIfNotRunning) {
    throw new Error(
      'No dev server found. Start one with: pnpm run dev\n' +
        'Or set startServerIfNotRunning: true to auto-start'
    )
  }

  // Start the server
  port = await startDevServer(config)
  await waitForServer(port, config)

  return port
}

/**
 * Stop the dev server if we started it
 */
export function stopDevServer() {
  if (serverProcess) {
    log('info', 'Stopping dev server...')
    // Kill the process group (negative PID) on Unix, direct kill on Windows
    try {
      if (process.platform !== 'win32') {
        process.kill(-serverProcess.pid, 'SIGTERM')
      } else {
        serverProcess.kill('SIGTERM')
      }
    } catch {
      serverProcess.kill('SIGTERM')
    }
    serverProcess = null
  }
}

/**
 * Standard viewport configurations
 */
export const VIEWPORTS = {
  'mobile-s': { width: 320, height: 568 },
  'mobile-m': { width: 375, height: 667 },
  'mobile-l': { width: 425, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
}

/**
 * Ensure output directory exists
 */
function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

/**
 * Validate screenshot dimensions for Claude API
 */
function validateScreenshotDimensions(width, height, fullPage = false) {
  if (fullPage) {
    log(
      'warn',
      `Full-page screenshot requested. Height may exceed ${MAX_IMAGE_DIMENSION}px limit.`
    )
    return false
  }
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    log(
      'warn',
      `Viewport ${width}x${height} exceeds ${MAX_IMAGE_DIMENSION}px limit for Claude API`
    )
    return false
  }
  return true
}

/**
 * Create a test context with browser and page ready
 */
export async function createTestContext(options = {}) {
  const {
    viewport = VIEWPORTS.desktop,
    viewportName = null,
    locale = 'en',
    waitForLoadingScreen = true,
    loadingScreenTimeout = 5000,
    ...browserOptions
  } = options

  // Derive viewport name if not provided
  const derivedViewportName =
    viewportName ||
    Object.entries(VIEWPORTS).find(
      ([, v]) => v.width === viewport.width && v.height === viewport.height
    )?.[0] ||
    `${viewport.width}x${viewport.height}`

  // Ensure server is running
  const port = await ensureDevServer()
  const baseUrl = `http://localhost:${port}`

  // Validate dimensions
  validateScreenshotDimensions(viewport.width, viewport.height)

  // Launch browser
  const browser = await chromium.launch(browserOptions)
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()

  // Navigate to page
  const url = `${baseUrl}/${locale}`
  log('info', `Navigating to ${url}`)
  await page.goto(url)

  // Wait for loading screen to complete
  if (waitForLoadingScreen) {
    log('debug', 'Waiting for loading screen to complete...')
    await page.waitForTimeout(loadingScreenTimeout)
  }

  return {
    browser,
    context,
    page,
    port,
    baseUrl,
    viewportName: derivedViewportName,

    /**
     * Take a screenshot with validation
     */
    async screenshot(path, options = {}) {
      const { fullPage = false, ...screenshotOptions } = options

      if (fullPage) {
        log(
          'warn',
          'Full-page screenshots may exceed Claude API dimension limits'
        )
      }

      ensureDir(path)
      await page.screenshot({ path, fullPage, ...screenshotOptions })

      // Check resulting file size
      const stats = statSync(path)
      const sizeKB = (stats.size / 1024).toFixed(1)
      log('success', `Screenshot saved: ${path} (${sizeKB} KB)`)

      return path
    },

    /**
     * Navigate to a section
     */
    async goToSection(sectionId, { waitTime = 500 } = {}) {
      log('debug', `Scrolling to #${sectionId}`)
      await page.evaluate((id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
      }, sectionId)
      await page.waitForTimeout(waitTime)
    },

    /**
     * Clean up resources
     */
    async close() {
      await browser.close()
      log('info', 'Browser closed')
    },
  }
}

/**
 * Run a test with automatic setup and cleanup
 */
export async function runTest(name, testFn, options = {}) {
  log('info', `\n${'='.repeat(50)}`)
  log('info', `Running: ${name}`)
  log('info', `${'='.repeat(50)}\n`)

  let ctx = null
  try {
    ctx = await createTestContext(options)
    await testFn(ctx)
    log('success', `\n✓ ${name} completed successfully\n`)
  } catch (error) {
    log('error', `\n✗ ${name} failed:`, error.message)
    if (options.verbose !== false) {
      console.error(error.stack)
    }
    throw error
  } finally {
    if (ctx) {
      await ctx.close()
    }
  }
}

/**
 * Run tests across multiple viewports
 */
export async function runViewportTests(name, testFn, options = {}) {
  const { viewports = Object.keys(VIEWPORTS), ...testOptions } = options

  log('info', `\n${'='.repeat(60)}`)
  log('info', `Running viewport tests: ${name}`)
  log('info', `Viewports: ${viewports.join(', ')}`)
  log('info', `${'='.repeat(60)}\n`)

  const results = []

  for (const vpName of viewports) {
    const viewport = VIEWPORTS[vpName]
    if (!viewport) {
      log('warn', `Unknown viewport: ${vpName}, skipping`)
      continue
    }

    try {
      await runTest(`${name} [${vpName}]`, testFn, {
        ...testOptions,
        viewport,
        viewportName: vpName,
      })
      results.push({ viewport: vpName, success: true })
    } catch (error) {
      results.push({ viewport: vpName, success: false, error: error.message })
    }
  }

  // Summary
  log('info', '\n' + '='.repeat(60))
  log('info', 'Results Summary:')
  for (const r of results) {
    const status = r.success ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'
    log('info', `  ${status} ${r.viewport}${r.error ? ': ' + r.error : ''}`)
  }
  log('info', '='.repeat(60) + '\n')

  const failed = results.filter((r) => !r.success)
  if (failed.length > 0) {
    throw new Error(`${failed.length} viewport(s) failed`)
  }

  return results
}

// Cleanup on exit
process.on('SIGINT', () => {
  stopDevServer()
  process.exit(130)
})

process.on('SIGTERM', () => {
  stopDevServer()
  process.exit(143)
})

process.on('exit', () => {
  stopDevServer()
})
