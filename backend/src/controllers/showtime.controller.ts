import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { ShowtimeService } from "../services/showtime.service";

const showtimeService = new ShowtimeService();

export class ShowtimeController {
  static async getAllShowtimes(req: Request, res: Response): Promise<void> {
    try {
      let date = undefined;
      
      // Check if date query parameter is provided
      if (req.query.date) {
        date = new Date(req.query.date as string);
      }
      
      const showtimes = await showtimeService.getAllShowtimes(date);
      res.status(HTTP_STATUS_CODES.OK).json({ showtimes });
    } catch (error: any) {
      console.error("Error fetching showtimes:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching showtimes"
      });
    }
  }

  static async getShowtimeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const showtime = await showtimeService.getShowtimeById(id);
      
      if (!showtime) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Showtime not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ showtime });
    } catch (error: any) {
      console.error("Error fetching showtime:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching showtime"
      });
    }
  }

  static async getShowtimesByMovie(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const showtimes = await showtimeService.getShowtimesByMovie(movieId);
      res.status(HTTP_STATUS_CODES.OK).json({ showtimes });
    } catch (error: any) {
      console.error("Error fetching showtimes by movie:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching showtimes by movie"
      });
    }
  }

  static async getShowtimesByTheater(req: Request, res: Response): Promise<void> {
    try {
      const { theaterId } = req.params;
      const showtimes = await showtimeService.getShowtimesByTheater(theaterId);
      res.status(HTTP_STATUS_CODES.OK).json({ showtimes });
    } catch (error: any) {
      console.error("Error fetching showtimes by theater:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching showtimes by theater"
      });
    }
  }

  static async createShowtime(req: Request, res: Response): Promise<void> {
    try {
      const showtimeData = req.body;
      const showtime = await showtimeService.createShowtime(showtimeData);
      res.status(HTTP_STATUS_CODES.CREATED).json({ message: "Showtime created successfully", showtime });
    } catch (error: any) {
      console.error("Error creating showtime:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error creating showtime"
      });
    }
  }

  static async updateShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const showtimeData = req.body;
      
      const showtime = await showtimeService.updateShowtime(id, showtimeData);
      
      if (!showtime) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Showtime not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Showtime updated successfully", showtime });
    } catch (error: any) {
      console.error("Error updating showtime:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error updating showtime"
      });
    }
  }

  static async deleteShowtime(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await showtimeService.deleteShowtime(id);
      
      if (!result) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Showtime not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Showtime deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting showtime:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error deleting showtime"
      });
    }
  }

  static async getShowtimeSeats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const seats = await showtimeService.getShowtimeSeats(id);
      res.status(HTTP_STATUS_CODES.OK).json({ seats });
    } catch (error: any) {
      console.error("Error fetching showtime seats:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching showtime seats"
      });
    }
  }
}