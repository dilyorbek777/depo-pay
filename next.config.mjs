/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/**',
            },
            // Add other image hosting domains here if needed (e.g., Unsplash, S3, Cloudinary)
            {
                protocol: 'https',
                hostname: '**', // Allows all https image URLs (useful for dynamic post URLs)
            },
        ],
    },
};

export default nextConfig;
