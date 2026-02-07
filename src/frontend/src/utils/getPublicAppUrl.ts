/**
 * Returns the public app URL for sharing.
 * In production on Internet Computer, this will be the canister's public URL.
 * During development, falls back to window.location.origin.
 */
export function getPublicAppUrl(): string {
  // Check if there's an explicit production URL set via environment variable
  // This would be set during the build process for IC mainnet deployments
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL;
  
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  
  // Fall back to current origin (works for both dev and production)
  return window.location.origin;
}
