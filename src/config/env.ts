const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

/** Base URL for API requests. Empty string uses same-origin (Vite proxy in dev). */
export const apiBaseUrl = rawBaseUrl.replace(/\/$/, '')
