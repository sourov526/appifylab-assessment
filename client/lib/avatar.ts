import type { AuthUser } from "@/types";

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getBackgroundColor(seedSource: string) {
  const palette = ["#F6C358", "#F4978E", "#84A59D", "#90CAF9", "#B39DDB", "#A5D6A7"];
  const seed = seedSource
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return palette[seed % palette.length];
}

export function getUserAvatarSrc(user: Pick<AuthUser, "firstName" | "lastName" | "email">) {
  const initials = getInitials(user.firstName, user.lastName);
  const background = getBackgroundColor(`${user.firstName}${user.lastName}${user.email}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${background}"/><text x="40" y="49" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#112032">${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
