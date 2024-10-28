import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: [
        path.resolve(__dirname, "src/react/FluidFlexbox.tsx"),
        path.resolve(__dirname, "src/dom/FlexWrapDetectorElement.ts"),
      ],
      fileName: (format, entryAlias) => {
        if (entryAlias === "FluidFlexbox") {
          return `fluid-flexbox.${format}.js`;
        }
        return `flex-wrap-detector.${format}.js`;
      },
    },
    minify: false,
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
