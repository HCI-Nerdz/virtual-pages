import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/virtual-pages/",
  server: { port: 5180 },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        edge: resolve(root, "edge/index.html"),
        preview: resolve(root, "preview/index.html"),
        contrast: resolve(root, "contrast/index.html"),
      },
    },
  },
});
