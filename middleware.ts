import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n, isValidLocale, Locale } from "./i18n-config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect /en/* to /*
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return NextResponse.redirect(new URL(pathname.replace(/^\/en/, ""), request.url));
  }

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    // Determine the locale to use
    let locale: Locale = i18n.defaultLocale;

    // Check for stored language preference
    const storedLang = request.cookies.get("NEXT_LOCALE")?.value;
    if (storedLang && isValidLocale(storedLang)) {
      locale = storedLang;
    } else {
      // Detect language from Accept-Language header
      const acceptLanguage = request.headers.get("Accept-Language");
      if (acceptLanguage) {
        const detectedLocale = acceptLanguage.split(",")[0].split("-")[0];
        if (isValidLocale(detectedLocale)) {
          locale = detectedLocale;
        }
      }
    }

    // Only redirect if the locale is not the default locale
    if (locale !== i18n.defaultLocale) {
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
