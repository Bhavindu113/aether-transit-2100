'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTransit } from '../../context/TransitContext';
import { TRANSIT_HUBS } from '../../data/mockHubs';
import { 
  Mic, 
  MicOff,
  X, 
  Compass, 
  MapPin, 
  Accessibility, 
  AlertCircle,
  Search,
  CheckCircle2,
  Volume2,
  Zap,
  ArrowRight,
  Radio
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  plainLabel: string;
  query: string;
}

export default function VoiceAssistantModal() {
  const { 
    voiceSimOpen, 
    setVoiceSimOpen, 
    plainLanguage, 
    togglePlainLanguage, 
    toggleHighContrast,
    setEmergencyOpen 
  } = useAccessibility();
  const { 
    setActiveScreen, 
    setSelectedVehicle, 
    vehicles, 
    setDestinationLocation,
    destinationLocation 
  } = useTransit();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [activeMessage, setActiveMessage] = useState<string>(
    plainLanguage 
      ? "Listening... Speak your destination or trip question." 
      : "Listening... Speak your destination (e.g., 'Grand Central', 'Airport', 'Harbor')."
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [micSupported, setMicSupported] = useState<boolean>(true);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Quick Action Voice Prompts
  const quickActions: QuickAction[] = [
    {
      id: 'grand-central',
      label: 'Go to Grand Central Station',
      plainLabel: 'Take me to Grand Central',
      query: 'Grand Central Station'
    },
    {
      id: 'airport',
      label: 'Routes to Airport Terminal 1',
      plainLabel: 'Find ride to Airport',
      query: 'Airport Terminal 1'
    },
    {
      id: 'harbor',
      label: 'Ferry to Harbor Waterfront',
      plainLabel: 'Go to Harbor Pier',
      query: 'Harbor Waterfront Pier'
    },
    {
      id: 'where-vehicle',
      label: 'Where is my Metro train right now?',
      plainLabel: 'Track my train on map',
      query: 'Where is my vehicle?'
    },
    {
      id: 'civic-center',
      label: 'Directions to Civic Center & City Hall',
      plainLabel: 'Go to City Hall Plaza',
      query: 'Civic Center & City Hall'
    },
    {
      id: 'emergency',
      label: 'Emergency Passenger Assistance',
      plainLabel: 'I need staff help now',
      query: 'Help and emergency'
    }
  ];

  // Natural speech response output
  const speakResponse = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.02;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setIsSpeaking(false);
      }
    }
  };

  // Smart Query Interpreter & Transit Search Engine
  const executeVoiceSearch = (rawQuery: string) => {
    if (!rawQuery || !rawQuery.trim()) return;

    setIsProcessing(true);
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const query = rawQuery.trim().toLowerCase();

    // 1. Accessibility commands
    if (query.includes('contrast') || query.includes('dark mode')) {
      setActiveMessage('High Contrast Mode toggled.');
      speakResponse('High contrast display toggled.');
      toggleHighContrast();
      setTimeout(() => {
        setIsProcessing(false);
        setVoiceSimOpen(false);
      }, 1200);
      return;
    }

    if (query.includes('plain language') || query.includes('simple words')) {
      setActiveMessage('Plain Language Mode toggled.');
      speakResponse('Plain language guidance enabled.');
      togglePlainLanguage();
      setTimeout(() => {
        setIsProcessing(false);
        setVoiceSimOpen(false);
      }, 1200);
      return;
    }

    // 2. Emergency & Assistance commands
    if (query.includes('emergency') || query.includes('sos') || query.includes('staff') || query.includes('help')) {
      const resp = plainLanguage 
        ? "Connecting you to station staff immediately." 
        : "Connecting you immediately with station passenger assistance staff.";
      setActiveMessage(resp);
      speakResponse(resp);
      setTimeout(() => {
        setIsProcessing(false);
        setVoiceSimOpen(false);
        setEmergencyOpen(true);
      }, 1400);
      return;
    }

    // 3. Live Vehicle Tracking commands
    if (query.includes('where is') || query.includes('vehicle') || query.includes('live map') || query.includes('track') || query.includes('bus') || query.includes('train')) {
      const vehicle = vehicles.find(v => v.vehicleId === 'AT-204') || vehicles[0];
      if (vehicle) setSelectedVehicle(vehicle);
      const resp = plainLanguage 
        ? "Your metro train is 3 minutes away. Centering live map now." 
        : "Metro Blue Line Train 204 is 3 minutes away. Centering live map.";
      setActiveMessage(resp);
      speakResponse(resp);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveScreen('map');
        setVoiceSimOpen(false);
      }, 1500);
      return;
    }

    // 4. Known Destination Matching
    let matchedDestination: string | null = null;

    if (query.includes('grand central') || query.includes('central station')) {
      matchedDestination = 'Grand Central Station';
    } else if (query.includes('airport') || query.includes('terminal')) {
      matchedDestination = 'Airport Terminal 1';
    } else if (query.includes('harbor') || query.includes('waterfront') || query.includes('pier') || query.includes('ferry')) {
      matchedDestination = 'Harbor Waterfront Pier';
    } else if (query.includes('civic') || query.includes('city hall') || query.includes('center plaza')) {
      matchedDestination = 'Civic Center & City Hall';
    } else if (query.includes('university') || query.includes('campus') || query.includes('college')) {
      matchedDestination = 'University & Tech Campus';
    } else {
      // Check against any hub keywords
      for (const hub of TRANSIT_HUBS) {
        if (query.includes(hub.name.toLowerCase()) || hub.name.toLowerCase().includes(query)) {
          matchedDestination = hub.name;
          break;
        }
      }
    }

    // If still not matched, treat the spoken phrase as custom destination
    if (!matchedDestination) {
      let cleaned = query
        .replace(/^(take me to|navigate to|go to|find route to|find train to|directions to|search for|how to get to|search|look for)\s+/i, '')
        .trim();

      if (cleaned.length > 0) {
        matchedDestination = cleaned
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      } else {
        matchedDestination = 'Grand Central Station';
      }
    }

    // Execute Destination Search & Route Presentation
    setDestinationLocation(matchedDestination);
    const confirmationText = plainLanguage
      ? `Searching routes to ${matchedDestination}. Opening your trip plan now.`
      : `Searching optimal transit routes to ${matchedDestination}. Opening Journey Planner.`;
    
    setActiveMessage(confirmationText);
    speakResponse(confirmationText);

    setTimeout(() => {
      setIsProcessing(false);
      setActiveScreen('journey');
      setVoiceSimOpen(false);
    }, 1400);
  };

  // Start Speech Recognition
  const startListening = () => {
    setStatusNote(null);
    setTranscript('');
    setActiveMessage(
      plainLanguage 
        ? "Listening... Speak your destination now." 
        : "Listening... Speak your destination or transit command."
    );

    const SpeechRecognitionClass = 
      typeof window !== 'undefined' 
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) 
        : null;

    if (!SpeechRecognitionClass) {
      setMicSupported(false);
      setIsListening(false);
      setStatusNote('Speech recognition is not supported in this browser. You can type or tap a destination below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusNote(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const currentSpoken = finalTranscript || interimTranscript;
        setTranscript(currentSpoken);

        if (finalTranscript) {
          executeVoiceSearch(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setStatusNote('Microphone access was blocked. Please enable microphone permissions in your browser, or type below.');
        } else if (event.error === 'no-speech') {
          setStatusNote('No speech heard. Click the microphone icon to try speaking again.');
        } else {
          setStatusNote(`Voice status: ${event.error}. You can also type your destination below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setStatusNote('Could not activate microphone. Please type or tap your destination below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Open / Close Lifecycle
  useEffect(() => {
    if (!voiceSimOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
      return;
    }

    // When modal opens, start listening automatically
    startListening();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, [voiceSimOpen]);

  if (!voiceSimOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setVoiceSimOpen(false)}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Transit Voice Assistant"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border transition-all ${
              isListening 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            }`}>
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  {plainLanguage ? "Transit Voice Search" : "MetroPulse Voice Assistant"}
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isListening 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                  <span>{isListening ? 'LISTENING' : 'READY'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {plainLanguage ? "Speak your destination to find fastest route" : "Hands-free spoken destination routing & live search"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setVoiceSimOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Audio Visualizer & Big Mic Button */}
        <div className="py-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-5 relative overflow-hidden">
          {/* Animated Waveform Bars */}
          <div className="flex items-center justify-center space-x-1.5 h-10 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
              const heights = [14, 28, 40, 22, 36, 44, 28, 16, 42, 30, 20, 10, 32, 24, 12];
              const h = isListening || isSpeaking ? heights[bar - 1] : 8;
              return (
                <div
                  key={bar}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isListening 
                      ? 'bg-blue-600 dark:bg-blue-400' 
                      : isSpeaking 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>

          {/* Interactive Center Microphone Button */}
          <div className="relative mb-3">
            {isListening && (
              <span className="absolute -inset-2.5 rounded-full bg-blue-500/20 animate-ping"></span>
            )}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                isListening 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-200 dark:ring-blue-900/50 shadow-blue-500/30' 
                  : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-600 shadow-sm'
              }`}
              title={isListening ? "Tap to stop listening" : "Tap to speak your destination"}
              aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
            >
              {isListening ? (
                <Mic className="w-7 h-7 animate-pulse" />
              ) : (
                <MicOff className="w-6 h-6 text-slate-500 dark:text-slate-300" />
              )}
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {isListening ? "Listening... Speak your destination" : "Tap microphone to speak"}
          </div>

          {/* Spoken Query Feedback */}
          {transcript && (
            <div className="px-5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-semibold max-w-sm text-center truncate mb-2">
              "{transcript}"
            </div>
          )}

          {/* Active Status / Assistant Reply */}
          <div className="px-6 text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed min-h-[36px] flex items-center justify-center">
              "{activeMessage}"
            </p>
          </div>

          {/* Status Note or Permission Warning */}
          {statusNote && (
            <div className="mt-2 mx-4 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] font-medium text-amber-800 dark:text-amber-200 text-center">
              {statusNote}
            </div>
          )}
        </div>

        {/* Manual Type / Search Input Fallback */}
        <div className="mb-5">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (manualInput.trim()) {
                executeVoiceSearch(manualInput);
              }
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Or type destination (e.g. Grand Central, Airport)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-850 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!manualInput.trim() || isProcessing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Suggested Spoken Prompts / One-Tap Search */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{plainLanguage ? "Quick Spoken Commands:" : "Quick Voice Queries:"}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Tap to ask</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => executeVoiceSearch(action.query)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all group shadow-xs"
              >
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 truncate pr-2">
                  "{plainLanguage ? action.plainLabel : action.label}"
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Spoken voice response enabled</span>
          </span>
          <span>Web Speech API • Real-time</span>
        </div>
      </div>
    </div>
  );
}
