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
import paymentRouter from "./routes/PaymentRouter";
import filesRouter from "./routes/FilesRouter";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { db } from "./models";
import { seedDatabase } from "./scripts/seed";
import bodyParser from "body-parser";
const connected_users = db.connectedUsers;

const app = express();
app.use(cookieParser());

app.use(
  bodyParser.json({
    verify: (req: any, res: any, buf: any) => {
      (req as any).rawBody = buf.toString();
    },
  })
);

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
      "https://law-firm27.netlify.app/",
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

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// One-click remote seed trigger endpoint (protected by SECRET key)
app.all("/api/seed", async (req, res) => {
  const secretKey = process.env.SECRET || "djkdqsljfdhskljk6fdisj";
  const providedKey = req.query.key || req.headers["x-seed-key"] || req.body?.key;

  if (!providedKey || providedKey !== secretKey) {
    res.status(403).json({ error: "Unauthorized: Invalid seed secret key" });
    return;
  }

  try {
    console.log("🌱 Manual seed triggered via /api/seed endpoint");
    await seedDatabase({ exitOnFinish: false });
    res.status(200).json({
      success: true,
      message: "Database wiped and seeded with fresh data and linked images successfully!"
    });
  } catch (error: any) {
    console.error("❌ Seed endpoint error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/attorney", attorneyRouter);
app.use("/api/payments", paymentRouter);
app.use("/files", filesRouter);

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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

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
        socket_id: socket.id
      });

      console.log(`User ${userId} registered with socket ID: ${socket.id}`);
      socket.emit('registrationSuccess', 'User registered');
    } catch (error) {
      console.error("Error registering user:", error);
      socket.emit('registrationError', 'Failed to register user');
    }
  });

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

export { io };

server.listen(PORT, async () => {
  console.log(`server is running on port ${PORT}`);

  try {
    const autoSeed = process.env.AUTO_SEED === 'true' || process.env.SEED_DATABASE === 'true';
    if (autoSeed) {
      console.log('🌱 AUTO_SEED flag detected. Running fresh database seeder on deploy...');
      await seedDatabase({ exitOnFinish: false });
    } else {
      const servicesCount = await db.services.count();
      if (servicesCount === 0) {
        console.log('🌱 Database has 0 services. Auto-seeding initial dataset on deploy...');
        await seedDatabase({ exitOnFinish: false });
      }
    }
  } catch (err: any) {
    console.warn('⚠️ Post-startup database auto-seed check:', err.message);
  }
});
