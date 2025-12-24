import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: './',
    publicDir: 'public',
    plugins: [tailwindcss(),],
    server: {
        port: 5173,
        strictPort: true
    }
});