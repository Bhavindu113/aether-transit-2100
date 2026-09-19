'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import JourneyTimeline from './JourneyTimeline';
import RerouteAlert from './RerouteAlert';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Leaf, 
  Map as MapIcon, 
  ShieldCheck, 
  Navigation
} from 'lucide-react';

export default function JourneyDetails() {
  const { selectedRoute, destinationLocation, setActiveScreen } = useTransit();
  const { t, plainLanguage } = useAccessibility();

  return (
    <div className="py-4 max-w-4xl mx-auto">
      {/* Top back button & action */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{plainLanguage ? "Back to Routes" : "Back to Search Results"}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveScreen('map')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-all shadow-sm"
          >
            <MapIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>{plainLanguage ? "View on Live Map" : "Track Route on Live Map"}</span>
          </button>
        </div>
      </div>

      {/* Main Screen Header: "Your Journey" */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold tracking-wide uppercase mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>CityTransit Route Summary</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <span>{plainLanguage ? "Your Planned Trip" : "Your Journey Details"}</span>
        </h1>
        <div className="flex items-center text-sm text-slate-600 mt-1 font-medium">
          <MapPin className="w-4 h-4 text-emerald-600 mr-1.5" />
          <span>{plainLanguage ? "Destination:" : "Final Destination:"}</span>
          <span className="text-slate-900 font-bold ml-1.5">{destinationLocation}</span>
        </div>
      </div>

      {/* Real-time Delay / Reroute Alert Banner */}
      <RerouteAlert />

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {/* Total Journey Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('Travel time')}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {selectedRoute.totalDurationMinutes} <span className="text-xs font-normal text-slate-500">min</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {plainLanguage ? "Fastest door-to-door" : "Direct commuter corridor"}
          </div>
        </div>

        {/* Arrival Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('ETA')}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700">
            {selectedRoute.arrivalTime}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {plainLanguage ? "Estimated arrival" : "Real-time synchronized"}
          </div>
        </div>

        {/* Total Fare */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5 font-semibold">
            <span className="text-xs font-bold text-emerald-600">$</span>
            <span>{plainLanguage ? "Total Fare" : "Unified Fare"}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-0.5">
            <span>$</span>
            <span>{selectedRoute.priceCredits.toFixed(2)}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {plainLanguage ? "All transfers included" : "Contactless / City Card"}
          </div>
        </div>

        {/* Carbon Impact */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5 font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('Carbon reduction')}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700">
            -{selectedRoute.carbonReductionPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {plainLanguage ? "Clean electric travel" : "Zero-emission electric"}
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Directions Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{plainLanguage ? "Step-by-Step Directions" : "Step-by-Step Directions"}</span>
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {selectedRoute.accessibilityScorePercent}% {t('Barrier Free')}
          </span>
        </div>

        <JourneyTimeline segments={selectedRoute.segments} />
      </div>
    </div>
  );
}
