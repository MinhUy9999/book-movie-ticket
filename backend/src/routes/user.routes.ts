import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = express.Router();

userRoutes.post("/register", (req: Request, res: Response) => {
    UserController.register(req, res);
});

userRoutes.post("/login", (req: Request, res: Response) => {
    UserController.login(req, res);
});

//gọi hàm này ở client để phòng khi accessToken hết hạn
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
