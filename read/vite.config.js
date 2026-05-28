import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";
import { fileURLToPath } from "url";
import { cwd } from "process";
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      viteMockServe({
        mockPath: "mock",
        localEnabled: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // 代理Doubao API请求
        "/api/doubao": {
          target: "https://ark.cn-beijing.volces.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/doubao/, "/api/v3"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              // 添加API密钥到请求头
              const apiKey = env.VITE_DOUBAO_API_KEY;
              proxyReq.setHeader("Authorization", `Bearer ${apiKey}`);
            });
          },
        },
      },
    },
  };
});
