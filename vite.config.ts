import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  // No real public folder. Only used for dev and test
  publicDir: process.env.NODE_ENV !== "production" ? "./test/assets" : undefined,
  plugins: [
    tsconfigPaths(),
    dts({
      include: "lib",
      exclude: ["**/__tests__", "**/__mocks__"],
      insertTypesEntry: true
    })
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "./lib/index.ts"),
      name: "maplibreglRasterReprojection",
      formats: ["es", "umd"],
      // The cdn unpkg does not handle ".cjs" as expected for umd builds
      // Use ".js" ending for now until this is fixed.
      // See: https://github.com/mjackson/unpkg/issues/355
      fileName: (format) => `maplibre-gl-raster-reprojection${format === "umd" ? ".umd" : ""}.js`
    }
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    testTimeout: 30000,
    coverage: {
      include: ["lib"],
      exclude: ["**/__tests__", "**/__mocks__", "**/types.ts", "**/*.d.ts"]
    }
  }
});
