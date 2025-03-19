import express, { Router } from "express";
import { TheaterController } from "../controllers/theater.controller";
import { ScreenController } from "../controllers/screen.controller";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware";

const theaterRoutes: Router = express.Router();

// Public theater routes
theaterRoutes.get("/", TheaterController.getAllTheaters);
theaterRoutes.get("/:id", TheaterController.getTheaterById);
theaterRoutes.get("/:id/screens", TheaterController.getTheaterScreens);

// Public screen routes
theaterRoutes.get("/screens/all", ScreenController.getAllScreens);
theaterRoutes.get("/screens/:id", ScreenController.getScreenById);
theaterRoutes.get("/screens/:id/seats", ScreenController.getScreenSeats);

// Admin theater routes - require authentication and admin role
theaterRoutes.post("/", authenticateToken, authorizeRoles("admin"), TheaterController.createTheater);
theaterRoutes.put("/:id", authenticateToken, authorizeRoles("admin"), TheaterController.updateTheater);
theaterRoutes.delete("/:id", authenticateToken, authorizeRoles("admin"), TheaterController.deleteTheater);

// Admin screen routes - require authentication and admin role
theaterRoutes.post("/screens", authenticateToken, authorizeRoles("admin"), ScreenController.createScreen);
theaterRoutes.put("/screens/:id", authenticateToken, authorizeRoles("admin"), ScreenController.updateScreen);
theaterRoutes.delete("/screens/:id", authenticateToken, authorizeRoles("admin"), ScreenController.deleteScreen);
theaterRoutes.put("/screens/:id/seats", authenticateToken, authorizeRoles("admin"), ScreenController.updateScreenSeats);

export default theaterRoutes;