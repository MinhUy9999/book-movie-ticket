import { UserService } from "../services/user.service";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { Request, Response } from "express";
import { isValidEmail, isValidPhoneNumber, isValidPassword, isValidDateOfBirth } from "../utils/validation";

const userService = new UserService();

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { username, password, email, genders, phone, dateofbirth, avatar, role } = req.body;

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
            if (!["male", "female"].includes(genders.toLowerCase())) {
                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Genders must be 'male' or 'female'" });
            }

            const user = await userService.createUser(username, password, email, genders, phone, dateofbirth, avatar, role);
            res.status(HTTP_STATUS_CODES.CREATED).json({ message: "User created successfully", user });
        } catch (error: any) {
            console.error("❌ Error creating user:", error.message);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message || "Error creating user" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const { token, user } = await userService.login(username, password);

            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
            res.status(HTTP_STATUS_CODES.OK).json({ message: "Logged in successfully", user, token });
        } catch (error: any) {
            console.error("❌ Error logging in:", error.message);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message || "Error logging in" });
        }
    }
}
