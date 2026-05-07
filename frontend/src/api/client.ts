import { create } from "axios";
import Constants from "expo-constants";

const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
const BASE_URL = expoHost
  ? `http://${expoHost}:5000/api`
  : "http://localhost:5000/api";

let getToken: (() => string | null) | null = null;

export const setAuthTokenProvider = (tokenGetter: () => string | null) => {
  getToken = tokenGetter;
};

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 8000,
});

apiClient.interceptors.request.use((config) => {
  // Attach token before every request if user is logged in.
  const token = getToken ? getToken() : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
