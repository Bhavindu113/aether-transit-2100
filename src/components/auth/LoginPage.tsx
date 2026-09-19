'use client';

import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import Logo from '../brand/Logo';
import { 
  Mail, 
  Lock, 
  CreditCard, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  AlertCircle,
  QrCode,
  Smartphone,
  Globe
} from 'lucide-react';

export default function LoginPage() {
  const { setActiveScreen, login } = useTransit();
  const { plainLanguage, highContrast } = useAccessibility();

  // Mode: 'email' | 'smartcard'
  const [authMode, setAuthMode] = useState<'email' | 'smartcard'>('email');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cardId, setCardId] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'email') {
        if (!email) {
          setErrorMsg('Please enter a valid commuter email address.');
          return;
        }
        login({
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email: email,
          cardId: 'TP-9921-504',
          balanceCredits: 62.40,
          passType: 'Metro Express Annual',
          tripsToday: 1
        });
      } else {
        if (!cardId) {
          setErrorMsg('Please enter your 9-digit Transit SmartCard number.');
          return;
        }
        login({
          name: 'Jordan Lee',
          email: 'jordan.lee@commuter.transit.gov',
          cardId: cardId.toUpperCase(),
          balanceCredits: 35.00,
          passType: 'Metropolitan Flex',
          tripsToday: 3
        });
      }
    }, 700);
  };

  // Demo Login Handler
  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: 'Alex Chen',
        email: 'alex.chen@citytransit.gov',
        cardId: 'TP-8492-019',
        balanceCredits: 48.50,
        passType: 'Metro Express Annual',
        tripsToday: 2
      });
    }, 400);
  };

  return (
    <div className="py-4 sm:py-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Navigation / Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            highContrast
              ? 'bg-slate-900 text-slate-200 hover:text-white border border-slate-700 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-sm hover:bg-slate-50'
          }`}
          aria-label="Back to Transit Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{plainLanguage ? "Back to Travel Planner" : "Return to Journey Planner"}</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-semibold ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
            Secure Commuter Gateway
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Main Grid: Split Visual Showcase + Authentication Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Visual Brand Showcase & Network Highlights */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#040812] border border-slate-800 text-white shadow-2xl min-h-[460px]">
          
          {/* Subtle Graphic Mesh & Deep Radial Glow Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.35),transparent_60%)] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>METROPOLITAN TRANSIT AUTHORITY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              One account for every bus, train & river route.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Sign in to manage your digital commuter pass, top up journey credits, track live vehicle telemetry, and personalize step-free accessibility preferences.
            </p>
          </div>

          {/* Centerpiece: Digital Metro SmartPass Card Preview */}
          <div className="relative z-10 my-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-blue-950/90 backdrop-blur-md border border-white/25 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-extrabold tracking-wider text-white">METROPULSE PASS</span>
                </div>
                <QrCode className="w-5 h-5 text-blue-300 opacity-80" />
              </div>

              <div className="pt-2">
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Commuter ID</div>
                <div className="text-base sm:text-lg font-mono font-black tracking-wider text-white">
                  TP • 8492 • 019
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                <span className="text-blue-200">Balance: <strong className="text-emerald-400 font-bold">$48.50</strong></span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active Pass
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Highlights */}
          <div className="relative z-10 pt-2 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span className="text-blue-100 font-medium">256-Bit Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span className="text-blue-100 font-medium">Zero-Emission Fleet</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Login Form Container */}
        <div className={`lg:col-span-7 rounded-3xl border p-6 sm:p-10 shadow-lg transition-colors flex flex-col justify-between ${
          highContrast ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          <div>
            {/* Logo & Welcome Header */}
            <div className="mb-6 space-y-2">
              <Logo size="lg" showTagline={true} />
              
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight pt-3 ${
                highContrast ? 'text-white' : 'text-slate-900'
              }`}>
                {plainLanguage ? "Sign In to Your Travel Account" : "Sign In to Commuter Portal"}
              </h1>
              <p className={`text-xs sm:text-sm font-normal ${
                highContrast ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {plainLanguage
                  ? "Type your email or travel card number to see your trips and passes."
                  : "Access your metropolitan transit passes, travel history, and real-time alerts."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className={`grid grid-cols-2 p-1.5 rounded-2xl border mb-6 transition-colors ${
              highContrast ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => { setAuthMode('email'); setErrorMsg(''); }}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'email'
                    ? highContrast
                      ? 'bg-slate-900 text-white shadow-sm border border-slate-600'
                      : 'bg-white text-blue-700 shadow-sm'
                    : highContrast
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Commuter Email</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('smartcard'); setErrorMsg(''); }}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'smartcard'
                    ? highContrast
                      ? 'bg-slate-900 text-white shadow-sm border border-slate-600'
                      : 'bg-white text-blue-700 shadow-sm'
                    : highContrast
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Transit SmartCard</span>
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'email' ? (
                <>
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${
                      highContrast ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {plainLanguage ? "Your Email:" : "Commuter Email Address"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex.chen@citytransit.gov"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
                          highContrast
                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className={`block text-xs font-bold uppercase tracking-wider ${
                        highContrast ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {plainLanguage ? "Your Password:" : "Password"}
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered commuter email.')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
                          highContrast
                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* SmartCard ID Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${
                      highContrast ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {plainLanguage ? "Card Serial Number:" : "Transit SmartCard Serial (9 Digits)"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardId}
                        onChange={(e) => setCardId(e.target.value)}
                        placeholder="TP-8492-019"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm font-mono uppercase tracking-wider rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
                          highContrast
                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className={`text-[11px] ${highContrast ? 'text-slate-400' : 'text-slate-500'}`}>
                      Printed on the bottom-right of your physical contactless transit card.
                    </p>
                  </div>

                  {/* SmartCard PIN Field */}
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold uppercase tracking-wider ${
                      highContrast ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {plainLanguage ? "Card Security PIN:" : "4-Digit Card Security PIN"}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        value={cardPin}
                        onChange={(e) => setCardPin(e.target.value)}
                        placeholder="••••"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
                          highContrast
                            ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className={`text-xs font-medium ${highContrast ? 'text-slate-300' : 'text-slate-600'}`}>
                    Remember this device for 30 days
                  </span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Authenticating with Metro Grid...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'email' ? 'Sign In to Account' : 'Access SmartCard Passes'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Commuter Login Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 shadow-sm ${
                  highContrast
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick One-Click Demo Commuter Sign In (Alex Chen • Annual Pass)</span>
              </button>
            </div>

            {/* Social SSO Options */}
            <div className="pt-5 space-y-3">
              <div className="relative flex items-center justify-center">
                <div className={`w-full border-t ${highContrast ? 'border-slate-800' : 'border-slate-200'}`}></div>
                <span className={`absolute px-3 text-[11px] uppercase tracking-wider font-bold ${
                  highContrast ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
                }`}>
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    highContrast
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    highContrast
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Apple ID / Passkey</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Assistance */}
          <div className={`pt-6 mt-6 border-t text-center text-xs ${
            highContrast ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Need assistance with a lost card? </span>
            <button
              onClick={() => alert('Metropolitan Transit 24/7 Commuter Line: 1-800-555-METRO')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Contact 24/7 Transit Support
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
