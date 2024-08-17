/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
module.exports = nextConfig;
