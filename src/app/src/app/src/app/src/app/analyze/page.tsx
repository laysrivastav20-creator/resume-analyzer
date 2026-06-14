"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface AnalysisResult {
  resumeScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  interviewQuestions: string[];
}

type Status = "idle" | "loading" | "done" | "error";

function ScoreRing({ score, label }: { score: number; label: string }) {
  const size = 128;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";
  const textColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${textColor}`}>{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
  );
}

function Card({ title, items, color, icon, numbered }: {
  title: string; items: string[]; color: string; icon: string; numbered?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${color}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-white/60">{items.length}</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 leading-relaxed">
            {numbered
              ? <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs font-semibold mt-0.5">{i+1}</span>
              : <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-500 mt-2" />
            }
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleAnalyze() {
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setErrorMsg("Please paste a resume with at least 50 characters.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      setStatus("done");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 tracking-tight text-lg">
            Resume<span className="text-blue-600">IQ</span>
          </Link>
          <span className="text-gray-500 text-sm">Resume Analyzer</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Analyze your resume</h1>
          <p className="text-gray-500">Paste your resume text below and get instant AI feedback.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full h-72 text-sm text-gray-900 placeholder-gray-300 resize-none outline-none leading-relaxed font-mono bg-[#F0EFE9] rounded-xl p-4 border border-gray-100 focus:border-blue-500 focus:bg-white transition-colors"
          />

          {errorMsg && (
            <div className="mt-3 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={status === "loading" || !resumeText.trim()}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {status === "loading" ? (
                <><svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>Analyzing…</>
              ) : <>Analyze resume</>}
            </button>
            {resumeText && (
              <button onClick={() => { setResumeText(""); setResult(null); setStatus("idle"); setErrorMsg(""); }}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-2.5">
                Clear
              </button>
            )}
          </div>
        </div>

        {status === "loading" && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-gray-400 text-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
              Gemini is reading your resume…
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div ref={resultRef} className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-6">Your Scores</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <ScoreRing score={result.resumeScore} label="Resume Score" />
                <div className="hidden sm:block w-px h-24 bg-gray-100" />
                <ScoreRing score={result.atsScore} label="ATS Score" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Strengths" items={result.strengths} color="bg-green-50 border-green-100" icon="✅" />
              <Card title="Weaknesses" items={result.weaknesses} color="bg-red-50 border-red-100" icon="⚠️" />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔍</span>
                <h3 className="font-semibold text-gray-900 text-sm">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span key={i} className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Card title="Improvement Suggestions" items={result.improvementSuggestions} color="bg-blue-50 border-blue-100" icon="🛠️" />
            <Card title="Likely Interview Questions" items={result.interviewQuestions} color="bg-gray-50 border-gray-100" icon="💬" numbered />

            <div className="text-center pt-2 pb-4">
              <button onClick={() => { setResumeText(""); setResult(null); setStatus("idle"); }}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-4">
                Analyze a different resume
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
