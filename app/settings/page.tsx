"use client";

import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/user-actions'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { User, Mail, Calendar, Settings } from 'lucide-react'

export default function SettingsPage() {
  const { isSignedIn } = useUser()
  const [dbUser, setDbUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      loadUserData()
    }
  }, [isSignedIn])

  const loadUserData = async () => {
    try {
      const user = await getCurrentUser()
      setDbUser(user)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
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
                Please sign in to access your settings
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
              <div className="text-2xl text-cyan-400">Loading settings...</div>
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-cyan-400 mb-2">
                Settings
              </h1>
              <p className="text-slate-400">
                Manage your account and preferences
              </p>
            </div>
            <Link 
              href="/"
              className="px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300"
            >
              Back to Analysis
            </Link>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <div className="p-6 rounded-[2rem] glass-pane">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400">Profile Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">First Name</label>
                  <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-slate-300">
                    {dbUser?.first_name || 'Not set'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Last Name</label>
                  <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-slate-300">
                    {dbUser?.last_name || 'Not set'}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Email Address</label>
                  <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-slate-300">
                    {dbUser?.email || 'Not set'}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-400 mb-2">Member Since</label>
                  <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-slate-300">
                    {dbUser?.created_at 
                      ? new Date(dbUser.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="p-6 rounded-[2rem] glass-pane">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-400">Account Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">Profile Management</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Your profile is managed through Clerk authentication. Click on your avatar in the top right to manage your account settings, change password, or delete your account.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">Data Privacy</h3>
                  <p className="text-sm text-slate-400">
                    Your analysis history and personal data are stored securely in our database. You can delete individual analyses from your history page or contact support for data deletion requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/history"
                className="p-6 rounded-[2rem] glass-pane hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-cyan-400">Analysis History</h3>
                </div>
                <p className="text-slate-400">
                  View and manage your previous resume analyses
                </p>
              </Link>
              
              <Link 
                href="/"
                className="p-6 rounded-[2rem] glass-pane hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-cyan-400">New Analysis</h3>
                </div>
                <p className="text-slate-400">
                  Start a new resume analysis
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
