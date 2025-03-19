import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { Theater } from "../models/theater.model";
import { Screen } from "../models/screen.model";

export class TheaterController {
  static async getAllTheaters(req: Request, res: Response): Promise<void> {
    try {
      const theaters = await Theater.find({ isActive: true });
      res.status(HTTP_STATUS_CODES.OK).json({ theaters });
    } catch (error: any) {
      console.error("Error fetching theaters:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching theaters"
      });
    }
  }

  static async getTheaterById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const theater = await Theater.findById(id);
      
      if (!theater) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Theater not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ theater });
    } catch (error: any) {
      console.error("Error fetching theater:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching theater"
      });
    }
  }

  static async createTheater(req: Request, res: Response): Promise<void> {
    try {
      const theaterData = req.body;
      
      if (!theaterData.name || !theaterData.location || !theaterData.totalScreens) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: "Missing required theater information"
        });
        return;
      }
      
      const theater = new Theater(theaterData);
      await theater.save();
      
      res.status(HTTP_STATUS_CODES.CREATED).json({ 
        message: "Theater created successfully", 
        theater 
      });
    } catch (error: any) {
      console.error("Error creating theater:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Error creating theater"
      });
    }
  }

  static async updateTheater(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const theaterData = req.body;
      
      const theater = await Theater.findByIdAndUpdate(
        id,
        { $set: theaterData },
        { new: true, runValidators: true }
      );
      
      if (!theater) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Theater not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ 
        message: "Theater updated successfully", 
        theater 
      });
    } catch (error: any) {
      console.error("Error updating theater:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Error updating theater"
      });
    }
  }

  static async deleteTheater(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Check if theater has associated screens
      const screensCount = await Screen.countDocuments({ theaterId: id });
      
      if (screensCount > 0) {
        // Just mark as inactive instead of deleting
        await Theater.findByIdAndUpdate(id, { isActive: false });
      } else {
        // No screens, can safely delete
        await Theater.findByIdAndDelete(id);
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Theater deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting theater:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error deleting theater"
      });
    }
  }

  static async getTheaterScreens(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const screens = await Screen.find({ theaterId: id, isActive: true });
      
      res.status(HTTP_STATUS_CODES.OK).json({ screens });
    } catch (error: any) {
      console.error("Error fetching theater screens:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Error fetching theater screens"
      });
    }
  }
}