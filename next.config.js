/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las fotos viven en Supabase Storage (bucket "productos").
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
