/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root detection
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
