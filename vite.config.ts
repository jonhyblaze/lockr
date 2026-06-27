import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon-180x180.png"],
      workbox: {
        // Precache the entire static build so the app works fully offline.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"]
      },
      manifest: {
        name: "Lockr — Password Generator",
        short_name: "Lockr",
        description: "Generate strong passwords entirely offline. No internet required.",
        theme_color: "#282828",
        background_color: "#282828",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
