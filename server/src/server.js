require("dotenv").config();
const PORT = process.env.PORT;
const IO_PORT = process.env.IO_PORT || 3000;
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const dbConnect = require("./config/db");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./api/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const http = require("http").createServer(app);
const credentials = require("./api/middleware/credentials");

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  const apptId = socket.handshake.auth.apptId;
  const userId = socket.handshake.auth.userId;
  const token = socket.handshake.auth.token;
  
  if (apptId) {
    socket.apptId = apptId;
  }
  
  if (userId && token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.UserInfo.id === userId) {
        socket.userId = userId;
        socket.join(`user_${userId}`); // Join user-specific room for notifications
        console.log(`✅ User ${userId} authenticated and joined room user_${userId}`);
      } else {
        console.log(`❌ User ID mismatch in socket auth`);
        return next(new Error('Authentication failed'));
      }
    } catch (err) {
      console.log(`❌ Invalid token in socket auth:`, err.message);
      return next(new Error('Authentication failed'));
    }
  }
  
  next();
});

// IO Connection
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected to room ${socket.apptId}`);
  console.log(`Socket userId: ${socket.userId}`);
  
  if (socket.apptId) {
    socket.join(socket.apptId);
  }
  
  if (socket.userId) {
    console.log(`✅ User ${socket.userId} connected and in room user_${socket.userId}`);
  }
  
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

  socket.on("typing", (data) => {
    if (data.appointmentId) {
      socket.to(data.appointmentId).emit("typing", data);
    }
  });

  socket.on("message-seen", (data) => {
    if (data.appointmentId) {
      socket.to(data.appointmentId).emit("message-seen", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    if (socket.userId) {
      console.log(`❌ User ${socket.userId} disconnected from room user_${socket.userId}`);
    }
  });

  socket.on("error", (error) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
});

// Server static files
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));

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

// Make io available to controllers
app.set('io', io);

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
app.use("/medicines", require("./api/routes/medicineRoutes"));

app.use("/users", require("./api/routes/userRoutes"));
app.use("/appointments", require("./api/routes/appointmentRoutes"));
app.use("/labs", require("./api/routes/labRoutes"));

app.use("/ratings", require("./api/routes/ratingRoutes"));
app.use("/notifications", require("./api/routes/notificationRoutes"));
app.use("/blogs", require("./api/routes/blogRoutes"));
app.use("/seo", require("./api/routes/seoRoutes"));

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  http.listen(PORT, "0.0.0.0", () => {   // <-- bind to 0.0.0.0
    const host = http.address().address;
    const port = http.address().port;
    console.log("App listening at http://%s:%s", host, port);
  });
});