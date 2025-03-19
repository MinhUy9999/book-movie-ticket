import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../httpStatus/httpStatusCode";
import { MovieService } from "../services/movie.service";

const movieService = new MovieService();

export class MovieController {
  static async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      // Check for query parameters
      const includeInactive = req.query.includeInactive === 'true';
      
      const movies = await movieService.getAllMovies(includeInactive);
      res.status(HTTP_STATUS_CODES.OK).json({ movies });
    } catch (error: any) {
      console.error("Error fetching movies:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching movies"
      });
    }
  }

  static async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const movie = await movieService.getMovieById(id);
      
      if (!movie) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Movie not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ movie });
    } catch (error: any) {
      console.error("Error fetching movie:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching movie"
      });
    }
  }

  static async getActiveMovies(req: Request, res: Response): Promise<void> {
    try {
      const movies = await movieService.getActiveMovies();
      res.status(HTTP_STATUS_CODES.OK).json({ movies });
    } catch (error: any) {
      console.error("Error fetching active movies:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching active movies"
      });
    }
  }

  static async getUpcomingMovies(req: Request, res: Response): Promise<void> {
    try {
      const movies = await movieService.getUpcomingMovies();
      res.status(HTTP_STATUS_CODES.OK).json({ movies });
    } catch (error: any) {
      console.error("Error fetching upcoming movies:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching upcoming movies"
      });
    }
  }

  static async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const { genre } = req.params;
      const movies = await movieService.getMoviesByGenre(genre);
      res.status(HTTP_STATUS_CODES.OK).json({ movies });
    } catch (error: any) {
      console.error("Error fetching movies by genre:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching movies by genre"
      });
    }
  }

  static async searchMovies(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      const movies = await movieService.searchMovies(query as string);
      res.status(HTTP_STATUS_CODES.OK).json({ movies });
    } catch (error: any) {
      console.error("Error searching movies:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error searching movies"
      });
    }
  }

  static async createMovie(req: Request, res: Response): Promise<void> {
    try {
      const movieData = req.body;
      const movie = await movieService.createMovie(movieData);
      res.status(HTTP_STATUS_CODES.CREATED).json({ message: "Movie created successfully", movie });
    } catch (error: any) {
      console.error("Error creating movie:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error creating movie"
      });
    }
  }

  static async updateMovie(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const movieData = req.body;
      
      const movie = await movieService.updateMovie(id, movieData);
      
      if (!movie) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Movie not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Movie updated successfully", movie });
    } catch (error: any) {
      console.error("Error updating movie:", error.message);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ 
        message: error.message || "Error updating movie"
      });
    }
  }

  static async deleteMovie(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await movieService.deleteMovie(id);
      
      if (!result) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Movie not found" });
        return;
      }
      
      res.status(HTTP_STATUS_CODES.OK).json({ message: "Movie deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting movie:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error deleting movie"
      });
    }
  }

  static async getMovieShowtimes(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      let date = undefined;
      
      // Check if date query parameter is provided
      if (req.query.date) {
        date = new Date(req.query.date as string);
      }
      
      const showtimes = await movieService.getMovieShowtimes(id, date);
      res.status(HTTP_STATUS_CODES.OK).json({ showtimes });
    } catch (error: any) {
      console.error("Error fetching movie showtimes:", error.message);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
        message: error.message || "Error fetching movie showtimes"
      });
    }
  }
}