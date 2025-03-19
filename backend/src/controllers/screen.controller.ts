import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { Screen } from "../models/screen.model";
import { Seat } from "../models/seat.model";
import { Showtime } from "../models/showtime.model";
import mongoose from "mongoose";

export class ScreenController {
  static async getAllScreens(req: Request, res: Response): Promise<void> {
    try {
      const screens = await Screen.find({ isActive: true }).populate('theaterId');
      res.status(HTTP_STATUS_CODES.OK).json({ screens });
    } catch (error: any) {
      console.error("Error fetching screens:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching screens"
      });
    }
  }

  static async getScreenById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const screen = await Screen.findById(id).populate('theaterId');
      
      if (!screen) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Screen not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ screen });
    } catch (error: any) {
      console.error("Error fetching screen:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching screen"
      });
    }
  }

  static async createScreen(req: Request, res: Response): Promise<void> {
    try {
      const screenData = req.body;
      
      if (!screenData.name || !screenData.theaterId || !screenData.capacity || !screenData.screenType) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "Missing required screen information"
        });
        return;
      }
      
      const screen = new Screen(screenData);
      await screen.save();
      
      // Create default seating layout based on capacity
      await ScreenController.createDefaultSeats(screen.id, screenData.capacity);
      
      res.status(HTTP_STATUS_CODES.CREATED).json({ 
        message: "Screen created successfully", 
        screen 
      });
    } catch (error: any) {
      console.error("Error creating screen:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Error creating screen"
      });
    }
  }

  static async updateScreen(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const screenData = req.body;
      
      const screen = await Screen.findByIdAndUpdate(
        id,
        { $set: screenData },
        { new: true, runValidators: true }
      );
      
      if (!screen) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Screen not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ 
        message: "Screen updated successfully", 
        screen 
      });
    } catch (error: any) {
      console.error("Error updating screen:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Error updating screen"
      });
    }
  }

  static async deleteScreen(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if screen has associated showtimes
      const showtimesCount = await Showtime.countDocuments({ 
        screenId: id,
        startTime: { $gte: new Date() },
        isActive: true
      });
      
      if (showtimesCount > 0) {
        // Just mark as inactive instead of deleting
        await Screen.findByIdAndUpdate(id, { isActive: false });
      } else {
        // No future showtimes, can safely delete
        await Screen.findByIdAndDelete(id);
        
        // Also delete associated seats
        await Seat.deleteMany({ screenId: id });
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Screen deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting screen:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error deleting screen"
      });
    }
  }

  static async getScreenSeats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const seats = await Seat.find({ screenId: id, isActive: true }).sort({ row: 1, seatNumber: 1 });
      
      // Group seats by row
      const seatsByRow: {[key: string]: any[]} = {};
      
      seats.forEach(seat => {
        if (!seatsByRow[seat.row]) {
          seatsByRow[seat.row] = [];
        }
        
        seatsByRow[seat.row].push({
          id: seat._id,
          row: seat.row,
          number: seat.seatNumber,
          type: seat.seatType
        });
      });
      
      // Convert to array and sort by row
      const result = Object.keys(seatsByRow)
        .sort()
        .map(row => ({
          row,
          seats: seatsByRow[row].sort((a, b) => a.number - b.number)
        }));
      
      res.status(HTTP_STATUS_CODES.OK).json({ seatingLayout: result });
    } catch (error: any) {
      console.error("Error fetching screen seats:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching screen seats"
      });
    }
  }

  static async updateScreenSeats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { seats } = req.body;
      
      if (!Array.isArray(seats)) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "Seats must be an array"
        });
        return;
      }
      
      // Start a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Delete existing seats
        await Seat.deleteMany({ screenId: id }, { session });
        
        // Create new seats
        const seatsToInsert = seats.map(seat => ({
          screenId: id,
          row: seat.row,
          seatNumber: seat.number,
          seatType: seat.type || 'standard',
          isActive: true
        }));
        
        await Seat.insertMany(seatsToInsert, { session });
        
        await session.commitTransaction();
        
        res.status(HTTP_STATUS_CODES.OK).json({ 
          message: "Screen seats updated successfully",
          count: seatsToInsert.length
        });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error: any) {
      console.error("Error updating screen seats:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Error updating screen seats"
      });
    }
  }

  // Helper method to create default seats for a new screen
  private static async createDefaultSeats(screenId: mongoose.Types.ObjectId, capacity: number): Promise<void> {
    // Calculate a reasonable layout based on capacity
    // For simplicity, we'll create a standard layout with rows A-J and seats 1-10 per row
    
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 10; // Standard size
    
    // Determine how many rows we need
    const requiredRows = Math.ceil(capacity / seatsPerRow);
    const rowsToUse = rows.slice(0, requiredRows);
    
    const seats = [];
    
    for (const row of rowsToUse) {
      // For first 2 rows, make them premium
      const seatType = row === 'A' || row === 'B' ? 'premium' : 'standard';
      
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seats.push({
          screenId,
          row,
          seatNumber,
          seatType,
          isActive: true
        });
      }
    }
    
    await Seat.insertMany(seats);
  }
}