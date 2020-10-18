module.exports = {
  // preset: "@vue/cli-plugin-unit-jest"
  moduleFileExtensions: [
    "js",
    "jsx",
    "json",
    // tell Jest to handle *.vue files
    "vue"
  ],
  transform: {
    // process *.vue files with vue-jest
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ["/node_modules/"],
  // support the same @ -> src alias mapping in source code
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testEnvironment: "jest-environment-jsdom-fifteen",
  // serializer for snapshots
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/tests/unit/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
  // https://github.com/facebook/jest/issues/6766
  testURL: "http://localhost/",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};
