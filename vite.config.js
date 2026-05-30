import { defineConfig } from "vite";

const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:5050",
    changeOrigin: true,
  },
};

export default defineConfig({
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
});
