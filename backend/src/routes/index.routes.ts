import { Router } from "express";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/admin", adminRoutes);

export default router;
