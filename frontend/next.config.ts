import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Force Turbopack root to frontend/ (avoids parent workspace path bugs)
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
