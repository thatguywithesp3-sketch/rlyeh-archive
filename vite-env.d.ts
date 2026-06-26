/// <reference types="vite/client" />

// The original CRA source reads asset paths from process.env.PUBLIC_URL.
// Vite replaces this at build time via `define` (see vite.config.ts);
// this ambient declaration just keeps TypeScript happy.
declare const process: {
  env: {
    PUBLIC_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  };
};
