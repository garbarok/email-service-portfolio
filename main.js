const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();
const emailRoutes = require("./routes/emailRoutes");

const app = express();

// Define environment-based origins for CORS
const envOrigins = {
  production: process.env.PRD_ORIGIN,
  preproduction: process.env.ACC_ORIGIN,
  development: process.env.DEV_ORIGIN,
};

// Get the current origin based on the environment
const currentOrigin = envOrigins[process.env.ENVIRONMENT];

// Set up CORS with the correct origin
const corsOptions = {
  origin: currentOrigin,
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ${currentOrigin} mode`);
});
