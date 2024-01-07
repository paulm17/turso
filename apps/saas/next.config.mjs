// Importing env files here to validate on build
import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**.iconfinder.com",
      },
    ],
    domains: [
      "127.0.0.1",
      "localhost",
      "images.pexels.com",
      "cdn.pixabay.com",
      "images.unsplash.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/css/:path*",
        destination: "http://localhost:9300/css/:path*",
      },
      {
        source: "/fonts/:path*",
        destination: "http://localhost:9300/fonts/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://localhost:9300/images/:path*",
      },
      {
        source: "/sounds/:path*",
        destination: "http://localhost:9300/sounds/:path*",
      },
      {
        source: "/videos/:path*",
        destination: "http://localhost:9300/videos/:path*",
      },
      {
        source: "/api/php/:path*",
        destination: "http://localhost:9000/api/:path*",
      },
      {
        source: "/api/nestjs/:path*",
        destination: "http://localhost:9400/api/:path*",
      },
    ];
  },
  webpack(config) {
    // required for svg files
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // required for react-pdf
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    return config;
  },
  experimental: {
    // optimizePackageImports: ["@raikou/server"],
    serverComponentsExternalPackages: ["@libsql/client"],
  },
  reactStrictMode: false,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@golfcart/auth", "@golfcart/db"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
