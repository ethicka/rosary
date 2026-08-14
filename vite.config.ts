import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "icons/icon.svg"],
      manifest: {
        name: "Rosary",
        short_name: "Rosary",
        description: "A bead-by-bead guide to praying the Rosary, offline and distraction-free.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#faf7f2",
        theme_color: "#6b3f2a",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
      },
    }),
  ],
});
