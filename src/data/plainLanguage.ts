export const PLAIN_LANGUAGE_DICTIONARY: Record<string, string> = {
  // Navigation & General
  "AETHER TRANSIT 2100": "CityTransit Network",
  "Move Beyond Tomorrow.": "Effortless transit for every commuter.",
  "Network status": "Line status",
  "OPTIMAL EFFICIENCY (99.98%)": "All lines running on schedule (99.4%)",
  "Telemetry": "Live Vehicle Info",
  "Live Telemetry": "Live Vehicle Info",
  "ETA": "Arrival time",
  "Destination ETA": "Estimated arrival time",
  "Emergency Assist": "Passenger Help / SOS",
  "Emergency assistance activated": "Passenger assistance requested",
  "Connecting you with Aether AI Voice Relay...": "Connecting you with station passenger services...",
  
  // Transport modes
  "Autonomous Bus": "Electric City Bus",
  "Maglev / Hyperloop": "Metro & Regional Train",
  "SkyCab": "Airport Express Link",
  "Smart Road": "Electric Streetcar & Bus",
  "Autonomous Pod": "Downtown Shuttle",
  "SkyCab Air": "Express Airport Link",
  "Maglev Express": "Fast Metro Train",
  
  // Locations & Hubs
  "Hyperloop Central": "Grand Central Station",
  "Skyport Alpha": "Airport Terminal 1",
  "Autonomous Expressway": "Metro Transit Expressway",
  "Marina Sub-Sea Nexus": "Harbor Waterfront Pier",
  "Solar Plains Perimeter": "University & Tech Campus",
  
  // Journey & Routes
  "AI Recommended": "Recommended best route",
  "AI Smart Reroute": "Find a faster route",
  "Find a better route": "Choose a faster route",
  "Traffic conditions changed": "Route delay alert",
  "Your current route may take 6 minutes longer.": "There is a slight road delay. You can save 6 minutes with an alternative route.",
  "Recalculating optimal vector...": "Finding the fastest route...",
  "Recalculation complete": "New faster route selected",
  "Carbon reduction": "Clean air savings",
  "lower carbon": "lower emissions",
  "Barrier Free": "Step-Free Accessible",
  "Transfers": "Line transfers",
  "Travel time": "Trip duration",
  
  // Accessibility terms
  "Level Boarding": "Flat step-on entrance",
  "Wheelchair Space": "Dedicated wheelchair space",
  "Audio Guidance": "Spoken voice directions",
  "Zero-G Assist": "Ultra-smooth ride assist",
  "Sensory Calm": "Quiet & low-sensory coach",
  "Step Free": "No stairs or steps",
  "Voice Guidance": "Clear voice announcements",
  "Haptic Ramp": "Gentle textured ramp",
  
  // Technical telemetry
  "Power": "Battery / Electric Power",
  "Next Hub": "Next stop",
  "Speed": "Current speed",
  "Distance": "Distance remaining",
  "Arrival": "Time until arrival",
  "Passenger Load": "Seats occupied",
  "Cabin Climate": "Inside temperature"
};

export function translatePlain(text: string, isPlainLanguage: boolean): string {
  if (!isPlainLanguage || !text) return text;
  return PLAIN_LANGUAGE_DICTIONARY[text] || text;
}
