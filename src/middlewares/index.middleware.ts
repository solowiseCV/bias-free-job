import { Application, json, urlencoded } from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./errors.middleware";
import indexRoutes from "../features/appRoute";

export default (app: Application) => {
  // Logging middleware
  app.use(morgan("combined"));

  // CORS middleware
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // Configuration setup (dotenv)
  if (process.env.NODE_ENV !== "production") configDotenv();

  // Body parsing middleware
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Security middleware
  app.use(helmet());

  // Cookie parsing middleware
  app.use(cookieParser());

  // Custom error handling middleware
  app.use(errorHandler);

  // Mounting routes
  app.use("/api/v1", indexRoutes);
};
