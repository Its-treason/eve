// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx, composePlugins } = require('@nrwl/next');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    internalApiHost: process.env.INTERNAL_API_HOST,
    publicApiHost: process.env.NEXT_PUBLIC_API_HOST,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
