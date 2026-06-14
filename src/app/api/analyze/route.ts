import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Please provide a resume with at least 50 characters." }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `You are an expert resume reviewer. Analyze the following resume and return a JSON object ONLY — no markdown, no explanation, no backticks.

The JSON must follow this exact structure:
{
  "resumeScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "strengths": [<3-5 strings>],
  "weaknesses": [<3-5 strings>],
  "missingSkills": [<4-7 short skill names>],
  "improvementSuggestions": [<4-6 actionable strings>],
  "interviewQuestions": [<exactly 5 strings>]
}

Resume:
---
${resumeText}
---

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 });
    }
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
