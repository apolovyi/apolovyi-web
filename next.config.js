/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "de", "ua", "ru"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
