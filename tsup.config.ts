import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: true,
  sourcemap: false,
  clean: true,
  dts: true,
  treeshake: true,
  format: ["esm", "cjs"],
  skipNodeModulesBundle: true,
  external: ["node_modules"],
});
