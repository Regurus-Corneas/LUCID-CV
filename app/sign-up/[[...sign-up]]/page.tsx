import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import './auth-styles.css'

export default function Page() {
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
          <Link href="/" className="text-2xl font-black text-cyan-400">
            LUCID CV
          </Link>
        </div>
      </nav>

      {/* Sign Up Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md auth-container">
          <SignUp 
            appearance={{
              variables: {
                colorPrimary: '#22d3ee',
                colorBackground: '#000000',
                colorInputBackground: '#1a1a1a',
                colorInputText: '#ffffff',
              },
              elements: {
                formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-black font-semibold',
                card: 'bg-gray-900/90 backdrop-blur-xl border border-gray-800 shadow-2xl',
                headerTitle: 'text-cyan-400 text-2xl font-bold',
                headerSubtitle: 'text-gray-400 text-sm',
                socialButtonsBlockButton: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700',
                formFieldInput: 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500',
                formFieldLabel: 'text-gray-300 text-sm font-medium',
                footerActionLink: 'text-cyan-400 hover:text-cyan-300 text-sm',
                dividerLine: 'bg-gray-700',
                dividerText: 'text-gray-500 text-sm',
                alert: 'bg-red-900/50 border-red-800 text-red-200',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
