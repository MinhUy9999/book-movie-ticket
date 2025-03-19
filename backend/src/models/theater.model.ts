import mongoose, { Schema, Document } from "mongoose";

export interface ITheater extends Document {
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalScreens: number;
  facilities: string[];
  isActive: boolean;
}

const TheaterSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalScreens: { type: Number, required: true, min: 1 },
  facilities: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Theater = mongoose.model<ITheater>("Theater", TheaterSchema);
