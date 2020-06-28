module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules",
  ],
  moduleDirectories: [
    "node_modules",
    "app",
  ],
  testRegex: ".*\\.test\\.js$",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/internals/testing/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "json",
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [
    '<rootDir>/internals/testing/enzyme-setup.js',
  ],
};
