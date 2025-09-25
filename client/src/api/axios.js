// Legacy axios configuration - DEPRECATED
// Use src/lib/api.js instead for new code
import { api } from "../lib/api.js";

// Export the centralized API instance for backward compatibility
export default api;

// Legacy axiosPrivate - now just an alias to the main API
export const axiosPrivate = api;
