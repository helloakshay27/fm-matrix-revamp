import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   injectRegister: false,
    //   selfDestroying: true,
    //   includeAssets: ["favicon.ico", "pwa-192x192.png", "pwa-512x512.png"],
    //   manifest: {
    //     name: "FM Matrix",
    //     short_name: "FM Matrix",
    //     description: "Facility Management Matrix Application",
    //     theme_color: "#ffffff",
    //     background_color: "#ffffff",
    //     display: "standalone",
    //     start_url: "/",
    //     icons: [
    //       {
    //         src: "/pwa-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //       {
    //         src: "/pwa-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //     maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 MB limit
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "google-fonts-cache",
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200],
    //           },
    //         },
    //       },
    //     ],
    //   },
    //   devOptions: {
    //     enabled: true,
    //   },
    // }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.xlsx", "**/*.xls"],
  base: "/", // Use absolute paths for proper asset loading
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Add hash to filenames for cache busting
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Add hash to generated files for better cache invalidation
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  // Disable caching in development
  cacheDir: mode === 'development' ? '.vite-no-cache' : '.vite',
}));
