import { NextRequest, NextResponse } from "next/server";
import { i18n, Locale } from "@/i18n-config";

export async function GET(request: NextRequest) {
  const acceptLanguageHeader = request.headers.get("Accept-Language");
  let detectedLocale: Locale = i18n.defaultLocale;

  if (acceptLanguageHeader) {
    const userPreferredLocales = acceptLanguageHeader.split(",").map((lang) => lang.split(";")[0]);

    for (const locale of userPreferredLocales) {
      const matchedLocale = i18n.locales.find((supportedLocale) =>
        locale.toLowerCase().startsWith(supportedLocale.toLowerCase()),
      );
      if (matchedLocale) {
        detectedLocale = matchedLocale;
        break;
      }
    }
  }

  return NextResponse.json({ locale: detectedLocale });
}
