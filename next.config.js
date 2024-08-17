/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "de", "ua", "ru"],
    defaultLocale: "en",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
module.exports = nextConfig;
