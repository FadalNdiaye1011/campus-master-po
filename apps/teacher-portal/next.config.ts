/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@repo/api', '@repo/auth'],

    // ✅ CORRECTION : outputFileTracingRoot sorti de experimental
    outputFileTracingRoot: path.join(__dirname, '../../'),

    output: 'standalone',

    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;