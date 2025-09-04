import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

// Health
app.get("/health", (_, res) => res.json({ ok: true, agent: "D" }));

// Send notification
app.post("/notify", (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "userId and message required" });

  res.json({
    status: "notified 📩",
    notifiedBy: "Agent D",
    userId,
    message,
  });
});

app.listen(process.env.PORT || 3004, () =>
  console.log(`🚀 Agent D on http://localhost:${process.env.PORT || 3004}`)
);
