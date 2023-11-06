/// <reference types="vitest" />

import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import generouted from '@generouted/react-router/plugin'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/web',

  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [
        // to fix this error: https://stackoverflow.com/questions/74902697/error-the-request-url-is-outside-of-vite-serving-allow-list-after-git-init
        searchForWorkspaceRoot(process.cwd() + '/apps/web/src'),
      ],
    }
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    generouted({
      source: {
        routes: searchForWorkspaceRoot(process.cwd()) + '/apps/web/src/pages/**/[\\w[-]*.{jsx,tsx}',
        modals: searchForWorkspaceRoot(process.cwd()) + '/apps/web/src/modals/**/[+]*.{jsx,tsx}',
      },
      output: searchForWorkspaceRoot(process.cwd()) + '/libs/web/router/src/router.ts',
    }),
  ],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  
});
