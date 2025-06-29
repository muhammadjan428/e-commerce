'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { CartProvider } from '@/components/cart/context'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen">
        <div className="h-16 bg-white shadow-sm"></div> {/* Navbar placeholder */}
        {children}
      </div>
    )
  }

  return (
    <CartProvider>
      <Navbar />
      {children}
    </CartProvider>
  )
}