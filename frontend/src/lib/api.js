const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:6000";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
const API_VERSION_PREFIX = "/api/v1";

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${API_VERSION_PREFIX}${normalizedPath}`;
};
