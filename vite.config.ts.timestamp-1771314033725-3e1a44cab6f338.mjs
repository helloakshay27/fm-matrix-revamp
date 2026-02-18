// vite.config.ts
import { defineConfig } from "file:///C:/fm-matrix-revamp/node_modules/vite/dist/node/index.js";
import react from "file:///C:/fm-matrix-revamp/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/fm-matrix-revamp/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\fm-matrix-revamp";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
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
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  assetsInclude: ["**/*.xlsx", "**/*.xls"],
  base: "/",
  // Use absolute paths for proper asset loading
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Add hash to filenames for cache busting
    rollupOptions: {
      output: {
        manualChunks: void 0,
        // Add hash to generated files for better cache invalidation
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  // Disable caching in development
  cacheDir: mode === "development" ? ".vite-no-cache" : ".vite"
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxmbS1tYXRyaXgtcmV2YW1wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxmbS1tYXRyaXgtcmV2YW1wXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9mbS1tYXRyaXgtcmV2YW1wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgICAvLyBWaXRlUFdBKHtcclxuICAgIC8vICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcclxuICAgIC8vICAgaW5qZWN0UmVnaXN0ZXI6IGZhbHNlLFxyXG4gICAgLy8gICBzZWxmRGVzdHJveWluZzogdHJ1ZSxcclxuICAgIC8vICAgaW5jbHVkZUFzc2V0czogW1wiZmF2aWNvbi5pY29cIiwgXCJwd2EtMTkyeDE5Mi5wbmdcIiwgXCJwd2EtNTEyeDUxMi5wbmdcIl0sXHJcbiAgICAvLyAgIG1hbmlmZXN0OiB7XHJcbiAgICAvLyAgICAgbmFtZTogXCJGTSBNYXRyaXhcIixcclxuICAgIC8vICAgICBzaG9ydF9uYW1lOiBcIkZNIE1hdHJpeFwiLFxyXG4gICAgLy8gICAgIGRlc2NyaXB0aW9uOiBcIkZhY2lsaXR5IE1hbmFnZW1lbnQgTWF0cml4IEFwcGxpY2F0aW9uXCIsXHJcbiAgICAvLyAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgLy8gICAgIGJhY2tncm91bmRfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgLy8gICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgLy8gICAgIHN0YXJ0X3VybDogXCIvXCIsXHJcbiAgICAvLyAgICAgaWNvbnM6IFtcclxuICAgIC8vICAgICAgIHtcclxuICAgIC8vICAgICAgICAgc3JjOiBcIi9wd2EtMTkyeDE5Mi5wbmdcIixcclxuICAgIC8vICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgLy8gICAgICAgICBwdXJwb3NlOiBcImFueSBtYXNrYWJsZVwiLFxyXG4gICAgLy8gICAgICAgfSxcclxuICAgIC8vICAgICAgIHtcclxuICAgIC8vICAgICAgICAgc3JjOiBcIi9wd2EtNTEyeDUxMi5wbmdcIixcclxuICAgIC8vICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgLy8gICAgICAgICBwdXJwb3NlOiBcImFueSBtYXNrYWJsZVwiLFxyXG4gICAgLy8gICAgICAgfSxcclxuICAgIC8vICAgICBdLFxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gICB3b3JrYm94OiB7XHJcbiAgICAvLyAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z31cIl0sXHJcbiAgICAvLyAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDIwICogMTAyNCAqIDEwMjQsIC8vIDIwIE1CIGxpbWl0XHJcbiAgICAvLyAgICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgIC8vICAgICAgIHtcclxuICAgIC8vICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxyXG4gICAgLy8gICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcclxuICAgIC8vICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgLy8gICAgICAgICAgIGNhY2hlTmFtZTogXCJnb29nbGUtZm9udHMtY2FjaGVcIixcclxuICAgIC8vICAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcclxuICAgIC8vICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSwgLy8gMSB5ZWFyXHJcbiAgICAvLyAgICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgLy8gICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxyXG4gICAgLy8gICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICB9LFxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyAgIGRldk9wdGlvbnM6IHtcclxuICAgIC8vICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gfSksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi54bHN4XCIsIFwiKiovKi54bHNcIl0sXHJcbiAgYmFzZTogXCIvXCIsIC8vIFVzZSBhYnNvbHV0ZSBwYXRocyBmb3IgcHJvcGVyIGFzc2V0IGxvYWRpbmdcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiBcImRpc3RcIixcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgLy8gQWRkIGhhc2ggdG8gZmlsZW5hbWVzIGZvciBjYWNoZSBidXN0aW5nXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczogdW5kZWZpbmVkLFxyXG4gICAgICAgIC8vIEFkZCBoYXNoIHRvIGdlbmVyYXRlZCBmaWxlcyBmb3IgYmV0dGVyIGNhY2hlIGludmFsaWRhdGlvblxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5baGFzaF0uanNgLFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5baGFzaF0uanNgLFxyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5baGFzaF0uW2V4dF1gLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8vIERpc2FibGUgY2FjaGluZyBpbiBkZXZlbG9wbWVudFxyXG4gIGNhY2hlRGlyOiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnID8gJy52aXRlLW5vLWNhY2hlJyA6ICcudml0ZScsXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErTyxTQUFTLG9CQUFvQjtBQUM1USxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFxRDVDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZSxDQUFDLGFBQWEsVUFBVTtBQUFBLEVBQ3ZDLE1BQU07QUFBQTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsSUFFYixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxRQUVkLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsVUFBVSxTQUFTLGdCQUFnQixtQkFBbUI7QUFDeEQsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
