import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // define: {
  //   "process.env": {
  //     client_id: "2234930308709.4581249840898",
  //     client_secret: "e98453ab9630e22b66822da70adb906f",
  //     token:
  //       "xoxp-2234930308709-2244156506612-4587180741572-b3e74159b0ea29044648aef78aa7bdca",
  //   },
  // },
  define: {
    "process.env": {
      client_id: "4709198068304.4698150294465",
      client_secret: "c66e811a6fdb4b5f27fee2596fd368f1",
      token:
        "xoxp-4709198068304-4682558614357-4678946849990-b4f3049b72a425ae70a3b444a54f36b2",
    },
  },
});
