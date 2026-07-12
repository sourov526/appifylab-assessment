import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { loginUser, getAuthenticatedUser, registerUser } from "./auth.service.js";

export async function registerController(request: Request, response: Response) {
  const user = await registerUser(request.body, request.session);
  response.status(201).json({ user });
}

export async function loginController(request: Request, response: Response) {
  const user = await loginUser(request.body, request.session);
  response.json({ user });
}

export async function logoutController(request: Request, response: Response) {
  await new Promise<void>((resolve, reject) => {
    request.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  response.clearCookie(env.SESSION_COOKIE_NAME);
  response.status(204).send();
}

export async function meController(request: Request, response: Response) {
  if (!request.session.userId) {
    response.status(401).json({ message: "Authentication required" });
    return;
  }

  const user = await getAuthenticatedUser(request.session.userId);
  response.json({ user });
}
