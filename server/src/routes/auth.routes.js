import { Router } from "express";
import { asyncRoute, requireAuth, rateLimit } from "../middleware/security.js";
import * as controller from "../controllers/auth.controller.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many login attempts. Try again in 15 minutes." });

router.post("/login", loginLimiter, asyncRoute(controller.login));
router.get("/me", requireAuth, asyncRoute(controller.me));
const credentialsLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many attempts. Try again in 15 minutes." });
router.put("/credentials", requireAuth, credentialsLimiter, asyncRoute(controller.updateCredentials));
router.post("/logout", asyncRoute(controller.logout));

export default router;
