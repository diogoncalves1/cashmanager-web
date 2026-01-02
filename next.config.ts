/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(); // ← Add this line (no path needed in 99% of cases)

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.altria.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.altria.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "cdn.another.com",
      },
    ],
  },
};

// Apply the next-intl plugin → very important!
export default withNextIntl(nextConfig);
