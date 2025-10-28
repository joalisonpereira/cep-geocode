import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./setupTests.ts",
    coverage: {
      reporter: ["json-summary", "lcov", "text", "html"],
    },
  },
});
