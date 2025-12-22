import express from "express";
import cors from "cors";
import morgan from "morgan";
import UserRoutes from "./routers/users.routes";
import TaskRoutes from "./routers/task.routes";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/user", UserRoutes);
app.use("/api/task", TaskRoutes);

export default app;
