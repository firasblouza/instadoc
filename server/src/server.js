require("dotenv").config();
const PORT = process.env.PORT;
const IO_PORT = process.env.IO_PORT || 3000;
const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./api/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./api/middleware/credentials");

const io = require("socket.io")(IO_PORT, {
  cors: {
    origins: "*",
    methods: ["GET", "POST"]
  }
});

io.use((socket, next) => {
  const apptId = socket.handshake.auth.apptId;
  if (!apptId) {
    return next(new Error("Invalid appointment"));
  }
  socket.apptId = apptId;
  next();
});

// IO Connection
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected to room ${socket.apptId}`);
  socket.join(socket.apptId);
  socket.on("add-note", (updatedNotes, id) => {
    if (id) {
      socket.to(id).emit("add-note", updatedNotes);
    }
  });
  socket.on("delete-note", (updatedNotes, id) => {
    if (id) {
      socket.to(id).emit("delete-note", updatedNotes);
    }
  });
  socket.on("send-message", (messageObj, id) => {
    if (id) {
      socket.to(id).emit("send-message", messageObj);
    }
  });
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

app.use("/ratings", require("./api/routes/ratingRoutes"));

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
  });
});
