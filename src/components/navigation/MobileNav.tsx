'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Home, Navigation2, Map as MapIcon, Mic, AlertCircle, User } from 'lucide-react';

export default function MobileNav() {
  const { activeScreen, setActiveScreen, user } = useTransit();
  const { setVoiceSimOpen, setEmergencyOpen } = useAccessibility();

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe px-2 py-1.5 transition-all shadow-lg"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all ${
            activeScreen === 'home'
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Navigate to Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium tracking-tight">Home</span>
        </button>

        {/* Journey */}
        <button
          onClick={() => setActiveScreen('journey')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all ${
            activeScreen === 'journey'
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Navigate to Journey Details"
        >
          <Navigation2 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium tracking-tight">Journey</span>
        </button>

        {/* Center: Voice Assistant & Search */}
        <button
          onClick={() => setVoiceSimOpen(true)}
          className="flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all group"
          aria-label="Open Voice Search"
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-0.5">
            <Mic className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-blue-600">Voice</span>
        </button>

        {/* Live Map */}
        <button
          onClick={() => setActiveScreen('map')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all ${
            activeScreen === 'map'
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Navigate to Live Map"
        >
          <MapIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium tracking-tight">Live Map</span>
        </button>

        {/* Commuter Account / Sign In */}
        <button
          onClick={() => setActiveScreen('login')}
          className={`flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all ${
            activeScreen === 'login'
              ? 'text-blue-600 bg-blue-50 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-label="Commuter Account"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px] mb-0.5">
              {user.name.charAt(0)}
            </div>
          ) : (
            <User className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[11px] font-medium tracking-tight truncate max-w-[50px]">
            {user ? user.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
}
