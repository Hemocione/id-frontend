// Transform is declared here instead of in a .babelrc on purpose: a Babel
// config file at the project root would opt the whole Next build out of SWC.
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  transform: {
    "^.+\\.js$": ["babel-jest", { presets: ["next/babel"] }],
  },
};
