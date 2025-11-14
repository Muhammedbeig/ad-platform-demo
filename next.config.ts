import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this 'images' block to whitelist the Google domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // This allows any image path from this host
      },
    ],
  },
  /* other config options can go here */
};

export default nextConfig;