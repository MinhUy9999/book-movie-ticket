// Repository Pattern Implementation for Data Access

import mongoose from 'mongoose';
import { Booking, IBooking } from '../../models/booking.model';
import { SeatReservation, ISeatReservation } from '../../models/seat.reservation.model';

// Repository Interface
export interface IBookingRepository {
  findById(id: string): Promise<IBooking | null>;
  findByUserId(userId: string): Promise<IBooking[]>;
  create(bookingData: Partial<IBooking>): Promise<IBooking>;
  update(id: string, bookingData: Partial<IBooking>): Promise<IBooking | null>;
  delete(id: string): Promise<boolean>;
  getActiveBookingsBySeatId(seatId: string, showtimeId: string): Promise<IBooking[]>;
  confirmBooking(id: string): Promise<IBooking | null>;
  cancelBooking(id: string): Promise<IBooking | null>;
}

// Concrete Repository Implementation
export class BookingRepository implements IBookingRepository {
  async findById(id: string): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID');
    }
    
    return await Booking.findById(id)
      .populate('userId', 'username email phone')
      .populate('showtimeId')
      .populate('seats');
  }

  async findByUserId(userId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    
    return await Booking.find({ userId })
      .populate('showtimeId')
      .populate('seats')
      .sort({ bookedAt: -1 });
  }

  async create(bookingData: Partial<IBooking>): Promise<IBooking> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create the booking
      const newBooking = new Booking(bookingData);
      await newBooking.save({ session });
      
      // Update seat reservations
      const seatUpdates = bookingData.seats?.map(seatId => 
        SeatReservation.updateOne(
          { 
            showtimeId: bookingData.showtimeId, 
            seatId: seatId 
          },
          { 
            status: 'reserved',
            bookingId: newBooking._id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes reservation
          },
          { upsert: true, session }
        )
      );
      
      if (seatUpdates) {
        await Promise.all(seatUpdates);
      }
      
      await session.commitTransaction();
      return newBooking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async update(id: string, bookingData: Partial<IBooking>): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID');
    }
    
    return await Booking.findByIdAndUpdate(
      id,
      { $set: bookingData },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID');
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get booking to find associated seat reservations
      const booking = await Booking.findById(id);
      if (!booking) {
        return false;
      }
      
      // Release seat reservations
      await SeatReservation.updateMany(
        { bookingId: booking._id },
        { 
          status: 'available',
          $unset: { bookingId: 1, expiresAt: 1 }
        },
        { session }
      );
      
      // Remove booking
      await Booking.deleteOne({ _id: id }, { session });
      
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getActiveBookingsBySeatId(seatId: string, showtimeId: string): Promise<IBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(seatId) || !mongoose.Types.ObjectId.isValid(showtimeId)) {
      throw new Error('Invalid seat ID or showtime ID');
    }
    
    // Find reservations for this seat
    const reservations = await SeatReservation.find({
      seatId,
      showtimeId,
      status: { $in: ['reserved', 'booked'] }
    });
    
    // Get associated bookings
    const bookingIds = reservations.map((res: ISeatReservation) => res.bookingId).filter((id: mongoose.Types.ObjectId | undefined) => id !== undefined);
    
    return await Booking.find({
      _id: { $in: bookingIds },
      bookingStatus: { $ne: 'cancelled' }
    });
  }

  async confirmBooking(id: string): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID');
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        id,
        { 
          bookingStatus: 'confirmed',
          paymentStatus: 'completed'
        },
        { new: true, session }
      );
      
      if (!booking) {
        await session.abortTransaction();
        return null;
      }
      
      // Update seat reservations to booked
      await SeatReservation.updateMany(
        { bookingId: booking._id },
        { 
          status: 'booked',
          $unset: { expiresAt: 1 }
        },
        { session }
      );
      
      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(id: string): Promise<IBooking | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid booking ID');
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        id,
        { bookingStatus: 'cancelled' },
        { new: true, session }
      );
      
      if (!booking) {
        await session.abortTransaction();
        return null;
      }
      
      // Release seat reservations
      await SeatReservation.updateMany(
        { bookingId: booking._id },
        { 
          status: 'available',
          $unset: { bookingId: 1, expiresAt: 1 }
        },
        { session }
      );
      
      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}