'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import NetworkStatus from './NetworkStatus';
import Logo from '../brand/Logo';
import { 
  Train, 
  Clock, 
  HelpCircle,
  Home,
  Navigation2,
  Map as MapIcon,
  Mic,
  User
} from 'lucide-react';

export default function Header() {
  const { activeScreen, setActiveScreen, currentTimeString, user, logout } = useTransit();
  const { setVoiceSimOpen, setEmergencyOpen } = useAccessibility();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between flex-nowrap gap-2 sm:gap-4">
        
        {/* Left: Professional Brand Identity */}
        <div className="flex items-center flex-shrink-0">
          <button 
            onClick={() => setActiveScreen('home')}
            className="flex items-center text-left group focus:outline-none"
            aria-label="MetroPulse Home"
          >
            <Logo size="md" showTagline={false} />
          </button>
        </div>

        {/* Center: Calm Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeScreen === 'home'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 opacity-80" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveScreen('journey')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeScreen === 'journey'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Navigation2 className="w-3.5 h-3.5 opacity-80" />
            <span>Journey</span>
          </button>

          <button
            onClick={() => setActiveScreen('map')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeScreen === 'map'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 opacity-80" />
            <span>Live Map</span>
          </button>
        </nav>

        {/* Right: Subtle Utilities & Commuter Account in One Line */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs flex-shrink-0">
          {/* Subtle line status */}
          <NetworkStatus />

          {/* Calm Clock */}
          <div className="hidden 2xl:flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTimeString}</span>
          </div>

          {/* Voice Assistant */}
          <button
            onClick={() => setVoiceSimOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium flex-shrink-0"
            title="Voice Assistant"
            aria-label="Open Voice Transit Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden xl:inline">Voice</span>
          </button>

          {/* Help & SOS */}
          <button
            onClick={() => setEmergencyOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold flex-shrink-0"
            aria-label="Passenger Assistance and Help"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Help & SOS</span>
          </button>

          {/* Commuter Account / Sign Out - Single Clean Row */}
          {user ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2 pl-2 sm:pl-2.5 border-l border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[85px] sm:max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className="hidden xl:inline text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/40 dark:border-emerald-800/40">
                  ${user.balanceCredits.toFixed(2)}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveScreen('login')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 ${
                activeScreen === 'login'
                  ? 'bg-blue-700 text-white shadow ring-2 ring-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
