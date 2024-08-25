import { NextRequest, NextResponse } from "next/server";
import { i18n, isValidLocale, Locale } from "@/i18n-config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware] Incoming request for path: ${pathname}`);

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  console.log(`[Middleware] Pathname is missing locale: ${pathnameIsMissingLocale}`);

  if (pathnameIsMissingLocale) {
    // Determine the locale to use
    let locale: Locale = i18n.defaultLocale;
    console.log(`[Middleware] Initial locale set to default: ${locale}`);

    // Check for stored language preference
    const storedLang = request.cookies.get("detectedLang")?.value;
    console.log(`[Middleware] Stored language from cookie: ${storedLang}`);

    if (storedLang && isValidLocale(storedLang)) {
      locale = storedLang;
      console.log(`[Middleware] Using stored language: ${locale}`);
    } else {
      // Detect language from Accept-Language header
      const acceptLanguage = request.headers.get("Accept-Language");
      console.log(`[Middleware] Accept-Language header: ${acceptLanguage}`);

      if (acceptLanguage) {
        const detectedLocale = acceptLanguage.split(",")[0].split("-")[0];
        console.log(`[Middleware] Detected locale from header: ${detectedLocale}`);

        if (isValidLocale(detectedLocale)) {
          locale = detectedLocale;
          console.log(`[Middleware] Using detected locale: ${locale}`);
        }
      }
    }

    // Always redirect if the locale is not the default locale
    if (locale !== i18n.defaultLocale) {
      const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
      console.log(`[Middleware] Redirecting to: ${redirectUrl.toString()}`);
      return NextResponse.redirect(redirectUrl);
    } else {
      console.log(`[Middleware] No redirect needed, using default locale: ${locale}`);
    }
  } else {
    console.log(`[Middleware] Pathname already includes a locale, no action needed`);
  }

  console.log(`[Middleware] Proceeding with the request`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
