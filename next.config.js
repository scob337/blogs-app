/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['avatar.iran.liara.run'],
  },
};

module.exports = nextConfig;
