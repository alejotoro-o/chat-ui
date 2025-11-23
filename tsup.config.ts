import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],   // entry point for your library
    format: ["cjs", "esm"],    // output both CommonJS and ES modules
    dts: true,                 // generate type declarations
    sourcemap: true,           // helpful for debugging
    clean: true,               // clear dist before build
    minify: false,             // keep readable output (optional)
    external: ["react", "react-dom"] // don’t bundle React
})