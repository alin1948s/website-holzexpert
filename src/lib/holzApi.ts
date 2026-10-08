const configuredApiBase = import.meta.env.VITE_HOLZ_API_URL?.trim();
export const HOLZ_API_BASE = (configuredApiBase || '/api').replace(/\/+$/, '');

export function holzApiUrl(path: string): string {
  return `${HOLZ_API_BASE}/${path.replace(/^\/+/, '')}`;
}

export function getAdminToken(): string {
  try {
    return sessionStorage.getItem('holzexpert_admin_token') || '';
  } catch {
    return '';
  }
}

export function setAdminToken(value: string): void {
  try {
    if (value) sessionStorage.setItem('holzexpert_admin_token', value);
    else sessionStorage.removeItem('holzexpert_admin_token');
  } catch {
    // The dashboard still works for the current page session if storage is unavailable.
  }
}
