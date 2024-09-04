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
            }
        ];
    }
};

export default nextConfig;
