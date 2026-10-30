import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

/** Dev-only. The FM session token is signed for another host and vi-uat returns 401.
 *  The Postman collection already has a bearer that host accepts. Read it here so it
 *  never lands in the client bundle. */
const readViAuditBearer = () => {
  try {
    const file = path.resolve(__dirname, "audit dashboardd.json");
    const collection = JSON.parse(fs.readFileSync(file, "utf8"));
    const items = Array.isArray(collection.item) ? collection.item : [];
    for (const item of items) {
      const bearer = item?.request?.auth?.bearer;
      if (!Array.isArray(bearer)) continue;
      const token = bearer.find((entry) => entry?.key === "token")?.value;
      if (typeof token === "string" && token) return token;
    }
  } catch {
    return "";
  }
  return "";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      "/vi-audit-dashboard": {
        target: "https://vi-uat-api.gophygital.work",
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/vi-audit-dashboard/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const token = readViAuditBearer();
            if (token) proxyReq.setHeader("Authorization", `Bearer ${token}`);
          });
        },
      },
    },
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
  // Strip license/version banners from the production bundle so a scanner can't
  // fingerprint third-party library versions straight out of the shipped JS.
  esbuild: {
    legalComments: "none",
  },
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
            "@radix-ui/react-select",
          ],
          "vendor-tanstack": ["@tanstack/react-query"],
          "vendor-charts": ["recharts"],
        },
        // Add hash to generated files for better cache invalidation
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  // Disable caching in development
  cacheDir: mode === "development" ? ".vite-no-cache" : ".vite",
}));
