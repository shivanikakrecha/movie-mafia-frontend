/* eslint-disable @typescript-eslint/no-explicit-any */

// import { APP_CONSTANTS } from "components/constants/AppConstants";
import { parseJwt } from "../utils/parsedJwt";

export const persistToken = (token: string, refresh_token: string): void => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("is_first_time_login", "1");
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("account_info", JSON.stringify(parseJwt(token)));
};

export const readToken = (): string => {
  return localStorage.getItem("accessToken") || "";
};

export const persistUser = (user: any): void => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

export const readUser = (): any | null => {
  const userStr = localStorage.getItem("user");

  return userStr ? JSON.parse(userStr) : null;
};

export const deleteToken = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("account_info");
  localStorage.removeItem("is_first_time_login");
};

export const deleteUser = (): void => localStorage.removeItem("user");
export const removeUserLoggedInCount = (): void => localStorage.removeItem("userLoggedInCount");
