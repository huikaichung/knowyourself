import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 啟用 React Strict Mode
  reactStrictMode: true,
  
  // 輸出為 standalone 以便 Docker 部署
  output: 'standalone',
  
  // 圖片優化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  
  // 環境變數
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://selfkit-backend-129518505568.asia-northeast1.run.app/api/v1',
  },
};

export default nextConfig;
