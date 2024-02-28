import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/**.ts", "!src/**/*.test.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  format: ["esm", "cjs"],
  skipNodeModulesBundle: true,
  external: ["node_modules"],
});
