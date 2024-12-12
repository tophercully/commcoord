import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disables error for using <img/> instead of <Image/>
  },
};

export default nextConfig;
