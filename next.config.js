/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  env: {
    MORALIS_API_KEY: 'xxxxx'
  }
}

module.exports = nextConfig
