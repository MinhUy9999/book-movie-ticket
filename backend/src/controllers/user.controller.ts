// File điều khiển xử lý các yêu cầu HTTP liên quan đến người dùng
import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { isValidEmail, isValidPhoneNumber, isValidPassword, isValidDateOfBirth } from "../utils/validation";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { UserService } from "../services/user.service";
import { responseSend } from "../config/response";

const userService = new UserService();

export class UserController {
    // Phương thức đăng ký người dùng
    static async register(req: Request, res: Response) {
        try {
            const { email, password, phone, dateofbirth, gender, avatar } = req.body;

            if (!isValidEmail(email)) {
                return responseSend(res, null, "Định dạng email không hợp lệ", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            if (!isValidPhoneNumber(phone)) {
                return responseSend(res, null, "Định dạng số điện thoại không hợp lệ (ít nhất 10 số)", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            if (!isValidPassword(password)) {
                return responseSend(res, null, "Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất 1 chữ cái và 1 số", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            if (!isValidDateOfBirth(dateofbirth)) {
                return responseSend(res, null, "Định dạng ngày không hợp lệ (phải là dd/mm/yyyy)", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const user = await userService.register(email, password, phone, dateofbirth, gender, avatar);
            const userPayload = { username: user.username, email: user.email, role: user.role };
            const accessToken = generateAccessToken(userPayload);
            const refreshToken = generateRefreshToken(userPayload);

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            responseSend(res, { user, accessToken }, "Đăng ký thành công", HTTP_STATUS_CODES.CREATED);
        } catch (error: any) {
            console.error("Error registering user:", error.message);
            responseSend(res, null, error.message || "Lỗi khi đăng ký người dùng", HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }
    // Phương thức đăng nhập người dùng
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!isValidEmail(email)) {
                return responseSend(res, null, "Định dạng email không hợp lệ", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            if (!isValidPassword(password)) {
                return responseSend(res, null, "Định dạng mật khẩu không hợp lệ", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const user = await userService.login(email, password);
            const userPayload = { username: user.username, email: user.email, role: user.role };
            const accessToken = generateAccessToken(userPayload);
            const refreshToken = generateRefreshToken(userPayload);

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            responseSend(res, { user, accessToken }, "Đăng nhập thành công", HTTP_STATUS_CODES.OK);
        } catch (error: any) {
            console.error("Error logging in:", error.message);
            responseSend(res, null, error.message || "Lỗi khi đăng nhập", HTTP_STATUS_CODES.UNAUTHORIZED);
        }
    }
    // Phương thức lấy tất cả người dùng
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            responseSend(res, { users }, "Lấy danh sách người dùng thành công", HTTP_STATUS_CODES.OK);
        } catch (error: any) {
            responseSend(res, null, error.message || "Lỗi khi lấy danh sách người dùng", HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }
    // Phương thức làm mới token
    static async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                return responseSend(res, null, "Không có refresh token", HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const decoded: any = verifyRefreshToken(refreshToken);
            if (!decoded) {
                return responseSend(res, null, "Refresh token không hợp lệ", HTTP_STATUS_CODES.FORBIDDEN);
            }

            const userPayload = {
                username: decoded.username,
                email: decoded.email,
                role: decoded.role,
            };
            const newAccessToken = generateAccessToken(userPayload);

            responseSend(res, { accessToken: newAccessToken }, "Làm mới token thành công", HTTP_STATUS_CODES.OK);
        } catch (error: any) {
            responseSend(res, null, error.message || "Lỗi khi làm mới token", HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }
    // Phương thức xử lý yêu cầu quên mật khẩu
    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!isValidEmail(email)) {
                return responseSend(res, null, "Định dạng email không hợp lệ", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const result = await userService.forgotPassword(email);
            responseSend(res, result, "Gửi email đặt lại mật khẩu thành công", HTTP_STATUS_CODES.OK);
        } catch (error: any) {
            console.error("Lỗi khi xử lý quên mật khẩu:", error.message);
            responseSend(res, null, error.message || "Lỗi khi gửi email đặt lại mật khẩu", HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            if (!token) {
                return responseSend(res, null, "Token không được cung cấp", HTTP_STATUS_CODES.BAD_REQUEST);
            }
            if (!isValidPassword(newPassword)) {
                return responseSend(res, null, "Mật khẩu mới phải dài ít nhất 8 ký tự và chứa ít nhất 1 chữ cái và 1 số", HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const result = await userService.resetPassword(token, newPassword);
            responseSend(res, result, "Đặt lại mật khẩu thành công", HTTP_STATUS_CODES.OK);
        } catch (error: any) {
            console.error("Lỗi khi đặt lại mật khẩu:", error.message);
            responseSend(res, null, error.message || "Lỗi khi đặt lại mật khẩu", HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}
