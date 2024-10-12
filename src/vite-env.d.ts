/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_URL_API: string;
  readonly VITE_APP_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
