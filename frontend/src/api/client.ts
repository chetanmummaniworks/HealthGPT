import axios from 'axios'

/**
 * Shared Axios instance for all API requests.
 *
 * The base URL is configurable via the VITE_API_URL environment variable.
 * If not set, requests go to /api/v1 which is proxied to the FastAPI
 * backend by the Vite dev server (see vite.config.ts).
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 5000,
})

export default apiClient