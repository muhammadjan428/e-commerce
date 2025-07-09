"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  Package,
  Home,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItemsCount } from "@/lib/actions/cart.actions";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();

  const [state, setState] = useState({
    mobileMenuOpen: false,
    scrolled: false,
    cartCount: 0,
    initialDataLoaded: false,
    isContactActive: false,
    searchQuery: "",
  });

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Initialize search query from URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      updateState({ searchQuery: q });
    }
  }, [searchParams, updateState]);

  // Handle search functionality
  const handleSearch = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && state.searchQuery.trim()) {
      const query = encodeURIComponent(state.searchQuery.trim());
      router.push(`/?q=${query}`);
      updateState({ mobileMenuOpen: false });
    }
  }, [state.searchQuery, router, updateState]);

  const handleSearchSubmit = useCallback(() => {
    if (state.searchQuery.trim()) {
      const query = encodeURIComponent(state.searchQuery.trim());
      router.push(`/?q=${query}`);
      updateState({ mobileMenuOpen: false });
    }
  }, [state.searchQuery, router, updateState]);

  // Check if contact is active
  useEffect(() => {
    const checkContactActive = () => {
      const isActive = pathname.includes("/contact") || window.location.hash === "#footer";
      updateState({ isContactActive: isActive });
    };
    
    checkContactActive();
    
    // Listen for hash changes
    const handleHashChange = () => checkContactActive();
    window.addEventListener("hashchange", handleHashChange);
    
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname, updateState]);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    try {
      const count = await getCartItemsCount();
      updateState({ cartCount: count });
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      updateState({ cartCount: 0 });
    }
  }, [updateState]);

  // Initialize data
  useEffect(() => {
    if (!isLoaded) return;
    
    const init = async () => {
      try {
        if (isSignedIn) {
          await fetchCartCount();
        } else {
          updateState({ cartCount: 0 });
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        updateState({ initialDataLoaded: true });
      }
    };
    
    init();
  }, [isLoaded, isSignedIn, fetchCartCount, updateState]);

  // Update cart on path change and scroll events
  useEffect(() => {
    if (isSignedIn && state.initialDataLoaded) fetchCartCount();
    
    const onScroll = () => updateState({ scrolled: window.scrollY > 10 });
    const handleCartUpdate = () => {
      if (isSignedIn && state.initialDataLoaded) fetchCartCount();
    };
    
    window.addEventListener("scroll", onScroll);
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [pathname, isSignedIn, state.initialDataLoaded, fetchCartCount, updateState]);

  // Handle hash scroll on mount
  useEffect(() => {
    if (pathname === "/" && window.location.hash === "#footer") {
      const scrollToFooter = () => {
        const footer = document.getElementById("footer");
        if (footer) {
          const isMobile = window.innerWidth < 1024;
          const offset = isMobile ? 20 : 0;
          const top = footer.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      };
      
      const delays = [100, 500, 1000, 1500];
      delays.forEach(delay => setTimeout(scrollToFooter, delay));
    }
  }, [pathname]);

  // Scroll to footer function
  const scrollToFooter = useCallback(() => {
    updateState({ mobileMenuOpen: false });
    
    const performScroll = () => {
      const footer = document.getElementById("footer");
      if (!footer) return;
      
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? 20 : 0;
      const top = footer.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    if (pathname === "/") {
      setTimeout(performScroll, 100);
    } else {
      router.push("/");
      setTimeout(() => {
        const checkAndScroll = () => {
          if (document.getElementById("footer")) {
            performScroll();
          } else {
            setTimeout(checkAndScroll, 100);
          }
        };
        checkAndScroll();
      }, 300);
    }
  }, [pathname, router, updateState]);

  const navItemClass = (href: string) => `relative px-3 py-2 rounded-lg transition-all duration-300 group ${
    pathname === href ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
  }`;

  const iconClass = (href: string) => `w-4 h-4 transition-colors ${
    pathname === href ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
  }`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      state.scrolled
        ? "backdrop-blur-lg shadow-lg border-b border-white/20"
        : "bg-transparent border-b border-transparent"
    }`}>
      {/* Modified container with reduced width for small/medium devices */}
      <div className="w-[90%] sm:w-[85%] md:w-[85%] lg:w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-3 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden rounded-full bg-gray-50 hover:bg-gray-100 transition-colors mr-2"
              onClick={() => updateState({ mobileMenuOpen: !state.mobileMenuOpen })}
            >
              {state.mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </Button>

            {/* Logo */}
            <Link href="/" className="hidden xl:flex items-center gap-2">
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
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={state.searchQuery}
                onChange={(e) => updateState({ searchQuery: e.target.value })}
                onKeyDown={handleSearch}
                placeholder="Search products..."
                className="w-full pl-4 pr-20 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex gap-1 items-center">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={navItemClass(href)}>
                <div className="flex items-center gap-2">
                  <Icon className={iconClass(href)} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {pathname === href && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-500 rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    animate={{ width: "80%", x: "-50%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}

            <button
              onClick={scrollToFooter}
              className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                state.isContactActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <MessageCircle className={`w-4 h-4 transition-colors ${
                state.isContactActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
              }`} />
              <span>Contact</span>
              {state.isContactActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-500 rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  animate={{ width: "80%", x: "-50%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>

            {isSignedIn && state.initialDataLoaded && (
              <Link href="/purchases" className={navItemClass("/purchases")}>
                <div className="flex items-center gap-2">
                  <Package className={iconClass("/purchases")} />
                  <span className="text-sm font-medium">Purchases</span>
                </div>
                {pathname === "/purchases" && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-blue-500 rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    animate={{ width: "80%", x: "-50%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            )}
          </nav>

          {/* Right Side - Cart and Auth */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className={`relative p-2 rounded-full transition-all duration-300 ${
              pathname === "/cart" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
            }`}>
              <ShoppingCart className={`transition-colors ${
                pathname === "/cart" ? "text-blue-600" : "text-gray-700"
              }`} size={20} />
              {state.cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {state.cartCount > 99 ? "99+" : state.cartCount}
                </motion.span>
              )}
            </Link>

            {/* Only show auth buttons after data is loaded */}
            {isLoaded && state.initialDataLoaded && (
              <>
                {isSignedIn ? (
                  <div className="scale-90">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-colors text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-9 rounded-full font-medium shadow-sm">
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {state.mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            {/* Mobile Search */}
            <div className="px-3 py-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={(e) => updateState({ searchQuery: e.target.value })}
                  onKeyDown={handleSearch}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 rounded-full border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
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
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                    onClick={() => updateState({ mobileMenuOpen: false })}
                  >
                    <Icon className={`w-5 h-5 ${pathname === href ? "text-blue-500" : "text-gray-400"}`} />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}

              <Link
                href="/cart"
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  pathname === "/cart"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
                onClick={() => updateState({ mobileMenuOpen: false })}
              >
                <div className="relative">
                  <ShoppingCart className={`w-5 h-5 ${pathname === "/cart" ? "text-blue-500" : "text-gray-400"}`} />
                  {state.cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {state.cartCount > 99 ? "99+" : state.cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              <button
                onClick={scrollToFooter}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left transition-colors ${
                  state.isContactActive
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <MessageCircle className={`w-5 h-5 ${state.isContactActive ? "text-blue-500" : "text-gray-400"}`} />
                <span>Contact Us</span>
              </button>

              {isSignedIn && state.initialDataLoaded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05 }}
                >
                  <Link
                    href="/purchases"
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                      pathname === "/purchases"
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                    onClick={() => updateState({ mobileMenuOpen: false })}
                  >
                    <Package className={`w-5 h-5 ${pathname === "/purchases" ? "text-blue-500" : "text-gray-400"}`} />
                    <span>My Purchases</span>
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}