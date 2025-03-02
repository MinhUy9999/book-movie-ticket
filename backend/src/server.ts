import express from "express";
import "./config/db";
import router from "./routes/index.routes";
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cookieParser()); 

app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
