import React, { useState } from "react";

export default function App() {
  const [idea, setIdea] = useState("");
  const [pipelineState, setPipelineState] = useState("idle"); // idle, architect, security, ux, complete
  const [data, setData] = useState(null);
  const [activePanel, setActivePanel] = useState("architect");

  const ignitePipeline = async () => {
    if (!idea.trim()) return;
    setData(null);

    // Step 1 Cycle: Trigger Architect Loading State
    setPipelineState("architect");

    try {
      const response = await fetch("http://localhost:5000/api/ignite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const result = await response.json();

      // Simulate real-time sequential agent processing intervals for maximum visual impact
      setTimeout(() => {
        setPipelineState("security");
        setTimeout(() => {
          setPipelineState("ux");
          setTimeout(() => {
            setData(result);
            setPipelineState("complete");
          }, 1500);
        }, 1500);
      }, 1500);
    } catch (err) {
      console.error(err);
      setPipelineState("idle");
    }
  };

  return (
    <div className="w-screen h-screen matrix-grid relative overflow-hidden flex flex-col items-center justify-between p-6 select-none">
      {/* Premium Header */}
      <header className="text-center z-10 mt-4">
        <h1 className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 drop-shadow">
          PULSEMIND AI
        </h1>
        <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
          Sequential Multi-Agent Orchestration Engine
        </p>
      </header>

      {/* Interactive Node Graph Canvas Space */}
      <div className="w-full max-w-4xl h-96 relative flex items-center justify-center z-10">
        {/* SVG Dynamic Data Chaining Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Central Hub to Architect Line */}
          <line
            x1="50%"
            y1="50%"
            x2="20%"
            y2="25%"
            stroke={pipelineState !== "idle" ? "#22d3ee" : "#334155"}
            strokeWidth="2"
            className={pipelineState === "architect" ? "data-stream-line" : ""}
          />
          {/* Architect to Security Line */}
          <line
            x1="20%"
            y1="25%"
            x2="80%"
            y2="25%"
            stroke={
              ["security", "ux", "complete"].includes(pipelineState)
                ? "#f43f5e"
                : "#334155"
            }
            strokeWidth="2"
            className={pipelineState === "security" ? "data-stream-line" : ""}
          />
          {/* Security to UX Design Line */}
          <line
            x1="80%"
            y1="25%"
            x2="50%"
            y2="80%"
            stroke={
              ["ux", "complete"].includes(pipelineState) ? "#10b981" : "#334155"
            }
            strokeWidth="2"
            className={pipelineState === "ux" ? "data-stream-line" : ""}
          />
        </svg>

        {/* Core Prompt Portal Hub (Center Node) */}
        <div className="absolute w-32 h-32 bg-slate-900 border-2 border-indigo-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] animate-pulse-slow">
          <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">
            Idea Hub
          </span>
          <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2"></div>
        </div>

        {/* Node 1: Technical Architect */}
        <div
          onClick={() => data && setActivePanel("architect")}
          className={`absolute left-[10%] top-[10%] p-4 rounded-xl border transition-all duration-500 cursor-pointer backdrop-blur-md
               ${pipelineState === "architect" ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105" : "border-slate-800 bg-slate-950/60"} 
               ${data && activePanel === "architect" ? "ring-2 ring-cyan-400" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${data ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "bg-slate-600"}`}
            ></div>
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
              Tech Architect
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Status:{" "}
            {pipelineState === "architect"
              ? "Compiling JSON..."
              : data
                ? "Resolved"
                : "Standby"}
          </p>
        </div>

        {/* Node 2: Security Adversary */}
        <div
          onClick={() => data && setActivePanel("security")}
          className={`absolute right-[10%] top-[10%] p-4 rounded-xl border transition-all duration-500 cursor-pointer backdrop-blur-md
               ${pipelineState === "security" ? "border-rose-500 bg-rose-950/40 shadow-[0_0_20px_rgba(244,63,94,0.2)] scale-105" : "border-slate-800 bg-slate-950/60"} 
               ${data && activePanel === "security" ? "ring-2 ring-rose-500" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${["ux", "complete"].includes(pipelineState) || data ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-slate-600"}`}
            ></div>
            <span className="font-mono text-xs uppercase tracking-wider text-rose-400">
              Security Adversary
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Status:{" "}
            {pipelineState === "security"
              ? "Auditing Stack..."
              : data
                ? "Resolved"
                : "Standby"}
          </p>
        </div>

        {/* Node 3: UI/UX Copilot */}
        <div
          onClick={() => data && setActivePanel("ux")}
          className={`absolute bottom-[5%] p-4 rounded-xl border transition-all duration-500 cursor-pointer backdrop-blur-md
               ${pipelineState === "ux" ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-105" : "border-slate-800 bg-slate-950/60"} 
               ${data && activePanel === "ux" ? "ring-2 ring-emerald-400" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${data ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-slate-600"}`}
            ></div>
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
              UI/UX Copilot
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Status:{" "}
            {pipelineState === "ux"
              ? "Designing Interlocking UI..."
              : data
                ? "Resolved"
                : "Standby"}
          </p>
        </div>
      </div>

      {/* Ground Control Unit: Input Interface and Real-Time Glassmorphism Insight Engine */}
      <div className="w-full max-w-4xl bg-slate-950/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-lg shadow-2xl z-10 flex flex-col md:flex-row gap-6 min-h-64 mb-4">
        {/* Left Side Command Form */}
        <div className="w-full md:w-2/5 flex flex-col justify-between gap-4">
          <div>
            <label className="text-xs uppercase font-mono tracking-widest text-indigo-400 block mb-2">
              Input Raw Concept Target
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ex: A decentralized autonomous equipment tracking rental network..."
              disabled={
                pipelineState !== "idle" && pipelineState !== "complete"
              }
              className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-sans"
            />
          </div>
          <button
            onClick={ignitePipeline}
            disabled={pipelineState !== "idle" && pipelineState !== "complete"}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono uppercase tracking-widest text-xs py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {pipelineState === "idle"
              ? "💡 Ignite Core Pipeline"
              : pipelineState === "complete"
                ? "🔄 Restart Engine"
                : "⚡ Orchestrating System State..."}
          </button>
        </div>

        {/* Right Side Streaming Structured Display Matrix */}
        <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col">
          {data ? (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="flex gap-2 border-b border-slate-800 pb-2 mb-3">
                <button
                  onClick={() => setActivePanel("architect")}
                  className={`text-xs font-mono uppercase px-3 py-1.5 rounded-md transition-all ${activePanel === "architect" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-400"}`}
                >
                  Topology
                </button>
                <button
                  onClick={() => setActivePanel("security")}
                  className={`text-xs font-mono uppercase px-3 py-1.5 rounded-md transition-all ${activePanel === "security" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "text-slate-400"}`}
                >
                  Threat Matrix
                </button>
                <button
                  onClick={() => setActivePanel("ux")}
                  className={`text-xs font-mono uppercase px-3 py-1.5 rounded-md transition-all ${activePanel === "ux" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "text-slate-400"}`}
                >
                  Layout UI
                </button>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4 flex-1 overflow-y-auto max-h-44 text-xs font-mono space-y-2 border border-slate-800">
                {activePanel === "architect" && (
                  <div>
                    <p className="text-cyan-400 font-bold mb-1">
                      // {data?.architect?.agentName || "Loading..."}
                    </p>
                    <p>
                      <span className="text-slate-500">Database:</span>{" "}
                      {data?.architect?.database}
                    </p>
                    <p>
                      <span className="text-slate-500">Frontend Stack:</span>{" "}
                      {data?.architect?.frontendStack?.join(", ")}
                    </p>
                    <p>
                      <span className="text-slate-500">Backend Core:</span>{" "}
                      {data?.architect?.backendStack?.join(", ")}
                    </p>
                    <p className="text-slate-300 mt-2 text-justify font-sans leading-relaxed">
                      {data?.architect?.systemArchitectureSummary}
                    </p>
                  </div>
                )}
                {activePanel === "security" && (
                  <div>
                    <p className="text-rose-400 font-bold mb-1">
                      // {data?.security?.agentName || "Loading..."}
                    </p>
                    <p>
                      <span className="text-slate-500">Threat Level:</span>{" "}
                      <span className="text-rose-500 font-bold">
                        {data?.security?.threatLevel}
                      </span>
                    </p>
                    <p className="text-slate-500 mt-1">Identified Flaws:</p>
                    <ul className="list-disc list-inside text-slate-300 font-sans space-y-1 mt-1 pl-1">
                      {data?.security?.vulnerabilitiesIdentified?.map(
                        (v, i) => (
                          <li key={i}>{v}</li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {activePanel === "ux" && (
                  <div>
                    <p className="text-emerald-400 font-bold mb-1">
                      // {data?.ux?.agentName || "Loading..."}
                    </p>
                    <p>
                      <span className="text-slate-500">Layout Pattern:</span>{" "}
                      {data?.ux?.layoutPattern}
                    </p>
                    <p className="text-slate-500 mt-1">
                      Suggested Viewport Components:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data?.ux?.suggestedComponents?.map((c, i) => (
                        <span
                          key={i}
                          className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-300 mt-2 text-justify font-sans leading-relaxed">
                      {data?.ux?.uxMitigationStrategy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs text-center py-8">
              {pipelineState === "idle" && (
                <p>
                  Waiting for Ignition sequence...
                  <br />
                  Input an idea to charge the engine nodes.
                </p>
              )}
              {pipelineState === "architect" && (
                <p className="text-cyan-400 animate-pulse">
                  ⚡ Agent 1 Active:
                  <br />
                  Assembling JSON Schema System Topology...
                </p>
              )}
              {pipelineState === "security" && (
                <p className="text-rose-400 animate-pulse">
                  🔒 Agent 2 Active:
                  <br />
                  Injecting Topology Context... Threat Audit Engaged.
                </p>
              )}
              {pipelineState === "ux" && (
                <p className="text-emerald-400 animate-pulse">
                  🎨 Agent 3 Active:
                  <br />
                  Orchestrating Mitigation Layout Blueprints...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
