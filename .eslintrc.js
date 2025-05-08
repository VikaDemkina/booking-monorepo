module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  overrides: [
    {
      // TypeScript files configuration
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_" 
        }],
      },
    },
    {
      // Next.js files configuration
      files: ["packages/frontend/**/*.ts", "packages/frontend/**/*.tsx"],
      extends: [
        "next/core-web-vitals",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
      ],
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      // JavaScript files in tools
      files: ["tools/**/*.js"],
      env: {
        node: true,
        es6: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "build/",
    "*.d.ts",
    "*.js.map",
  ],
};