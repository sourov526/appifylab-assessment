const SESSION_COOKIE_NAME = "session";

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/feed");
}
