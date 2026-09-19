import { VehicleTelemetry } from '../types/telemetry';

export const INITIAL_VEHICLES: VehicleTelemetry[] = [
  {
    vehicleId: 'AT-204',
    callsign: 'Metro Blue Line M1',
    plainCallsign: 'Metro Train 204',
    model: 'Alstom Metropolis 8-Car Electric Train',
    domain: 'AIR',
    status: 'active',
    speedKmH: 78,
    maxSpeedKmH: 110,
    distanceRemainingKm: 4.4,
    etaCountdownMinutes: 3,
    etaCountdownSeconds: 32,
    powerLevelPercent: 92,
    powerSource: 'Overhead 1500V DC Clean Electric Grid',
    nextHub: 'Grand Central Station',
    plainNextHub: 'Downtown Central Station',
    cabinTempCelsius: 21.5,
    passengerOccupancyPercent: 54,
    routeCoordinates: {
      start: { x: 180, y: 140 },
      end: { x: 500, y: 320 },
      currentProgress: 0.42
    },
    accessibilityCertified: true,
    barrierFreeFeatures: [
      'Level Platform-to-Train Docking',
      'Dedicated Wheelchair Bays & Straps',
      'Dual High-Contrast Screen Indicators',
      'Multilingual Audio Announcements'
    ]
  },
  {
    vehicleId: 'ML-809',
    callsign: 'Regional Rail Express 809',
    plainCallsign: 'Express Train 809',
    model: 'Siemens Velaro High-Speed Commuter Train',
    domain: 'RAIL',
    status: 'active',
    speedKmH: 115,
    maxSpeedKmH: 160,
    distanceRemainingKm: 8.2,
    etaCountdownMinutes: 4,
    etaCountdownSeconds: 15,
    powerLevelPercent: 96,
    powerSource: 'High-Efficiency Electric Regenerative Braking',
    nextHub: 'Harbor Waterfront Pier',
    plainNextHub: 'Waterfront Ferry Terminal',
    cabinTempCelsius: 22.0,
    passengerOccupancyPercent: 62,
    routeCoordinates: {
      start: { x: 500, y: 320 },
      end: { x: 820, y: 460 },
      currentProgress: 0.65
    },
    accessibilityCertified: true,
    barrierFreeFeatures: [
      'Step-Free Retractable Platform Ramps',
      'Tactile Navigational Floor Ribbons',
      'Induction Hearing Loop Throughout',
      'Quiet / Sensory-Friendly Carriage'
    ]
  },
  {
    vehicleId: 'AP-114',
    callsign: 'Downtown Electric Shuttle 114',
    plainCallsign: 'City Shuttle Bus 114',
    model: 'Solaris Urbino 12 Electric Zero-Emission Bus',
    domain: 'ROAD',
    status: 'active',
    speedKmH: 42,
    maxSpeedKmH: 65,
    distanceRemainingKm: 1.8,
    etaCountdownMinutes: 2,
    etaCountdownSeconds: 45,
    powerLevelPercent: 84,
    powerSource: '350kWh Ultra-Fast Opportunity Charge',
    nextHub: 'Civic Center & City Hall',
    plainNextHub: 'City Center Plaza',
    cabinTempCelsius: 20.8,
    passengerOccupancyPercent: 35,
    routeCoordinates: {
      start: { x: 500, y: 320 },
      end: { x: 380, y: 520 },
      currentProgress: 0.28
    },
    accessibilityCertified: true,
    barrierFreeFeatures: [
      'Automatic Curbside Kneeling System',
      'Wheelchair Flip-Down Access Ramp',
      'Audio & Visual Next-Stop Announcers',
      'Stroller & Walker Reserved Area'
    ]
  },
  {
    vehicleId: 'EB-42',
    callsign: 'University Line Bus 42',
    plainCallsign: 'Campus Electric Bus 42',
    model: 'BYD K9 High-Capacity Articulated Bus',
    domain: 'ROAD',
    status: 'active',
    speedKmH: 38,
    maxSpeedKmH: 60,
    distanceRemainingKm: 3.2,
    etaCountdownMinutes: 5,
    etaCountdownSeconds: 10,
    powerLevelPercent: 88,
    powerSource: 'Clean Solar Rooftop & Battery Power',
    nextHub: 'University & Tech Campus',
    plainNextHub: 'University Campus Station',
    cabinTempCelsius: 22.4,
    passengerOccupancyPercent: 71,
    routeCoordinates: {
      start: { x: 180, y: 140 },
      end: { x: 260, y: 480 },
      currentProgress: 0.72
    },
    accessibilityCertified: true,
    barrierFreeFeatures: [
      'Dual Low-Floor Entrance Doors',
      'Two Dedicated Wheelchair Positions',
      'Sign Language Video Screens (ASL)'
    ]
  }
];
