import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },

  webpack(config: Configuration, {  }) {
    const fileLoaderRule = config.module?.rules?.find((rule): rule is RuleSetRule => {
        if (rule && typeof rule === 'object' && rule.test instanceof RegExp) {
            return rule.test.test('.svg');
        }
        return false;
    });

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push(
      {
        ...(fileLoaderRule || {}),
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: [{
            loader: '@svgr/webpack',
            options: {
            }
        }],
      }
    );

    if (fileLoaderRule) {
        fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },


};

export default nextConfig;