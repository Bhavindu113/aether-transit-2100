'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Eye, 
  Type, 
  BookOpen, 
  Mic, 
  X, 
  Accessibility
} from 'lucide-react';

export default function AccessibilitySuite() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    plainLanguage,
    fontSize,
    toggleHighContrast,
    togglePlainLanguage,
    setFontSize,
    setVoiceSimOpen
  } = useAccessibility();

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      <aside 
        aria-label="Accessibility tools"
        className="fixed bottom-20 md:bottom-6 right-4 z-30"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Open Accessibility Options"
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-md transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
            <Accessibility className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {plainLanguage ? "Easy Reading" : "Accessibility"}
          </span>
          {(highContrast || plainLanguage || fontSize !== 'standard') && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Custom accessibility settings active"></span>
          )}
        </button>
      </aside>

      {/* Accessibility Control Panel Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility Settings"
            className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl shadow-xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {plainLanguage ? "Reading & Accessibility Helpers" : "Accessibility Settings"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {plainLanguage ? "Make this screen easier to read and use" : "Tailor legibility, contrast, and guidance to your needs"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close accessibility suite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls Stack */}
            <div className="py-4 space-y-4">
              {/* 1. High Contrast */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between">
                <div className="flex items-start space-x-3 pr-2">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      High Contrast Dark Mode
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {plainLanguage ? "Turns the full website into dark mode with bright easy-to-read words" : "Transforms the entire website into high-contrast dark mode with bright text"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 focus:outline-none ${
                    highContrast ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  aria-pressed={highContrast}
                  aria-label="Toggle High Contrast Mode"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                      highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Plain Language */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between">
                <div className="flex items-start space-x-3 pr-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {plainLanguage ? "Plain & Simple Words" : "Plain Language Mode"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {plainLanguage ? "Replaces technical jargon with friendly, everyday words" : "Translates transit terms into simple everyday language"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={togglePlainLanguage}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 focus:outline-none ${
                    plainLanguage ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  aria-pressed={plainLanguage}
                  aria-label="Toggle Plain Language Mode"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                      plainLanguage ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Font Size Scaling */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-2.5 mb-3">
                  <Type className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">
                    {plainLanguage ? "Text Size" : "Font Size Scaling"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFontSize('standard')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                      fontSize === 'standard'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`py-2 px-3 rounded-lg text-sm font-bold border text-center transition-all ${
                      fontSize === 'large'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`py-2 px-3 rounded-lg text-base font-bold border text-center transition-all ${
                      fontSize === 'xlarge'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Extra Large
                  </button>
                </div>
              </div>

              {/* 4. Voice Assistant Quick Launch */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {plainLanguage ? "Voice Helper" : "Voice Transit Assistant"}
                    </div>
                    <div className="text-xs text-slate-600">
                      {plainLanguage ? "Ask for routes or help using voice" : "Hands-free spoken trip guidance"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setVoiceSimOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  {plainLanguage ? "Open" : "Launch"}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Universal Accessibility Standard</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
