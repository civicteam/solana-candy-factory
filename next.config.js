const withTM = require('next-transpile-modules')([
  '@identity.com/wallet-adapter-base',
  '@identity.com/wallet-adapter-react']
);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, os: false, path: false, crypto: false };

    return config;
  }
})