import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Add another entry here if you use a Cloudinary custom CNAME, e.g. hostname: "images.yourdomain.com"
    ],
  },
};

export default nextConfig;
