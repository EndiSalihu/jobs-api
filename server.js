// imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// route imports
const authRouter = require("./routes/authRoutes");
const jobsRouter = require("./routes/jobsRoutes");

const mongoose = require("mongoose");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// middlewares
app.set("trust proxy", 1);

// Apply rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss()); 

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFoundMiddleware); 
app.use(errorHandlerMiddleware); 

// port var
const port = process.env.PORT || 3000;

// server start
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected!");
    app.listen(port, () => 
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

start();
