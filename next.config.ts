import type { NextConfig } from "next";

/**
 * Next.js configuration for the Expression Builder application
 * 
 * This configuration enables Turbopack for faster development builds
 * and sets the root directory for the build process.
 */
const nextConfig: NextConfig = {
  // Enable Turbopack for faster development and builds
  turbopack: {
    root: './'  // Set the root directory for Turbopack
  }
};

export default nextConfig;
