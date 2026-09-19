'use client';

import React from 'react';
import { RouteOption } from '../../types/transit';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Zap, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  Repeat, 
  Plane, 
  Train, 
  Bus, 
  Waypoints 
} from 'lucide-react';

interface RouteCardProps {
  route: RouteOption;
}

export default function RouteCard({ route }: RouteCardProps) {
  const { setSelectedRoute, setActiveScreen } = useTransit();
  const { t, plainLanguage } = useAccessibility();

  const handleSelectJourney = () => {
    setSelectedRoute(route);
    setActiveScreen('journey');
  };

  const renderModeIcon = (mode: string) => {
    switch (mode) {
      case 'skycab':
        return <Plane className="w-3.5 h-3.5 text-blue-600" />;
      case 'maglev':
        return <Train className="w-3.5 h-3.5 text-indigo-600" />;
      case 'pod':
      case 'smartroad':
        return <Bus className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Waypoints className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 overflow-hidden ${
        route.isAiRecommended
          ? 'bg-white border-2 border-blue-500/60 shadow-md ring-1 ring-blue-500/20'
          : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
      } p-5 sm:p-6 group`}
    >
      {/* Recommended Route Badge */}
      {route.isAiRecommended && (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold mb-3">
          <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{plainLanguage ? "Fastest Recommended Route" : "Fastest Route • Recommended"}</span>
        </div>
      )}

      {/* Main Header: Route Name & Fare */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
            <span>{plainLanguage ? route.plainName : route.name}</span>
          </h3>
          <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 font-medium">
            <span>{route.tagline}</span>
            <span className="text-slate-400">•</span>
            <span className="font-bold text-blue-700">
              {route.departureTime} → {route.arrivalTime} ({t('ETA')})
            </span>
          </div>
        </div>

        {/* Fare Pill */}
        <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-500">
            {plainLanguage ? "Fare" : "Transit Fare"}
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-0.5 justify-end">
            <span>$</span>
            <span>{route.priceCredits.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Modes Sequence Pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {route.modesSequence.map((mode, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
              {renderModeIcon(mode)}
              <span className="capitalize">{mode === 'skycab' ? 'Airport Express' : mode === 'maglev' ? 'Metro Rail' : mode === 'pod' ? 'Shuttle' : 'Streetcar'}</span>
            </div>
            {idx < route.modesSequence.length - 1 && (
              <span className="text-slate-400 font-mono text-xs">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-slate-100 mb-5">
        {/* Travel Time */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('Travel time')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {route.totalDurationMinutes} <span className="text-xs font-normal text-slate-500">min</span>
          </div>
        </div>

        {/* Number of Transfers */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Repeat className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('Transfers')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {route.transfersCount === 0 ? 'Direct' : `${route.transfersCount} transfer`}
          </div>
        </div>

        {/* Carbon Reduction */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('Carbon reduction')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-700">
            -{route.carbonReductionPercent}% <span className="text-xs font-normal text-slate-500">clean</span>
          </div>
        </div>

        {/* Accessibility Rating */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{plainLanguage ? "Accessibility" : "Step-Free"}</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-800">
            {route.accessibilityScorePercent}% <span className="text-xs font-normal text-slate-500">{t('Barrier Free')}</span>
          </div>
        </div>
      </div>

      {/* Action Footer: "View Journey" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>
            {plainLanguage
              ? "All stations have flat boarding and elevators"
              : "100% Step-Free Station Boarding Verified"}
          </span>
        </div>

        <button
          onClick={handleSelectJourney}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow flex items-center justify-center space-x-2 group/btn"
        >
          <span>View Journey</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
