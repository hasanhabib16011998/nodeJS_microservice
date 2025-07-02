const BASE_URL = import.meta.env.VITE_BASE_URL as string;
export const API_URLS = {
  IDENTITY_SERVICE: `${BASE_URL}/auth`, // Identity Service
  POST_SERVICE: `${BASE_URL}/posts`, // Posts Service
};

export default API_URLS;