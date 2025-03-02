import { User } from "../models/user.model";
import bcrypt from "bcrypt";

export class UserService {
    async register(email: string, password: string, phone: string, dateofbirth: string, gender: string, avatar?: string) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultAvatar = gender === "male"
                ? `https://avatar.iran.liara.run/public/boy?email=${email}`
                : `https://avatar.iran.liara.run/public/girl?email=${email}`;
            const finalAvatar = avatar || defaultAvatar;

            const [day, month, year] = dateofbirth.split("/");
            const dobDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

            const newUser = new User({
                email,
                password: hashedPassword,
                phone,
                dateofbirth: dobDate,
                gender, 
                avatar: finalAvatar,
                role: "user"
            });

            await newUser.save();

            newUser.username = `user${newUser._id}`;
            await newUser.save();

            return newUser;
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(err.message || "Error registering user");
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            return user;
        } catch (error: any) {
            throw new Error(error.message || "Error logging in");
        }
    }
}
