import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1000mb', 
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'khaled67.alwaysdata.net', // 👈 ضيف الدومين بتاعك هنا
        pathname: '**', // اسمح بكل المسارات
      },
    ],
  },
  htmlLimitedBots: /.*/,
};

export default nextConfig;
