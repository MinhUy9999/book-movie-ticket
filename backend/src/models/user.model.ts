
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    genders: string;
    phone: string;
    dateofbirth: Date;
    avatar: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
    genders: { type: String, required: true },
    phone: { type: String, required: true },
    dateofbirth: { type: Date, required: true },
    avatar: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);