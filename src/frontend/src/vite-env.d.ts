/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public app URL for sharing (e.g., https://your-canister-id.ic0.app) */
  readonly VITE_PUBLIC_APP_URL?: string;
  
  /** Internet Identity provider URL (defaults to https://identity.ic0.app) */
  readonly VITE_II_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
