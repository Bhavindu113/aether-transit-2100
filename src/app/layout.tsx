import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { TransitProvider } from '../context/TransitContext';
import Footer from '../components/navigation/Footer';
import AccessibilitySuite from '../components/accessibility/AccessibilitySuite';
import VoiceAssistantModal from '../components/voice/VoiceAssistantModal';
import EmergencyModal from '../components/emergency/EmergencyModal';

export const metadata: Metadata = {
  title: 'CityTransit | Urban Journey Planner & Live Fleet Map',
  description: 'Smart, human-centered public transit planner engineered for universal accessibility, real-time vehicle arrivals, and clean zero-emission travel.',
  keywords: ['City Transit', 'Public Transportation', 'Metro', 'Bus Tracker', 'Accessible Transit', 'Journey Planner'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="subtle-mesh ambient-lighting min-h-screen text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 antialiased">
        <AccessibilityProvider>
          <TransitProvider>
            {/* Main Application Shell */}
            <div className="flex-1 flex flex-col pb-16 md:pb-0">
              {children}
              <Footer />
            </div>

            {/* Persistent Assistive Modals & Overlays */}
            <AccessibilitySuite />
            <VoiceAssistantModal />
            <EmergencyModal />
          </TransitProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
