/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: process.env.ENVIRONMENT !== "Local",
};

export default nextConfig;
