/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    async rewrites() {
        return [{
            source: '/api/backend/:path*',
            destination: 'http://localhost:3001/api/:path*',
        }, ];
    },
};

module.exports = nextConfig;