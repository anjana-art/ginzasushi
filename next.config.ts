// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (avoids the multi-lockfile warning)
  turbopack: {
    root: __dirname,
  },

  // React Compiler (you enabled this during setup)
  reactCompiler: true,

  // Remote image hosts
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",   // Cloudinary
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",  // Unsplash (for sample images)
      },
    ],
  },
};

export default nextConfig;