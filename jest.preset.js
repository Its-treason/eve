const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  setupFiles: ['./jest.setup.ts'],
  resetMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**.config.ts', '!**.d.ts'],
  coverageIngorePatterns: ['/node_modules/']
};

