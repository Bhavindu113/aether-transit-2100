'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Train, MapPin } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  location: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/metro_express.jpg',
    title: 'Metro Blue Line Express',
    subtitle: 'High-frequency electric rail connecting Airport & Downtown every 4 minutes.',
    tag: '100% On-Time Corridor',
    location: 'Airport River Bridge'
  },
  {
    id: 2,
    image: '/images/station_terminal.jpg',
    title: 'Grand Central Station Terminal',
    subtitle: 'Sunlit modern concourse with 100% level boarding, elevators, and step-free access.',
    tag: 'Barrier-Free Hub',
    location: 'Central Concourse'
  },
  {
    id: 3,
    image: '/images/electric_bus.jpg',
    title: 'Zero-Emission City Fleet',
    subtitle: 'Quiet, accessible low-floor electric buses serving everyday neighborhood avenues.',
    tag: 'Clean Air Fleet',
    location: 'City Center Boulevard'
  }
];

export default function TransitSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slideshow every 5 seconds (pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div 
      className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200/90 shadow-sm mb-6 transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="City Transit Gallery Slideshow"
    >
      {/* Slides Viewport */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden bg-slate-100">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Photo with 100% full opacity */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center opacity-100 transition-transform duration-1000 scale-100 hover:scale-105"
              />

              {/* Subtle bottom vignette to ensure caption card contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* Glass Caption Card (Frosted Glass with dark, highly readable text) */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-20">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      <span>{slide.tag}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{slide.location}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Prev / Next Navigation Buttons (Frosted Glass, subtle, calm) */}
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 shadow-md backdrop-blur-md transition-all active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 shadow-md backdrop-blur-md transition-all active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 right-4 z-30 hidden sm:flex items-center space-x-1.5 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-md">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIdx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
