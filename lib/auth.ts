import { cookies } from "next/headers";

export const AUTH_COOKIE = "admin_session";
export const AUTH_VALUE = "owner-ok";

export const DEFAULT_LOGIN = "owner";
export const DEFAULT_PASSWORD = "owner";

export function isAuthenticated(): boolean {
  return cookies().get(AUTH_COOKIE)?.value === AUTH_VALUE;
}
