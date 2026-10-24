
import express from "express";
import { pool } from "./db/client.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Classroom Management API is running",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("select 1 as ok");
    res.status(200).json({ database: result.rows[0]?.ok === 1 ? "connected" : "error" });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({ database: "unavailable" });
  }
});

export default app;
