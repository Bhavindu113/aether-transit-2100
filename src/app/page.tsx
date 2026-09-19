'use client';

import React from 'react';
import { useTransit } from '../context/TransitContext';
import { useAccessibility } from '../context/AccessibilityContext';
import Header from '../components/navigation/Header';
import MobileNav from '../components/navigation/MobileNav';
import HeroSection from '../components/home/HeroSection';
import TransitSlideshow from '../components/home/TransitSlideshow';
import JourneySearchCard from '../components/home/JourneySearchCard';
import TransportFilter from '../components/home/TransportFilter';
import RouteCard from '../components/home/RouteCard';
import JourneyDetails from '../components/journey/JourneyDetails';
import LiveTransitMap from '../components/map/LiveTransitMap';
import LoginPage from '../components/auth/LoginPage';
import { ArrowRight, Map as MapIcon } from 'lucide-react';

export default function App() {
  const { activeScreen, setActiveScreen, routes, selectedMode } = useTransit();
  const { t, plainLanguage } = useAccessibility();

  // Filter routes based on selectedMode
  const filteredRoutes = routes.filter((r) => {
    if (selectedMode === 'all') return true;
    return r.modesSequence.includes(selectedMode as any);
  });

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-slate-50">
      {/* Top Header */}
      <Header />

      {/* Main Responsive Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* SCREEN 1: HOME (Journey Discovery) */}
        {activeScreen === 'home' && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Section */}
            <HeroSection />

            {/* Photo Slideshow with 100% full opacity */}
            <TransitSlideshow />

            {/* Two-Column / Stacked Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Journey Search & Filters (5 cols on large screens) */}
              <div className="lg:col-span-5 space-y-4">
                <JourneySearchCard />

                {/* Quick Map Preview Teaser */}
                <div 
                  onClick={() => setActiveScreen('map')}
                  className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <MapIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {plainLanguage ? "Open Live Transit Map" : "Live Transit Map & Fleet Tracker"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {plainLanguage ? "Track trains and buses moving in real time" : "Real-time positions on metro, buses & regional rail"}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>

              {/* Right Column: Transport Mode Filters & Routes (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <TransportFilter />

                {/* Section Header */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                      {plainLanguage ? "Available Routes for You" : "Recommended Transit Routes"}
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {filteredRoutes.length} {plainLanguage ? "options" : "routes available"}
                  </span>
                </div>

                {/* Routes List */}
                <div className="space-y-4">
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route) => (
                      <RouteCard key={route.id} route={route} />
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                      <p className="text-sm">No direct routes match this filter mode.</p>
                      <button
                        onClick={() => setActiveScreen('home')}
                        className="mt-3 text-xs text-blue-600 hover:underline font-medium"
                      >
                        Reset mode filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: JOURNEY DETAILS */}
        {activeScreen === 'journey' && (
          <div className="animate-in fade-in duration-300">
            <JourneyDetails />
          </div>
        )}

        {/* SCREEN 3: LIVE MAP & FLEET TRACKER */}
        {activeScreen === 'map' && (
          <div className="animate-in fade-in duration-300">
            <LiveTransitMap />
          </div>
        )}

        {/* SCREEN 4: COMMUTER AUTHENTICATION & LOGIN */}
        {activeScreen === 'login' && (
          <div className="animate-in fade-in duration-300">
            <LoginPage />
          </div>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
