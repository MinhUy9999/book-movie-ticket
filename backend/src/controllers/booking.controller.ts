import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { BookingService } from "../services/booking.service";
import { PaymentProcessor, CreditCardPayment, PayPalPayment } from "../patterns/strategy/PaymentStrategy";

// Interface to extend Request with user info
interface AuthRequest extends Request {
  user?: any;
}

const bookingService = new BookingService();

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Authentication required" });
        return;
      }
      
      const { showtimeId, seatIds, paymentMethod } = req.body;
      
      // Validate input
      if (!showtimeId || !seatIds || !seatIds.length || !paymentMethod) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
          message: "Missing required booking information" 
        });
        return;
      }
      
      // Create booking
      const booking = await bookingService.createBooking({
        userId: req.user.id,
        showtimeId,
        seatIds,
        paymentMethod,
        paymentDetails: {} // Will be provided at payment processing step
      });
      
      res.status(HTTP_STATUS_CODES.CREATED).json({ 
        message: "Booking created successfully", 
        booking 
      });
    } catch (error: any) {
      console.error("Error creating booking:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error creating booking"
      });
    }
  }

  static async processPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Authentication required" });
        return;
      }
      
      const { bookingId, paymentMethod, paymentDetails } = req.body;
      
      // Validate input
      if (!bookingId || !paymentMethod || !paymentDetails) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
          message: "Missing required payment information" 
        });
        return;
      }
      
      // Select payment strategy based on payment method
      let paymentStrategy;
      switch (paymentMethod.toLowerCase()) {
        case 'credit_card':
          paymentStrategy = new CreditCardPayment();
          break;
        case 'paypal':
          paymentStrategy = new PayPalPayment();
          break;
        default:
          res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
            message: "Unsupported payment method" 
          });
          return;
      }
      
      // Create payment processor with selected strategy
      const paymentProcessor = new PaymentProcessor(paymentStrategy);
      
      // Process payment
      const updatedBooking = await bookingService.processPayment(
        bookingId,
        paymentProcessor,
        paymentDetails
      );
      
      res.status(HTTP_STATUS_CODES.OK).json({ 
        message: "Payment processed successfully", 
        booking: updatedBooking 
      });
    } catch (error: any) {
      console.error("Error processing payment:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error processing payment"
      });
    }
  }

  static async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Authentication required" });
        return;
      }
      
      const { id } = req.params;
      
      // Cancel booking
      const booking = await bookingService.cancelBooking(id, req.user.id);
      
      res.status(HTTP_STATUS_CODES.OK).json({ 
        message: "Booking cancelled successfully", 
        booking 
      });
    } catch (error: any) {
      console.error("Error cancelling booking:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error cancelling booking"
      });
    }
  }

  static async getUserBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Authentication required" });
        return;
      }
      
      // Get user bookings
      const bookings = await bookingService.getUserBookings(req.user.id);
      
      res.status(HTTP_STATUS_CODES.OK).json({ bookings });
    } catch (error: any) {
      console.error("Error fetching user bookings:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching user bookings"
      });
    }
  }

  static async getBookingDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ message: "Authentication required" });
        return;
      }
      
      const { id } = req.params;
      
      // Get booking details
      const booking = await bookingService.getBookingDetails(id, req.user.id);
      
      res.status(HTTP_STATUS_CODES.OK).json({ booking });
    } catch (error: any) {
      console.error("Error fetching booking details:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching booking details"
      });
    }
  }
}