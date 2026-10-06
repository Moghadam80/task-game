import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dl.lifelands.ir", pathname: "/game/**" },
    ],
  },
};

export default nextConfig;
