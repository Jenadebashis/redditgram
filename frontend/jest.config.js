export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '^@heroicons/react/24/outline$': '<rootDir>/src/__mocks__/heroicons.js',
    '^\.\./config$': '<rootDir>/src/__mocks__/config.js',
    '^\.\/config$': '<rootDir>/src/__mocks__/config.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverage: true,
}