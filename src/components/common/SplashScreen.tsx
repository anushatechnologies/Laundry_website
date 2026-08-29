'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  appName?: string;
  tagline?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  appName = 'LaundryFresh',
  tagline = 'LUXURY FABRIC CARE & DOORSTEP LAUNDRY',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showTagline, setShowTagline] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. Character-by-character typewriter effect
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < appName.length) {
        setDisplayText(appName.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Show tagline after typing completes
        setTimeout(() => {
          setShowTagline(true);
          // Wait briefly, then trigger the smooth curtain slide-up
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsRemoved(true);
              onComplete?.();
            }, 900); // 900ms exit animation duration
          }, 1100);
        }, 300);
      }
    }, 110); // 110ms per character for crisp, elegant pacing

    return () => clearInterval(typingInterval);
  }, [appName, onComplete]);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#1C0B18] via-[#2B1326] to-[#120510] text-white transition-all duration-[900ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isExiting
          ? '-translate-y-full opacity-90 scale-[0.98] pointer-events-none'
          : 'translate-y-0 opacity-100 scale-100'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Ambient background glow & soft bubble rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#5B214F]/40 to-[#D6B36A]/20 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#5B214F]/30 rounded-full blur-[90px]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#D6B36A]/15 rounded-full blur-[80px]" />
        
        {/* Floating particle bubbles */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/25 rounded-full animate-bounce duration-1000" />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-[#D6B36A]/30 rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white/40 rounded-full" />
      </div>

      {/* Center Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
        {/* Glowing App Logo Emblem */}
        <div className="relative mb-7 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D6B36A] via-[#5B214F] to-[#D6B36A] rounded-[28px] blur-md opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] bg-[#2B1326] border border-[#D6B36A]/40 p-3.5 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="LaundryFresh Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Dynamic Typewriter Brand Name */}
        <div className="min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-poppins flex items-center">
            <span>
              {displayText.slice(0, 7)}
              {displayText.length > 7 && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6B36A] via-[#F3E5AB] to-[#D6B36A]">
                  {displayText.slice(7)}
                </span>
              )}
            </span>
            {/* Glowing Blinking Cursor */}
            <span
              className={`inline-block w-1.5 h-8 sm:h-10 ml-1.5 bg-[#D6B36A] rounded-full shadow-[0_0_12px_#D6B36A] ${
                displayText.length === appName.length ? 'animate-ping' : 'animate-pulse'
              }`}
            />
          </h1>
        </div>

        {/* Tagline Fade In */}
        <div
          className={`transition-all duration-700 ease-out mt-3 ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#D6B36A] uppercase font-poppins">
            {tagline}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/10 text-[11px] font-semibold text-white/70">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
              5-Star Care
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Ozone Hygiene
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Bar indicator */}
      <div className="absolute bottom-8 w-44 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#5B214F] via-[#D6B36A] to-white rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, (displayText.length / appName.length) * 80 + (showTagline ? 20 : 0))}%`,
          }}
        />
      </div>
    </div>
  );
};
