export function getCookie(name: string): string | undefined {
	if (typeof document === 'undefined') return undefined
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
	return match ? decodeURIComponent(match[1]) : undefined
}

export function setCookie(
	name: string,
	value: string,
	options?: { days?: number; path?: string; sameSite?: 'Lax' | 'Strict' | 'None'; secure?: boolean },
): void {
	if (typeof document === 'undefined') return
	let expires = ''
	if (options?.days !== undefined) {
		const date = new Date()
		date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toUTCString()
	}
	const path = '; path=' + (options?.path ?? '/')
	const sameSite = '; samesite=' + (options?.sameSite ?? 'Lax')
	const secure = options?.secure ?? (typeof location !== 'undefined' && location.protocol === 'https:')
	const secureStr = secure ? '; secure' : ''
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}${path}${sameSite}${secureStr}`
}

export function deleteCookie(name: string, path: string = '/'): void {
	if (typeof document === 'undefined') return
	document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}
