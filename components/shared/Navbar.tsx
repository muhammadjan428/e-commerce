'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  Package,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCartItemsCount } from '@/lib/actions/cart.actions';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // fetch cart count
  const fetchCartCount = async () => {
    try {
      setIsLoading(true);
      const count = await getCartItemsCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch count on mount and when user signs in/out
  useEffect(() => {
    if (isSignedIn) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isSignedIn]);

  // Update when path changes
  useEffect(() => {
    if (isSignedIn) {
      fetchCartCount();
    }
  }, [pathname, isSignedIn]);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to cart updates via custom event
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isSignedIn) fetchCartCount();
    };


    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isSignedIn]);

  // Smooth scroll to footer
  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 relative">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900">
              Luxe<span className="text-blue-600">Cart</span>
            </span>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* ACTION ICONS */}
          <div className="flex items-center gap-4">
            {/* Contact */}
            <button
              onClick={scrollToFooter}
              className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              <span>Contact</span>
            </button>

            {/* Purchases - Only show if signed in */}
            {isSignedIn && (
              <Link 
                href="/purchases" 
                className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <Package size={16} />
                <span>Purchases</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden md:block p-2 rounded-full hover:bg-gray-50">
              <Heart className="text-gray-700" size={20} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-50">
              <ShoppingCart className="text-gray-700" size={20} />
              {!isLoading && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Clerk Auth */}
            <div className="hidden md:block">
              {isSignedIn ? (
                <div className="scale-90">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full bg-gray-50 hover:bg-gray-100"
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
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <nav className="flex flex-col border-t border-gray-100">
              <button
                onClick={scrollToFooter}
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 text-left"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span>Contact Us</span>
              </button>

              {/* Purchases - Only show if signed in */}
              {isSignedIn && (
                <Link
                  href="/purchases"
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5 text-gray-400" />
                  <span>My Purchases</span>
                </Link>
              )}

              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 text-gray-400" />
                <span>Wishlist</span>
              </Link>

              <div className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 border-t border-gray-100">
                {isSignedIn ? (
                  <>
                    <UserButton afterSignOutUrl="/" />
                    <span>My Account</span>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}