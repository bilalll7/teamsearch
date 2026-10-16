import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
let refreshPromise: Promise<string> | null = null;
const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.startsWith("/auth/")
    )
      return Promise.reject(error);
    request._retry = true;
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearSession();
      window.location.assign("/login");
      return Promise.reject(error);
    }
    try {
      if (!refreshPromise)
        refreshPromise = axios
          .post(
            `${baseURL}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
          )
          .then(({ data }) => {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            return data.accessToken as string;
          })
          .finally(() => {
            refreshPromise = null;
          });
      request.headers.Authorization = `Bearer ${await refreshPromise}`;
      return api(request);
    } catch (refreshError) {
      clearSession();
      window.location.assign("/login");
      return Promise.reject(refreshError);
    }
  },
);
export async function logout() {
  if (refreshPromise) await refreshPromise;
  const token = localStorage.getItem("refreshToken");
  if (token) {
    try {
      await axios.post(
        `${baseURL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (e) {
      if (!axios.isAxiosError(e) || e.response?.status !== 401) throw e;
    }
  }
  clearSession();
}
export default api;
