/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['huynh'],
  experimental: {
    typedRoutes: true
  }
}

module.exports = nextConfig 