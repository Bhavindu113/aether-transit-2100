export type FontSizeOption = 'standard' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  highContrast: boolean;
  plainLanguage: boolean;
  fontSize: FontSizeOption;
  reducedMotion: boolean;
  voiceSimActive: boolean;
  screenReaderDescriptions: boolean;
}
