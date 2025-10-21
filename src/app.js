import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;