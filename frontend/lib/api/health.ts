import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import type { ApiResponse } from "./types";

export async function checkHealth() {
  const { data } = await api.get<ApiResponse<{ status: string }>>(API_ENDPOINTS.health);
  return data.data;
}
