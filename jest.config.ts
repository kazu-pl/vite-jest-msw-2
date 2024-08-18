export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],

  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  setupFiles: ["./jest.polyfills.js"],
};
