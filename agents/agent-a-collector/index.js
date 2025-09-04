import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Agent A running with full pipeline...");
});

// 🔹 Full pipeline: A → B → C → D
app.post("/submit-doc", async (req, res) => {
  const { userId, docUrl, event } = req.body || {};
  if (!userId || !docUrl) {
    return res.status(400).json({ error: "userId and docUrl are required" });
  }

  try {
    // 1️⃣ Verify doc with Agent B
    const verifyResp = await axios.post(`${process.env.AGENT_B_URL}/verify`, {
      userId,
      docUrl,
    });

    if (verifyResp.data.status !== "verified ✅") {
      return res.json({
        status: "verification_failed ❌",
        verifier: verifyResp.data,
      });
    }

    // 2️⃣ Schedule event with Agent C
    const scheduleResp = await axios.post(`${process.env.AGENT_C_URL}/schedule`, {
      userId,
      event: event || "Hackathon demo at 10 AM",
    });

    // 3️⃣ Send notification with Agent D
    const notifyResp = await axios.post(`${process.env.AGENT_D_URL}/notify`, {
      userId,
      message: `✅ Document verified & event scheduled: ${scheduleResp.data.event}`,
    });

    // 4️⃣ Return combined response
    return res.json({
      status: "pipeline_success 🚀",
      verifier: verifyResp.data,
      scheduler: scheduleResp.data,
      notifier: notifyResp.data,
    });
  } catch (e) {
    console.error("❌ Pipeline error:", e.response?.data || e.message);
    return res.status(500).json({ error: "Pipeline failed", detail: e.message });
  }
});

// 🚀 Start Agent A
app.listen(process.env.PORT || 3001, () =>
  console.log(`🚀 Agent A running on port ${process.env.PORT || 3001}`)
);
