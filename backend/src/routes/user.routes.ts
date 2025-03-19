import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = express.Router();

const router = express.Router();

userRoutes.post("/register", async (req: Request, res: Response) => {
    await UserController.register(req, res);
});

userRoutes.post("/login", (req: Request, res: Response) => {
    UserController.login(req, res);
});

userRoutes.post("/refresh-token", (req: Request, res: Response) => {
    UserController.refreshToken(req, res);
});

userRoutes.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({ message: "Logout successful" });
});

export default userRoutes;
