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
        headers: {
