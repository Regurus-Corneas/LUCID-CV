"use client";

import React, { useState, useRef, useEffect } from "react";
import { analyzeResume, refineJobDescription } from "./actions";
import { saveAnalysisResult } from "./lib/user-actions";
import pdfToText from 'react-pdftotext';
import { FileText, Sparkles, AlertCircle, CheckCircle, History } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { UserProfile } from './components/UserProfile';

function CountUpNumber({ target, duration }: { target: number; duration: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{count}%</>;
}

export default function Home() {
  const { isSignedIn } = useUser();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [textKey, setTextKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleRefine = async () => {
    if (!jobDescription.trim()) return;
    
    setIsRefining(true);
    try {
      const refined = await refineJobDescription(jobDescription);
      setJobDescription(refined);
    } catch (error) {
      setResult("An error occurred while refining. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Check if it's a PDF
    if (file.type !== "application/pdf") {
      return;
    }

    try {
      // 2. Extract text using the simple library
      const text = await pdfToText(file);
      
      // 3. Save to hidden state
      setResumeText(text);
      setResumeFileName(file.name);
      console.log("PDF Content Extracted Successfully");
    } catch (error) {
      console.error("Failed to extract text from pdf", error);
    }
  }

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeResume(jobDescription, resumeText);
      
      // Save to database if user is signed in
      if (isSignedIn) {
        try {
          await saveAnalysisResult(jobDescription, resumeText, analysisResult);
        } catch (error) {
          console.error('Error saving analysis:', error);
          // Continue with showing results even if save fails
        }
      }
      
      // Cinematic delay to let the scanning animation run
      setTimeout(() => {
        setResult(analysisResult);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setResult({ error: "An error occurred while analyzing. Please try again." });
      setIsLoading(false);
    }
  };

  // Smooth scroll to results when analysis completes
  useEffect(() => {
    if (result && !isLoading && resultsRef.current) {
      // Delay to ensure the results are fully rendered
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [result, isLoading]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Base black layer */}
      <div className="fixed inset-0 bg-black pointer-events-none" />
      
      {/* Premium Background Image */}
      <div className="fixed inset-0 pointer-events-none blur-[40px] opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Vignette Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 20%, black 100%)',
        }}
      />
      
      {/* Navigation Header */}
      <nav className="relative z-20 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black text-cyan-400">
              LUCID CV
            </Link>
            {isSignedIn && (
              <Link 
                href="/history"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-all duration-300"
              >
                <History size={16} />
                History
              </Link>
            )}
          </div>
          <UserProfile />
        </div>
      </nav>

      {/* Main content */}
      <main className="relative min-h-screen text-slate-200 p-8 font-sans z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Header Section */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 text-xs font-semibold tracking-wider">
                Corneas v1.0
              </span>
            </div>
            <div className="relative isolate">
              <h1 className="text-8xl font-black tracking-tighter glass-text-masterpiece">
                <span className="absolute inset-0 blur-2xl opacity-20 pointer-events-none">LUCID CV</span>
                LUCID CV
              </h1>
            </div>
            <p className="font-bold uppercase tracking-[0.3em] text-[10px] text-cyan-200 drop-shadow-[0_0_2px_rgba(34,211,238,0.9)] drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Compare your CV against any job in seconds
            </p>
          </header>
    
          <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Job Description */}
          <div className={`min-h-[450px] p-6 rounded-[2rem] glass-pane flex flex-col transition-all duration-300 animate-[float_6s_ease-in-out_infinite] hover:shadow-[0_0_50px_rgba(236,72,153,0.2)] relative ${isRefining ? 'refining-shimmer' : ''}`} style={{ animationDelay: '0s' }}>
            {isLoading && <div className="scan-line" />}
            <label className="block text-sm font-semibold mb-3 text-cyan-400 uppercase tracking-wider text-center">Job Description</label>
            <div className="relative flex-1 w-full overflow-hidden rounded-2xl flex flex-col">
              {/* Textarea area */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  key={textKey}
                  className={`w-full h-full bg-transparent border-none outline-none resize-none p-4 pr-6 text-sm text-slate-300 font-medium placeholder:text-slate-700 custom-scrollbar transition-opacity duration-300 ${isRefining ? 'opacity-50' : 'opacity-100 text-fade-in'}`}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isRefining}
                />
              </div>

              {/* Spacer to protect text from button */}
              <div className="h-6" />
            </div>
            <button
              onClick={async () => {
                setIsRefining(true);
                const cleaned = await refineJobDescription(jobDescription);
                // Small delay for fade-in effect
                setTimeout(() => {
                  setJobDescription(cleaned);
                  setTextKey(prev => prev + 1); // Trigger fade-in animation
                  setIsRefining(false);
                }, 100);
              }}
              disabled={isRefining}
              className={`mt-auto liquid-glass-button w-full h-16 rounded-full text-xs font-bold tracking-[0.3em] uppercase gap-2 ${
                isRefining ? "cursor-not-allowed text-slate-500" : "text-cyan-400"
              }`}
            >
              <Sparkles size={20} className={isRefining ? "text-slate-400" : "text-cyan-400"} />
              {isRefining ? "Refining..." : "Refine"}
            </button>
          </div>
  
          {/* Right Column: Resume Upload */}
          <div className="min-h-[450px] p-6 rounded-[2rem] glass-pane flex flex-col transition-all duration-300 animate-[float_6s_ease-in-out_infinite] hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:bg-white/[0.06] relative" style={{ animationDelay: '1.5s' }}>
            {isLoading && <div className="scan-line" />}
            <label className="block text-sm font-semibold mb-3 text-blue-400 uppercase tracking-wider text-center">Your Resume</label>
            <div className="relative flex-1 w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center">
              <input 
                type="file" 
                accept=".pdf,application/pdf" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="cv-upload" 
              />
              <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center justify-center text-center">
                <FileText size={40} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]" />
                <p className="text-sm font-bold text-slate-400 mt-2">
                  {resumeFileName || "Click to upload PDF"}
                </p>
              </label>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !resumeText}
              className={`mt-auto liquid-glass-button w-full h-16 rounded-full text-xs font-bold tracking-[0.3em] uppercase ${
                isLoading ? "cursor-not-allowed text-slate-500" : "text-cyan-400"
              }`}
            >
              {isLoading ? "Brainstorming..." : "Analyze Match"}
            </button>
          </div>
        </div>
  
        {/* Results Section */}
        {result && (
          <div ref={resultsRef} className="p-8 rounded-[2rem] glass-pane animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="text-cyan-400"></span> Analysis Results
            </h2>
            {result.error ? (
              <div className="text-red-400">{result.error}</div>
            ) : (
              <div className="space-y-8">
                {/* Hero Match Score - Circular Gauge */}
                <div className="flex justify-center items-center py-8 result-item-1">
                  <div className="p-10 overflow-visible">
                    <div className="relative w-64 h-64 overflow-visible">
                      <svg className="progress-ring w-full h-full overflow-visible" viewBox="0 0 100 100" style={{ '--final-offset': `${283 - (283 * result.matchScore / 100)}` } as React.CSSProperties}>
                        <defs>
                          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                          <filter id="glow-blur">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                          </filter>
                        </defs>
                        <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                        {/* Blurred background circle for glow */}
                        <circle cx="50" cy="50" r="45" className="gauge-circle opacity-50" fill="none" stroke="url(#progress-gradient)" strokeWidth="4" strokeDasharray="283" strokeDashoffset="283" style={{ filter: 'blur(12px)' }} />
                        {/* Main progress circle */}
                        <circle cx="50" cy="50" r="45" className="gauge-circle" fill="none" stroke="url(#progress-gradient)" strokeWidth="4" strokeDasharray="283" strokeDashoffset="283" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl font-black text-white leading-none">
                          <CountUpNumber target={result.matchScore} duration={1.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verdict and Summary - Side by Side */}
                <div className="flex flex-col md:flex-row gap-6 result-item-2 items-stretch">
                  <div className="w-full md:w-1/3 p-6 rounded-[2rem] glass-pane flex flex-col items-center justify-center gap-4">
                    <div className="text-base font-bold uppercase tracking-widest text-cyan-400">Verdict</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
                      {result.verdict === "Strong Match" ? (
                        <CheckCircle size={20} className="text-emerald-400" />
                      ) : result.verdict === "Partial Match" ? (
                        <AlertCircle size={20} className="text-amber-400" />
                      ) : (
                        <AlertCircle size={20} className="text-rose-400" />
                      )}
                      <span className="text-xl font-bold text-blue-400">{result.verdict}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-6 rounded-[2rem] glass-pane flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-cyan-400">Strategic Summary</h3>
                    <p className="text-slate-300 leading-relaxed flex-1">{result.summary}</p>
                  </div>
                </div>

                {/* Skills Glow Tags Grid */}
                <div className="space-y-6 result-item-3">
                  {result.skills?.matched && result.skills.matched.length > 0 && (
                    <div className="p-6 rounded-[2rem] glass-pane">
                      <h3 className="text-lg font-semibold mb-4 text-emerald-400">Matched Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.matched.map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium shadow-[0_0_10px_rgba(16,185,129,0.3)] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.skills?.missing && result.skills.missing.length > 0 && (
                    <div className="p-6 rounded-[2rem] glass-pane">
                      <h3 className="text-lg font-semibold mb-4 text-rose-400">Missing Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.missing.map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm font-medium shadow-[0_0_10px_rgba(244,63,94,0.3)] shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.skills?.bonus && result.skills.bonus.length > 0 && (
                    <div className="p-6 rounded-[2rem] glass-pane">
                      <h3 className="text-lg font-semibold mb-4 text-amber-400">Bonus Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.bonus.map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-medium shadow-[0_0_10px_rgba(245,158,11,0.3)] shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {result.atsAnalysis && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {result.atsAnalysis.missingKeywords && result.atsAnalysis.missingKeywords.length > 0 && (
                      <div className="p-6 rounded-[2rem] glass-pane">
                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Missing Keywords</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {result.atsAnalysis.missingKeywords.map((keyword: string, i: number) => (
                            <li key={i}>{keyword}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.atsAnalysis.redFlags && result.atsAnalysis.redFlags.length > 0 && (
                      <div className="p-6 rounded-[2rem] glass-pane">
                        <h3 className="text-lg font-semibold mb-4 text-red-400">Red Flags</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {result.atsAnalysis.redFlags.map((flag: string, i: number) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.atsAnalysis.formattingWarnings && result.atsAnalysis.formattingWarnings.length > 0 && (
                      <div className="p-6 rounded-[2rem] glass-pane">
                        <h3 className="text-lg font-semibold mb-4 text-yellow-400">Formatting Warnings</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {result.atsAnalysis.formattingWarnings.map((warning: string, i: number) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {result.bulletPointFixes && result.bulletPointFixes.length > 0 && (
                  <div className="p-6 rounded-[2rem] glass-pane result-item-4">
                    <h3 className="text-lg font-semibold mb-6 text-cyan-400">Bullet Point Improvements</h3>
                    <div className="space-y-6">
                      {result.bulletPointFixes.map((fix: any, i: number) => (
                        <div key={i} className="grid md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 relative">
                          {/* Glowing vertical divider */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.5)] transform -translate-x-1/2"></div>
                          {/* Left: Legacy (Original) */}
                          <div className="space-y-2 pr-4">
                            <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Legacy</div>
                            <div className="text-slate-300 line-through opacity-50 leading-relaxed">{fix.original}</div>
                          </div>
                          {/* Right: Optimized (Suggested) */}
                          <div className="space-y-2 pl-4">
                            <div className="text-xs uppercase tracking-wider text-emerald-400 mb-2">Optimized</div>
                            <div className="text-emerald-300 leading-relaxed font-medium">{fix.suggested}</div>
                            <div className="text-xs text-slate-400 mt-3 italic">{fix.improvement}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.fiveMinuteFixes && result.fiveMinuteFixes.length > 0 && (
                  <div className="p-6 rounded-[2rem] glass-pane result-item-5">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">5-Minute Fixes</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      {result.fiveMinuteFixes.map((fix: string, i: number) => (
                        <li key={i}>{fix}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reset Button */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => {
                      setJobDescription("");
                      setResumeText("");
                      setResumeFileName(null);
                      setResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full max-w-md py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 tracking-[0.3em] font-bold text-slate-300 hover:text-white uppercase"
                  >
                    Start New Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}