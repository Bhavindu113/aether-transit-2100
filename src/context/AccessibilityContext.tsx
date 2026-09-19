'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FontSizeOption } from '../types/accessibility';
import { PLAIN_LANGUAGE_DICTIONARY, translatePlain } from '../data/plainLanguage';

interface AccessibilityContextType {
  highContrast: boolean;
  plainLanguage: boolean;
  fontSize: FontSizeOption;
  voiceSimOpen: boolean;
  emergencyOpen: boolean;
  toggleHighContrast: () => void;
  togglePlainLanguage: () => void;
  setFontSize: (size: FontSizeOption) => void;
  setVoiceSimOpen: (open: boolean) => void;
  setEmergencyOpen: (open: boolean) => void;
  t: (text: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [plainLanguage, setPlainLanguage] = useState<boolean>(false);
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('standard');
  const [voiceSimOpen, setVoiceSimOpen] = useState<boolean>(false);
  const [emergencyOpen, setEmergencyOpen] = useState<boolean>(false);

  // Apply root classes and CSS variables based on state
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // High contrast class applied to both root html and body
    if (highContrast) {
      root.classList.add('high-contrast-mode', 'dark');
      if (body) body.classList.add('high-contrast-mode', 'dark');
    } else {
      root.classList.remove('high-contrast-mode', 'dark');
      if (body) body.classList.remove('high-contrast-mode', 'dark');
    }

    // Font size scaling
    root.classList.remove('font-scale-standard', 'font-scale-large', 'font-scale-xlarge');
    root.classList.add(`font-scale-${fontSize}`);

    if (fontSize === 'standard') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    }
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const togglePlainLanguage = () => setPlainLanguage(prev => !prev);
  const setFontSize = (size: FontSizeOption) => setFontSizeState(size);

  const t = (text: string) => {
    return translatePlain(text, plainLanguage);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        plainLanguage,
        fontSize,
        voiceSimOpen,
        emergencyOpen,
        toggleHighContrast,
        togglePlainLanguage,
        setFontSize,
        setVoiceSimOpen,
        setEmergencyOpen,
        t
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
