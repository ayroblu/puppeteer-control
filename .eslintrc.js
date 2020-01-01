module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    eqeqeq: 2,
  },
  // Sometimes javascript and typescript ones aren't compatible
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      },
    },
  ],
};
