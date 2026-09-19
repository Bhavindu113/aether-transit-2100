import { TransitHub } from '../types/transit';

export const TRANSIT_HUBS: TransitHub[] = [
  {
    id: 'hub-skyport',
    name: 'Airport Terminal 1',
    plainName: 'International Airport',
    district: 'Airport Metro Corridor',
    type: 'skyport',
    coordinates: { x: 180, y: 140 },
    geo: { lat: 40.6413, lng: -73.7781 },
    activeLines: ['LINE-BLUE-EXP', 'SHUTTLE-AIR', 'EXPRESS-01'],
    accessibilityRating: '100% Barrier-Free'
  },
  {
    id: 'hub-central',
    name: 'Grand Central Station',
    plainName: 'Downtown Central Station',
    district: 'Downtown Financial Center',
    type: 'hyperloop',
    coordinates: { x: 500, y: 320 },
    geo: { lat: 40.7527, lng: -73.9772 },
    activeLines: ['METRO-M1', 'RAPID-BUS-C', 'REGIONAL-RAIL'],
    accessibilityRating: '100% Step-Free'
  },
  {
    id: 'hub-marina',
    name: 'Harbor Waterfront Pier',
    plainName: 'Waterfront Ferry Terminal',
    district: 'Harbor Coastal Promenade',
    type: 'marina',
    coordinates: { x: 820, y: 460 },
    geo: { lat: 40.7018, lng: -74.0135 },
    activeLines: ['FERRY-EXPRESS', 'COASTAL-TRAM'],
    accessibilityRating: '100% Step-Free'
  },
  {
    id: 'hub-solar',
    name: 'University & Tech Campus',
    plainName: 'University & Innovation District',
    district: 'South Academic Campus',
    type: 'surface',
    coordinates: { x: 260, y: 480 },
    geo: { lat: 40.7295, lng: -73.9965 },
    activeLines: ['CAMPUS-LINK', 'ELECTRIC-BUS-12'],
    accessibilityRating: '100% Barrier-Free'
  },
  {
    id: 'hub-destination',
    name: 'Civic Center & City Hall',
    plainName: 'City Center Plaza',
    district: 'Civic Cultural District',
    type: 'surface',
    coordinates: { x: 380, y: 520 },
    geo: { lat: 40.7128, lng: -74.0060 },
    activeLines: ['METRO-M2', 'CITY-SHUTTLE'],
    accessibilityRating: '100% Step-Free'
  }
];
