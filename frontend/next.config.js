/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ML_SERVICE_URL: process.env.NEXT_PUBLIC_ML_SERVICE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: '/ml/:path*',
        destination: `${process.env.NEXT_PUBLIC_ML_SERVICE_URL}/:path*`,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  images: {
    domains: ['localhost', 'api.twitter.com', 'graph.instagram.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
