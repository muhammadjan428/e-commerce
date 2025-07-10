"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Home, ArrowLeft, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 md:p-12 lg:p-16">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full text-red-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Page Not Found</span>
            </div>

            {/* 404 Number */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                404
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for seems to have vanished into the digital void. 
                Don't worry, even the best explorers sometimes take a wrong turn.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-8 sm:mb-10 md:mb-12">
              <Link
                href="/"
                className="group relative overflow-hidden px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="relative text-sm sm:text-base">Go Home</span>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="group relative overflow-hidden px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-white/80 text-gray-700 hover:text-blue-600 font-semibold rounded-xl sm:rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="relative text-sm sm:text-base">Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}