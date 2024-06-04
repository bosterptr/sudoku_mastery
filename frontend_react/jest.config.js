/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/src/$1',
    sudoku_wasm: '<rootDir>/../sudoku_wasm/pkg/sudoku_wasm.js',
  },
  modulePaths: ['<rootDir>'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest',
      {
        astTransformers: {
          before: [
            {
              path: '@formatjs/ts-transformer/ts-jest-integration',
              options: {
                // options
                overrideIdFn: '[sha512:contenthash:base64:6]',
                ast: true,
              },
            },
          ],
        },
      },
    ],
  },
};
