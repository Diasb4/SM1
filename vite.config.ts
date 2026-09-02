import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000';
  const wsTarget = backendTarget.replace(/^http/, 'ws');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true
        },
        '/ws': {
          target: wsTarget,
          ws: true
        }
      }
    },
    preview: {
      port: Number(process.env.PORT) || 80,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true
        },
        '/ws': {
          target: wsTarget,
          ws: true
        }
      }
    }
  };
});
