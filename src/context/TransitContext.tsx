'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RouteOption, TransportMode, RealtimeAlert } from '../types/transit';
import { VehicleTelemetry } from '../types/telemetry';
import { INITIAL_ROUTES, RECALCULATED_OPTIMAL_ROUTE } from '../data/mockRoutes';
import { INITIAL_VEHICLES } from '../data/mockVehicles';

export type ScreenTab = 'home' | 'journey' | 'map' | 'login';

export interface UserProfile {
  name: string;
  email: string;
  cardId: string;
  balanceCredits: number;
  passType: 'Metro Express Annual' | 'Metropolitan Flex' | 'Standard Commuter';
  tripsToday: number;
}

interface TransitContextType {
  activeScreen: ScreenTab;
  setActiveScreen: (screen: ScreenTab) => void;
  originLocation: string;
  destinationLocation: string;
  setOriginLocation: (loc: string) => void;
  setDestinationLocation: (loc: string) => void;
  swapLocations: () => void;
  selectedMode: TransportMode;
  setSelectedMode: (mode: TransportMode) => void;
  routes: RouteOption[];
  selectedRoute: RouteOption;
  setSelectedRoute: (route: RouteOption) => void;
  activeAlert: RealtimeAlert | null;
  isRecalculating: boolean;
  recalculateBetterRoute: () => void;
  hasRerouted: boolean;
  vehicles: VehicleTelemetry[];
  selectedVehicle: VehicleTelemetry;
  setSelectedVehicle: (v: VehicleTelemetry) => void;
  currentTimeString: string;
  selectQuickDestination: (dest: string) => void;
  user: UserProfile | null;
  login: (customData?: Partial<UserProfile>) => void;
  logout: () => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

export function TransitProvider({ children }: { children: ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>('home');
  const [originLocation, setOriginLocation] = useState<string>('Airport Terminal 1');
  const [destinationLocation, setDestinationLocation] = useState<string>('Grand Central Station');
  const [selectedMode, setSelectedMode] = useState<TransportMode>('all');
  const [routes, setRoutes] = useState<RouteOption[]>(INITIAL_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(INITIAL_ROUTES[0]);
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTelemetry>(INITIAL_VEHICLES[0]);
  const [hasRerouted, setHasRerouted] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [currentTimeString, setCurrentTimeString] = useState<string>('08:42 AM');
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (customData?: Partial<UserProfile>) => {
    setUser({
      name: customData?.name || 'Alex Chen',
      email: customData?.email || 'alex.chen@citytransit.gov',
      cardId: customData?.cardId || 'TP-8492-019',
      balanceCredits: customData?.balanceCredits ?? 48.50,
      passType: customData?.passType || 'Metro Express Annual',
      tripsToday: customData?.tripsToday ?? 2
    });
    setActiveScreen('home');
  };

  const logout = () => {
    setUser(null);
  };

  // Real-time alert simulation
  const [activeAlert, setActiveAlert] = useState<RealtimeAlert | null>({
    id: 'alert-traffic-01',
    type: 'traffic',
    title: 'Traffic conditions changed',
    plainTitle: 'Route delay alert',
    message: 'Your current route may take 6 minutes longer.',
    plainMessage: 'There is a slight road delay. You can save 6 minutes with an alternative route.',
    severity: 'warning',
    extraMinutes: 6,
    canReroute: true
  });

  // Simulated digital clock ticker & realistic vehicle telemetry updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTimeString(`${formattedHours}:${mins}:${secs} ${ampm}`);

      // Periodic vehicle telemetry updates
      setVehicles(prevVehicles =>
        prevVehicles.map(v => {
          // Slight speed fluctuation ± 2 km/h
          const deltaSpeed = Math.floor(Math.random() * 5) - 2;
          const newSpeed = Math.max(v.speedKmH + deltaSpeed, 30);

          // Count down arrival seconds
          let newSeconds = v.etaCountdownSeconds - 1;
          let newMinutes = v.etaCountdownMinutes;
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes = Math.max(0, newMinutes - 1);
          }

          // Small distance countdown
          const newDistance = Math.max(0.1, Number((v.distanceRemainingKm - 0.02).toFixed(1)));

          // Progress on route
          let newProgress = v.routeCoordinates.currentProgress + 0.004;
          if (newProgress > 1) newProgress = 0.05;

          return {
            ...v,
            speedKmH: newSpeed,
            etaCountdownSeconds: newSeconds,
            etaCountdownMinutes: newMinutes,
            distanceRemainingKm: newDistance,
            routeCoordinates: {
              ...v.routeCoordinates,
              currentProgress: newProgress
            }
          };
        })
      );
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Update selected vehicle reference whenever vehicles array updates
  useEffect(() => {
    const updated = vehicles.find(v => v.vehicleId === selectedVehicle.vehicleId);
    if (updated) {
      setSelectedVehicle(updated);
    }
  }, [vehicles, selectedVehicle.vehicleId]);

  const swapLocations = () => {
    setOriginLocation(destinationLocation);
    setDestinationLocation(originLocation);
  };

  const selectQuickDestination = (dest: string) => {
    setDestinationLocation(dest);
  };

  const recalculateBetterRoute = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setSelectedRoute(RECALCULATED_OPTIMAL_ROUTE);
      setHasRerouted(true);
      setIsRecalculating(false);
      setActiveAlert(null); // Clear alert once rerouted
    }, 1200);
  };

  return (
    <TransitContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        originLocation,
        destinationLocation,
        setOriginLocation,
        setDestinationLocation,
        swapLocations,
        selectedMode,
        setSelectedMode,
        routes,
        selectedRoute,
        setSelectedRoute,
        activeAlert,
        isRecalculating,
        recalculateBetterRoute,
        hasRerouted,
        vehicles,
        selectedVehicle,
        setSelectedVehicle,
        currentTimeString,
        selectQuickDestination,
        user,
        login,
        logout
      }}
    >
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}
