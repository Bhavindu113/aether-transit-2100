'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  AlertCircle, 
  PhoneCall, 
  ShieldAlert, 
  X, 
  CheckCircle
} from 'lucide-react';

export default function EmergencyModal() {
  const { emergencyOpen, setEmergencyOpen, plainLanguage, t } = useAccessibility();
  const [status, setStatus] = useState<'activating' | 'connecting' | 'connected'>('activating');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!emergencyOpen) {
      setStatus('activating');
      setElapsedSeconds(0);
      return;
    }

    // Progression of emergency simulation
    const t1 = setTimeout(() => {
      setStatus('connecting');
    }, 1000);

    const t2 = setTimeout(() => {
      setStatus('connected');
    }, 2800);

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, [emergencyOpen]);

  if (!emergencyOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setEmergencyOpen(false)}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Passenger Assistance"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500"></div>

        {/* Close Button */}
        <button
          onClick={() => setEmergencyOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close emergency modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Central Pulse Beacon Icon */}
        <div className="flex flex-col items-center text-center my-4">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center">
              {status === 'connected' ? (
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-rose-600 animate-pulse" />
              )}
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">
            {t('Passenger Assistance & SOS')}
          </h2>

          {/* Status Description */}
          {status === 'activating' && (
            <p className="text-sm text-rose-700 font-semibold">
              Connecting to Transit Operations & Station Staff...
            </p>
          )}

          {status === 'connecting' && (
            <p className="text-sm text-amber-700 font-semibold animate-pulse">
              Connecting with Station Duty Officer...
            </p>
          )}

          {status === 'connected' && (
            <div className="space-y-1">
              <div className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Connected: Station Staff & Security Active</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Live intercom connected. A station attendant is on their way to assist you.
              </p>
            </div>
          )}
        </div>

        {/* Real-time Location Stamp */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 my-5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 font-semibold">
            <span>CURRENT STATION:</span>
            <span className="text-slate-900 font-bold">Grand Central Station (Platform 2)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 font-semibold">
            <span>GPS LOCATION:</span>
            <span className="text-slate-800 font-mono">40.7527° N, 73.9772° W</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 font-semibold">
            <span>CALL DURATION:</span>
            <span className="text-blue-700 font-bold">00:{String(elapsedSeconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setEmergencyOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold border border-slate-300 transition-all text-center"
          >
            {plainLanguage ? "Cancel (I am okay)" : "Cancel Assistance"}
          </button>

          <button
            onClick={() => alert("Simulated 2-way audio intercom active. Speak directly into your device microphone.")}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{plainLanguage ? "Speak to Attendant" : "Open Intercom Line"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
