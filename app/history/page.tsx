"use client";

import { useState, useEffect } from 'react'
import { getAnalysisHistory, deleteAnalysisResult } from '../lib/user-actions'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Trash2, Eye, Calendar, Target, TrendingUp } from 'lucide-react'

interface Analysis {
  id: string
  job_description: string
  resume_text: string
  analysis_result: any
  match_score: number
  verdict: string
  created_at: string
}

export default function HistoryPage() {
  const { isSignedIn } = useUser()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    if (isSignedIn) {
      loadHistory()
    }
  }, [isSignedIn])

  const loadHistory = async () => {
    try {
      const data = await getAnalysisHistory(20)
      setAnalyses(data)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteAnalysisResult(id)
        setAnalyses(analyses.filter(a => a.id !== id))
      } catch (error) {
        console.error('Error deleting analysis:', error)
      }
    }
  }

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen bg-black">
        <div className="fixed inset-0 bg-black pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none blur-[40px] opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop"
            alt="Abstract background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <main className="relative min-h-screen text-slate-200 p-8 font-sans z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <h1 className="text-6xl font-black tracking-tighter text-cyan-400 mb-4">
                Sign In Required
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Please sign in to view your analysis history
              </p>
              <Link 
                href="/sign-in"
                className="px-8 py-3 rounded-full bg-cyan-500 text-black text-lg font-semibold hover:bg-cyan-400 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black">
        <div className="fixed inset-0 bg-black pointer-events-none" />
        <main className="relative min-h-screen text-slate-200 p-8 font-sans z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-20">
              <div className="text-2xl text-cyan-400">Loading history...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 bg-black pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none blur-[40px] opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <main className="relative min-h-screen text-slate-200 p-8 font-sans z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-cyan-400 mb-2">
                Analysis History
              </h1>
              <p className="text-slate-400">
                Your previous resume analyses
              </p>
            </div>
            <Link 
              href="/"
              className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300"
            >
              New Analysis
            </Link>
          </div>

          {analyses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-2xl text-slate-400 mb-4">
                No analysis history yet
              </div>
              <Link 
                href="/"
                className="px-8 py-3 rounded-full bg-cyan-500 text-black text-lg font-semibold hover:bg-cyan-400 transition-all duration-300"
              >
                Start Your First Analysis
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="p-6 rounded-[2rem] glass-pane">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-cyan-400" />
                          <span className="text-2xl font-bold text-cyan-400">
                            {analysis.match_score}%
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          analysis.verdict === 'Strong Match' 
                            ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                            : analysis.verdict === 'Partial Match'
                            ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                            : 'bg-rose-500/20 border border-rose-400/30 text-rose-300'
                        }`}>
                          {analysis.verdict}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <p className="text-slate-300 line-clamp-2 mb-3">
                        {analysis.job_description.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedAnalysis(analysis)}
                        className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(analysis.id)}
                        className="p-2 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-400 hover:bg-rose-500/30 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-cyan-400">Analysis Details</h2>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Job Description</h3>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {selectedAnalysis.job_description}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Analysis Result</h3>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <pre className="text-slate-300 text-sm overflow-x-auto">
                    {JSON.stringify(selectedAnalysis.analysis_result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
