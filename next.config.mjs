/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/categories/:id',
        destination: '/categories/:id/articles',
        permanent: true,
      },
      {
        source: '/users/:username',
        destination: '/users/:username/profile',
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
    ],
  },
};

export default nextConfig;
