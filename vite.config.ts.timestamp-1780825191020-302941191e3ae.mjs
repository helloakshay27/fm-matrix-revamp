// vite.config.ts
import { defineConfig } from "file:///Users/haveninfoline/Desktop/fm-matrix-redesign/node_modules/vite/dist/node/index.js";
import react from "file:///Users/haveninfoline/Desktop/fm-matrix-redesign/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///Users/haveninfoline/Desktop/fm-matrix-redesign/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/Users/haveninfoline/Desktop/fm-matrix-redesign";
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
    // Reduce memory usage during build
    minify: "esbuild",
    sourcemap: false,
    // Add hash to filenames for cache busting
    rollupOptions: {
      output: {
        // Split vendor chunks to reduce memory pressure
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": ["@mui/material", "@mui/icons-material"],
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select"
          ],
          "vendor-tanstack": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"]
        },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGF2ZW5pbmZvbGluZS9EZXNrdG9wL2ZtLW1hdHJpeC1yZWRlc2lnblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hhdmVuaW5mb2xpbmUvRGVza3RvcC9mbS1tYXRyaXgtcmVkZXNpZ24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hhdmVuaW5mb2xpbmUvRGVza3RvcC9mbS1tYXRyaXgtcmVkZXNpZ24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA1MTczLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgLy8gVml0ZVBXQSh7XG4gICAgLy8gICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgIC8vICAgaW5qZWN0UmVnaXN0ZXI6IGZhbHNlLFxuICAgIC8vICAgc2VsZkRlc3Ryb3lpbmc6IHRydWUsXG4gICAgLy8gICBpbmNsdWRlQXNzZXRzOiBbXCJmYXZpY29uLmljb1wiLCBcInB3YS0xOTJ4MTkyLnBuZ1wiLCBcInB3YS01MTJ4NTEyLnBuZ1wiXSxcbiAgICAvLyAgIG1hbmlmZXN0OiB7XG4gICAgLy8gICAgIG5hbWU6IFwiRk0gTWF0cml4XCIsXG4gICAgLy8gICAgIHNob3J0X25hbWU6IFwiRk0gTWF0cml4XCIsXG4gICAgLy8gICAgIGRlc2NyaXB0aW9uOiBcIkZhY2lsaXR5IE1hbmFnZW1lbnQgTWF0cml4IEFwcGxpY2F0aW9uXCIsXG4gICAgLy8gICAgIHRoZW1lX2NvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAvLyAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgLy8gICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgIC8vICAgICBzdGFydF91cmw6IFwiL1wiLFxuICAgIC8vICAgICBpY29uczogW1xuICAgIC8vICAgICAgIHtcbiAgICAvLyAgICAgICAgIHNyYzogXCIvcHdhLTE5MngxOTIucG5nXCIsXG4gICAgLy8gICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgIC8vICAgICAgICAgcHVycG9zZTogXCJhbnkgbWFza2FibGVcIixcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICAgIHtcbiAgICAvLyAgICAgICAgIHNyYzogXCIvcHdhLTUxMng1MTIucG5nXCIsXG4gICAgLy8gICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgIC8vICAgICAgICAgcHVycG9zZTogXCJhbnkgbWFza2FibGVcIixcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICBdLFxuICAgIC8vICAgfSxcbiAgICAvLyAgIHdvcmtib3g6IHtcbiAgICAvLyAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z31cIl0sXG4gICAgLy8gICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAyMCAqIDEwMjQgKiAxMDI0LCAvLyAyMCBNQiBsaW1pdFxuICAgIC8vICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgIC8vICAgICAgIHtcbiAgICAvLyAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nb29nbGVhcGlzXFwuY29tXFwvLiovaSxcbiAgICAvLyAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxuICAgIC8vICAgICAgICAgb3B0aW9uczoge1xuICAgIC8vICAgICAgICAgICBjYWNoZU5hbWU6IFwiZ29vZ2xlLWZvbnRzLWNhY2hlXCIsXG4gICAgLy8gICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAvLyAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAvLyAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsIC8vIDEgeWVhclxuICAgIC8vICAgICAgICAgICB9LFxuICAgIC8vICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgIC8vICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAvLyAgICAgICAgICAgfSxcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgXSxcbiAgICAvLyAgIH0sXG4gICAgLy8gICBkZXZPcHRpb25zOiB7XG4gICAgLy8gICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgLy8gICB9LFxuICAgIC8vIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBbXCIqKi8qLnhsc3hcIiwgXCIqKi8qLnhsc1wiXSxcbiAgYmFzZTogXCIvXCIsIC8vIFVzZSBhYnNvbHV0ZSBwYXRocyBmb3IgcHJvcGVyIGFzc2V0IGxvYWRpbmdcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIC8vIFJlZHVjZSBtZW1vcnkgdXNhZ2UgZHVyaW5nIGJ1aWxkXG4gICAgbWluaWZ5OiBcImVzYnVpbGRcIixcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIC8vIEFkZCBoYXNoIHRvIGZpbGVuYW1lcyBmb3IgY2FjaGUgYnVzdGluZ1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBTcGxpdCB2ZW5kb3IgY2h1bmtzIHRvIHJlZHVjZSBtZW1vcnkgcHJlc3N1cmVcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgXCJ2ZW5kb3ItcmVhY3RcIjogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1yb3V0ZXItZG9tXCJdLFxuICAgICAgICAgIFwidmVuZG9yLW11aVwiOiBbXCJAbXVpL21hdGVyaWFsXCIsIFwiQG11aS9pY29ucy1tYXRlcmlhbFwiXSxcbiAgICAgICAgICBcInZlbmRvci1yYWRpeFwiOiBbXG4gICAgICAgICAgICBcIkByYWRpeC11aS9yZWFjdC1kaWFsb2dcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnVcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRhYnNcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNlbGVjdFwiLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgXCJ2ZW5kb3ItdGFuc3RhY2tcIjogW1wiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCJdLFxuICAgICAgICAgIFwidmVuZG9yLWNoYXJ0c1wiOiBbXCJyZWNoYXJ0c1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gQWRkIGhhc2ggdG8gZ2VuZXJhdGVkIGZpbGVzIGZvciBiZXR0ZXIgY2FjaGUgaW52YWxpZGF0aW9uXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS5baGFzaF0uanNgLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0uW2hhc2hdLmpzYCxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLltoYXNoXS5bZXh0XWAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIC8vIERpc2FibGUgY2FjaGluZyBpbiBkZXZlbG9wbWVudFxuICBjYWNoZURpcjogbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiID8gXCIudml0ZS1uby1jYWNoZVwiIDogXCIudml0ZVwiLFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVCxTQUFTLG9CQUFvQjtBQUM1VixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFxRDVDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZSxDQUFDLGFBQWEsVUFBVTtBQUFBLEVBQ3ZDLE1BQU07QUFBQTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBO0FBQUEsSUFFYixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQSxJQUVYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGNBQWMsQ0FBQyxpQkFBaUIscUJBQXFCO0FBQUEsVUFDckQsZ0JBQWdCO0FBQUEsWUFDZDtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxtQkFBbUIsQ0FBQyx1QkFBdUI7QUFBQSxVQUMzQyxpQkFBaUIsQ0FBQyxVQUFVO0FBQUEsUUFDOUI7QUFBQTtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxVQUFVLFNBQVMsZ0JBQWdCLG1CQUFtQjtBQUN4RCxFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
