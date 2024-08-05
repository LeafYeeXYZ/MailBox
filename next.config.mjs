/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许 Gravatar 图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        port: '',
        pathname: '/avatar/*',
      },
    ]
  },
};

export default nextConfig;
