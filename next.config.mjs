/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/articles',
                permanent: true,
            },
            {
                source: '/categories/:id',
                destination: '/categories/:id/articles',
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
