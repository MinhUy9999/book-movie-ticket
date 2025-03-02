import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { UserService } from "../services/user.service";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { isValidEmail, isValidPhoneNumber, isValidPassword, isValidDateOfBirth } from "../utils/validation";

const userService = new UserService();

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, phone, dateofbirth, gender, avatar } = req.body;

            if (!isValidEmail(email)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid email format" });
            }
            if (!isValidPhoneNumber(phone)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid phone number format (must be at least 10 digits)" });
            }
            if (!isValidPassword(password)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Password must be at least 8 characters long and include at least 1 letter and 1 number" });
            }
            if (!isValidDateOfBirth(dateofbirth)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid date format (must be dd/mm/yyyy)" });
            }

            const user = await userService.register(email, password, phone, dateofbirth, gender, avatar);

            const userPayload = { username: user.username, email: user.email, role: user.role };

            const accessToken = generateAccessToken(userPayload);
            const refreshToken = generateRefreshToken(userPayload);

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(HTTP_STATUS_CODES.CREATED).json({ message: "User registered successfully", user, accessToken });
        } catch (error: any) {
            console.error("Error registering user:", error.message);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message || "Error registering user" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!isValidEmail(email)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid email format" });
            }
            if (!isValidPassword(password)) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid password format" });
            }

            const user = await userService.login(email, password);

            const userPayload = { username: user.username, email: user.email, role: user.role };

            const accessToken = generateAccessToken(userPayload);
            const refreshToken = generateRefreshToken(userPayload);

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            res.status(HTTP_STATUS_CODES.OK).json({ message: "Logged in successfully", user, accessToken });
        } catch (error: any) {
            console.error("Error logging in:", error.message);
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: error.message || "Error logging in" });
        }
    }
}
