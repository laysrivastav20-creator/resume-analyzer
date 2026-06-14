import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-ink tracking-tight text-lg">
            Resume<span className="text-accent">IQ</span>
          </span>
          <Link href="/analyze" className="text-sm font-medium text-accent hover:text-blue-700 transition-colors">
            Analyze Resume →
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-slow" />
          Powered by Gemini AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-ink leading-[1.08] tracking-tight mb-6">
          Know exactly where<br />
          <span className="text-accent">your resume stands</span>
        </h1>
        <p className="text-slate text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Paste your resume and get an instant breakdown — ATS score, skill gaps, improvement tips, and real interview questions.
        </p>
        <Link href="/analyze" className="inline-flex items-center gap-2 bg-ink text-paper px-7 py-3.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
          Analyze my resume
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "📊", label: "Dual Scoring", desc: "Resume score and ATS compatibility score, side by side." },
            { icon: "🔍", label: "Skill Gap Analysis", desc: "See exactly which skills are missing for your target role." },
            { icon: "💬", label: "Interview Prep", desc: "5 likely interview questions generated from your resume." },
            { icon: "✅", label: "Strengths Identified", desc: "Understand what's already working well in your resume." },
            { icon: "⚡", label: "Instant Results", desc: "Analysis delivered in seconds, no sign-up needed." },
            { icon: "🛠️", label: "Actionable Tips", desc: "Concrete suggestions to improve before your next application." },
          ].map((f) => (
            <div key={f.label} className="bg-mist rounded-xl p-5 border border-gray-100">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-ink text-sm mb-1">{f.label}</div>
              <div className="text-slate text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-slate text-xs">
        ResumeIQ — AI-powered resume analysis. No data is stored.
      </footer>
    </main>
  );
}
