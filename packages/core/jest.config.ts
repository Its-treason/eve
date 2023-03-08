/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/core',
  testEnvironment: "node",
};

