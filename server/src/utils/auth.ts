import type { User } from "@prisma/client";

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
}
