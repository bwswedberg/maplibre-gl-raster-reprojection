import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./lib/index.ts"),
      name: "maplibreRasterReprojection",
      formats: ["es", "umd"],
      fileName: "maplibre-gl-raster-reprojection"
    }
  },
  plugins: [tsconfigPaths(), dts({ include: "lib" })],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    testTimeout: 30000
  }
});
