import { saveToken, clearAuth } from "@/utils/auth";

export const setToken = (token: string): void => {
  saveToken(token);
};

export const clearTokenFromStore = (): void => {
  clearAuth();
};
