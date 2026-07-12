export const SESSION_COOKIE_NAME = "appifylab.sid";

export function isProtectedPath(pathname: string) {
  return pathname.startsWith("/feed");
}

export function isAuthPath(pathname: string) {
  return pathname === "/login" || pathname === "/register" || pathname === "/registration";
}
