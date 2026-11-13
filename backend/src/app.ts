
import express from "express";
import assignmentsRouter from './routes/assignments.routes.js'
import cors from "cors"
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    exposedHeaders: ["X-Total-Count"], // otherwise the browser hides it from Refine
  }),
);
app.use(express.json());
app.use("/api/assignments", assignmentsRouter)
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Classroom Management API is running",
  });
});





export default app;
