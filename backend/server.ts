import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routes/UsersRouter";
import adminRouter from "./routes/AdminRouter";
import "./socketServer";

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
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/user", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
