import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the modern Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

// Define the Master Multi-Agent Pipeline Endpoint
app.post("/api/ignite", async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Core project idea is required." });
  }

  try {
    // ==========================================
    // STAGE 1: THE TECHNICAL ARCHITECT AGENT
    // ==========================================
    const architectSchema = {
      type: "OBJECT",
      properties: {
        agentName: { type: "STRING" },
        database: { type: "STRING" },
        frontendStack: { type: "ARRAY", items: { type: "STRING" } },
        backendStack: { type: "ARRAY", items: { type: "STRING" } },
        systemArchitectureSummary: { type: "STRING" },
      },
      required: [
        "agentName",
        "database",
        "frontendStack",
        "backendStack",
        "systemArchitectureSummary",
      ],
      additionalProperties: false,
    };

    const architectPrompt = `You are a high-level software architect. Analyze this raw concept and design an optimized full-stack infrastructure topology: "${idea}"`;

    const architectResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: architectPrompt,
      config: {
        systemInstruction:
          "You are an enterprise technical architect. Your job is to select data models and tech stacks. Output strictly via the provided schema parameters.",
        responseMimeType: "application/json",
        responseSchema: architectSchema,
      },
    });

    const architectData = JSON.parse(architectResponse.text);

    // ==========================================
    // STAGE 2: THE ADVERSARY SECURITY AUDITOR (Dependent on Stage 1)
    // ==========================================
    const securitySchema = {
      type: "OBJECT",
      properties: {
        agentName: { type: "STRING" },
        threatLevel: { type: "STRING" },
        vulnerabilitiesIdentified: { type: "ARRAY", items: { type: "STRING" } },
        attackVectors: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: [
        "agentName",
        "threatLevel",
        "vulnerabilitiesIdentified",
        "attackVectors",
      ],
      additionalProperties: false,
    };

    const securityPrompt = `Analyze the security implications of this core idea: "${idea}" configured with this proposed architecture topology: ${JSON.stringify(architectData)}`;

    const securityResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: securityPrompt,
      config: {
        systemInstruction:
          "You are a cyber security auditor. Your single focus is to break architectures and point out structural flaws. Be ruthlessly critical.",
        responseMimeType: "application/json",
        responseSchema: securitySchema,
      },
    });

    const securityData = JSON.parse(securityResponse.text);

    // ==========================================
    // STAGE 3: THE UI/UX COPILOT (Dependent on Stage 1 & 2)
    // ==========================================
    const uxSchema = {
      type: "OBJECT",
      properties: {
        agentName: { type: "STRING" },
        layoutPattern: { type: "STRING" },
        suggestedComponents: { type: "ARRAY", items: { type: "STRING" } },
        uxMitigationStrategy: { type: "STRING" },
      },
      required: [
        "agentName",
        "layoutPattern",
        "suggestedComponents",
        "uxMitigationStrategy",
      ],
      additionalProperties: false,
    };

    const uxPrompt = `Design a human-computer interface layout for "${idea}" that explicitly mitigates these specific system vulnerabilities: ${JSON.stringify(securityData)} while taking advantage of this architecture: ${JSON.stringify(architectData)}`;

    const uxResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: uxPrompt,
      config: {
        systemInstruction:
          "You are a senior UI/UX designer. Create mock layout design blueprints that enhance system usability and help visual components guard against user error or interface threats.",
        responseMimeType: "application/json",
        responseSchema: uxSchema,
      },
    });

    const uxData = JSON.parse(uxResponse.text);

    // Return the perfectly ordered, verified JSON matrix directly to the frontend canvas
    return res.json({
      architect: architectData,
      security: securityData,
      ux: uxData,
    });
  } catch (error) {
    console.error("Pipeline Processing Failure:", error);
    return res
      .status(500)
      .json({ error: "Multi-Agent pipeline configuration failed to resolve." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`PulseMind AI core running on port ${PORT}`),
);
