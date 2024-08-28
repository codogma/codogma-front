/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/profile',
                permanent: true,
            },
            {
                source: '/categories/:id',
                destination: '/categories/:id/profile',
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
