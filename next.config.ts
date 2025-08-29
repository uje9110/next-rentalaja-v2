/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rentalaja.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.rentalaja.co.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dwariw6sy/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
    qualities: [90, 100],
  },
};

module.exports = nextConfig;
