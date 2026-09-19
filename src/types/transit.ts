export type TransportMode = 'all' | 'pod' | 'maglev' | 'skycab' | 'smartroad';

export interface AccessibilityTag {
  id: string;
  label: string;
  plainLabel: string;
  icon?: string;
}

export interface JourneySegment {
  id: string;
  stepNumber: string;
  mode: 'skycab' | 'maglev' | 'pod' | 'smartroad';
  title: string;
  plainTitle: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  accessibilityFeatures: AccessibilityTag[];
  distanceKm: number;
  lineCode?: string;
  platformOrPad?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  plainName: string;
  tagline: string;
  isAiRecommended?: boolean;
  modesSequence: Array<'skycab' | 'maglev' | 'pod' | 'smartroad'>;
  modesLabel: string;
  totalDurationMinutes: number;
  transfersCount: number;
  carbonReductionPercent: number;
  accessibilityScorePercent: number;
  priceCredits: number;
  departureTime: string;
  arrivalTime: string;
  segments: JourneySegment[];
}

export interface TransitHub {
  id: string;
  name: string;
  plainName: string;
  district: string;
  type: 'skyport' | 'hyperloop' | 'surface' | 'marina';
  coordinates: { x: number; y: number };
  geo?: { lat: number; lng: number };
  activeLines: string[];
  accessibilityRating: string;
}

export interface RealtimeAlert {
  id: string;
  type: 'traffic' | 'weather' | 'energy' | 'maintenance';
  title: string;
  plainTitle: string;
  message: string;
  plainMessage: string;
  severity: 'warning' | 'info' | 'critical';
  extraMinutes: number;
  canReroute: boolean;
}
