import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "wakey-panel.js",
    },
    // Straight into the folder the integration ships, because HACS copies the
    // repo verbatim and never runs a build step.
    outDir: "../custom_components/wakey/frontend/dist",
    emptyOutDir: true,
    target: "es2022",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      // One self-contained file. Hashed sibling chunks are exactly the kind of
      // thing that goes stale in a committed artifact.
      output: { inlineDynamicImports: true },
    },
  },
});
