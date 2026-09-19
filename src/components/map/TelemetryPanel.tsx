'use client';

import React from 'react';
import { VehicleTelemetry } from '../../types/telemetry';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Plane, 
  Train, 
  Bus, 
  Gauge, 
  BatteryCharging, 
  Navigation, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Thermometer, 
  Users, 
  X
} from 'lucide-react';

interface TelemetryPanelProps {
  vehicle: VehicleTelemetry;
  onClose?: () => void;
}

export default function TelemetryPanel({ vehicle, onClose }: TelemetryPanelProps) {
  const { t, plainLanguage, highContrast } = useAccessibility();

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'AIR':
        return {
          border: highContrast ? 'border-blue-800' : 'border-blue-200',
          text: highContrast ? 'text-blue-400' : 'text-blue-700',
          bg: highContrast ? 'bg-blue-950/70' : 'bg-blue-50',
          label: 'AIRPORT EXPRESS'
        };
      case 'RAIL':
        return {
          border: highContrast ? 'border-indigo-800' : 'border-indigo-200',
          text: highContrast ? 'text-indigo-400' : 'text-indigo-700',
          bg: highContrast ? 'bg-indigo-950/70' : 'bg-indigo-50',
          label: 'METRO RAIL'
        };
      case 'ROAD':
        return {
          border: highContrast ? 'border-emerald-800' : 'border-emerald-200',
          text: highContrast ? 'text-emerald-400' : 'text-emerald-700',
          bg: highContrast ? 'bg-emerald-950/70' : 'bg-emerald-50',
          label: 'CITY TRANSIT'
        };
      default:
        return {
          border: highContrast ? 'border-blue-800' : 'border-blue-200',
          text: highContrast ? 'text-blue-400' : 'text-blue-700',
          bg: highContrast ? 'bg-blue-950/70' : 'bg-blue-50',
          label: 'TRANSIT LINE'
        };
    }
  };

  const domainStyle = getDomainColor(vehicle.domain);

  const formatCountdown = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`border ${domainStyle.border} rounded-2xl p-5 relative overflow-hidden transition-all duration-300 shadow-sm ${
      highContrast ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Top Header */}
      <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
        highContrast ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${domainStyle.bg} ${domainStyle.text} border ${domainStyle.border}`}>
            {vehicle.domain === 'AIR' && <Plane className="w-5 h-5" />}
            {vehicle.domain === 'RAIL' && <Train className="w-5 h-5" />}
            {vehicle.domain === 'ROAD' && <Bus className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${domainStyle.bg} ${domainStyle.text} ${domainStyle.border}`}>
                {domainStyle.label}
              </span>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${
                highContrast ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ACTIVE
              </span>
            </div>
            <h3 className={`text-lg font-bold tracking-tight ${
              highContrast ? 'text-white' : 'text-slate-900'
            }`}>
              {plainLanguage ? vehicle.plainCallsign : vehicle.callsign}
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              highContrast ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            aria-label="Close vehicle status"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Required Telemetry Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Speed */}
        <div className={`p-3 rounded-xl border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs mb-1 font-semibold ${
            highContrast ? 'text-slate-300' : 'text-slate-500'
          }`}>
            <Gauge className={`w-3.5 h-3.5 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>{t('Speed')}</span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold flex items-baseline gap-1 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <span>{vehicle.speedKmH}</span>
            <span className={`text-xs font-normal ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>km/h</span>
          </div>
        </div>

        {/* Distance */}
        <div className={`p-3 rounded-xl border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs mb-1 font-semibold ${
            highContrast ? 'text-slate-300' : 'text-slate-500'
          }`}>
            <Navigation className={`w-3.5 h-3.5 ${highContrast ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span>{t('Distance')}</span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold flex items-baseline gap-1 ${
            highContrast ? 'text-white' : 'text-slate-900'
          }`}>
            <span>{vehicle.distanceRemainingKm}</span>
            <span className={`text-xs font-normal ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>km</span>
          </div>
        </div>

        {/* Arrival ETA Countdown */}
        <div className={`p-3 rounded-xl border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs mb-1 font-semibold ${
            highContrast ? 'text-slate-300' : 'text-slate-500'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${highContrast ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>{t('Arrival')}</span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${
            highContrast ? 'text-amber-400' : 'text-amber-800'
          }`}>
            {formatCountdown(vehicle.etaCountdownMinutes, vehicle.etaCountdownSeconds)}
          </div>
        </div>

        {/* Power Level */}
        <div className={`p-3 rounded-xl border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className={`flex items-center space-x-1.5 text-xs mb-1 font-semibold ${
            highContrast ? 'text-slate-300' : 'text-slate-500'
          }`}>
            <BatteryCharging className={`w-3.5 h-3.5 ${highContrast ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>{t('Power')}</span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold flex items-baseline gap-1 ${
            highContrast ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            <span>{vehicle.powerLevelPercent}%</span>
            <span className={`text-xs font-normal ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Electric</span>
          </div>
        </div>
      </div>

      {/* Next Hub Bar */}
      <div className={`p-3 rounded-xl border mb-4 flex items-center justify-between transition-colors ${
        highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <MapPin className={`w-4 h-4 flex-shrink-0 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-xs font-semibold ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>{t('Next Hub')}:</span>
          <span className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {plainLanguage ? vehicle.plainNextHub : vehicle.nextHub}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          highContrast ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          TRACK 01
        </span>
      </div>

      {/* Cabin & Passenger Stats */}
      <div className={`grid grid-cols-2 gap-2 text-xs mb-4 font-medium`}>
        <div className={`flex items-center space-x-1.5 p-2 rounded-lg border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
        }`}>
          <Thermometer className={`w-3.5 h-3.5 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`} />
          <span>{t('Cabin Climate')}: <strong className={highContrast ? 'text-white' : 'text-slate-900'}>{vehicle.cabinTempCelsius}°C</strong></span>
        </div>
        <div className={`flex items-center space-x-1.5 p-2 rounded-lg border transition-colors ${
          highContrast ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
        }`}>
          <Users className={`w-3.5 h-3.5 ${highContrast ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <span>{t('Passenger Load')}: <strong className={highContrast ? 'text-white' : 'text-slate-900'}>{vehicle.passengerOccupancyPercent}%</strong></span>
        </div>
      </div>

      {/* Barrier-Free Accessibility Compliance */}
      <div className={`pt-3 border-t ${highContrast ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className={`flex items-center space-x-1.5 text-xs font-bold mb-2 ${
          highContrast ? 'text-amber-400' : 'text-amber-800'
        }`}>
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>{plainLanguage ? "Accessibility Features on this Vehicle:" : "Verified Barrier-Free Equipment:"}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {vehicle.barrierFreeFeatures.map((feat, idx) => (
            <div key={idx} className={`text-[11px] font-medium flex items-center gap-1.5 ${
              highContrast ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
