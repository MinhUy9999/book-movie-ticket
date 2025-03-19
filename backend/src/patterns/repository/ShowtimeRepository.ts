// Repository Pattern for Showtime Data Access

import mongoose from 'mongoose';
import { Showtime, IShowtime } from '../../models/showtime.model';
import { Theater } from '../../models/theater.model';
import { Screen } from '../../models/screen.model';

export interface IShowtimeRepository {
  findById(id: string): Promise<IShowtime | null>;
  findAll(filters?: any): Promise<IShowtime[]>;
  findByMovie(movieId: string): Promise<IShowtime[]>;
  findByTheater(theaterId: string): Promise<IShowtime[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IShowtime[]>;
  findAvailableShowtimes(movieId: string, date: Date): Promise<IShowtime[]>;
  create(showtimeData: Partial<IShowtime>): Promise<IShowtime>;
  update(id: string, showtimeData: Partial<IShowtime>): Promise<IShowtime | null>;
  delete(id: string): Promise<boolean>;
}

export class ShowtimeRepository implements IShowtimeRepository {
  async findById(id: string): Promise<IShowtime | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid showtime ID');
    }
    
    return await Showtime.findById(id)
      .populate('movieId')
      .populate({
        path: 'screenId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      });
  }

  async findAll(filters: any = {}): Promise<IShowtime[]> {
    return await Showtime.find(filters)
      .populate('movieId')
      .populate({
        path: 'screenId',
        populate: {
          path: 'theaterId',
          model: 'Theater'
        }
      })
      .sort({ startTime: 1 });
  }

  async findByMovie(movieId: string): Promise<IShowtime[]> {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      throw new Error('Invalid movie ID');
    }
    
    return await Showtime.find({ 
      movieId,
      startTime: { $gte: new Date() },
      isActive: true
    })
    .populate('movieId')
    .populate({
      path: 'screenId',
      populate: {
        path: 'theaterId',
        model: 'Theater'
      }
    })
    .sort({ startTime: 1 });
  }

  async findByTheater(theaterId: string): Promise<IShowtime[]> {
    if (!mongoose.Types.ObjectId.isValid(theaterId)) {
      throw new Error('Invalid theater ID');
    }
    
    // Find all screens in this theater
    const screens = await Screen.find({ theaterId });
    const screenIds = screens.map(screen => screen._id);
    
    return await Showtime.find({ 
      screenId: { $in: screenIds },
      startTime: { $gte: new Date() },
      isActive: true
    })
    .populate('movieId')
    .populate({
      path: 'screenId',
      populate: {
        path: 'theaterId',
        model: 'Theater'
      }
    })
    .sort({ startTime: 1 });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IShowtime[]> {
    return await Showtime.find({ 
      startTime: { $gte: startDate, $lte: endDate },
      isActive: true
    })
    .populate('movieId')
    .populate({
      path: 'screenId',
      populate: {
        path: 'theaterId',
        model: 'Theater'
      }
    })
    .sort({ startTime: 1 });
  }

  async findAvailableShowtimes(movieId: string, date: Date): Promise<IShowtime[]> {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      throw new Error('Invalid movie ID');
    }
    
    // Create date range for the requested day (from start to end of day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await Showtime.find({ 
      movieId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      isActive: true
    })
    .populate('movieId')
    .populate({
      path: 'screenId',
      populate: {
        path: 'theaterId',
        model: 'Theater'
      }
    })
    .sort({ startTime: 1 });
  }

  async create(showtimeData: Partial<IShowtime>): Promise<IShowtime> {
    // Validation: Check for overlapping showtimes
    if (showtimeData.screenId && showtimeData.startTime && showtimeData.endTime) {
      const overlappingShowtime = await Showtime.findOne({
        screenId: showtimeData.screenId,
        $or: [
          {
            startTime: { $lt: showtimeData.endTime },
            endTime: { $gt: showtimeData.startTime }
          }
        ],
        isActive: true
      });
      
      if (overlappingShowtime) {
        throw new Error('There is an overlapping showtime for this screen');
      }
    }
    
    const newShowtime = new Showtime(showtimeData);
    return await newShowtime.save();
  }

  async update(id: string, showtimeData: Partial<IShowtime>): Promise<IShowtime | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid showtime ID');
    }
    
    // Validation: Check for overlapping showtimes if dates are being updated
    if (showtimeData.screenId && showtimeData.startTime && showtimeData.endTime) {
      const overlappingShowtime = await Showtime.findOne({
        _id: { $ne: id },
        screenId: showtimeData.screenId,
        $or: [
          {
            startTime: { $lt: showtimeData.endTime },
            endTime: { $gt: showtimeData.startTime }
          }
        ],
        isActive: true
      });
      
      if (overlappingShowtime) {
        throw new Error('There is an overlapping showtime for this screen');
      }
    }
    
    return await Showtime.findByIdAndUpdate(
      id,
      { $set: showtimeData },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid showtime ID');
    }
    
    // Soft delete - just mark as inactive
    const result = await Showtime.updateOne(
      { _id: id },
      { $set: { isActive: false } }
    );
    
    return result.modifiedCount > 0;
  }
}
