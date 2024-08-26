import { NextRequest, NextResponse } from 'next/server'

import { Locale, i18n, isValidLocale } from '@/i18n-config'

function getLocale(request: NextRequest): Locale {
	const storedLang = request.cookies.get('detectedLang')?.value
	if (storedLang && isValidLocale(storedLang)) {
		console.log(`[Middleware] Using stored language: ${storedLang}`)
		return storedLang
	}

	const acceptLanguage = request.headers.get('Accept-Language')
	if (acceptLanguage) {
		const detectedLocale = acceptLanguage.split(',')[0].split('-')[0]
		if (isValidLocale(detectedLocale)) {
			console.log(`[Middleware] Using detected locale: ${detectedLocale}`)
			return detectedLocale
		}
	}

	console.log(`[Middleware] Using default locale: ${i18n.defaultLocale}`)
	return i18n.defaultLocale
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	console.log(`[Middleware] Incoming request for path: ${pathname}`)

	// Redirect /en/* to /*
	if (pathname.startsWith('/en/') || pathname === '/en') {
		const newPathname = pathname.replace(/^\/en/, '') || '/'
		console.log(`[Middleware] Redirecting from /en to: ${newPathname}`)
		return NextResponse.redirect(new URL(newPathname, request.url))
	}

	const pathnameIsMissingLocale = i18n.locales.every((locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`)
	console.log(`[Middleware] Pathname is missing locale: ${pathnameIsMissingLocale}`)

	if (pathnameIsMissingLocale) {
		const locale = getLocale(request)

		if (locale !== i18n.defaultLocale) {
			const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
			console.log(`[Middleware] Redirecting to: ${redirectUrl.toString()}`)
			return NextResponse.redirect(redirectUrl)
		}
	}

	console.log(`[Middleware] Proceeding with the request`)
	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - static (static files)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|cv|img|fav|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)',
	],
}
