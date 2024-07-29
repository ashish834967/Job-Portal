import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
dotenv.config({});

const app = express()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: 'http//localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));
app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})