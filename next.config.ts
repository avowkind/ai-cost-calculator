import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isGithubPages ? '/totara-ai-cost-calculator/' : undefined,
  basePath: isGithubPages ? '/totara-ai-cost-calculator' : undefined,
};

export default nextConfig;
