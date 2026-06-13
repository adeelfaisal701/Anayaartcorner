export const API_ENDPOINTS = {
  health: "/health",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  artworks: "/artworks",
  portraits: "/portraits",
  uploads: {
    image: "/uploads/image",
  },
} as const;
