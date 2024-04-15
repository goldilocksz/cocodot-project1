/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['27.71.17.99:9090'],
    },
  },
  rewrites: () => [
    {
      source: '/api/:path*',
      destination: 'http://27.71.17.99:9090/:path*',
    },
  ],
}

export default nextConfig
