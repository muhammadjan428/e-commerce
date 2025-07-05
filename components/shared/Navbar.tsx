"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  Package,
  Home,
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
  const { isSignedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    setMobileSearchQuery(query);
  }, [searchParams]);

  // fetch cart count
  const fetchCartCount = async () => {
    try {
      setIsLoading(true);
      const count = await getCartItemsCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to cart updates via custom event
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isSignedIn) fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [isSignedIn]);

  // Enhanced scroll to footer function with better mobile/tablet support
  const scrollToFooter = useCallback(() => {
    // Close mobile menu first
    setMobileMenuOpen(false);

    const performScroll = () => {
      const footer = document.getElementById("footer");

      if (footer) {
        // Get viewport and element dimensions
        const viewportHeight = window.innerHeight;
        const footerRect = footer.getBoundingClientRect();
        const footerTop = footerRect.top + window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;

        // Calculate optimal scroll position
        // For mobile: scroll to show footer at top with small offset
        // For desktop: use standard behavior
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

        let targetPosition;

        if (isMobile || isTablet) {
          // For mobile/tablet: scroll to footer top with small offset
          targetPosition = Math.max(0, footerTop - 20);

          // Ensure we don't scroll past the bottom
          const maxScroll = documentHeight - viewportHeight;
          targetPosition = Math.min(targetPosition, maxScroll);
        } else {
          // For desktop: use scrollIntoView behavior
          footer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        // Use requestAnimationFrame for smooth scrolling on mobile
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // ms
        let startTime: number | null = null; // Fix: Explicitly type startTime

        const animateScroll = (currentTime: number) => {
          // Fix: Explicitly type currentTime parameter
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = easeInOutQuad(
            timeElapsed,
            startPosition,
            distance,
            duration
          );

          window.scrollTo(0, run);

          if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
          } else {
            // Ensure we end at the exact target position
            window.scrollTo(0, targetPosition);
          }
        };

        // Easing function for smooth animation
        const easeInOutQuad = (
          t: number,
          b: number,
          c: number,
          d: number
        ): number => {
          t /= d / 2;
          if (t < 1) return (c / 2) * t * t + b;
          t--;
          return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animateScroll);
      }
    };

    if (pathname === "/") {
      // Already on home page - scroll immediately
      // Add small delay to ensure mobile menu closes first
      setTimeout(performScroll, 100);
    } else {
      // Navigate to home page first
      router.push("/");

      // Wait for navigation to complete
      const checkAndScroll = () => {
        // Check if we're on the home page and footer exists
        if (
          window.location.pathname === "/" &&
          document.getElementById("footer")
        ) {
          performScroll();
        } else {
          // Keep checking until conditions are met
          setTimeout(checkAndScroll, 100);
        }
      };

      // Start checking after navigation
      setTimeout(checkAndScroll, 300);
    }
  }, [pathname, router]);

  // Handle scroll to footer when landing on home page with hash
  useEffect(() => {
    if (pathname === "/" && window.location.hash === "#footer") {
      // Wait for page to fully load
      const handleHashScroll = () => {
        const footer = document.getElementById("footer");
        if (footer) {
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

          if (isMobile || isTablet) {
            // Use the same mobile scrolling logic
            const footerRect = footer.getBoundingClientRect();
            const footerTop = footerRect.top + window.pageYOffset;
            const targetPosition = Math.max(0, footerTop - 20);

            // Smooth scroll to target
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          } else {
            footer.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      };

      // Multiple fallbacks to ensure it works
      const timeouts = [500, 1000, 1500];
      timeouts.forEach((delay) => {
        setTimeout(handleHashScroll, delay);
      });

      // Also try on window load
      if (document.readyState === "complete") {
        setTimeout(handleHashScroll, 100);
      } else {
        window.addEventListener(
          "load",
          () => {
            setTimeout(handleHashScroll, 100);
          },
          { once: true }
        );
      }
    }
  }, [pathname]);

  // Search functionality
  const handleSearch = useCallback(
    async (query: string, isMobile = false) => {
      if (!query.trim()) return;

      setIsSearching(true);

      try {
        // Navigate to home page with search query
        const searchRoute = `/?q=${encodeURIComponent(query)}`;
        router.push(searchRoute);

        // Close mobile menu if search was from mobile
        if (isMobile) {
          setMobileMenuOpen(false);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [router]
  );

  // Handle desktop search form submission
  const handleDesktopSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Handle mobile search form submission
  const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(mobileSearchQuery, true);
  };

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMobileSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMobileSearchQuery(e.target.value);
  };

  // Handle search with Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const handleMobileSearchKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch(mobileSearchQuery, true);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setMobileSearchQuery("");
    // Navigate to home page without search params
    router.push("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg shadow-lg border-b border-white/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Mobile Hamburger (visible on small screens) or Logo (visible on large screens) */}
          <div className="flex items-center">
            {/* Mobile Hamburger - Show on small and medium screens */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden rounded-full bg-gray-50 hover:bg-gray-100 transition-colors mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* LOGO - Hidden on small screens, visible on large screens */}
            <Link
              href="/"
              className="hidden xl:flex items-center gap-2 relative"
            >
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

          {/* SEARCH BAR - Only on desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleDesktopSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-4 pr-20 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <Search
                    className={`w-4 h-4 text-gray-400 ${
                      isSearching ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </form>
          </div>

          {/* DESKTOP NAVIGATION - Only for larger screens */}
          <nav className="hidden xl:flex gap-1 items-center">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 group ${
                  pathname === href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      pathname === href
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                  />
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

            {/* Contact - Desktop only */}
            <button
              onClick={scrollToFooter}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              <span>Contact</span>
            </button>

            {/* Purchases - Desktop only, show if signed in */}
            {isSignedIn && (
              <Link
                href="/purchases"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <Package size={16} />
                <span>Purchases</span>
              </Link>
            )}
          </nav>

          {/* RIGHT SIDE - Cart and Auth (Always visible) */}
          <div className="flex items-center gap-3">
            {/* Cart - Always visible */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="text-gray-700" size={20} />
              {!isLoading && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth - Always visible */}
            <div className="flex items-center">
              {isSignedIn ? (
                <div className="scale-90">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-colors text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-9 rounded-full font-medium shadow-sm"
                  >
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">Sign In</span>
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            {/* Search Bar - Mobile/Tablet */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form onSubmit={handleMobileSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={mobileSearchQuery}
                  onChange={handleMobileSearchInputChange}
                  onKeyPress={handleMobileSearchKeyPress}
                  className="w-full pl-4 pr-20 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {mobileSearchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching || !mobileSearchQuery.trim()}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Search
                      className={`w-4 h-4 text-gray-400 ${
                        isSearching ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </form>
            </div>

            {/* Navigation Links */}
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
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        pathname === href ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Contact - Mobile/Tablet */}
              <button
                onClick={scrollToFooter}
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 text-left border-l-4 border-transparent transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span>Contact Us</span>
              </button>

              {/* Purchases - Mobile/Tablet, show if signed in */}
              {isSignedIn && (
                <Link
                  href="/purchases"
                  className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 border-l-4 border-transparent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5 text-gray-400" />
                  <span>My Purchases</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
