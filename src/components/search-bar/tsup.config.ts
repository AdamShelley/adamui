import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    external: ["react", "react-dom", "framer-motion", "tailwindcss"],
    treeshake: true,
    target: 'es2019',
    sourcemap: true,
    minify: true,
    esbuildOptions(options) {
        options.jsx = 'automatic'
    },
    // Include CSS files
    loader: {
        '.css': 'copy',
    },
});