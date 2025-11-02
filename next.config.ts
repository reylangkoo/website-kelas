import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https", 
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // Tambahkan ini
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", 
      },
       {
        protocol: "https",
        hostname: "drive.google.com", // ✅ Tambahkan ini
      },
       {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ sering dipakai Google Drive untuk direct image
      },
      // Tambahkan domain lain yang mungkin digunakan
    ],
    domains: ['localhost'],
  },
  transpilePackages: ["@appletosolutions/reactbits"],
};

export default nextConfig;