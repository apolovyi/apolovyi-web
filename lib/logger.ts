/* Centralized lightweight logger for app code. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVELS = ['debug', 'info', 'warn', 'error'] as const
const env = process.env.NODE_ENV ?? 'development'
const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? (env === 'production' ? 'warn' : env === 'test' ? 'error' : 'debug')
export const logLevel: LogLevel = currentLevel
function enabled(level: LogLevel) {
	return LEVELS.indexOf(level) >= LEVELS.indexOf(currentLevel)
}

export const logger = {
	debug: (...args: unknown[]) => {
		if (enabled('debug')) {
			console.debug(...args)
		}
	},
	info: (...args: unknown[]) => {
		if (enabled('info')) {
			console.info(...args)
		}
	},
	warn: (...args: unknown[]) => {
		if (enabled('warn')) {
			console.warn(...args)
		}
	},
	error: (...args: unknown[]) => {
		if (enabled('error')) {
			console.error(...args)
		}
	},
}
