
import express from "express";
import assignmentsRouter from './routes/assignments.routes.js'
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/assignments", assignmentsRouter)
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Classroom Management API is running",
  });
});





export default app;
