export type VehicleDomain = 'AIR' | 'RAIL' | 'ROAD';

export interface VehicleTelemetry {
  vehicleId: string;
  callsign: string;
  plainCallsign: string;
  model: string;
  domain: VehicleDomain;
  status: 'active' | 'boarding' | 'docked' | 'diverted';
  speedKmH: number;
  maxSpeedKmH: number;
  distanceRemainingKm: number;
  etaCountdownMinutes: number;
  etaCountdownSeconds: number;
  powerLevelPercent: number;
  powerSource: string;
  nextHub: string;
  plainNextHub: string;
  cabinTempCelsius: number;
  passengerOccupancyPercent: number;
  routeCoordinates: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    currentProgress: number; // 0.0 to 1.0
  };
  accessibilityCertified: boolean;
  barrierFreeFeatures: string[];
}
