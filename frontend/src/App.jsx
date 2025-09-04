import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [workflow, setWorkflow] = useState(null);

  const runPipeline = async () => {
    try {
      const res = await fetch("http://localhost:3001/submit-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "u123",
          docUrl: "http://example.com/test.pdf",
          event: "Hackathon Final Demo at 5 PM",
        }),
      });

      const data = await res.json();
      setWorkflow(data);
    } catch (err) {
      console.error(err);
      alert("⚠️ Pipeline failed. Check backend agents.");
    }
  };

  const exportLogs = () => {
    if (!workflow) return;
    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow-log.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Header */}
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-indigo-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🚀 Multi-Agent System Dashboard
      </motion.h1>

      {/* Workflow Control */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">📂 Workflow Control</h2>
        <p className="text-gray-600 mb-6">
          Kick off the full pipeline: <b>Agent A → B → C → D</b>
        </p>
        <button
          onClick={runPipeline}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          ▶ Run Pipeline
        </button>
      </div>

      {/* Agent Logs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">📜 Agent Timeline</h2>

        {!workflow ? (
          <p className="text-gray-500">No workflow run yet. Start one above!</p>
        ) : (
          <div className="space-y-6">
            {/* Success */}
            <motion.div
              className="p-4 bg-green-100 border border-green-300 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✅ <b>{workflow.status}</b>
            </motion.div>

            {/* Agent B */}
            <motion.div
              className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="font-semibold text-blue-600">Agent B (Verifier)</h3>
              <p>{workflow.verifier?.status}</p>
              <p>User: {workflow.verifier?.userId}</p>
              <p>Doc: {workflow.verifier?.docUrl}</p>
            </motion.div>

            {/* Agent C */}
            <motion.div
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h3 className="font-semibold text-yellow-600">Agent C (Scheduler)</h3>
              <p>{workflow.scheduler?.status}</p>
              <p>Event: {workflow.scheduler?.event}</p>
            </motion.div>

            {/* Agent D */}
            <motion.div
              className="p-4 bg-purple-50 border border-purple-200 rounded-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h3 className="font-semibold text-purple-600">Agent D (Notifier)</h3>
              <p>{workflow.notifier?.status}</p>
              <p>Message: {workflow.notifier?.message}</p>
            </motion.div>
          </div>
        )}

        {/* Export Logs */}
        {workflow && (
          <button
            onClick={exportLogs}
            className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900"
          >
            ⬇ Export Logs
          </button>
        )}
      </div>

      {/* System Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">ℹ️ System Info</h2>
        <ul className="text-gray-700 space-y-2">
          <li>✅ Agent A (Collector) → Port 3001</li>
          <li>✅ Agent B (Verifier) → Port 3002</li>
          <li>✅ Agent C (Scheduler) → Port 3003</li>
          <li>✅ Agent D (Notifier) → Port 3004</li>
        </ul>
      </div>
    </div>
  );
}
