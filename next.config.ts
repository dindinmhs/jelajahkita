import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol : "https",
        hostname : "xjmhgtobkazsfounxfjf.supabase.co",
      }
    ],
  },
  turbopack:{},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "ws": "commonjs ws"
      });
    }
    return config;
  },
};

export default nextConfig;
