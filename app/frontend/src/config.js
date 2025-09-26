// Centralized frontend configuration
// Prefer environment variables, but provide safe local defaults for DX

// Prefer Vite env (import.meta.env) but support CRA env (process.env) as fallback
const viteUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL;
export const BACKEND_URL = viteUrl || "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api`;

export default {
  BACKEND_URL,
  API_BASE,
};
