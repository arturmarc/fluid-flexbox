import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: [path.resolve(__dirname, "src/dom/FlexWrapDetectorElement.ts")],
      formats: ["umd"],
      name: "FlexWrapDetector",
      fileName: "flex-wrap-detector",
    },
    minify: false,
    outDir: "dist/web",
    emptyOutDir: false,
  },
});
