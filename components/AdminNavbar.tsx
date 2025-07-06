'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Package, Settings, ShoppingCart, Users, LayoutDashboard, X, LayoutGrid, MonitorSpeaker } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/admin/billboards', label: 'Billboards', icon: MonitorSpeaker },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
     <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
    scrolled
      ? 'backdrop-blur-lg shadow-lg border-b border-white/20'
      : 'bg-transparent border-b border-transparent'
  }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with animation */}
        <Link href="/admin" className="flex items-center gap-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            <LayoutDashboard className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AdminPanel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-1 items-center">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 group ${
                pathname === href 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon 
                  className={`w-4 h-4 transition-colors ${
                    pathname === href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                  }`} 
                />
                <span className="text-sm font-medium">{label}</span>
              </div>
              
              {pathname === href && (
                <motion.div 
                  className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-500 rounded-full"
                  initial={{ width: 0, x: '-50%' }}
                  animate={{ width: '80%', x: '-50%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* User Actions - Fixed alignment */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border border-gray-200",
                }
              }}
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation with animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col">
              {navLinks.map(({ href, label, icon: Icon }, index) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                      pathname === href
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon 
                      className={`w-5 h-5 ${
                        pathname === href ? 'text-blue-500' : 'text-gray-400'
                      }`} 
                    />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}