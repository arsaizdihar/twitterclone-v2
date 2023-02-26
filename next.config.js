/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.S3_PUBLIC_DOMAIN],
  },
};

module.exports = nextConfig;
