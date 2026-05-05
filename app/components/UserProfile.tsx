"use client";

import { useUser, UserButton } from '@clerk/nextjs'
import { getCurrentUser } from '../lib/user-actions'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className = "" }: UserProfileProps) {
  const { isSignedIn, user } = useUser()
  const [dbUser, setDbUser] = useState<any>(null)

  useEffect(() => {
    if (isSignedIn) {
      getCurrentUser().then(setDbUser)
    }
  }, [isSignedIn])

  if (!isSignedIn) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <Link 
          href="/sign-in"
          className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-all duration-300"
        >
          Sign In
        </Link>
        <Link 
          href="/sign-up"
          className="px-4 py-2 rounded-full bg-cyan-500 text-black text-sm font-semibold hover:bg-cyan-400 transition-all duration-300"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-semibold text-cyan-400">
            {dbUser?.first_name || user?.firstName} {dbUser?.last_name || user?.lastName}
          </div>
          <div className="text-xs text-slate-400">
            {dbUser?.email || user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "bg-gray-900 border border-gray-800",
              userButtonPopoverActionButton: "text-gray-300 hover:text-cyan-400",
              userButtonPopoverActionButtonText: "text-sm",
            }
          }}
        />
      </div>
    </div>
  )
}
