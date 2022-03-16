export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/test/', '<rootDir>/src/index.js'],
  coverageReporters: [['lcov', { projectRoot: '../..' }], 'text', 'clover'],
  errorOnDeprecated: true,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/index.js'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { configFile: '../../.swcrc.test' }],
  },
};
