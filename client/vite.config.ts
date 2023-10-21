import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@api": "/src/api",
      "@utils": "/src/utils",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@context": "/src/context",
      "@hooks": "/src/hooks",
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
});

//config port

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//   },
// });

//config proxy

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// });
