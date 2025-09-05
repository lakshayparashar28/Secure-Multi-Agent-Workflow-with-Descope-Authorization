import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

// Root health check
app.get("/", (req, res) => {
  res.send("✅ Agent B (Verifier) is running...");
});

// Health (JSON style)
app.get("/health", (_, res) => res.json({ ok: true, agent: "B" }));

// Receive simple messages
app.post("/receive-from-a", (req, res) => {
  res.json({ status: "received", checkedBy: "Agent B", message: req.body.message });
});

// Verify document
app.post("/verify", (req, res) => {
  const { userId, docUrl } = req.body;
  if (!userId || !docUrl) return res.status(400).json({ error: "userId and docUrl required" });

  const isValid = docUrl.endsWith(".pdf") || docUrl.endsWith(".jpg");
  res.json({
    status: isValid ? "verified ✅" : "rejected ❌",
    checkedBy: "Agent B",
    userId,
    docUrl,
  });
});

app.listen(process.env.PORT || 3002, () =>
  console.log(`🚀 Agent B on http://localhost:${process.env.PORT || 3002}`)
);
