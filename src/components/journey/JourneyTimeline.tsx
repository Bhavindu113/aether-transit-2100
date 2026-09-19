'use client';

import React, { useState } from 'react';
import { JourneySegment } from '../../types/transit';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Plane, 
  Train, 
  Bus, 
  Check, 
  MapPin, 
  ArrowDown, 
  Volume2
} from 'lucide-react';

interface JourneyTimelineProps {
  segments: JourneySegment[];
}

export default function JourneyTimeline({ segments }: JourneyTimelineProps) {
  const { plainLanguage } = useAccessibility();
  const [activeSegmentId, setActiveSegmentId] = useState<string>(segments[0]?.id || '');
  const [spokenSegment, setSpokenSegment] = useState<string | null>(null);

  const renderModeIcon = (mode: string) => {
    switch (mode) {
      case 'skycab':
        return <Plane className="w-5 h-5 text-blue-600" />;
      case 'maglev':
        return <Train className="w-5 h-5 text-indigo-600" />;
      case 'pod':
      case 'smartroad':
        return <Bus className="w-5 h-5 text-emerald-600" />;
      default:
        return <Train className="w-5 h-5 text-blue-600" />;
    }
  };

  const simulateSpeech = (segment: JourneySegment) => {
    const text = `Step ${segment.stepNumber}: ${segment.title} from ${segment.fromStation} to ${segment.toStation}. Departs at ${segment.departureTime}, arrives at ${segment.arrivalTime}.`;
    setSpokenSegment(text);
    setTimeout(() => setSpokenSegment(null), 4000);
  };

  return (
    <div className="relative py-2">
      {/* Audio Announcement Toast Banner */}
      {spokenSegment && (
        <div className="mb-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center space-x-2 animate-in fade-in shadow-sm">
          <Volume2 className="w-4 h-4 text-blue-600 animate-pulse flex-shrink-0" />
          <span>{spokenSegment}</span>
        </div>
      )}

      <div className="space-y-6">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const isSelected = activeSegmentId === segment.id;

          return (
            <div key={segment.id} className="relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-6 top-16 bottom-[-24px] w-0.5 bg-slate-200 -z-0"></div>
              )}

              {/* Segment Card */}
              <div 
                onClick={() => setActiveSegmentId(segment.id)}
                className={`bg-white rounded-2xl p-4 sm:p-6 transition-all cursor-pointer relative z-10 border ${
                  isSelected 
                    ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-blue-600 font-bold leading-none mb-0.5">
                        STEP
                      </span>
                      <span className="text-base font-extrabold text-slate-900 leading-none">
                        {segment.stepNumber}
                      </span>
                    </div>
                  </div>

                  {/* Main Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                          {renderModeIcon(segment.mode)}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {plainLanguage ? segment.plainTitle : segment.title}
                        </h4>
                        {segment.lineCode && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 hidden sm:inline-block">
                            {segment.lineCode}
                          </span>
                        )}
                      </div>

                      {/* Time and Duration Badge */}
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                          {segment.departureTime} → {segment.arrivalTime}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            simulateSpeech(segment);
                          }}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 transition-colors"
                          title="Listen to audio instructions"
                          aria-label={`Listen to instructions for step ${segment.stepNumber}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* From / To Stations */}
                    <div className="flex items-center text-xs text-slate-700 mb-3 space-x-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900">{segment.fromStation}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-slate-800">{segment.toStation}</span>
                      {segment.platformOrPad && (
                        <span className="text-slate-500 pl-1 border-l border-slate-200 font-semibold">
                          ({segment.platformOrPad})
                        </span>
                      )}
                    </div>

                    {/* Accessibility Feature Tags */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 mb-2 font-bold uppercase tracking-wider">
                        {plainLanguage ? "Accessibility Features:" : "Accessibility:"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {segment.accessibilityFeatures.map((feat) => (
                          <div
                            key={feat.id}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{plainLanguage ? feat.plainLabel : feat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Transition Indicator between segments */}
              {!isLast && (
                <div className="my-2 ml-6 pl-4 flex items-center space-x-2 text-xs text-slate-600 font-medium">
                  <div className="p-1 rounded bg-white border border-slate-300 text-blue-600 shadow-sm">
                    <ArrowDown className="w-3 h-3" />
                  </div>
                  <span>
                    {plainLanguage
                      ? "Transfer step: 4 min smooth level connection (elevators available)"
                      : "Transfer connection • 4 min level walk • Elevators active"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
