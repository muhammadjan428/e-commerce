'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Billboard {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  billboards: Billboard[];
  selectedCategoryId?: string;
}

export default function PublicBillboardDisplay({ billboards, selectedCategoryId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter billboards based on selected category from page
  const filteredBillboards = selectedCategoryId 
    ? billboards.filter(billboard => billboard.category._id === selectedCategoryId)
    : billboards;

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategoryId]);

  // Auto-rotate billboards every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || filteredBillboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBillboards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredBillboards.length, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredBillboards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBillboards.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get current category name for display
  const currentCategoryName = selectedCategoryId 
    ? billboards.find(b => b.category._id === selectedCategoryId)?.category.name || 'Unknown'
    : 'All Categories';

  // Show fallback if no billboards
  if (!billboards || billboards.length === 0) {
    return (
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Our Store</h2>
          <p className="text-lg opacity-90">Discover amazing products and deals</p>
        </div>
      </div>
    );
  }

  // Show fallback if no billboards in selected category
  if (filteredBillboards.length === 0) {
    return (
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-2">No Billboards Available</h2>
          <p className="text-lg opacity-90">
            No promotional content for <span className="font-semibold">{currentCategoryName}</span> category yet
          </p>
        </div>
      </div>
    );
  }

  const currentBillboard = filteredBillboards[currentIndex];

  return (
    <div className="w-full">
      {/* Billboard Display */}
      <div 
        className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-lg group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Billboard Image Background */}
        <div className="relative w-full h-full">
          {currentBillboard.imageUrl ? (
            <Image
              src={currentBillboard.imageUrl}
              alt={currentBillboard.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              onError={(e) => {
                console.error('Failed to load billboard image:', currentBillboard.imageUrl);
                // Fallback to a placeholder or gradient background
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
                {currentBillboard.title}
              </h1>
              {currentBillboard.description && (
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto drop-shadow-lg">
                  {currentBillboard.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {filteredBillboards.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30"
              aria-label="Previous billboard"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/30"
              aria-label="Next billboard"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}