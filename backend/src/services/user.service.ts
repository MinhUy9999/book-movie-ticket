import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export class UserService {
    async createUser(username: string, password: string, email: string, genders: string, phone: string, dateofbirth: string, avatar?: string, role: "user" | "admin" = "user") {
        try {
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                throw new Error(existingUser.email === email ? "Email already exists" : "Username already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultAvatar = genders === "male"
                ? `https://avatar.iran.liara.run/public/boy?username=${username}`
                : `https://avatar.iran.liara.run/public/girl?username=${username}`;
            const finalAvatar = avatar || defaultAvatar;

            const newUser = new User({
                username,
                password: hashedPassword,
                email,
                genders,
                phone,
                dateofbirth,
                avatar: finalAvatar,
                role, 
            });

            await newUser.save();
            return newUser;
        } catch (error: unknown) {
            const err = error as Error;
            console.error("❌ Error creating user:", err.message);
            throw new Error(err.message || "Error creating user");
        }
    }

    async login(username: string, password: string) {
        try {
            const user = await User.findOne({ username });
            if (!user) throw new Error("User not found");

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new Error("Invalid password");

            const token = jwt.sign(
                { username: user.username, email: user.email, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            return { token, user };
        } catch (error: any) {
            console.error("❌ Error logging in:", error.message);
            throw new Error(error.message || "Error logging in");
        }
    }

    async getAllUsers() {
        return await User.find().select("-password"); 
    }
}
