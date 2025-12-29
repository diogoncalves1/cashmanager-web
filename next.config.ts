/** @type {import('next').NextConfig} */
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

export default nextConfig;
