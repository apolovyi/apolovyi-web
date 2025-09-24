export type CookieOptions = {
	expires?: number | Date
	path?: string
	sameSite?: 'Lax' | 'Strict' | 'None'
	secure?: boolean
}

export function getCookie(name: string): string | undefined {
	if (typeof document === 'undefined') return undefined
	const value = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
		?.split('=')[1]
	return value ? decodeURIComponent(value) : undefined
}

export function setCookie(name: string, value: string, opts: CookieOptions = {}): void {
	if (typeof document === 'undefined') return
	const parts: string[] = []
	parts.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
	if (opts.expires) {
		const date = typeof opts.expires === 'number' ? new Date(Date.now() + opts.expires * 864e5) : opts.expires
		parts.push(`Expires=${date.toUTCString()}`)
	}
	parts.push(`Path=${opts.path ?? '/'}`)
	if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`)
	if (opts.secure) parts.push('Secure')
	document.cookie = parts.join('; ')
}
