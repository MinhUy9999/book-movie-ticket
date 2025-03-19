import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  screenId: mongoose.Types.ObjectId;
  row: string;
  seatNumber: number;
  seatType: "standard" | "premium" | "vip";
  isActive: boolean;
}

const SeatSchema: Schema = new Schema({
  screenId: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
  row: { type: String, required: true },
  seatNumber: { type: Number, required: true },
  seatType: { type: String, enum: ["standard", "premium", "vip"], default: "standard" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to ensure unique seat in a screen
SeatSchema.index({ screenId: 1, row: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model<ISeat>("Seat", SeatSchema);
