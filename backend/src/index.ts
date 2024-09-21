require('dotenv').config()
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/errorMiddleware";
import router from "./routes/routes";

const app = express();
const PORT = process.env.PORT  || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Error handling middleware
app.use(errorMiddleware);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
