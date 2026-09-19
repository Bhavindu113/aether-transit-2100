import { RouteOption } from '../types/transit';

export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: 'route-ai-recommended',
    name: 'Airport Express → Metro Blue Line → City Shuttle',
    plainName: 'Airport Shuttle → Metro Train → Local Bus',
    tagline: 'Recommended Best Route (Fastest & Step-Free)',
    isAiRecommended: true,
    modesSequence: ['skycab', 'maglev', 'pod'],
    modesLabel: 'Airport Express + Metro Line + Shuttle',
    totalDurationMinutes: 24,
    transfersCount: 2,
    carbonReductionPercent: 92,
    accessibilityScorePercent: 100,
    priceCredits: 4.50,
    departureTime: '08:42',
    arrivalTime: '09:06',
    segments: [
      {
        id: 'seg-1',
        stepNumber: '01',
        mode: 'skycab',
        title: 'Airport Express Shuttle',
        plainTitle: 'Airport Express Link',
        fromStation: 'Airport Terminal 1',
        toStation: 'Airport Transit Junction',
        departureTime: '08:42',
        arrivalTime: '08:49',
        durationMinutes: 7,
        distanceKm: 8.2,
        lineCode: 'AIRPORT-EXP 1',
        platformOrPad: 'Terminal Gate 3',
        accessibilityFeatures: [
          { id: 'acc-1', label: 'Step-Free Boarding', plainLabel: 'Level boarding without steps' },
          { id: 'acc-2', label: 'Wheelchair Area', plainLabel: 'Dedicated wheelchair bay' },
          { id: 'acc-3', label: 'Audio Announcements', plainLabel: 'Spoken stop announcements' }
        ]
      },
      {
        id: 'seg-2',
        stepNumber: '02',
        mode: 'maglev',
        title: 'Metro Blue Line (Express)',
        plainTitle: 'Fast Metro Train',
        fromStation: 'Airport Junction Metro',
        toStation: 'Grand Central Station',
        departureTime: '08:53',
        arrivalTime: '09:05',
        durationMinutes: 12,
        distanceKm: 18.5,
        lineCode: 'METRO LINE M1',
        platformOrPad: 'Track 2 (Southbound)',
        accessibilityFeatures: [
          { id: 'acc-4', label: 'Elevator & Ramp', plainLabel: 'Elevator directly to train' },
          { id: 'acc-5', label: 'Priority Seating', plainLabel: 'Comfort priority seats' },
          { id: 'acc-6', label: 'Tactile Paving', plainLabel: 'Guiding tactile floor tiles' }
        ]
      },
      {
        id: 'seg-3',
        stepNumber: '03',
        mode: 'pod',
        title: 'Civic Center Electric Shuttle',
        plainTitle: 'City Center Electric Mini-Bus',
        fromStation: 'Grand Central Plaza',
        toStation: 'Civic Center & City Hall',
        departureTime: '09:08',
        arrivalTime: '09:15',
        durationMinutes: 7,
        distanceKm: 2.8,
        lineCode: 'SHUTTLE 10',
        platformOrPad: 'Bus Bay B',
        accessibilityFeatures: [
          { id: 'acc-7', label: 'Low Floor Entry', plainLabel: 'Curbside flat entrance' },
          { id: 'acc-8', label: 'Visual Displays', plainLabel: 'Next stop screen displays' }
        ]
      }
    ]
  },
  {
    id: 'route-direct-maglev',
    name: 'Direct Regional Express Train',
    plainName: 'Direct Fast Commuter Train',
    tagline: 'Single transfer • Fewest stops',
    isAiRecommended: false,
    modesSequence: ['maglev', 'smartroad'],
    modesLabel: 'Regional Express + City Walk',
    totalDurationMinutes: 20,
    transfersCount: 1,
    carbonReductionPercent: 96,
    accessibilityScorePercent: 100,
    priceCredits: 5.20,
    departureTime: '08:45',
    arrivalTime: '09:05',
    segments: [
      {
        id: 'seg-m1',
        stepNumber: '01',
        mode: 'maglev',
        title: 'Regional Rapid Rail',
        plainTitle: 'High-Speed Express Train',
        fromStation: 'Airport Station (Lower Level)',
        toStation: 'Grand Central Station',
        departureTime: '08:45',
        arrivalTime: '09:00',
        durationMinutes: 15,
        distanceKm: 22.0,
        lineCode: 'REGIONAL EXP',
        platformOrPad: 'Platform 1',
        accessibilityFeatures: [
          { id: 'acc-m1', label: 'Step-Free Boarding', plainLabel: 'Level platform access' },
          { id: 'acc-m2', label: 'Wheelchair Area', plainLabel: 'Reserved wheelchair bay' },
          { id: 'acc-m3', label: 'Quiet Coach', plainLabel: 'Calm and quiet carriage' }
        ]
      },
      {
        id: 'seg-m2',
        stepNumber: '02',
        mode: 'smartroad',
        title: 'Electric Downtown Connector',
        plainTitle: 'Downtown Streetcar Shuttle',
        fromStation: 'Grand Central North Exit',
        toStation: 'Civic Center & City Hall',
        departureTime: '09:02',
        arrivalTime: '09:05',
        durationMinutes: 3,
        distanceKm: 1.2,
        lineCode: 'DOWNTOWN-LINK',
        platformOrPad: 'Street Stop 4',
        accessibilityFeatures: [
          { id: 'acc-m4', label: 'Step Free', plainLabel: 'No stairs or barriers' },
          { id: 'acc-m5', label: 'Audio & Visual', plainLabel: 'Dual screen and voice guidance' }
        ]
      }
    ]
  },
  {
    id: 'route-eco-glide',
    name: 'Rapid Eco-Bus & Light Rail',
    plainName: 'Electric City Bus & Tram',
    tagline: 'Scenic & Budget Friendly (Zero Emissions)',
    isAiRecommended: false,
    modesSequence: ['smartroad', 'pod'],
    modesLabel: 'Electric Rapid Bus + Streetcar',
    totalDurationMinutes: 31,
    transfersCount: 1,
    carbonReductionPercent: 98,
    accessibilityScorePercent: 95,
    priceCredits: 2.75,
    departureTime: '08:40',
    arrivalTime: '09:11',
    segments: [
      {
        id: 'seg-e1',
        stepNumber: '01',
        mode: 'smartroad',
        title: 'City Rapid Electric Bus',
        plainTitle: 'Clean Electric City Bus',
        fromStation: 'Airport Ground Bus Terminal',
        toStation: 'Civic West Hub',
        departureTime: '08:40',
        arrivalTime: '09:00',
        durationMinutes: 20,
        distanceKm: 12.5,
        lineCode: 'RAPID BUS 40',
        platformOrPad: 'Bus Bay 1',
        accessibilityFeatures: [
          { id: 'acc-e1', label: 'Kneeling Bus Ramp', plainLabel: 'Bus lowers to curb level' },
          { id: 'acc-e2', label: 'Wheelchair Lock', plainLabel: 'Secure wheelchair spot' },
          { id: 'acc-e3', label: 'Next Stop Audio', plainLabel: 'Clear voice announcements' }
        ]
      },
      {
        id: 'seg-e2',
        stepNumber: '02',
        mode: 'pod',
        title: 'Civic Center Streetcar',
        plainTitle: 'Local Streetcar Tram',
        fromStation: 'Civic West Hub',
        toStation: 'Civic Center & City Hall',
        departureTime: '09:03',
        arrivalTime: '09:11',
        durationMinutes: 8,
        distanceKm: 2.4,
        lineCode: 'TRAM 2',
        platformOrPad: 'Track A',
        accessibilityFeatures: [
          { id: 'acc-e4', label: 'Step Free', plainLabel: 'Flat boarding platform' },
          { id: 'acc-e5', label: 'Tactile Guidance', plainLabel: 'Braille and tactile floor path' }
        ]
      }
    ]
  }
];

export const RECALCULATED_OPTIMAL_ROUTE: RouteOption = {
  id: 'route-recalculated-bypass',
  name: 'Express Airport Link → Fast Direct Metro',
  plainName: 'Faster Alternative Route (Saves 6 min)',
  tagline: 'Optimized real-time detour around street delays',
  isAiRecommended: true,
  modesSequence: ['skycab', 'maglev', 'pod'],
  modesLabel: 'Priority Express + Metro',
  totalDurationMinutes: 18,
  transfersCount: 1,
  carbonReductionPercent: 95,
  accessibilityScorePercent: 100,
  priceCredits: 4.50,
  departureTime: '08:43',
  arrivalTime: '09:01',
  segments: [
    {
      id: 'seg-opt-1',
      stepNumber: '01',
      mode: 'skycab',
      title: 'Airport Express Non-Stop',
      plainTitle: 'Direct Express Link',
      fromStation: 'Airport Terminal 1 Station',
      toStation: 'Grand Central Station (Express Level)',
      departureTime: '08:43',
      arrivalTime: '08:53',
      durationMinutes: 10,
      distanceKm: 14.2,
      lineCode: 'NON-STOP EXP',
      platformOrPad: 'Express Gate 1',
      accessibilityFeatures: [
        { id: 'opt-acc-1', label: 'Level Boarding', plainLabel: 'Step-free walk on' },
        { id: 'opt-acc-2', label: 'Wheelchair Bay', plainLabel: 'Dedicated wheelchair area' },
        { id: 'opt-acc-3', label: 'Voice & Screen', plainLabel: 'Clear visual and spoken guidance' }
      ]
    },
    {
      id: 'seg-opt-2',
      stepNumber: '02',
      mode: 'pod',
      title: 'Civic Plaza Direct Tram',
      plainTitle: 'Direct City Hall Tram',
      fromStation: 'Grand Central Express Exit',
      toStation: 'Civic Center & City Hall',
      departureTime: '08:55',
      arrivalTime: '09:01',
      durationMinutes: 6,
      distanceKm: 2.1,
      lineCode: 'DIRECT TRAM 8',
      platformOrPad: 'Platform C',
      accessibilityFeatures: [
        { id: 'opt-acc-4', label: 'Step Free', plainLabel: 'No stairs or ramps needed' },
        { id: 'opt-acc-5', label: 'Smooth Transit', plainLabel: 'Level, vibration-free ride' },
        { id: 'opt-acc-6', label: 'Audio Guidance', plainLabel: 'Spoken audio directions' }
      ]
    }
  ]
};
