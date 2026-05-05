import { ClerkProvider } from '@clerk/nextjs'

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#22d3ee',
          colorBackground: '#000000',
          colorInputBackground: '#1a1a1a',
          colorInputText: '#f8fafc',
        },
        elements: {
          formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-600 text-black font-semibold',
          card: 'bg-gray-900 border border-gray-800',
          headerTitle: 'text-cyan-400',
          headerSubtitle: 'text-gray-400',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
