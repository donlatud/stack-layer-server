import { Router } from "express";
import { getProtectedRoute, getAdminOnlyRoute } from "../controllers/protected.controller.mjs";
import protectUser from "../middleware/protectUser.mjs";
import protectAdmin from "../middleware/protectAdmin.mjs";

const protectedRouter = Router();

// Protected routes (require valid Supabase JWT)
protectedRouter.get("/protected-route", protectUser, getProtectedRoute);

// Admin-only routes (require role = admin in users table)
protectedRouter.get("/admin-only", protectAdmin, getAdminOnlyRoute);

export default protectedRouter;

