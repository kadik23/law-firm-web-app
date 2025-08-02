import dotenv from "dotenv";
dotenv.config();
import 'module-alias/register';
import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routes/UsersRouter";
import adminRouter from "./routes/AdminRouter";
import attorneyRouter from "./routes/AttorneyRouter";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { db } from "./models";
const connected_users = db.connectedUsers;

const app = express();
app.use(cookieParser());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Law Firm Web App Backend",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: [
    "./models/*.js",
    "./controllers/*.js",
    "./controllers/Admin/*.js",
    "./controllers/User/*.js",
  ],
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001", 
      "https://law-site-beryl.vercel.app",
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

console.log('CORS Configuration:', {
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://law-site-beryl.vercel.app",
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL
  ].filter(Boolean)
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the correct uploads directory
const isProduction = process.env.NODE_ENV === 'production';
const uploadsPath = isProduction ? path.join(__dirname, '../uploads') : path.join(__dirname, 'uploads');
app.use("/uploads", express.static(uploadsPath));

// Test endpoint for CORS
app.get("/test-cors", (req, res) => {
  res.json({ 
    message: "CORS is working!", 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for middleware testing
app.get("/debug-auth", (req, res) => {
  const authToken = req.cookies.authToken;
  res.json({
    hasAuthToken: !!authToken,
    tokenLength: authToken ? authToken.length : 0,
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent']
    }
  });
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/attorney", attorneyRouter);

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server attached to the HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://law-site-beryl.vercel.app",
      process.env.FRONTEND_URL,
      process.env.NEXT_PUBLIC_FRONTEND_URL
    ].filter((origin): origin is string => Boolean(origin)),
    credentials: true
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Register user with their userId
  socket.on("register", async (userId) => {
    try {
      const numericUserId = parseInt(userId, 10);
      if (isNaN(numericUserId)) {
        console.error(`Invalid userId received for registration: ${userId}`);
        socket.emit('registrationError', 'Invalid user ID format');
        return;
      }

      // Remove any old socket for this user
      await connected_users.destroy({ where: { user_id: numericUserId } });
      // Insert the new socket
      await connected_users.create({
        user_id: numericUserId,
        socket_id: socket.id // Store as string
      });

      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
      socket.emit('registrationSuccess', 'User registered');
    } catch (error) {
      console.error("Error registering user:", error);
      socket.emit('registrationError', 'Failed to register user');
    }
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    try {
      const deletedRowCount = await connected_users.destroy({
        where: { socket_id: socket.id }
      });

      if (deletedRowCount > 0) {
        console.log(`User with socket ID ${socket.id} disconnected and removed.`);
      } else {
        console.log(`Socket ID ${socket.id} disconnected but was not found in DB.`);
      }
    } catch (error) {
      console.error("Error during user disconnection:", error);
    }
  });
});

// Export io for use in other files
export { io };

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
