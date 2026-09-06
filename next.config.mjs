/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
  },
  images: {
    domains: ["images.unsplash.com", "picsum.photos"],
  },
};

export default nextConfig;
