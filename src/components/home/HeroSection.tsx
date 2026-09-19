'use client';

import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Clock, ShieldCheck, Leaf, Users } from 'lucide-react';

export default function HeroSection() {
  const { t, plainLanguage } = useAccessibility();

  return (
    <div className="relative pt-2 pb-6 md:pt-4 md:pb-8 text-left">
      {/* Top Tagline / Category */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>
          {plainLanguage ? "Public Transit For Everyone" : "Smart Metropolitan Commuter Navigator"}
        </span>
      </div>

      {/* Main Heading with dark crisp letters */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
        {t('Everyday Transit, Made Effortless.')}
      </h1>

      {/* Supporting Text */}
      <p className="max-w-2xl text-sm sm:text-base text-slate-600 font-normal leading-relaxed mb-6">
        {plainLanguage
          ? "Find the fastest, easiest way to travel across your city. Real-time metro, bus, and train times with step-free accessibility for everyone."
          : "Plan your urban journeys with real-time arrivals, live fleet tracking, and 100% accessible barrier-free corridors across the metropolitan transit network."}
      </p>

      {/* Key Transit Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl pt-1">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{plainLanguage ? "Avg Wait Time" : "Service Frequency"}</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900">Every 3-5 <span className="text-xs text-slate-500 font-normal">min</span></div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{plainLanguage ? "Clean Energy" : "Zero Emissions"}</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-700">100% <span className="text-xs text-slate-500 font-normal">Electric</span></div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{plainLanguage ? "Accessibility" : "Step-Free Stations"}</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-800">100% <span className="text-xs text-slate-500 font-normal">Accessible</span></div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{plainLanguage ? "Daily Commuters" : "Daily Ridership"}</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-blue-900">2.4M <span className="text-xs text-slate-500 font-normal">riders</span></div>
        </div>
      </div>
    </div>
  );
}
