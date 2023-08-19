require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./api/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");

// Middleware for file upload

// Handle 'Access-Control-Allow-Credentials' option for Cors
app.use(credentials);

// Cors
app.use(cors(corsOptions));

// Built-in JSON middleware
app.use(express.json());

// Built-in URL-encoded middleware
app.use(express.urlencoded({ extended: false }));

// Middleware for cookies
app.use(cookieParser());

// Connect to DB
dbConnect();

// Routes

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/register", require("./api/routes/register"));
app.use("/login", require("./api/routes/auth"));
app.use("/refresh", require("./api/routes/refresh"));
app.use("/logout", require("./api/routes/logout"));

app.use("/admin", require("./api/routes/adminRoutes"));

// Protected routes
app.use(verifyJWT);
app.use("/doctors", require("./api/routes/doctorRoutes"));
app.use("/users", require("./api/routes/userRoutes"));
app.use("/appointments", require("./api/routes/appointmentRoutes"));
app.use("/labs", require("./api/routes/labRoutes"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
  });
});
