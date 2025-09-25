// Environment-based constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE || 
  (import.meta.env.PROD ? "/api" : "http://localhost:3001");
export const SOCKET_URL = import.meta.env.PROD 
  ? window.location.origin 
  : "http://localhost:3001";

// Image and media URLs - use server URL in development, relative in production
export const getImageURL = (filename) => {
  if (!filename) return null;
  
  // Remove any existing protocol/host from filename
  const cleanFilename = filename.replace(/^https?:\/\/[^\/]+/, '');
  
  // In development, use the full server URL
  if (!import.meta.env.PROD) {
    const serverURL = "http://localhost:3001";
    if (cleanFilename.startsWith('/uploads/')) {
      return `${serverURL}${cleanFilename}`;
    }
    return cleanFilename.startsWith('/') 
      ? `${serverURL}/uploads${cleanFilename}`
      : `${serverURL}/uploads/${cleanFilename}`;
  }
  
  // In production, use relative paths
  if (cleanFilename.startsWith('/uploads/')) {
    return cleanFilename;
  }
  
  return cleanFilename.startsWith('/') 
    ? `/uploads${cleanFilename}`
    : `/uploads/${cleanFilename}`;
};

// Asset URLs - always relative
export const getAssetURL = (path) => {
  if (!path) return null;
  
  // Remove any existing protocol/host from path
  const cleanPath = path.replace(/^https?:\/\/[^\/]+/, '');
  
  // Ensure it starts with /
  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
};

// File upload URLs
export const getUploadURL = (filename) => {
  return getImageURL(filename);
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  getImageURL,
  getAssetURL,
  getUploadURL
};
