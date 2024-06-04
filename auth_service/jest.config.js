module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalSetup: './src/testUtils/globalSetup.ts',
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
