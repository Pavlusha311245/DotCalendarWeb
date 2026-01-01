import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: './',
    publicDir: 'public',
    plugins: [tailwindcss(),],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true
    }
});