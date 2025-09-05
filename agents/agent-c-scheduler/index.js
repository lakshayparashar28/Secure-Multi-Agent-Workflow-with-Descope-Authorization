import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

// Root health check
app.get("/", (req, res) => {
  res.send("✅ Agent C (Scheduler) is running...");
});

// Health
app.get("/health", (_, res) => res.json({ ok: true, agent: "C" }));

// Schedule event
app.post("/schedule", (req, res) => {
  const { userId, event } = req.body;
  if (!userId || !event) return res.status(400).json({ error: "userId and event required" });

  res.json({
    status: "scheduled 📅",
    scheduledBy: "Agent C",
    userId,
    event,
  });
});

app.listen(process.env.PORT || 3003, () =>
  console.log(`🚀 Agent C on http://localhost:${process.env.PORT || 3003}`)
);
