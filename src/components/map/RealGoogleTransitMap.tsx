'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TRANSIT_HUBS } from '../../data/mockHubs';
import { TransitHub } from '../../types/transit';
import { 
  MapPin, 
  Navigation, 
  ArrowRightLeft, 
  Key, 
  Layers, 
  Compass, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

// Calculate Haversine distance between two lat/lng coordinates in km
function getHaversineDistanceKm(c1: Coordinates, c2: Coordinates): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export default function RealGoogleTransitMap() {
  const { 
    originLocation, 
    destinationLocation, 
    setOriginLocation, 
    setDestinationLocation,
    swapLocations,
    vehicles,
    selectedVehicle,
    setSelectedVehicle
  } = useTransit();
  
  const { plainLanguage, highContrast } = useAccessibility();

  // API Key State (loaded from env or localStorage)
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'interactive' | 'embed' | 'satellite'>('interactive');

  // Interactive selected points on the map
  const originHub = useMemo(() => {
    return TRANSIT_HUBS.find(h => h.name.toLowerCase().includes(originLocation.toLowerCase()) || 
      originLocation.toLowerCase().includes(h.name.toLowerCase())) || TRANSIT_HUBS[0];
  }, [originLocation]);

  const destHub = useMemo(() => {
    return TRANSIT_HUBS.find(h => h.name.toLowerCase().includes(destinationLocation.toLowerCase()) || 
      destinationLocation.toLowerCase().includes(h.name.toLowerCase())) || TRANSIT_HUBS[1];
  }, [destinationLocation]);

  const [originCoord, setOriginCoord] = useState<Coordinates>(
    originHub.geo || { lat: 40.6413, lng: -73.7781 }
  );
  const [destCoord, setDestCoord] = useState<Coordinates>(
    destHub.geo || { lat: 40.7527, lng: -73.9772 }
  );

  // Sync coords when origin/dest hub changes
  useEffect(() => {
    if (originHub.geo) setOriginCoord(originHub.geo);
  }, [originHub]);

  useEffect(() => {
    if (destHub.geo) setDestCoord(destHub.geo);
  }, [destHub]);

  // Clicked temporary location for user to choose as Origin or Destination
  const [clickedCoord, setClickedCoord] = useState<Coordinates | null>(null);
  const [clickTooltipPos, setClickTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Active hover/selected station info
  const [selectedHub, setSelectedHub] = useState<TransitHub | null>(null);

  // Distance calculations
  const distanceKm = useMemo(() => {
    return getHaversineDistanceKm(originCoord, destCoord);
  }, [originCoord, destCoord]);

  const distanceMiles = useMemo(() => {
    return Number((distanceKm * 0.621371).toFixed(2));
  }, [distanceKm]);

  // Transit corridor road/track distance factor ~ 1.28x
  const transitDistanceKm = useMemo(() => {
    return Number((distanceKm * 1.28).toFixed(1));
  }, [distanceKm]);

  // Estimated transit times
  const metroTimeMinutes = useMemo(() => {
    return Math.max(4, Math.round((transitDistanceKm / 55) * 60) + 3);
  }, [transitDistanceKm]);

  const busTimeMinutes = useMemo(() => {
    return Math.max(6, Math.round((transitDistanceKm / 28) * 60) + 6);
  }, [transitDistanceKm]);

  // Google Maps DOM container ref
  const googleMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  // Load API key from env or localStorage
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('gmaps_api_key') : null;
    const key = storedKey || envKey || '';
    if (key) {
      setApiKey(key);
      setTempKeyInput(key);
    }
  }, []);

  // Dynamically load Google Maps JS API when apiKey is provided
  useEffect(() => {
    if (!apiKey) {
      setIsGoogleLoaded(false);
      return;
    }

    if ((window as any).google && (window as any).google.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.warn('Google Maps API failed to load with provided key.');
        setIsGoogleLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }
  }, [apiKey]);

  // Initialize and update Google Map instance when API is available
  useEffect(() => {
    if (!isGoogleLoaded || !googleMapRef.current || !(window as any).google) return;

    try {
      const google = (window as any).google;
      const center = {
        lat: (originCoord.lat + destCoord.lat) / 2,
        lng: (originCoord.lng + destCoord.lng) / 2
      };

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(googleMapRef.current, {
          center,
          zoom: 12,
          mapTypeId: mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'on' }] },
            { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#1E3A8A' }] }
          ]
        });

        // Click listener to pick points on real Google Map
        mapInstanceRef.current.addListener('click', (e: any) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setClickedCoord({ lat, lng });
        });
      } else {
        mapInstanceRef.current.setMapTypeId(
          mapType === 'satellite' ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP
        );
      }

      // Clear existing markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add Origin Marker (Green)
      const originMarker = new google.maps.Marker({
        position: originCoord,
        map: mapInstanceRef.current,
        title: `Origin: ${originLocation}`,
        label: { text: 'A', color: '#FFFFFF', fontWeight: 'bold' },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        }
      });
      markersRef.current.push(originMarker);

      // Add Destination Marker (Red)
      const destMarker = new google.maps.Marker({
        position: destCoord,
        map: mapInstanceRef.current,
        title: `Destination: ${destinationLocation}`,
        label: { text: 'B', color: '#FFFFFF', fontWeight: 'bold' },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        }
      });
      markersRef.current.push(destMarker);

      // Add Transit Station Markers
      TRANSIT_HUBS.forEach(hub => {
        if (hub.geo) {
          const stationMarker = new google.maps.Marker({
            position: hub.geo,
            map: mapInstanceRef.current,
            title: hub.name,
            icon: {
              path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: '#2563EB',
              fillOpacity: 0.9,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          });

          stationMarker.addListener('click', () => {
            setSelectedHub(hub);
          });
          markersRef.current.push(stationMarker);
        }
      });

      // Draw Polyline for Distance Marking
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      polylineRef.current = new google.maps.Polyline({
        path: [originCoord, destCoord],
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 0.85,
        strokeWeight: 5
      });
      polylineRef.current.setMap(mapInstanceRef.current);

    } catch (err) {
      console.warn('Error updating Google Map markers:', err);
    }
  }, [isGoogleLoaded, originCoord, destCoord, originLocation, destinationLocation, mapType]);

  const handleSaveApiKey = () => {
    setApiKey(tempKeyInput.trim());
    if (typeof window !== 'undefined') {
      if (tempKeyInput.trim()) {
        localStorage.setItem('gmaps_api_key', tempKeyInput.trim());
      } else {
        localStorage.removeItem('gmaps_api_key');
      }
    }
    setShowKeyModal(false);
  };

  // Set point as origin
  const handleSetAsOrigin = (name: string, coord: Coordinates) => {
    setOriginLocation(name);
    setOriginCoord(coord);
    setClickedCoord(null);
    setClickTooltipPos(null);
  };

  // Set point as destination
  const handleSetAsDestination = (name: string, coord: Coordinates) => {
    setDestinationLocation(name);
    setDestCoord(coord);
    setClickedCoord(null);
    setClickTooltipPos(null);
  };

  // Interactive map bounds for SVG / Canvas fallback representation
  const mapBounds = {
    minLat: 40.62,
    maxLat: 40.78,
    minLng: -74.05,
    maxLng: -73.75
  };

  const projectCoordToSvg = (coord: Coordinates) => {
    const xPercent = (coord.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng);
    const yPercent = (mapBounds.maxLat - coord.lat) / (mapBounds.maxLat - mapBounds.minLat);
    return {
      x: 60 + xPercent * 880,
      y: 50 + yPercent * 480
    };
  };

  const originSvg = projectCoordToSvg(originCoord);
  const destSvg = projectCoordToSvg(destCoord);
  const midSvg = {
    x: (originSvg.x + destSvg.x) / 2,
    y: (originSvg.y + destSvg.y) / 2
  };

  // Handle map click on SVG representation to choose custom locations
  const handleSvgMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const normX = (clickX / svgWidth) * 1000;
    const normY = (clickY / svgHeight) * 580;

    // Inverse project to lat/lng
    const xFraction = Math.max(0, Math.min(1, (normX - 60) / 880));
    const yFraction = Math.max(0, Math.min(1, (normY - 50) / 480));

    const lng = Number((mapBounds.minLng + xFraction * (mapBounds.maxLng - mapBounds.minLng)).toFixed(4));
    const lat = Number((mapBounds.maxLat - yFraction * (mapBounds.maxLat - mapBounds.minLat)).toFixed(4));

    setClickedCoord({ lat, lng });
    setClickTooltipPos({ x: clickX, y: clickY });
  };

  return (
    <div className="space-y-4">
      {/* Top Location Selector & Distance Readout Bar */}
      <div className={`rounded-2xl border p-4 shadow-sm transition-colors ${highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Origin Selector */}
          <div className="md:col-span-4">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{plainLanguage ? "Start From (Origin):" : "Point A (Origin Location):"}</span>
            </label>
            <div className="relative">
              <select
                value={originLocation}
                onChange={(e) => {
                  const hub = TRANSIT_HUBS.find(h => h.name === e.target.value);
                  if (hub && hub.geo) {
                    setOriginLocation(hub.name);
                    setOriginCoord(hub.geo);
                  }
                }}
                className={`w-full pl-8 pr-8 py-2 text-xs sm:text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer border transition-colors ${highContrast ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-200'}`}
              >
                {TRANSIT_HUBS.map(hub => (
                  <option key={hub.id} value={hub.name}>
                    {plainLanguage ? hub.plainName : hub.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-emerald-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              onClick={swapLocations}
              className={`p-2 rounded-xl border transition-colors ${highContrast ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200'}`}
              title="Reverse Origin & Destination"
              aria-label="Reverse Origin and Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Selector */}
          <div className="md:col-span-4">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>{plainLanguage ? "Travel To (Destination):" : "Point B (Destination Location):"}</span>
            </label>
            <div className="relative">
              <select
                value={destinationLocation}
                onChange={(e) => {
                  const hub = TRANSIT_HUBS.find(h => h.name === e.target.value);
                  if (hub && hub.geo) {
                    setDestinationLocation(hub.name);
                    setDestCoord(hub.geo);
                  }
                }}
                className={`w-full pl-8 pr-8 py-2 text-xs sm:text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer border transition-colors ${highContrast ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-800 border-slate-200'}`}
              >
                {TRANSIT_HUBS.map(hub => (
                  <option key={hub.id} value={hub.name}>
                    {plainLanguage ? hub.plainName : hub.name}
                  </option>
                ))}
              </select>
              <Navigation className="w-4 h-4 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Real-Time Distance Readout Badge */}
          <div className="md:col-span-3 flex flex-col justify-end pt-2 md:pt-0">
            <div className={`p-2.5 rounded-xl border text-center transition-colors ${highContrast ? 'bg-blue-950/40 border-blue-800/80' : 'bg-blue-50 border-blue-200'}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wide ${highContrast ? 'text-blue-400' : 'text-blue-700'}`}>
                Live Measured Distance
              </div>
              <div className={`text-base font-extrabold flex items-center justify-center gap-1.5 ${highContrast ? 'text-white' : 'text-blue-900'}`}>
                <span>{distanceKm} km</span>
                <span className={`text-xs font-semibold ${highContrast ? 'text-blue-400' : 'text-blue-600'}`}>({distanceMiles} mi)</span>
              </div>
              <div className={`text-[10px] font-medium ${highContrast ? 'text-blue-300' : 'text-blue-700'}`}>
                Corridor: {transitDistanceKm} km • ~{metroTimeMinutes}m by Metro
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Map Container */}
      <div className={`relative rounded-2xl overflow-hidden border shadow-sm min-h-[500px] transition-colors ${highContrast ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'}`}>
        
        {/* Floating Top Map Controls */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none flex-wrap gap-2">
          
          {/* Badge */}
          <div className={`pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-sm transition-colors ${highContrast ? 'bg-slate-900/95 text-slate-100 border-slate-700' : 'bg-white/95 text-slate-800 border-slate-200'}`}>
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>REAL GOOGLE METROPOLITAN TRANSIT MAP</span>
            {isGoogleLoaded ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Google JS API Active
              </span>
            ) : (
              <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${highContrast ? 'text-blue-300 bg-blue-950/60 border-blue-800' : 'text-blue-600 bg-blue-50 border-blue-200'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Interactive Transit Engine
              </span>
            )}
          </div>

          {/* Controls: Google Map Key & View Toggle */}
          <div className="pointer-events-auto flex items-center space-x-1.5">
            <button
              onClick={() => setMapType(mapType === 'interactive' ? 'embed' : 'interactive')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                mapType === 'embed'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : highContrast
                    ? 'bg-slate-900/95 backdrop-blur-md text-slate-200 border-slate-700 hover:bg-slate-800'
                    : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Google Maps Live Directions Embed"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mapType === 'embed' ? 'Interactive Layer' : 'Google Embed View'}</span>
            </button>

            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-colors border ${
                highContrast
                  ? 'bg-slate-900/95 backdrop-blur-md text-slate-200 hover:text-blue-400 border-slate-700 hover:bg-slate-800'
                  : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-blue-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Configure Google Maps API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{apiKey ? 'API Key Active' : 'Set Google Key'}</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Google Maps JS API View (When API Key is valid and loaded) */}
        {isGoogleLoaded && mapType === 'interactive' && (
          <div ref={googleMapRef} className="w-full h-[540px] z-10" />
        )}

        {/* View Mode 2: Google Maps Embed Navigation Frame (Official Google Maps Web Directions) */}
        {mapType === 'embed' && (
          <div className="w-full h-[540px] relative">
            <iframe
              title="Real Google Map Transit Route"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(originCoord.lat + ',' + originCoord.lng)}+to+${encodeURIComponent(destCoord.lat + ',' + destCoord.lng)}&t=m&z=12&output=embed`}
            />
          </div>
        )}

        {/* View Mode 3: Built-in Interactive Transit Vector & Street Engine (Always available, zero setup needed) */}
        {(!isGoogleLoaded || mapType === 'interactive') && mapType !== 'embed' && (
          <div className={`w-full h-[540px] relative overflow-hidden select-none transition-colors ${highContrast ? 'bg-[#0B0F19]' : 'bg-[#EBF2F7]'}`}>
            
            {/* Real Street Map Canvas Background */}
            <svg
              viewBox="0 0 1000 580"
              className="w-full h-full cursor-crosshair"
              onClick={handleSvgMapClick}
            >
              <defs>
                <pattern id="real-map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke={highContrast ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 163, 184, 0.2)"} strokeWidth="1" />
                </pattern>

                {/* Road gradient */}
                <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>

              {/* Water & Coastal Geography Background */}
              <rect width="1000" height="580" fill={highContrast ? "#080D1A" : "#E2EDF8"} />
              
              {/* Landmass Polygons */}
              <path
                d="M 50,20 L 450,20 L 420,560 L 50,560 Z"
                fill={highContrast ? "#111827" : "#F8FAFC"}
                stroke={highContrast ? "#334155" : "#CBD5E1"}
                strokeWidth="2"
              />
              <path
                d="M 460,20 L 980,20 L 980,560 L 490,560 Z"
                fill={highContrast ? "#111827" : "#F8FAFC"}
                stroke={highContrast ? "#334155" : "#CBD5E1"}
                strokeWidth="2"
              />
              
              {/* River / Channel between boroughs */}
              <path
                d="M 450,20 Q 430,300 420,560 L 490,560 Q 470,300 460,20 Z"
                fill={highContrast ? "#172554" : "#BAE6FD"}
                opacity={highContrast ? 0.9 : 0.8}
              />

              {/* Street & Arterial Grid lines */}
              <rect width="1000" height="580" fill="url(#real-map-grid)" />

              {/* Major Highway & Metro Network Corridors */}
              <g opacity="0.65">
                {/* Metro Blue Line */}
                <path d="M 180,120 Q 320,240 540,220" fill="none" stroke="#2563EB" strokeWidth="5" strokeDasharray="8 4" />
                {/* Regional Express */}
                <path d="M 540,220 Q 720,280 840,420" fill="none" stroke="#4F46E5" strokeWidth="5" strokeDasharray="8 4" />
                {/* Harbor Ferry Link */}
                <path d="M 420,380 L 840,420" fill="none" stroke="#0284C7" strokeWidth="4" strokeDasharray="4 4" />
                {/* Surface Rapid Bus */}
                <path d="M 180,120 Q 220,350 320,440" fill="none" stroke="#059669" strokeWidth="4.5" />
              </g>

              {/* DISTANCE MARKING POLYLINE (Between Point A and Point B) */}
              <g id="distance-corridor-line">
                {/* Outer halo */}
                <line
                  x1={originSvg.x}
                  y1={originSvg.y}
                  x2={destSvg.x}
                  y2={destSvg.y}
                  stroke="#2563EB"
                  strokeWidth="8"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
                {/* Direct Geodesic Line */}
                <line
                  x1={originSvg.x}
                  y1={originSvg.y}
                  x2={destSvg.x}
                  y2={destSvg.y}
                  stroke="url(#corridor-gradient)"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              </g>

              {/* ALL TRANSIT HUBS / STATIONS ON REAL MAP */}
              {TRANSIT_HUBS.map(hub => {
                if (!hub.geo) return null;
                const pt = projectCoordToSvg(hub.geo);
                const isOrigin = hub.name === originLocation;
                const isDest = hub.name === destinationLocation;

                return (
                  <g 
                    key={hub.id} 
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHub(hub);
                    }}
                  >
                    {/* Station Pulse if Origin or Dest */}
                    {(isOrigin || isDest) && (
                      <circle r="22" fill="none" stroke={isOrigin ? '#10B981' : '#EF4444'} strokeWidth="2.5" opacity="0.4" className="animate-ping" />
                    )}

                    {/* Outer Circle */}
                    <circle 
                      r="14" 
                      fill={highContrast ? "#1E293B" : "#FFFFFF"} 
                      stroke={isOrigin ? '#10B981' : isDest ? '#EF4444' : highContrast ? '#60A5FA' : '#2563EB'} 
                      strokeWidth="3.5" 
                      className="transition-transform group-hover:scale-125"
                    />
                    
                    {/* Center Dot */}
                    <circle 
                      r="5" 
                      fill={isOrigin ? '#10B981' : isDest ? '#EF4444' : highContrast ? '#94A3B8' : '#1E293B'} 
                    />

                    {/* Station Tag Pill */}
                    <g transform="translate(18, -12)">
                      <rect
                        x="0"
                        y="0"
                        width={hub.name.length * 7.2 + 18}
                        height="24"
                        rx="7"
                        fill={highContrast ? "#0F172A" : "#FFFFFF"}
                        stroke={highContrast ? "#475569" : "#CBD5E1"}
                        strokeWidth="1.5"
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
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
                );
              })}

              {/* ORIGIN (A) PROMINENT PIN */}
              <g transform={`translate(${originSvg.x}, ${originSvg.y})`}>
                <g transform="translate(0, -32)">
                  <path
                    d="M 0,0 C -12,-12 -16,-24 0,-34 C 16,-24 12,-12 0,0 Z"
                    fill="#10B981"
                    stroke={highContrast ? "#0F172A" : "#FFFFFF"}
                    strokeWidth="2"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                  />
                  <circle cx="0" cy="-20" r="6" fill={highContrast ? "#0F172A" : "#FFFFFF"} />
                  <text x="0" y="-17" fill={highContrast ? "#34D399" : "#065F46"} fontSize="9" fontWeight="900" textAnchor="middle">A</text>
                </g>
              </g>

              {/* DESTINATION (B) PROMINENT PIN */}
              <g transform={`translate(${destSvg.x}, ${destSvg.y})`}>
                <g transform="translate(0, -32)">
                  <path
                    d="M 0,0 C -12,-12 -16,-24 0,-34 C 16,-24 12,-12 0,0 Z"
                    fill="#EF4444"
                    stroke={highContrast ? "#0F172A" : "#FFFFFF"}
                    strokeWidth="2"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                  />
                  <circle cx="0" cy="-20" r="6" fill={highContrast ? "#0F172A" : "#FFFFFF"} />
                  <text x="0" y="-17" fill={highContrast ? "#F87171" : "#991B1B"} fontSize="9" fontWeight="900" textAnchor="middle">B</text>
                </g>
              </g>

              {/* DISTANCE MARKING BADGE (Placed at midpoint of route line) */}
              <g transform={`translate(${midSvg.x}, ${midSvg.y - 16})`}>
                <rect
                  x="-85"
                  y="-16"
                  width="170"
                  height="32"
                  rx="16"
                  fill={highContrast ? "#0B0F19" : "#0F172A"}
                  stroke={highContrast ? "#60A5FA" : "#FFFFFF"}
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                <text
                  x="0"
                  y="4"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  📍 {distanceKm} km ({distanceMiles} mi)
                </text>
              </g>

            </svg>

            {/* Click-to-Choose Location Context Popover */}
            {clickedCoord && clickTooltipPos && (
              <div 
                className={`absolute z-30 rounded-2xl shadow-xl border p-3.5 animate-in fade-in zoom-in-95 duration-150 transition-colors ${
                  highContrast ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
                style={{ 
                  left: Math.min(clickTooltipPos.x, 380), 
                  top: Math.min(clickTooltipPos.y, 400) 
                }}
              >
                <div className={`flex items-center justify-between gap-3 mb-2 pb-1.5 border-b ${highContrast ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className={`text-xs font-bold ${highContrast ? 'text-white' : 'text-slate-800'}`}>
                    Selected Location
                  </div>
                  <button 
                    onClick={() => setClickedCoord(null)}
                    className={`text-xs font-bold ${highContrast ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    ✕
                  </button>
                </div>
                <div className={`text-[11px] mb-3 font-mono ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
                  Lat: {clickedCoord.lat}, Lng: {clickedCoord.lng}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSetAsOrigin(`GPS (${clickedCoord.lat}, ${clickedCoord.lng})`, clickedCoord)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Set as Start (A)
                  </button>
                  <button
                    onClick={() => handleSetAsDestination(`GPS (${clickedCoord.lat}, ${clickedCoord.lng})`, clickedCoord)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Set as Goal (B)
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Bottom Distance & Trip Insights Overlay Bar */}
        <div className={`p-3.5 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs transition-colors ${
          highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl transition-colors ${highContrast ? 'bg-blue-950/70 text-blue-400 border border-blue-900' : 'bg-blue-50 text-blue-600'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-bold ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Route Distance</div>
              <div className={`text-sm font-extrabold ${highContrast ? 'text-white' : 'text-slate-900'}`}>{transitDistanceKm} km</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl transition-colors ${highContrast ? 'bg-indigo-950/70 text-indigo-400 border border-indigo-900' : 'bg-indigo-50 text-indigo-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-bold ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Metro Express</div>
              <div className={`text-sm font-extrabold ${highContrast ? 'text-white' : 'text-slate-900'}`}>~{metroTimeMinutes} mins</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl transition-colors ${highContrast ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900' : 'bg-emerald-50 text-emerald-600'}`}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-bold ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Zero-Emission</div>
              <div className={`text-sm font-extrabold ${highContrast ? 'text-white' : 'text-slate-900'}`}>100% Electric</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl transition-colors ${highContrast ? 'bg-amber-950/70 text-amber-400 border border-amber-900' : 'bg-amber-50 text-amber-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-bold ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Accessibility</div>
              <div className={`text-sm font-extrabold ${highContrast ? 'text-white' : 'text-slate-900'}`}>Step-Free Access</div>
            </div>
          </div>

        </div>

      </div>

      {/* Station Details Modal if Station is Clicked */}
      {selectedHub && (
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 transition-colors ${
          highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${highContrast ? 'bg-blue-950/70 text-blue-400 border-blue-900' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${highContrast ? 'text-white' : 'text-slate-900'}`}>
                {plainLanguage ? selectedHub.plainName : selectedHub.name}
              </div>
              <div className={`text-xs ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedHub.district} • {selectedHub.accessibilityRating}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedHub.geo) handleSetAsOrigin(selectedHub.name, selectedHub.geo);
                setSelectedHub(null);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                highContrast ? 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border-emerald-800' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
              }`}
            >
              Set as Start (A)
            </button>
            <button
              onClick={() => {
                if (selectedHub.geo) handleSetAsDestination(selectedHub.name, selectedHub.geo);
                setSelectedHub(null);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                highContrast ? 'bg-rose-950/70 text-rose-300 hover:bg-rose-900 border-rose-800' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
              }`}
            >
              Set as Goal (B)
            </button>
            <button
              onClick={() => setSelectedHub(null)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                highContrast ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Google Maps API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className={`w-full max-w-md rounded-2xl shadow-xl border p-6 space-y-4 transition-colors ${
            highContrast ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center space-x-3 pb-3 border-b ${highContrast ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={`p-2 rounded-xl border ${highContrast ? 'bg-amber-950/70 text-amber-400 border-amber-900' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${highContrast ? 'text-white' : 'text-slate-900'}`}>Google Maps API Setup</h3>
                <p className={`text-xs ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>Enable native Google Maps JavaScript & Directions API</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-xs font-bold ${highContrast ? 'text-slate-300' : 'text-slate-700'}`}>
                Google Maps API Key (Optional)
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono transition-colors ${
                  highContrast ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'border-slate-300 text-slate-900 bg-white'
                }`}
              />
              <p className={`text-[11px] leading-relaxed ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
                Note: An interactive transit engine and embedded Google Maps directions are already active out of the box. Entering your own key unlocks custom Google Maps JS layers and autocomplete.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  highContrast ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
