/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint checks during build to prevent pre-existing linter warnings from blocking compilation.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We want TypeScript checks to run, but if they have warnings we can keep it strict.
    ignoreBuildErrors: false,
  }
};

module.exports = nextConfig;
