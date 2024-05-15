import {defineConfig} from "vite";
import tailwindcss from "tailwindcss";

export default defineConfig({
    base: './',
    plugins: [],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
});