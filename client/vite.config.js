
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      Pragma: "no-cache",
    },

    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
