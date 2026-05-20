import { useState } from "react";

export default function App() {
  const [idea, setIdea] = useState(() => localStorage.getItem("pulse_mind_active_idea") || "");
  const [modelName, setModelName] = useState("gemini-2.0-flash");
  const [pipelineState, setPipelineState] = useState(() => localStorage.getItem("pulse_mind_active_blueprint") ? "complete" : "idle");
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("pulse_mind_active_blueprint");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activePanel, setActivePanel] = useState("architect");
  const [copyStatus, setCopyStatus] = useState("Copy Data");

  const ignitePipeline = async () => {
    if (!idea.trim()) return;
    setData(null);
    localStorage.removeItem("pulse_mind_active_blueprint");
    localStorage.removeItem("pulse_mind_active_idea");
    setPipelineState("architect");

    try {
      const response = await fetch("http://localhost:5000/api/ignite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, modelName }),
      });

      const result = await response.json();

      if (result.error) {
        console.error("API error returned:", result.error);
        setPipelineState("idle");
        if (result.error.includes("429") || result.error.toLowerCase().includes("quota")) {
          alert("Rate limit exceeded. The system is automatically retrying on the server, but you may need to wait a minute before trying again.");
        } else {
          alert(`Pipeline Error: ${result.error}`);
        }
        return;
      }

      // Smooth state orchestration transitions
      setTimeout(() => {
        setPipelineState("security");
        setTimeout(() => {
          setPipelineState("ux");
          setTimeout(() => {
            setData(result);
            setPipelineState("complete");
            localStorage.setItem(
              "pulse_mind_active_blueprint",
              JSON.stringify(result),
            );
            localStorage.setItem("pulse_mind_active_idea", idea);
          }, 1500);
        }, 1500);
      }, 1500);
    } catch (err) {
      console.error("Fetch link crash caught:", err);
      setPipelineState("idle");
      alert(
        "Unable to securely bridge metadata to backend server running on port 5000.",
      );
    }
  };

  const clearEngineSession = () => {
    localStorage.removeItem("pulse_mind_active_blueprint");
    localStorage.removeItem("pulse_mind_active_idea");
    setData(null);
    setIdea("");
    setPipelineState("idle");
  };

  const handleCopyClipboard = async () => {
    if (!data || !data[activePanel]) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(data[activePanel], null, 2),
      );
      setCopyStatus("Copied! ✓");
      setTimeout(() => setCopyStatus("Copy Data"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadBlueprintFile = () => {
    if (!data) return;
    const dataBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "pulsemind-blueprint.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="w-screen h-screen bg-[#030712] relative overflow-hidden flex flex-col items-center justify-between p-6 text-white select-none">
      {/* Platform Header Container */}
      <header className="text-center z-10 mt-2 flex flex-col items-center">
        <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400">
          PULSEMIND AI
        </h1>
        <p className="text-slate-300 text-xs font-bold mt-1 uppercase tracking-widest">
          Sequential Multi-Agent Orchestration Engine
        </p>

        {/* Model Switcher Deck */}
        <div className="mt-3 flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setModelName("gemini-2.0-flash")}
            className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg transition-all ${modelName === "gemini-2.0-flash" ? "bg-cyan-500 text-black font-black" : "text-slate-400 font-bold hover:text-slate-200"}`}
          >
            Gemini 2.0 Flash
          </button>
          <button
            onClick={() => setModelName("gemini-1.5-pro")}
            className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg transition-all ${modelName === "gemini-1.5-pro" ? "bg-purple-600 text-white font-black" : "text-slate-400 font-bold hover:text-slate-200"}`}
          >
            Gemini 1.5 Pro 🔥
          </button>
        </div>
      </header>

      {/* Structural Network Map Canvas Space */}
      <div className="w-full max-w-4xl border border-slate-800 rounded-2xl bg-slate-950/40 p-6 my-2 flex flex-col justify-between items-center h-72 z-10 gap-4">
        {/* Top Horizon Line Row */}
        <div className="flex w-full justify-between items-center px-4">
          {/* Agent Card 1: Architect */}
          <div
            onClick={() => data && setActivePanel("architect")}
            className={`w-48 p-3 rounded-xl border text-center transition-all duration-300 ${
              pipelineState === "architect"
                ? "border-cyan-400 bg-cyan-950/70 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-105 font-bold"
                : "border-slate-800 bg-slate-900/90 hover:border-slate-700"
            } ${data && activePanel === "architect" ? "ring-2 ring-cyan-400" : ""} cursor-pointer`}
          >
            <p className="font-mono text-[10px] font-black tracking-wider text-cyan-400 uppercase">
              // Tech Architect
            </p>
            <p className="text-[11px] font-bold mt-1 text-slate-200">
              Status:{" "}
              {pipelineState === "architect"
                ? "RUNNING"
                : data
                  ? "RESOLVED"
                  : "STANDBY"}
            </p>
          </div>

          {/* Central Connecting Core Hub */}
          <div className="flex flex-col items-center justify-center border border-dashed border-indigo-500/30 rounded-full h-24 w-24 bg-slate-900/80 shadow-inner">
            <span className="text-[9px] text-indigo-400 font-black tracking-widest uppercase text-center leading-tight">
              Pipeline
              <br />
              Hub
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1.5 ${pipelineState !== "idle" ? "bg-cyan-400 animate-ping" : "bg-slate-700"}`}
            ></div>
          </div>

          {/* Agent Card 2: Security */}
          <div
            onClick={() => data && setActivePanel("security")}
            className={`w-48 p-3 rounded-xl border text-center transition-all duration-300 ${
              pipelineState === "security"
                ? "border-rose-500 bg-rose-950/70 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105 font-bold"
                : "border-slate-800 bg-slate-900/90 hover:border-slate-700"
            } ${data && activePanel === "security" ? "ring-2 ring-rose-500" : ""} cursor-pointer`}
          >
            <p className="font-mono text-[10px] font-black tracking-wider text-rose-400 uppercase">
              // Security Adversary
            </p>
            <p className="text-[11px] font-bold mt-1 text-slate-200">
              Status:{" "}
              {pipelineState === "security"
                ? "AUDITING"
                : ["ux", "complete"].includes(pipelineState) || data
                  ? "RESOLVED"
                  : "STANDBY"}
            </p>
          </div>
        </div>

        {/* Dynamic Vector Link Track Layout Line */}
        <div className="h-0.5 w-4/5 border-t border-dashed border-slate-800 relative">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-colors ${pipelineState !== "idle" ? "bg-indigo-400" : "bg-slate-800"}`}
          ></div>
        </div>

        {/* Bottom Horizontal Line Row */}
        <div
          onClick={() => data && setActivePanel("ux")}
          className={`w-52 p-3 rounded-xl border text-center transition-all duration-300 ${
            pipelineState === "ux"
              ? "border-emerald-400 bg-emerald-950/70 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105 font-bold"
              : "border-slate-800 bg-slate-900/90 hover:border-slate-700"
          } ${data && activePanel === "ux" ? "ring-2 ring-emerald-400" : ""} cursor-pointer`}
        >
          <p className="font-mono text-[10px] font-black tracking-wider text-emerald-400 uppercase">
            // UI/UX Copilot
          </p>
          <p className="text-[11px] font-bold mt-1 text-slate-200">
            Status:{" "}
            {pipelineState === "ux"
              ? "COMPILING"
              : data
                ? "RESOLVED"
                : "STANDBY"}
          </p>
        </div>
      </div>

      {/* Control Console Interface Panel */}
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl z-10 flex flex-col md:flex-row gap-5 min-h-64 mb-1">
        {/* Left Side Execution Trigger Module */}
        <div className="w-full md:w-2/5 flex flex-col justify-between gap-3">
          <div>
            <label className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 block mb-1.5 font-extrabold">
              Input Target Concept
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ex: A peer-to-peer mobile app for renting high-end camera lenses..."
              disabled={
                pipelineState !== "idle" && pipelineState !== "complete"
              }
              className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans font-bold resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={ignitePipeline}
              disabled={
                pipelineState !== "idle" && pipelineState !== "complete"
              }
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono uppercase tracking-widest text-[10px] py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {pipelineState === "idle"
                ? "💡 Ignite Core Pipeline"
                : pipelineState === "complete"
                  ? "🔄 Recalculate Flow"
                  : "⚡ Compiling Graph State..."}
            </button>
            {pipelineState === "complete" && (
              <button
                onClick={clearEngineSession}
                className="bg-slate-900 border border-slate-800 text-slate-200 hover:text-white px-4 py-3 rounded-xl text-[10px] font-mono uppercase font-black transition-colors"
              >
                Wipe
              </button>
            )}
          </div>
        </div>

        {/* Right Side Visual Telemetry Interface Output Displays */}
        <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5 flex flex-col">
          {data ? (
            <div className="flex flex-col h-full w-full">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2 w-full">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePanel("architect")}
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md font-black border ${activePanel === "architect" ? "bg-cyan-500 text-black border-cyan-400" : "bg-slate-900 text-slate-300 border-slate-800"}`}
                  >
                    Topology
                  </button>
                  <button
                    onClick={() => setActivePanel("security")}
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md font-black border ${activePanel === "security" ? "bg-rose-500 text-white border-rose-400" : "bg-slate-900 text-slate-300 border-slate-800"}`}
                  >
                    Threats
                  </button>
                  <button
                    onClick={() => setActivePanel("ux")}
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md font-black border ${activePanel === "ux" ? "bg-emerald-500 text-black border-emerald-400" : "bg-slate-900 text-slate-300 border-slate-800"}`}
                  >
                    Layout UI
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={handleCopyClipboard}
                    className="bg-slate-900 border border-slate-700 text-white text-[9px] font-mono uppercase px-2 py-1 rounded font-black hover:bg-slate-800"
                  >
                    {copyStatus}
                  </button>
                  <button
                    onClick={downloadBlueprintFile}
                    className="bg-indigo-900 border border-indigo-700 text-white text-[9px] font-mono uppercase px-2 py-1 rounded font-black hover:bg-indigo-800"
                  >
                    📥 Download Blueprint
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 flex-1 overflow-y-auto max-h-40 text-xs font-mono border border-slate-800 text-white font-medium space-y-2">
                {activePanel === "architect" && (
                  <div className="text-white">
                    <div className="bg-cyan-950 border border-cyan-800/60 p-2 rounded-lg mb-2 text-cyan-400 font-bold text-[10px] uppercase">
                      // Pipeline Link: Ingesting Concept
                    </div>
                    <p>
                      <span className="text-cyan-400 font-extrabold">
                        Database Core:
                      </span>{" "}
                      <span className="text-cyan-200 font-bold">
                        {data?.architect?.database || "PostgreSQL"}
                      </span>
                    </p>
                    <p>
                      <span className="text-cyan-400 font-extrabold">
                        Frontend Stack:
                      </span>{" "}
                      <span className="text-white font-bold">
                        {data?.architect?.frontendStack
                          ? data.architect.frontendStack.join(", ")
                          : "React, Tailwind, Vite"}
                      </span>
                    </p>
                    <p>
                      <span className="text-cyan-400 font-extrabold">
                        Backend Engine:
                      </span>{" "}
                      <span className="text-white font-bold">
                        {data?.architect?.backendStack
                          ? data.architect.backendStack.join(", ")
                          : "Node.js, Express"}
                      </span>
                    </p>
                    <p className="text-white mt-2 text-justify font-sans border-t border-slate-800/80 pt-2 text-xs font-normal leading-relaxed">
                      {data?.architect?.systemArchitectureSummary}
                    </p>
                  </div>
                )}
                {activePanel === "security" && (
                  <div className="text-white">
                    <div className="bg-rose-950 border border-rose-800/60 p-2 rounded-lg mb-2 text-rose-400 font-bold text-[10px] uppercase">
                      // Pipeline Link: Auditing Topology Structural Ingestions
                    </div>
                    <p>
                      <span className="text-rose-400 font-extrabold">
                        Calculated Threat Matrix:
                      </span>{" "}
                      <span className="bg-rose-600 text-white font-black px-2 py-0.5 rounded text-[10px] border border-rose-400 ml-1">
                        {data?.security?.threatLevel || "EVALUATED"}
                      </span>
                    </p>
                    <p className="text-rose-400 font-bold mt-2 text-[10px] uppercase tracking-wider">
                      Identified System Exploit Vulnerabilities:
                    </p>
                    <ul className="list-disc list-inside text-white font-sans space-y-1.5 text-xs mt-1 font-normal pl-1">
                      {data?.security?.vulnerabilitiesIdentified?.map(
                        (v, i) => (
                          <li key={i} className="text-justify">
                            {v}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {activePanel === "ux" && (
                  <div className="text-white">
                    <div className="bg-emerald-950 border border-emerald-800/60 p-2 rounded-lg mb-2 text-emerald-400 font-bold text-[10px] uppercase">
                      // Pipeline Link: Multi-Agent Mitigations Loaded
                    </div>
                    <p>
                      <span className="text-emerald-400 font-extrabold">
                        UX Layout Pattern:
                      </span>{" "}
                      <span className="text-emerald-300 font-bold">
                        {data?.ux?.layoutPattern}
                      </span>
                    </p>
                    <p className="text-emerald-400 font-bold mt-2 text-[10px] uppercase tracking-wider">
                      Required Protective Viewport Components:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data?.ux?.suggestedComponents?.map((c, i) => (
                        <span
                          key={i}
                          className="bg-slate-950 text-emerald-300 font-black text-[10px] px-2 py-0.5 rounded border border-emerald-900"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-white mt-2 text-justify font-sans border-t border-slate-800 pt-2 text-xs font-normal leading-relaxed">
                      {data?.ux?.uxMitigationStrategy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 font-mono text-xs text-center py-6 font-bold uppercase tracking-wide">
              {pipelineState === "idle" && (
                <p>
                  System Core Standby.
                  <br />
                  Input concept definition targeting multi-agent execution maps.
                </p>
              )}
              {pipelineState === "architect" && (
                <p className="text-cyan-400 animate-pulse">
                  ⚡ Agent 1 Compiling JSON Topology Schema via{" "}
                  {modelName.toUpperCase()}...
                </p>
              )}
              {pipelineState === "security" && (
                <p className="text-rose-400 animate-pulse">
                  🔒 Agent 2 Ingesting Pipeline Context... Injecting Threat
                  Vector Matrix...
                </p>
              )}
              {pipelineState === "ux" && (
                <p className="text-emerald-400 animate-pulse">
                  🎨 Agent 3 Compiling Layout Component Mitigations...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
