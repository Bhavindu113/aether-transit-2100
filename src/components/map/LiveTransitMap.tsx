'use client';

import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { VehicleTelemetry } from '../../types/telemetry';
import { TRANSIT_HUBS } from '../../data/mockHubs';
import TelemetryPanel from './TelemetryPanel';
import RealGoogleTransitMap from './RealGoogleTransitMap';
import { 
  Plane, 
  Train, 
  Bus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass,
  MapPin,
  Layers
} from 'lucide-react';

export default function LiveTransitMap() {
  const { vehicles, selectedVehicle, setSelectedVehicle } = useTransit();
  const { plainLanguage, highContrast } = useAccessibility();

  // Active layers state
  const [viewMode, setViewMode] = useState<'google' | 'schematic'>('google');
  const [showAir, setShowAir] = useState(true);
  const [showRail, setShowRail] = useState(true);
  const [showRoad, setShowRoad] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Quadratic Bezier interpolation helper
  const getBezierPoint = (p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}, tVal: number) => {
    const invT = 1 - tVal;
    const x = invT * invT * p0.x + 2 * invT * tVal * p1.x + tVal * tVal * p2.x;
    const y = invT * invT * p0.y + 2 * invT * tVal * p1.y + tVal * tVal * p2.y;
    return { x, y };
  };

  // Calculate live position of vehicles
  const getVehiclePosition = (vehicle: VehicleTelemetry) => {
    const progress = vehicle.routeCoordinates.currentProgress;
    if (vehicle.vehicleId === 'AT-204') {
      // Metro Blue Line
      return getBezierPoint({ x: 180, y: 140 }, { x: 340, y: 180 }, { x: 500, y: 320 }, progress);
    } else if (vehicle.vehicleId === 'ML-809') {
      // Regional Rail
      return getBezierPoint({ x: 500, y: 320 }, { x: 670, y: 380 }, { x: 820, y: 460 }, progress);
    } else if (vehicle.vehicleId === 'AP-114') {
      // Downtown Shuttle
      return getBezierPoint({ x: 500, y: 320 }, { x: 440, y: 440 }, { x: 380, y: 520 }, progress);
    } else {
      // University Bus
      return getBezierPoint({ x: 180, y: 140 }, { x: 210, y: 310 }, { x: 260, y: 480 }, progress);
    }
  };

  const handleSelectVehicle = (vehicle: VehicleTelemetry) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="py-2 max-w-7xl mx-auto">
      {/* Map Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1 ${highContrast ? 'text-blue-400' : 'text-blue-700'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{plainLanguage ? "Real-Time City Map" : "Live Metropolitan Transit Map"}</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {plainLanguage ? "Live City Transit Map" : "Metropolitan Transit & Live Fleet Tracker"}
          </h1>
        </div>

        {/* View Switcher & Layer Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Map View Switcher */}
          <div className={`flex items-center p-1 rounded-xl border transition-colors ${highContrast ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setViewMode('google')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'google'
                  ? highContrast ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'bg-white text-blue-700 shadow-sm'
                  : highContrast ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Real Google Map</span>
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'schematic'
                  ? highContrast ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'bg-white text-blue-700 shadow-sm'
                  : highContrast ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${highContrast ? 'text-slate-300' : 'text-slate-500'}`} />
              <span>Transit Schematic</span>
            </button>
          </div>

          {/* Schematic Layer Filters (shown in schematic mode) */}
          {viewMode === 'schematic' && (
            <>
              <button
                onClick={() => setShowAir(!showAir)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  showAir
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : highContrast ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 opacity-75'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Airport</span>
              </button>

              <button
                onClick={() => setShowRail(!showRail)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  showRail
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : highContrast ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 opacity-75'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Rail</span>
              </button>

              <button
                onClick={() => setShowRoad(!showRoad)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  showRoad
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : highContrast ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 opacity-75'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Bus</span>
              </button>

              {/* Zoom controls */}
              <div className={`flex items-center space-x-1 border-l pl-2 ${highContrast ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
                  className={`p-1.5 rounded-lg border shadow-sm transition-colors ${
                    highContrast ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                  className={`p-1.5 rounded-lg border shadow-sm transition-colors ${
                    highContrast ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className={`p-1.5 rounded-lg border shadow-sm transition-colors ${
                    highContrast ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Map Container & Telemetry Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Real Google Map OR Schematic SVG Canvas */}
        <div className="lg:col-span-7 xl:col-span-8">
          {viewMode === 'google' ? (
            <RealGoogleTransitMap />
          ) : (
            /* Vector SVG Canvas Container */
            <div className={`relative rounded-2xl overflow-hidden border shadow-sm transition-colors ${
              highContrast ? 'border-slate-800 bg-[#0B0F19]' : 'border-slate-200 bg-[#F1F5F9]'
            }`}>
          {/* Canvas Header Badge */}
          <div className={`absolute top-4 left-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-sm transition-colors ${
            highContrast ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
          }`}>
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>METRO REGIONAL TRANSIT MAP</span>
          </div>

          <div className={`absolute top-4 right-4 z-20 hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded backdrop-blur-md border text-[11px] font-bold shadow-sm transition-colors ${
            highContrast ? 'bg-slate-900/95 border-slate-700 text-slate-300' : 'bg-white/95 border-slate-200 text-slate-600'
          }`}>
            <span>CLICK A VEHICLE TO TRACK</span>
          </div>

          {/* Responsive SVG Map */}
          <div className="w-full overflow-auto flex items-center justify-center p-2 sm:p-4">
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-auto min-w-[650px] sm:min-w-full transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <defs>
                <pattern id="light-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={highContrast ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 163, 184, 0.15)"} strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background Grid Pattern */}
              <rect width="1000" height="650" fill="url(#light-grid)" />

              {/* DISTRICT POLYGONS (High contrast dark mode aware) */}
              {/* 1. Airport District */}
              <polygon
                points="80,60 300,50 320,240 100,250"
                fill={highContrast ? "#1E293B" : "#E2E8F0"}
                stroke={highContrast ? "#3B82F6" : "#94A3B8"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={highContrast ? 0.85 : 0.6}
              />
              <text x="110" y="85" fill={highContrast ? "#93C5FD" : "#1E3A8A"} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                ZONE 01: AIRPORT DISTRICT
              </text>

              {/* 2. Downtown Central District */}
              <polygon
                points="400,200 620,190 640,430 380,420"
                fill={highContrast ? "#1E1B4B" : "#E0E7FF"}
                stroke={highContrast ? "#6366F1" : "#A5B4FC"}
                strokeWidth="1.5"
                opacity={highContrast ? 0.85 : 0.6}
              />
              <text x="420" y="225" fill={highContrast ? "#C7D2FE" : "#312E81"} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                ZONE 02: DOWNTOWN FINANCIAL CORE
              </text>

              {/* 3. Harbor & Coastal Bay */}
              <polygon
                points="700,320 940,300 920,580 680,560"
                fill={highContrast ? "#064E3B" : "#D1FAE5"}
                stroke={highContrast ? "#10B981" : "#6EE7B7"}
                strokeWidth="1.5"
                opacity={highContrast ? 0.85 : 0.6}
              />
              <text x="720" y="340" fill={highContrast ? "#6EE7B7" : "#064E3B"} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                ZONE 03: HARBOR WATERFRONT
              </text>

              {/* 4. University & Tech Park */}
              <polygon
                points="120,380 340,360 320,590 100,580"
                fill={highContrast ? "#451A03" : "#FEF3C7"}
                stroke={highContrast ? "#F59E0B" : "#FCD34D"}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity={highContrast ? 0.85 : 0.6}
              />
              <text x="130" y="405" fill={highContrast ? "#FCD34D" : "#78350F"} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                ZONE 04: UNIVERSITY & TECH PARK
              </text>

              {/* TRANSIT CORRIDORS */}
              {/* SMART BUS / TRAMWAY (Emerald Line) */}
              {showRoad && (
                <g id="road-lines" opacity="0.95">
                  <path
                    d="M 180 140 Q 210 310 260 480"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 260 480 Q 320 530 380 520"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 380 520 Q 440 440 500 320"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* METRO & REGIONAL RAIL (Indigo Line) */}
              {showRail && (
                <g id="rail-lines">
                  <path
                    d="M 180 140 L 500 320"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 500 320 Q 670 380 820 460"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* AIRPORT EXPRESS LINK (Royal Blue Line) */}
              {showAir && (
                <g id="air-lines">
                  <path
                    d="M 180 140 Q 340 180 500 320"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 500 320 Q 680 240 820 460"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* TRANSIT STATIONS */}
              {TRANSIT_HUBS.map((hub) => (
                <g key={hub.id} transform={`translate(${hub.coordinates.x}, ${hub.coordinates.y})`} className="cursor-pointer">
                  <circle r="14" fill={highContrast ? "#1E293B" : "#FFFFFF"} stroke={highContrast ? "#60A5FA" : "#2563EB"} strokeWidth="3" />
                  <circle r="6" fill={highContrast ? "#94A3B8" : "#1E293B"} />
                  
                  {/* Station Name Badge */}
                  <g transform="translate(16, -11)">
                    <rect
                      x="0"
                      y="0"
                      width={hub.name.length * 7.5 + 18}
                      height="24"
                      rx="6"
                      fill={highContrast ? "#0F172A" : "#FFFFFF"}
                      stroke={highContrast ? "#475569" : "#CBD5E1"}
                      strokeWidth="1.5"
                    />
                    <text
                      x="9"
                      y="16"
                      fill={highContrast ? "#FFFFFF" : "#0F172A"}
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      {plainLanguage ? hub.plainName : hub.name}
                    </text>
                  </g>
                </g>
              ))}

              {/* MOVING VEHICLES */}
              {vehicles.map((v) => {
                if (v.domain === 'AIR' && !showAir) return null;
                if (v.domain === 'RAIL' && !showRail) return null;
                if (v.domain === 'ROAD' && !showRoad) return null;

                const pos = getVehiclePosition(v);
                const isSelected = selectedVehicle.vehicleId === v.vehicleId;

                const iconFill =
                  v.domain === 'AIR' ? '#3B82F6' : v.domain === 'RAIL' ? '#6366F1' : '#059669';

                return (
                  <g
                    key={v.vehicleId}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => handleSelectVehicle(v)}
                    className="cursor-pointer group"
                    role="button"
                    aria-label={`Select vehicle ${v.callsign}`}
                  >
                    {/* Selection Ring if Selected */}
                    {isSelected && (
                      <circle
                        r="20"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                    )}

                    {/* Vehicle Marker Node */}
                    <circle
                      r="10"
                      fill={highContrast ? "#0F172A" : "#FFFFFF"}
                      stroke={iconFill}
                      strokeWidth="3.5"
                    />

                    {/* Vehicle Callsign Tag */}
                    <g transform="translate(16, -14)">
                      <rect
                        x="0"
                        y="0"
                        width={v.callsign.length * 6.5 + 16}
                        height="20"
                        rx="5"
                        fill={highContrast ? "#0F172A" : "#FFFFFF"}
                        stroke={iconFill}
                        strokeWidth="1.5"
                      />
                      <text
                        x="7"
                        y="14"
                        fill={highContrast ? "#FFFFFF" : "#0F172A"}
                        fontSize="9.5"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {v.callsign.split(' ')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Vehicle Selector Strip at Bottom of Map */}
          <div className={`p-3 border-t flex items-center gap-2 overflow-x-auto transition-colors ${
            highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase pl-1 whitespace-nowrap ${highContrast ? 'text-slate-400' : 'text-slate-600'}`}>
              {plainLanguage ? "Pick a Vehicle:" : "Inspect Live Fleet:"}
            </span>
            {vehicles.map((v) => {
              const isSelected = selectedVehicle.vehicleId === v.vehicleId;
              return (
                <button
                  key={v.vehicleId}
                  onClick={() => handleSelectVehicle(v)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                    isSelected
                      ? highContrast ? 'bg-blue-950 text-blue-300 border-blue-700 shadow-sm' : 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                      : highContrast ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>{v.callsign}</span>
                  <span className={`text-[10px] font-normal ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>({v.speedKmH} km/h)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>

        {/* Telemetry HUD Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-20">
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${highContrast ? 'text-blue-400' : 'text-blue-700'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Live Vehicle Status</span>
              </span>
              <span className={`text-[11px] font-medium ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
                LIVE GPS UPDATE
              </span>
            </div>

            <TelemetryPanel vehicle={selectedVehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}
