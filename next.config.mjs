/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['27.71.17.99:9090'],
    },
  },
}

export default nextConfig
