'use client';

import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  theme?: 'auto' | 'light' | 'dark' | 'footer';
}

export default function Logo({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  theme = 'auto'
}: LogoProps) {
  const { highContrast } = useAccessibility();

  // Dimensions based on size variant
  const sizeConfig = {
    sm: {
      iconSize: 28,
      textSize: 'text-base',
      taglineSize: 'text-[9px]',
      gap: 'gap-2'
    },
    md: {
      iconSize: 36,
      textSize: 'text-lg',
      taglineSize: 'text-[10px]',
      gap: 'gap-2.5'
    },
    lg: {
      iconSize: 48,
      textSize: 'text-2xl',
      taglineSize: 'text-xs',
      gap: 'gap-3.5'
    },
    xl: {
      iconSize: 60,
      textSize: 'text-3xl',
      taglineSize: 'text-sm',
      gap: 'gap-4'
    }
  }[size];

  return (
    <div className={`flex items-center ${sizeConfig.gap} select-none ${className}`}>
      {/* Bespoke Vector Mark: Aerodynamic Velocity Loop & Interconnected Transit Node */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Velocity Track Gradient */}
            <linearGradient id="logo-track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Inner Ring Glow Gradient */}
            <linearGradient id="logo-glow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Outer Hex/Circle Shield Background */}
            <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={highContrast ? "#1E293B" : "#EFF6FF"} />
              <stop offset="100%" stopColor={highContrast ? "#0F172A" : "#DBEAFE"} />
            </linearGradient>
          </defs>

          {/* Hexagonal Rounded Badge Shield */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill="url(#logo-bg-grad)"
            stroke={highContrast ? "#38BDF8" : "#93C5FD"}
            strokeWidth="3"
          />

          {/* Outer Curved Aerodynamic Track Line */}
          <path
            d="M 22,64 C 22,34 44,22 76,22"
            stroke="url(#logo-track-grad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Intersecting Reciprocal Return Track Line */}
          <path
            d="M 78,36 C 78,66 56,78 24,78"
            stroke="url(#logo-glow-grad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* High-Speed Center Transit Corridor (Geodesic Bridge) */}
          <path
            d="M 26,62 L 74,38"
            stroke={highContrast ? "#FFFFFF" : "#1E293B"}
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Core Kinetic Hub Nodes */}
          {/* Node 1: Airport/Origin Junction */}
          <circle cx="24" cy="63" r="7.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="24" cy="63" r="2.5" fill="#FFFFFF" />

          {/* Node 2: Central Express Hub */}
          <circle cx="50" cy="50" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />

          {/* Node 3: Waterfront/Destination Junction */}
          <circle cx="76" cy="37" r="7.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="76" cy="37" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography Brandmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight flex items-baseline ${sizeConfig.textSize}`}>
            <span className={
              theme === 'footer'
                ? 'text-white sm:text-slate-900 sm:dark:text-white'
                : theme === 'dark'
                  ? 'text-white'
                  : highContrast
                    ? 'text-white'
                    : 'text-slate-900 dark:text-white'
            }>
              METRO
            </span>
            <span className={
              theme === 'footer'
                ? 'text-sky-400 sm:text-blue-600 sm:dark:text-sky-400 font-extrabold ml-1'
                : theme === 'dark'
                  ? 'text-sky-400 font-extrabold ml-1'
                  : 'text-blue-600 dark:text-sky-400 font-extrabold ml-1'
            }>
              PULSE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 mb-0.5 animate-pulse"></span>
          </div>
          {showTagline && (
            <span className={`font-semibold tracking-wider uppercase mt-0.5 ${sizeConfig.taglineSize} ${
              theme === 'footer'
                ? 'text-slate-300 sm:text-slate-500 sm:dark:text-slate-400'
                : theme === 'dark'
                  ? 'text-slate-300'
                  : highContrast
                    ? 'text-slate-400'
                    : 'text-slate-500 dark:text-slate-400'
            }`}>
              Metropolitan Rapid Transit
            </span>
          )}
        </div>
      )}
    </div>
  );
}
