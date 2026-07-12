import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginController, logoutController, meController, registerController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(registerController));
authRouter.post("/login", validate(loginSchema), asyncHandler(loginController));
authRouter.post("/logout", asyncHandler(logoutController));
authRouter.get("/me", asyncHandler(meController));
