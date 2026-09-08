import type { NextConfig } from "next";

// Gallery photos are served from Supabase Storage, so the image optimizer has
// to be told that host is trusted. Deriving the pattern from the same env var
// the client uses keeps the two from drifting apart, and narrowing it to the
// public path of one bucket means a leaked URL on the same project cannot be
// turned into free image optimization.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl}/storage/v1/object/public/gallery/**`)]
      : [],
  },
};

export default nextConfig;
