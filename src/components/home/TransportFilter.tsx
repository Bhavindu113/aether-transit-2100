'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TransportMode } from '../../types/transit';
import { Bus, Train, Plane, Waypoints, Layers } from 'lucide-react';

interface FilterItem {
  id: TransportMode;
  label: string;
  plainLabel: string;
  icon: React.ElementType;
}

export default function TransportFilter() {
  const { selectedMode, setSelectedMode } = useTransit();
  const { plainLanguage } = useAccessibility();

  const filters: FilterItem[] = [
    { id: 'all', label: 'All Modes', plainLabel: 'All Transit Ways', icon: Layers },
    { id: 'skycab', label: 'Airport Express', plainLabel: 'Airport Express Link', icon: Plane },
    { id: 'maglev', label: 'Metro & Regional Rail', plainLabel: 'Metro Trains', icon: Train },
    { id: 'pod', label: 'Electric City Bus', plainLabel: 'City Buses', icon: Bus },
    { id: 'smartroad', label: 'Downtown Tram', plainLabel: 'Local Streetcar Tram', icon: Waypoints }
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {plainLanguage ? "Filter by Vehicle Type:" : "Filter by Transit Mode:"}
        </span>
        <span className="text-[11px] text-emerald-700 font-semibold">
          100% Zero-Emission Fleet
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {filters.map(filter => {
          const Icon = filter.icon;
          const isActive = selectedMode === filter.id;

          return (
            <button
              key={filter.id}
              onClick={() => setSelectedMode(filter.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{plainLanguage ? filter.plainLabel : filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
