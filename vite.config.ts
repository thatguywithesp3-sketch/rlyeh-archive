import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from GitHub Pages under /R-LYEH-ARCHIVE/.
const BASE = '/R-LYEH-ARCHIVE/';

export default defineConfig({
  base: BASE,
  plugins: [
    react({
      babel: {
        plugins: [
          // Enables styled-components SSR-safe class names, displayNames, and minification
          ['babel-plugin-styled-components', { displayName: true, fileName: false }],
        ],
      },
    }),
  ],
  define: {
    // The original CRA source uses process.env.PUBLIC_URL for asset paths.
    // Map it to the Vite base (without the trailing slash so `${PUBLIC}/Images/...` stays valid).
    'process.env.PUBLIC_URL': JSON.stringify(BASE.replace(/\/$/, '')),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
