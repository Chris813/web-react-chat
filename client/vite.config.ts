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
