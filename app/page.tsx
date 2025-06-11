'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the app</h1>

      {!isSignedIn ? (
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign In
        </button>
      ) : (
        <div>
          <p>You are signed in! </p>
          <UserButton />
        </div>
      )}
    </div>
  )
}