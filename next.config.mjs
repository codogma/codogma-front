import path from 'node:path';
import { fileURLToPath } from 'node:url';

import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },

  async redirects() {
    return [
      {
        source: '/:lng/categories/:id',
        destination: '/:lng/categories/:id/articles',
        permanent: true,
      },
      {
        source: '/:lng/users/:username',
        destination: '/:lng/users/:username/profile',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      // TODO: добавь реальные домены (cdn/production host)
      // { protocol: 'https', hostname: 'cdn.codogma.com', pathname: '/**' },
    ],
    qualities: [70, 75, 80],
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
