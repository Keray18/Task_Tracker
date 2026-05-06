import { apiClient } from "./client";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
  success?: boolean;
};

export const loginApi = async (email: string, password: string) => {
  const response = await apiClient.post<AuthResponse>("/auth/logUserIn", {
    email,
    password,
  });
  return response.data;
};

export const signupApi = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await apiClient.post<AuthResponse>("/auth/signUserUp", {
    name,
    email,
    password,
  });
  return response.data;
};
