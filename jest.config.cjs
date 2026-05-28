module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|jpg|jpeg|png|svg|webp|avif)$": "<rootDir>/test/fileMock.cjs",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
