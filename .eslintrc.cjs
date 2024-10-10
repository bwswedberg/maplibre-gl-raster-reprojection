/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // Typescript
    {
      files: ["**/*.{ts}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts"]
          },
          typescript: {
            alwaysTryTypes: true
          }
        }
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier"
      ],
      rules: {
        "import/order": [
          "error",
          {
            alphabetize: { caseInsensitive: true, order: "asc" },
            groups: ["builtin", "external", "internal", "parent", "sibling"]
          }
        ],
        "@typescript-eslint/no-explicit-any": "off"
      }
    },

    // Jest/Vitest
    {
      files: ["src/**/*.test.{js,ts}"],
      plugins: ["jest", "jest-dom", "testing-library"],
      extends: [
        "plugin:jest/recommended",
        "plugin:jest-dom/recommended",
        "prettier"
      ],
      env: {
        "jest/globals": true
      },
      settings: {
        jest: {
          // we're using vitest which has a very similar API to jest
          // (so the linting plugins work nicely), but it means we have to explicitly
          // set the jest version.
          version: 28
        }
      }
    },

    // Cypress
    {
      files: ["lib/**/*.e2e.ts"],
      plugins: ["playwright"],
      extends: ["plugin:playwright/playwright-test", "prettier"],
    },

    // Node
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true
      }
    }
  ]
};
