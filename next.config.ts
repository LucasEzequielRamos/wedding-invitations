import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "ojqdfwpptugtaprofgoq.supabase.co",
      pathname: "/storage/v1/object/public/wedding-media/**",
    },
  ],
},
};

export default nextConfig;
