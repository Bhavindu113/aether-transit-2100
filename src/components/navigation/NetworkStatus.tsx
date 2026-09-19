'use client';

import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function NetworkStatus() {
  const { t } = useAccessibility();

  return (
    <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-600">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      <span className="text-[11px] font-medium text-slate-600">
        All lines on-time (99.4%)
      </span>
    </div>
  );
}
