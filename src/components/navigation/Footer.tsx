'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import Logo from '../brand/Logo';
import { 
  Train, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Leaf, 
  Accessibility, 
  Clock, 
  ArrowUpRight,
  User
} from 'lucide-react';

export default function Footer() {
  const { setActiveScreen } = useTransit();
  const { setVoiceSimOpen, setEmergencyOpen, toggleHighContrast } = useAccessibility();

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/90 transition-colors mt-auto">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Commitment (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => setActiveScreen('home')}
              className="text-left focus:outline-none"
              aria-label="MetroPulse Home"
            >
              <Logo size="md" showTagline={true} />
            </button>

            <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-sm">
              Making public transportation effortless, sustainable, and 100% accessible for every commuter across the metropolitan region.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Electric Fleet</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Step-Free Certified</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Transit Planner
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => setActiveScreen('home')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Home & Discovery</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('journey')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Journey Directions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('map')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Live Vehicle Map</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('login')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Passenger Account & Login</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Real-Time Timetables</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Transit Lines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Corridors & Lines
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Metro Blue Line (Airport)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Regional Rail Express</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>City Rapid Electric Bus</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Downtown Streetcar Tram</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Accessibility & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Passenger Care
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button 
                  onClick={() => setEmergencyOpen(true)}
                  className="hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>Passenger Assistance & SOS</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setVoiceSimOpen(true)}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Voice Transit Assistant</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={toggleHighContrast}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Toggle Contrast Mode</span>
                </button>
              </li>
              <li className="pt-1 text-xs text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>24/7 Hotline: 1-800-CITY-BUS</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-slate-200/80 bg-slate-50/70 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span>© 2026 Metropolitan Transit Authority.</span>
            <span>All stations barrier-free certified.</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational (99.4%)</span>
            </span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
