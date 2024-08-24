import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "@/i18n-config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log("Middleware called for pathname:", pathname);

  // Redirect /en/* to /*
  if (pathname.startsWith("/en/") || pathname === "/en") {
    console.log("Redirecting from /en to /");
    return NextResponse.redirect(new URL(pathname.replace(/^\/en/, ""), request.url));
  }

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    // If no locale is specified, use the default locale or the one from the cookie
    const locale = request.cookies.get("NEXT_LOCALE")?.value || i18n.defaultLocale;

    // Only redirect if the locale is not the default locale (assuming 'en' is default)
    if (locale !== "en") {
      console.log(`Adding locale ${locale} to URL`);
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
  }

  console.log("No redirect necessary");
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
