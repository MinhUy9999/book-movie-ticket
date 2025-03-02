import express from "express";
import "./config/db";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); 
app.use(cookieParser()); 
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
