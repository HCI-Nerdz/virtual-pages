import { defineConfig } from "vite";

export default defineConfig({
  base: "/virtual-pages/",
  server: { port: 5180 },
  build: { outDir: "dist", emptyOutDir: true },
});
