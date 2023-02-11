// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  publicRuntimeConfig: {
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    internalApiHost: process.env.INTERNAL_API_HOST,
    publicApiHost: process.env.NEXT_PUBLIC_API_HOST,
  },
};

module.exports = withNx(nextConfig);
