import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";


const router = express.Router();

router.post("/create-user", async (req: Request, res: Response) => {
    await UserController.createUser(req, res);
});


router.post("/login", async (req: Request, res: Response) => {
    await UserController.login(req, res);
});

router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({ message: "Logout successful" });
})



export default router;
