require("dotenv").config();
const PORT = process.env.PORT;
const IO_PORT = process.env.IO_PORT;
const io = require("socket.io")(IO_PORT);
const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./api/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");

// IO Connection
io.on("connection", (socket) => {
  console.log(socket.id);
});

// Server static files
app.use("/uploads", express.static("uploads"));

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
