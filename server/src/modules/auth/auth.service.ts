import bcrypt from "bcryptjs";
import type { Session, SessionData } from "express-session";
import { prisma } from "../../config/db.js";
import { sanitizeUser } from "../../utils/auth.js";
import { AppError } from "../../utils/app-error.js";
import type { loginSchema, registerSchema } from "./auth.schemas.js";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type AuthSession = Session & Partial<SessionData>;

async function persistSession(session: AuthSession, userId: string) {
  session.userId = userId;

  await new Promise<void>((resolve, reject) => {
    session.save((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export async function registerUser(input: RegisterInput, session: AuthSession) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });

  if (existingUser) {
    throw new AppError("Email is already in use", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      passwordHash
    }
  });

  await persistSession(session, user.id);

  return sanitizeUser(user);
}

export async function loginUser(input: LoginInput, session: AuthSession) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() }
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  await persistSession(session, user.id);

  return sanitizeUser(user);
}

export async function getAuthenticatedUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
}
