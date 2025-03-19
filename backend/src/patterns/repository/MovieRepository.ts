// Repository Pattern for Movie Data Access

import mongoose from 'mongoose';
import { Movie, IMovie } from '../../models/movie.model';

export interface IMovieRepository {
  findById(id: string): Promise<IMovie | null>;
  findAll(filters?: any): Promise<IMovie[]>;
  findByGenre(genre: string): Promise<IMovie[]>;
  findActiveMovies(): Promise<IMovie[]>;
  findUpcomingMovies(): Promise<IMovie[]>;
  create(movieData: Partial<IMovie>): Promise<IMovie>;
  update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null>;
  delete(id: string): Promise<boolean>;
  searchMovies(query: string): Promise<IMovie[]>;
}

export class MovieRepository implements IMovieRepository {
  async findById(id: string): Promise<IMovie | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    
    return await Movie.findById(id);
  }

  async findAll(filters: any = {}): Promise<IMovie[]> {
    return await Movie.find(filters).sort({ releaseDate: -1 });
  }

  async findByGenre(genre: string): Promise<IMovie[]> {
    return await Movie.find({ genre: { $regex: new RegExp(genre, 'i') }, isActive: true })
      .sort({ releaseDate: -1 });
  }

  async findActiveMovies(): Promise<IMovie[]> {
    const now = new Date();
    return await Movie.find({
      isActive: true,
      releaseDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ releaseDate: -1 });
  }

  async findUpcomingMovies(): Promise<IMovie[]> {
    const now = new Date();
    return await Movie.find({
      isActive: true,
      releaseDate: { $gt: now }
    }).sort({ releaseDate: 1 });
  }

  async create(movieData: Partial<IMovie>): Promise<IMovie> {
    const newMovie = new Movie(movieData);
    return await newMovie.save();
  }

  async update(id: string, movieData: Partial<IMovie>): Promise<IMovie | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    
    return await Movie.findByIdAndUpdate(
      id,
      { $set: movieData },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    
    const result = await Movie.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async searchMovies(query: string): Promise<IMovie[]> {
    // Case-insensitive search across multiple fields
    const searchRegex = new RegExp(query, 'i');
    
    return await Movie.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { genre: { $regex: searchRegex } },
        { director: { $regex: searchRegex } },
        { cast: { $regex: searchRegex } }
      ],
      isActive: true
    }).sort({ releaseDate: -1 });
  }
}
