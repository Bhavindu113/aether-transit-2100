'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  MapPin, 
  Navigation, 
  ArrowUpDown, 
  Compass, 
  CheckCircle2,
  Mic,
  ArrowRight
} from 'lucide-react';

export default function JourneySearchCard() {
  const { 
    originLocation, 
    destinationLocation, 
    setOriginLocation, 
    setDestinationLocation, 
    swapLocations,
    selectQuickDestination,
    setActiveScreen
  } = useTransit();
  const { t, plainLanguage, setVoiceSimOpen } = useAccessibility();

  const suggestions = [
    'Grand Central Station',
    'Airport Terminal 1',
    'Harbor Waterfront Pier',
    'Civic Center & City Hall'
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 transition-all border border-slate-200/90 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>{plainLanguage ? "Plan Your Trip" : "Find Your Route"}</span>
        </h2>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Live GPS Active</span>
        </span>
      </div>

      {/* Input Fields Grid with Swap Button */}
      <div className="relative space-y-3">
        {/* FROM Input */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {plainLanguage ? "Starting Point" : "DEPARTURE LOCATION"}
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={originLocation}
              onChange={(e) => setOriginLocation(e.target.value)}
              placeholder="Enter starting station or address"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            type="button"
            onClick={swapLocations}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all hover:scale-105 active:scale-95 group"
            title="Swap Origin and Destination"
            aria-label="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* TO Input with Voice Search Icon */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {plainLanguage ? "Destination" : "DESTINATION LOCATION"}
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-emerald-600">
              <Navigation className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={destinationLocation}
              onChange={(e) => setDestinationLocation(e.target.value)}
              placeholder="Where do you want to go? (or tap mic)"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setVoiceSimOpen(true)}
              className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
              title="Search by voice"
              aria-label="Voice Search Destination"
            >
              <Mic className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Find Transit Routes Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setActiveScreen('journey')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 group"
          >
            <span>{plainLanguage ? "Find My Routes" : "Find Transit Routes"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <div className="text-[11px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">
          {plainLanguage ? "Popular Places:" : "Quick Destinations:"}
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => {
            const isSelected = destinationLocation === suggestion;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => selectQuickDestination(suggestion)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                <span>{t(suggestion)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
