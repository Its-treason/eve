import type { UserConfigFn, UserConfig } from 'vite';
import swcReact from 'vite-plugin-swc-react';

const defineConfig: UserConfigFn = () => {
  const config: UserConfig = {
    plugins: [
      swcReact(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react'],
            'react-dom': ['react-dom'],
          },
        },
      },
    },
  };
  return config;
};

export default defineConfig;
