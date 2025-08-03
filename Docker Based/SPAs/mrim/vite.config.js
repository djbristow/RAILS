import { fileURLToPath, URL } from "node:url";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
    resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 3001, // This is for local dev server, not directly used in Docker deploy behind Nginx
    },
    // --- ADD THIS 'base' OPTION ---
    base: '/mrim/', // <-- IMPORTANT: This tells Vite to prepend /mrim/ to all asset URLs
    // --- END ADDITION ---
})