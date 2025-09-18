/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour production standard (pas d'export statique)
  // Pour Hostinger avec Node.js support
  
  images: {
    // Optimisation d'images pour la production
    formats: ['image/webp', 'image/avif'],
    
    // Enable remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Enable image optimization
    unoptimized: false,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compression
  compress: true,
  
  // Performance optimization
  poweredByHeader: false,
};

module.exports = nextConfig;
