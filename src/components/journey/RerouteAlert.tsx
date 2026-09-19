'use client';

import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AlertTriangle, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function RerouteAlert() {
  const { activeAlert, isRecalculating, recalculateBetterRoute, hasRerouted } = useTransit();
  const { t, plainLanguage } = useAccessibility();

  if (!activeAlert && !hasRerouted) return null;

  if (hasRerouted) {
    return (
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {t('Recalculation complete')}
              </div>
              <div className="text-xs text-emerald-800 font-medium mt-0.5">
                {plainLanguage
                  ? "You are now on the faster alternative route that saves 6 minutes."
                  : "Switched to Airport Express Link. Saved 6 minutes on your journey."}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            OPTIMIZED
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Alert Icon & Text */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 mt-0.5 sm:mt-0 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{t('Traffic conditions changed')}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
                +6 MIN DELAY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              {t('Your current route may take 6 minutes longer.')}
            </p>
          </div>
        </div>

        {/* Action Button: Find a better route */}
        <button
          onClick={recalculateBetterRoute}
          disabled={isRecalculating}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-75"
        >
          {isRecalculating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('Recalculating optimal vector...')}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-white" />
              <span>{t('Find a better route')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
