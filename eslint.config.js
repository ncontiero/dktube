import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  javascript: {
    overrides: {
      "node/no-unsupported-features/node-builtins": [
        "error",
        { allowExperimental: true },
      ],
    },
  },
  unicorn: {
    overrides: {
      "unicorn/consistent-function-scoping": [
        "error",
        { checkArrowFunctions: false },
      ],
    },
  },
  jsx: {
    a11y: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
