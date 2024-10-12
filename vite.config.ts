import pluginChecker from 'vite-plugin-checker';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { loadEnv } from 'vite';

const envDir = './environment';

export default ({ mode }: { mode: any }) => {
  const env = loadEnv(mode, envDir);

  return defineConfig({
    base: env.VITE_APP_PUBLIC_URL,
    plugins: [react(), svgr(), pluginChecker({ typescript: true })],
    envDir: envDir,
    server: {
      open: true,
      port: 3000,
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTest.ts',
      css: false,
    },
  });
};
