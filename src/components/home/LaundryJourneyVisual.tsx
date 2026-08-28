'use client';

import React, { useEffect, useRef, useState } from 'react';
import './laundry-cinematic.css';

/* ──────────────────────────────────────────────────────────────
   SVG DEFS — shared gradients, filters, patterns
   All scenes reference these defs via xlink:href / url(#...)
   ────────────────────────────────────────────────────────────── */
const SVGDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
    <defs>
      {/* ── METALLIC MACHINE BODY ── */}
      <linearGradient id="machineBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#F7F0F2" />
        <stop offset="30%"  stopColor="#E8DDE1" />
        <stop offset="60%"  stopColor="#E8DDE1" />
        <stop offset="100%" stopColor="#9A8D94" />
      </linearGradient>
      <linearGradient id="machineBodyV" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="20%"  stopColor="#FCF9F7" />
        <stop offset="70%"  stopColor="#E8DDE1" />
        <stop offset="100%" stopColor="#9A8D94" />
      </linearGradient>
      <linearGradient id="machineBodySide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#6F626A" />
        <stop offset="50%"  stopColor="#9A8D94" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>

      {/* ── GLASS DOOR ── */}
      <radialGradient id="glassBase" cx="38%" cy="35%" r="55%">
        <stop offset="0%"   stopColor="rgba(186,230,253,0.75)" />
        <stop offset="40%"  stopColor="rgba(147,197,253,0.50)" />
        <stop offset="80%"  stopColor="rgba(30,64,175,0.30)" />
        <stop offset="100%" stopColor="rgba(15,23,42,0.55)" />
      </radialGradient>
      <radialGradient id="glassHighlight" cx="30%" cy="25%" r="40%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.90)" />
        <stop offset="50%"  stopColor="rgba(255,255,255,0.30)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
      </radialGradient>
      <radialGradient id="glassRing" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#E8DDE1" />
        <stop offset="40%"  stopColor="#9A8D94" />
        <stop offset="85%"  stopColor="#6F626A" />
        <stop offset="100%" stopColor="#6F626A" />
      </radialGradient>

      {/* ── WATER ── */}
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="rgba(147,197,253,0.70)" />
        <stop offset="50%"  stopColor="rgba(59,130,246,0.55)" />
        <stop offset="100%" stopColor="rgba(29,78,216,0.70)" />
      </linearGradient>

      {/* ── DRUM INTERIOR ── */}
      <radialGradient id="drumInner" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#2B1326" />
        <stop offset="70%"  stopColor="#241A21" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      {/* ── FABRIC GRADIENTS ── */}
      <linearGradient id="fabricWhite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="30%"  stopColor="#FCF9F7" />
        <stop offset="70%"  stopColor="#E8DDE1" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>
      <linearGradient id="fabricWhiteH" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#F7F0F2" />
        <stop offset="20%"  stopColor="#ffffff" />
        <stop offset="80%"  stopColor="#F7F0F2" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>
      <linearGradient id="fabricBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#60a5fa" />
        <stop offset="40%"  stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="fabricJeans" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#4b8ed3" />
        <stop offset="50%"  stopColor="#1e40af" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="fabricTowel" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#10b981" />
        <stop offset="50%"  stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="fabricSaree" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#f59e0b" />
        <stop offset="50%"  stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="shirtFold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
      </linearGradient>

      {/* ── STEAM GRADIENTS ── */}
      <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.85)" stopOpacity="0.85" />
        <stop offset="60%"  stopColor="rgba(224,242,254,0.50)" stopOpacity="0.5" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.00)" stopOpacity="0" />
      </linearGradient>

      {/* ── IRON BODY ── */}
      <linearGradient id="ironGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#E8DDE1" />
        <stop offset="40%"  stopColor="#9A8D94" />
        <stop offset="100%" stopColor="#6F626A" />
      </linearGradient>

      {/* ── PACKAGE ── */}
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="60%"  stopColor="#FCF9F7" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>
      <linearGradient id="bagSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#E8DDE1" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>

      {/* ── GREEN ACCENT ── */}
      <linearGradient id="greenAccent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#15803d" />
        <stop offset="50%"  stopColor="#16a34a" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <linearGradient id="scanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(22,163,74,0)" />
        <stop offset="30%"  stopColor="rgba(22,163,74,0.9)" />
        <stop offset="70%"  stopColor="rgba(22,163,74,0.9)" />
        <stop offset="100%" stopColor="rgba(22,163,74,0)" />
      </linearGradient>

      {/* ── AMBIENT GLOW ── */}
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="rgba(220,252,231,0.80)" />
        <stop offset="60%"  stopColor="rgba(240,253,244,0.40)" />
        <stop offset="100%" stopColor="rgba(240,253,244,0.00)" />
      </radialGradient>
      <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="rgba(254,249,195,0.70)" />
        <stop offset="100%" stopColor="rgba(254,249,195,0.00)" />
      </radialGradient>
      <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="rgba(219,234,254,0.80)" />
        <stop offset="100%" stopColor="rgba(219,234,254,0.00)" />
      </radialGradient>

      {/* ── DOORSTEP ENVIRONMENT ── */}
      <linearGradient id="doorFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#2B1326" />
        <stop offset="100%" stopColor="#241A21" />
      </linearGradient>
      <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#334155" />
        <stop offset="100%" stopColor="#2B1326" />
      </linearGradient>
      <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#F7F0F2" />
        <stop offset="100%" stopColor="#E8DDE1" />
      </linearGradient>
      <radialGradient id="warmLight" cx="50%" cy="30%" r="60%">
        <stop offset="0%"   stopColor="rgba(254,249,195,0.90)" />
        <stop offset="60%"  stopColor="rgba(253,230,138,0.40)" />
        <stop offset="100%" stopColor="rgba(253,230,138,0.00)" />
      </radialGradient>

      {/* ── FILTERS ── */}
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(15,23,42,0.22)" />
      </filter>
      <filter id="deepShadow" x="-30%" y="-20%" width="160%" height="180%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="rgba(15,23,42,0.30)" />
        <feDropShadow dx="0" dy="4"  stdDeviation="4"  floodColor="rgba(15,23,42,0.15)" />
      </filter>
      <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
      <filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feFlood floodColor="#16a34a" floodOpacity="0.5" result="glow" />
        <feComposite in="glow" in2="blur" operator="in" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>

      {/* ── BUBBLE PATTERN ── */}
      <radialGradient id="bubbleGrad" cx="35%" cy="30%" r="60%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.95)" />
        <stop offset="50%"  stopColor="rgba(186,230,253,0.60)" />
        <stop offset="100%" stopColor="rgba(147,197,253,0.30)" />
      </radialGradient>

      {/* ── FOLD SHADOW ── */}
      <linearGradient id="foldShadow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.00)" />
      </linearGradient>
      <linearGradient id="foldHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.70)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
      </linearGradient>
    </defs>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 1 — CLOTHES COLLECTION
   Layered fabrics with realistic folds, highlights, shadows
   ────────────────────────────────────────────────────────────── */
const ClothesScene: React.FC = () => (
  <svg viewBox="0 0 400 380" fill="none" className="scene-svg" aria-hidden>
    {/* Background glow */}
    <ellipse cx="200" cy="200" rx="180" ry="160" fill="url(#bgGlow)" />

    {/* ── LAUNDRY BASKET ── */}
    {/* Basket shadow */}
    <ellipse cx="200" cy="358" rx="100" ry="14" fill="rgba(15,23,42,0.12)" className="cloth-float-shadow" />
    {/* Basket body */}
    <rect x="110" y="260" width="180" height="100" rx="8" fill="url(#machineBodyV)" filter="url(#softShadow)" />
    {/* Basket weave lines horizontal */}
    {[0,1,2,3,4].map(i => (
      <line key={i} x1="112" y1={276 + i * 20} x2="288" y2={276 + i * 20} stroke="#E8DDE1" strokeWidth="1" strokeOpacity="0.8" />
    ))}
    {/* Basket weave lines vertical */}
    {[0,1,2,3,4,5,6,7,8].map(i => (
      <line key={i} x1={118 + i * 20} y1="260" x2={118 + i * 20} y2="360" stroke="#E8DDE1" strokeWidth="1" strokeOpacity="0.5" />
    ))}
    {/* Basket rim */}
    <rect x="105" y="255" width="190" height="14" rx="4" fill="url(#machineBody)" />
    {/* Basket rim highlight */}
    <rect x="107" y="256" width="186" height="4" rx="2" fill="rgba(255,255,255,0.6)" />

    {/* ── SAREE (bottom, most layered back) ── */}
    <g className="cloth-gentle-float" style={{ animationDelay: '0.5s' }}>
      <path d="M135,258 Q158,210 200,195 Q242,210 265,258" fill="url(#fabricSaree)" />
      <path d="M145,258 Q165,218 200,205 Q235,218 255,258" fill="rgba(245,158,11,0.3)" />
      {/* Saree border pattern */}
      <path d="M135,258 Q158,210 200,195 Q242,210 265,258 Q250,245 200,235 Q150,245 135,258 Z" fill="none" stroke="#b45309" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M140,258 Q162,215 200,200 Q238,215 260,258" fill="none" stroke="rgba(255,200,80,0.4)" strokeWidth="1" />
      {/* Fold shadow on saree */}
      <path d="M200,195 Q195,220 194,258" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
    </g>

    {/* ── TOWEL ── */}
    <g className="cloth-gentle-float" style={{ animationDelay: '0.2s' }}>
      <path d="M130,256 C140,220 170,200 200,198 C230,200 260,220 270,256" fill="url(#fabricTowel)" filter="url(#softShadow)" />
      {/* Terry texture lines */}
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={138 + i * 22} y1="200" x2={136 + i * 22} y2="256" stroke="rgba(4,120,87,0.35)" strokeWidth="2" strokeDasharray="2 3" />
      ))}
      <path d="M130,256 C140,220 170,200 200,198 C230,200 260,220 270,256 C250,248 200,242 150,248 Z" fill="rgba(4,120,87,0.25)" />
      {/* Towel highlight */}
      <path d="M155,215 Q175,205 195,203" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* ── JEANS ── */}
    <g className="cloth-gentle-float" style={{ animationDelay: '0.8s' }}>
      <path d="M140,254 L148,170 Q200,155 252,170 L260,254" fill="url(#fabricJeans)" filter="url(#softShadow)" />
      {/* Jeans waistband */}
      <rect x="140" y="168" width="120" height="18" rx="3" fill="#1e3a8a" />
      <rect x="143" y="170" width="114" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
      {/* Jeans seam */}
      <line x1="200" y1="186" x2="200" y2="254" stroke="rgba(30,58,138,0.6)" strokeWidth="2" strokeDasharray="3 2" />
      {/* Jeans pockets */}
      <path d="M158,190 Q165,198 172,190" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M228,190 Q235,198 242,190" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* Jeans fade/highlight */}
      <path d="M148,170 L152,254 Q160,248 165,254 L158,170 Z" fill="rgba(147,197,253,0.12)" />
      <path d="M252,170 L248,254 Q240,248 235,254 L242,170 Z" fill="rgba(147,197,253,0.08)" />
    </g>

    {/* ── BLUE SHIRT ── */}
    <g className="cloth-gentle-float" style={{ animationDelay: '0.3s' }}>
      {/* Left sleeve */}
      <path d="M118,140 Q108,170 115,210 Q130,205 138,185 L145,140 Z" fill="url(#fabricBlue)" />
      <path d="M118,140 Q108,170 115,210 Q120,207 124,200 L130,140 Z" fill="rgba(255,255,255,0.12)" />
      {/* Right sleeve */}
      <path d="M282,140 Q292,170 285,210 Q270,205 262,185 L255,140 Z" fill="url(#fabricBlue)" />
      {/* Body */}
      <path d="M145,130 L118,148 L115,252 L285,252 L282,148 L255,130 Q230,118 200,115 Q170,118 145,130 Z" fill="url(#fabricBlue)" filter="url(#softShadow)" />
      {/* Collar */}
      <path d="M173,130 L200,148 L227,130 L215,120 Q200,115 185,120 Z" fill="url(#fabricBlue)" />
      <path d="M185,120 Q200,128 215,120 L210,130 Q200,122 190,130 Z" fill="#2563eb" />
      {/* Shirt buttons */}
      {[0,1,2,3].map(i => (
        <circle key={i} cx="200" cy={152 + i * 24} r="3" fill="rgba(255,255,255,0.5)" />
      ))}
      {/* Highlight on shoulder */}
      <path d="M145,130 Q160,125 175,128" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
      <path d="M225,128 Q240,125 255,130" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
      {/* Chest highlight */}
      <ellipse cx="175" cy="165" rx="14" ry="22" fill="rgba(255,255,255,0.10)" />
      {/* Fold on sleeve */}
      <path d="M120,170 Q125,185 122,200" fill="none" stroke="rgba(30,58,138,0.4)" strokeWidth="1.5" />
    </g>

    {/* ── WHITE SHIRT (top / foreground) ── */}
    <g className="cloth-gentle-float cloth-float-fg" style={{ animationDelay: '0s' }}>
      {/* Left sleeve */}
      <path d="M112,108 Q100,145 108,192 Q124,187 134,165 L140,108 Z" fill="url(#fabricWhite)" filter="url(#softShadow)" />
      <path d="M112,108 Q100,145 108,192 Q114,189 116,180 L122,108 Z" fill="rgba(255,255,255,0.7)" />
      {/* Right sleeve */}
      <path d="M288,108 Q300,145 292,192 Q276,187 266,165 L260,108 Z" fill="url(#fabricWhite)" filter="url(#softShadow)" />
      <path d="M278,108 Q288,145 286,180 Q290,185 292,192 Q296,158 288,108 Z" fill="rgba(200,210,220,0.3)" />
      {/* Body */}
      <path d="M140,97 L112,115 L108,248 L292,248 L288,115 L260,97 Q230,84 200,81 Q170,84 140,97 Z" fill="url(#fabricWhiteH)" filter="url(#deepShadow)" />
      {/* Collar */}
      <path d="M167,97 L200,118 L233,97 L220,86 Q200,81 180,86 Z" fill="url(#fabricWhite)" />
      <path d="M180,86 Q200,96 220,86 L215,97 Q200,89 185,97 Z" fill="#E8DDE1" />
      {/* Collar shadow */}
      <path d="M183,88 Q200,98 217,88" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" />
      {/* Placket */}
      <rect x="197" y="118" width="6" height="130" rx="1" fill="rgba(226,232,240,0.6)" />
      {/* Shirt buttons */}
      {[0,1,2,3,4].map(i => (
        <ellipse key={i} cx="200" cy={122 + i * 24} rx="3.5" ry="2.5" fill="rgba(203,213,225,0.9)" />
      ))}
      {/* Chest pocket */}
      <path d="M158,118 L174,118 L174,138 L158,138 Z" fill="none" stroke="rgba(203,213,225,0.7)" strokeWidth="1" />
      {/* Highlights */}
      <path d="M140,97 Q155,90 170,93" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
      <path d="M230,93 Q245,90 260,97" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="170" cy="140" rx="12" ry="28" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="228" cy="140" rx="10" ry="24" fill="rgba(255,255,255,0.10)" />
      {/* Fabric fold line */}
      <path d="M200,118 Q198,160 200,248" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
      {/* Arm fold shadows */}
      <path d="M115,148 Q118,170 114,190" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
      <path d="M285,148 Q282,170 286,190" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
    </g>

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">DOORSTEP COLLECTION</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 2 — WASHING MACHINE
   Photorealistic front-loader with glass door, water, drum
   ────────────────────────────────────────────────────────────── */
const WashingScene: React.FC = () => (
  <svg viewBox="0 0 400 420" fill="none" className="scene-svg" aria-hidden>
    {/* Background glow */}
    <ellipse cx="200" cy="210" rx="190" ry="180" fill="url(#blueGlow)" />

    {/* ── MACHINE AMBIENT SHADOW ── */}
    <ellipse cx="200" cy="398" rx="115" ry="14" fill="rgba(15,23,42,0.18)" />

    {/* ── MACHINE BACK PANEL (depth) ── */}
    <rect x="68" y="36" width="264" height="350" rx="18" fill="#9A8D94" opacity="0.25" />

    {/* ── MACHINE BODY ── */}
    <rect x="64" y="32" width="272" height="354" rx="18" fill="url(#machineBodyV)" filter="url(#deepShadow)" />

    {/* Body edge highlight */}
    <rect x="64" y="32" width="272" height="354" rx="18" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
    <rect x="66" y="34" width="268" height="3" rx="1.5" fill="rgba(255,255,255,0.9)" />

    {/* ── TOP CONTROL PANEL ── */}
    <rect x="64" y="32" width="272" height="72" rx="18" fill="url(#doorFrameGrad)" />
    <rect x="64" y="82" width="272" height="22" rx="0" fill="#2B1326" />
    {/* Panel highlight edge */}
    <rect x="66" y="34" width="268" height="2" rx="1" fill="rgba(255,255,255,0.15)" />

    {/* Display screen */}
    <rect x="82" y="44" width="120" height="46" rx="6" fill="#241A21" />
    <rect x="84" y="46" width="116" height="42" rx="5" fill="#111827" />
    {/* Display glow */}
    <rect x="86" y="48" width="112" height="38" rx="4" fill="#22c55e" opacity="0.15" />
    {/* Display text */}
    <text x="142" y="62" textAnchor="middle" fontSize="8" fill="#4ade80" fontFamily="monospace" letterSpacing="1">WASHING</text>
    <text x="142" y="76" textAnchor="middle" fontSize="7" fill="#86efac" fontFamily="monospace">34:00 • COTTON</text>
    {/* Display dots */}
    <circle cx="88" cy="82" r="3" fill="#4ade80" opacity="0.8" className="wash-blink" />

    {/* Control dial 1 — temperature */}
    <circle cx="228" cy="58" r="22" fill="#2B1326" />
    <circle cx="228" cy="58" r="20" fill="url(#glassRing)" />
    <circle cx="228" cy="58" r="15" fill="#241A21" />
    <circle cx="228" cy="58" r="12" fill="#2B1326" />
    {/* Dial markers */}
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const r = angle * Math.PI / 180;
      const x1 = 228 + 16 * Math.sin(r), y1 = 58 - 16 * Math.cos(r);
      const x2 = 228 + 19 * Math.sin(r), y2 = 58 - 19 * Math.cos(r);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />;
    })}
    {/* Dial pointer */}
    <line x1="228" y1="58" x2="228" y2="46" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
    <circle cx="228" cy="58" r="3" fill="#4ade80" />

    {/* Control dial 2 — spin */}
    <circle cx="310" cy="58" r="20" fill="#2B1326" />
    <circle cx="310" cy="58" r="18" fill="url(#glassRing)" />
    <circle cx="310" cy="58" r="13" fill="#241A21" />
    <circle cx="310" cy="58" r="10" fill="#2B1326" />
    <line x1="310" y1="58" x2="316" y2="48" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
    <circle cx="310" cy="58" r="3" fill="#93c5fd" />

    {/* ── DOOR RECESS ── */}
    <circle cx="200" cy="234" r="128" fill="#E8DDE1" />
    <circle cx="200" cy="234" r="125" fill="#9A8D94" />

    {/* ── DOOR RING (chrome bezel) ── */}
    <circle cx="200" cy="234" r="122" fill="url(#glassRing)" filter="url(#softShadow)" />

    {/* Ring highlights */}
    <path d="M 105,180 A 122,122 0 0 1 295,180" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
    <path d="M 108,295 A 122,122 0 0 0 292,295" fill="none" stroke="rgba(15,23,42,0.3)" strokeWidth="3" />

    {/* ── DRUM BACKGROUND ── */}
    <circle cx="200" cy="234" r="110" fill="url(#drumInner)" />

    {/* Drum fins/holes pattern */}
    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
      const angle = (i * 30) * Math.PI / 180;
      const r = 90;
      const cx = 200 + r * Math.sin(angle);
      const cy = 234 - r * Math.cos(angle);
      return <circle key={i} cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.08)" />;
    })}

    {/* ── WATER LAYER ── */}
    <clipPath id="drumClip"><circle cx="200" cy="234" r="110" /></clipPath>
    <rect x="90" y="289" width="220" height="55" fill="url(#waterGrad)" clipPath="url(#drumClip)" opacity="0.75" className="water-slosh" />
    {/* Water surface wave */}
    <path d="M90,289 Q125,283 160,289 Q200,295 240,289 Q275,283 310,289" fill="none" stroke="rgba(147,197,253,0.6)" strokeWidth="2" clipPath="url(#drumClip)" className="water-wave" />

    {/* ── ROTATING CLOTHES IN DRUM ── */}
    <g clipPath="url(#drumClip)" className="drum-spin">
      {/* Clothes tumbling */}
      <ellipse cx="185" cy="210" rx="28" ry="18" fill="url(#fabricWhite)" opacity="0.85" />
      <path d="M168,204 Q185,194 202,204" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <ellipse cx="225" cy="245" rx="24" ry="15" fill="url(#fabricBlue)" opacity="0.8" />
      <ellipse cx="175" cy="252" rx="20" ry="12" fill="url(#fabricTowel)" opacity="0.75" />
      <ellipse cx="215" cy="215" rx="16" ry="10" fill="url(#fabricJeans)" opacity="0.8" />
    </g>

    {/* ── BUBBLES ── */}
    <g clipPath="url(#drumClip)">
      {[
        { cx: 150, cy: 270, r: 7, delay: '0s' },
        { cx: 170, cy: 255, r: 5, delay: '0.3s' },
        { cx: 200, cy: 265, r: 9, delay: '0.6s' },
        { cx: 230, cy: 260, r: 6, delay: '0.15s' },
        { cx: 250, cy: 275, r: 8, delay: '0.45s' },
        { cx: 140, cy: 285, r: 5, delay: '0.8s' },
        { cx: 215, cy: 248, r: 4, delay: '0.2s' },
        { cx: 185, cy: 280, r: 6, delay: '0.55s' },
        { cx: 260, cy: 265, r: 5, delay: '0.9s' },
        { cx: 165, cy: 243, r: 4, delay: '0.35s' },
      ].map((b, i) => (
        <g key={i} className="bubble-rise" style={{ animationDelay: b.delay }}>
          <circle cx={b.cx} cy={b.cy} r={b.r} fill="url(#bubbleGrad)" />
          <circle cx={b.cx - b.r * 0.4} cy={b.cy - b.r * 0.4} r={b.r * 0.3} fill="rgba(255,255,255,0.8)" />
        </g>
      ))}
    </g>

    {/* ── GLASS DOOR OVERLAY ── */}
    <circle cx="200" cy="234" r="110" fill="url(#glassBase)" />
    <circle cx="200" cy="234" r="110" fill="url(#glassHighlight)" />
    {/* Glass reflection streaks */}
    <path d="M 145,148 Q 165,158 158,178" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeLinecap="round" />
    <path d="M 168,140 Q 182,148 178,162" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Glass rim reflection */}
    <path d="M 110,200 A 110,110 0 0 1 155,138" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
    {/* Droplets on glass */}
    {[
      { x: 168, y: 148 }, { x: 188, y: 142 }, { x: 155, y: 162 },
      { x: 240, y: 155 }, { x: 258, y: 168 }, { x: 224, y: 144 },
    ].map((d, i) => (
      <g key={i} className="droplet-run" style={{ animationDelay: `${i * 0.4}s` }}>
        <ellipse cx={d.x} cy={d.y} rx="3" ry="5" fill="rgba(186,230,253,0.7)" />
        <ellipse cx={d.x - 1} cy={d.y - 2} rx="1.5" ry="2" fill="rgba(255,255,255,0.8)" />
      </g>
    ))}

    {/* ── HANDLE ── */}
    <rect x="291" y="220" width="14" height="30" rx="7" fill="url(#glassRing)" />
    <rect x="293" y="222" width="6" height="26" rx="3" fill="rgba(255,255,255,0.3)" />

    {/* ── BOTTOM PANEL ── */}
    <rect x="64" y="350" width="272" height="36" rx="0" fill="#2B1326" />
    <rect x="64" y="368" width="272" height="18" rx="0" fill="url(#doorFrameGrad)" style={{ borderRadius: '0 0 18px 18px' }} />
    {/* Panel vents */}
    {[0,1,2,3,4].map(i => (
      <rect key={i} x={86 + i * 38} y="357" width="26" height="4" rx="2" fill="#334155" />
    ))}
    {/* Power light */}
    <circle cx="290" cy="360" r="5" fill="#22c55e" className="wash-blink" />
    <circle cx="290" cy="360" r="3" fill="#4ade80" />

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">EXPERT WASHING</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 3 — STEAM PRESSING
   Professional iron + ironing board + realistic steam
   ────────────────────────────────────────────────────────────── */
const SteamScene: React.FC = () => (
  <svg viewBox="0 0 400 380" fill="none" className="scene-svg" aria-hidden>
    {/* Background glow */}
    <ellipse cx="200" cy="200" rx="190" ry="160" fill="url(#blueGlow)" />

    {/* ── IRONING BOARD ── */}
    {/* Board shadow */}
    <ellipse cx="205" cy="372" rx="140" ry="10" fill="rgba(15,23,42,0.15)" />
    {/* Board legs */}
    <line x1="160" y1="310" x2="130" y2="368" stroke="#6F626A" strokeWidth="4" strokeLinecap="round" />
    <line x1="250" y1="310" x2="280" y2="368" stroke="#6F626A" strokeWidth="4" strokeLinecap="round" />
    <line x1="145" y1="340" x2="265" y2="340" stroke="#6F626A" strokeWidth="3" strokeLinecap="round" />
    {/* Board surface */}
    <path d="M68,285 Q80,275 200,272 Q320,275 338,285 L330,312 Q200,318 75,312 Z" fill="#F7F0F2" filter="url(#softShadow)" />
    <path d="M68,285 Q80,275 200,272 Q320,275 338,285 L330,290 Q200,295 75,290 Z" fill="rgba(255,255,255,0.7)" />
    {/* Board pattern */}
    {[0,1,2,3,4,5,6].map(i => (
      <line key={i} x1={80 + i * 40} y1="276" x2={78 + i * 40} y2="312" stroke="rgba(203,213,225,0.5)" strokeWidth="1" />
    ))}
    {/* Board edge */}
    <path d="M68,285 Q80,275 200,272 Q320,275 338,285" fill="none" stroke="#E8DDE1" strokeWidth="1.5" />

    {/* ── SHIRT ON BOARD ── */}
    {/* Left sleeve */}
    <path d="M92,282 Q74,270 72,255 Q76,245 88,248 L102,278 Z" fill="url(#fabricWhite)" />
    <path d="M76,258 Q80,250 88,252" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
    {/* Right sleeve */}
    <path d="M308,282 Q326,270 328,255 Q324,245 312,248 L298,278 Z" fill="url(#fabricWhite)" />
    {/* Shirt body on board */}
    <path d="M102,272 L100,200 Q200,190 300,200 L298,272" fill="url(#fabricWhiteH)" filter="url(#softShadow)" />
    {/* Collar */}
    <path d="M168,200 L200,216 L232,200 L220,192 Q200,188 180,192 Z" fill="url(#fabricWhite)" />
    <path d="M180,192 Q200,202 220,192 L215,200 Q200,194 185,200 Z" fill="#E8DDE1" />
    {/* Shirt buttons */}
    {[0,1,2].map(i => <circle key={i} cx="200" cy={220 + i * 22} r="3" fill="rgba(203,213,225,0.8)" />)}
    {/* Wrinkle lines (animated away by iron) */}
    <g className="crease-smooth">
      <path d="M135,225 Q155,218 175,225" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M225,232 Q245,225 265,232" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M140,250 Q165,243 185,250" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="1" strokeLinecap="round" />
    </g>
    {/* Shirt highlight */}
    <ellipse cx="158" cy="235" rx="16" ry="28" fill="rgba(255,255,255,0.25)" />

    {/* ── STEAM IRON ── */}
    <g className="iron-glide">
      {/* Iron body */}
      <path d="M118,195 Q138,172 175,168 L240,168 L258,178 L260,198 Q210,204 170,200 Q140,200 118,195 Z" fill="url(#ironGrad)" filter="url(#deepShadow)" />
      {/* Iron soleplate */}
      <path d="M120,198 Q138,196 175,194 L240,194 L258,200 L260,204 Q210,207 170,205 Q140,206 120,204 Z" fill="url(#machineBody)" />
      {/* Soleplate holes */}
      {[0,1,2,3,4,5].map(i => (
        <ellipse key={i} cx={148 + i * 18} cy={201} rx="2.5" ry="2" fill="rgba(15,23,42,0.3)" />
      ))}
      {[0,1,2,3].map(i => (
        <ellipse key={i} cx={157 + i * 18} cy={207} rx="2.5" ry="2" fill="rgba(15,23,42,0.25)" />
      ))}
      {/* Iron handle */}
      <path d="M165,168 L168,138 Q200,128 232,138 L235,168 Q200,162 165,168 Z" fill="#2B1326" />
      <path d="M168,140 Q200,132 232,140" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      {/* Handle grip texture */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={175} y={142 + i * 6} width={50} height={2} rx={1} fill="rgba(255,255,255,0.06)" />
      ))}
      {/* Iron top highlight */}
      <path d="M145,175 Q175,168 215,170" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
      {/* Water window */}
      <ellipse cx="200" cy="178" rx="15" ry="8" fill="rgba(147,197,253,0.4)" />
      <ellipse cx="200" cy="178" rx="12" ry="6" fill="rgba(186,230,253,0.5)" />
    </g>

    {/* ── STEAM JETS ── */}
    <g className="steam-jets-group">
      {[148, 162, 178, 194, 210, 226, 240].map((x, i) => (
        <g key={i} className="steam-puff" style={{ animationDelay: `${i * 0.12}s` }}>
          <ellipse cx={x} cy={195} rx="4" ry="8" fill="url(#steamGrad)" filter="url(#steamBlur)" />
        </g>
      ))}
    </g>

    {/* ── STEAM CLOUDS RISING ── */}
    <g className="steam-rise-group">
      {[0,1,2,3,4].map(i => (
        <g key={i} className="steam-cloud-rise" style={{ animationDelay: `${i * 0.35}s`, animationDuration: `2.${i}s` }}>
          <ellipse
            cx={140 + i * 32} cy={175}
            rx={12 + i * 2} ry={18 + i * 3}
            fill="url(#steamGrad)"
            filter="url(#steamBlur)"
          />
        </g>
      ))}
    </g>

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">STEAM PRESSING</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 4 — QUALITY CHECK
   Clean garment on inspection station, green scan laser
   ────────────────────────────────────────────────────────────── */
const QualityScene: React.FC = () => (
  <svg viewBox="0 0 400 380" fill="none" className="scene-svg" aria-hidden>
    <ellipse cx="200" cy="200" rx="180" ry="155" fill="url(#bgGlow)" />

    {/* ── INSPECTION TABLE ── */}
    <ellipse cx="200" cy="372" rx="140" ry="10" fill="rgba(15,23,42,0.12)" />
    <rect x="76" y="305" width="248" height="60" rx="8" fill="url(#machineBodyV)" filter="url(#softShadow)" />
    <rect x="76" y="305" width="248" height="10" rx="5" fill="url(#machineBody)" />
    <rect x="78" y="306" width="244" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
    {/* LED strip */}
    <rect x="80" y="338" width="240" height="3" rx="1.5" fill="#22c55e" opacity="0.4" className="quality-led-pulse" />

    {/* ── FOLDED GARMENT STACK ── */}
    <g filter="url(#softShadow)">
      {/* Fold 3 — bottom */}
      <rect x="118" y="270" width="164" height="40" rx="6" fill="url(#fabricBlue)" />
      <rect x="120" y="272" width="160" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <line x1="200" y1="270" x2="200" y2="310" stroke="rgba(30,58,138,0.3)" strokeWidth="1" />

      {/* Fold 2 — middle */}
      <rect x="126" y="250" width="148" height="28" rx="5" fill="url(#fabricWhite)" />
      <rect x="128" y="252" width="144" height="4" rx="2" fill="rgba(255,255,255,0.8)" />
      <rect x="132" y="260" width="136" height="2" rx="1" fill="rgba(203,213,225,0.5)" />

      {/* Fold 1 — top, pristine shirt */}
      <rect x="134" y="230" width="132" height="28" rx="5" fill="url(#fabricWhiteH)" />
      <rect x="136" y="232" width="128" height="4" rx="2" fill="rgba(255,255,255,0.9)" />
      {/* Collar visible */}
      <path d="M176,230 L200,242 L224,230 L217,224 Q200,220 183,224 Z" fill="url(#fabricWhite)" />
      <path d="M185,224 Q200,234 215,224" fill="none" stroke="rgba(203,213,225,0.7)" strokeWidth="1" />
      {/* Shirt label on fold */}
      <rect x="191" y="247" width="18" height="10" rx="2" fill="rgba(203,213,225,0.6)" />
      <text x="200" y="255" textAnchor="middle" fontSize="5" fill="#6F626A">S/M</text>
    </g>

    {/* ── GREEN SCAN LINE ── */}
    <g className="scan-sweep">
      <rect x="88" y="228" width="224" height="2" rx="1" fill="url(#scanLineGrad)" />
      <rect x="88" y="226" width="224" height="6" rx="3" fill="url(#scanLineGrad)" opacity="0.3" />
      {/* Scan glow */}
      <rect x="88" y="215" width="224" height="28" rx="4"
        fill="rgba(22,163,74,0.06)"
      />
    </g>

    {/* ── QUALITY CHECKMARK REVEAL ── */}
    <g className="quality-check-reveal">
      <circle cx="200" cy="175" r="36" fill="rgba(220,252,231,0.7)" />
      <circle cx="200" cy="175" r="36" fill="none" stroke="#16a34a" strokeWidth="2.5" />
      {/* Check path */}
      <path d="M183,175 L195,187 L218,162" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="check-draw" />
    </g>

    {/* ── QUALITY TEXT ── */}
    <g className="quality-text-reveal">
      <rect x="132" y="138" width="136" height="26" rx="13" fill="rgba(220,252,231,0.95)" />
      <rect x="132" y="138" width="136" height="26" rx="13" fill="none" stroke="#bbf7d0" strokeWidth="1" />
      <text x="200" y="156" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#15803d" letterSpacing="1.5">QUALITY CHECKED ✓</text>
    </g>

    {/* Scan corner marks */}
    <path d="M 88,225 L 88,215 L 98,215" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.6" />
    <path d="M 312,225 L 312,215 L 302,215" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.6" />
    <path d="M 88,265 L 88,275 L 98,275" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.6" />
    <path d="M 312,265 L 312,275 L 302,275" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.6" />

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">QUALITY CHECK</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 5 — PREMIUM PACKAGING
   Fold animation into laundry bag with brand
   ────────────────────────────────────────────────────────────── */
const PackagingScene: React.FC = () => (
  <svg viewBox="0 0 400 400" fill="none" className="scene-svg" aria-hidden>
    <ellipse cx="200" cy="210" rx="180" ry="160" fill="url(#bgGlow)" />

    {/* ── BAG SHADOW ── */}
    <ellipse cx="200" cy="390" rx="105" ry="12" fill="rgba(15,23,42,0.14)" />

    {/* ── PACKAGING BAG BODY ── */}
    <g filter="url(#deepShadow)">
      {/* Bag back face */}
      <rect x="106" y="118" width="188" height="250" rx="12" fill="url(#machineBodyV)" />

      {/* Bag front face */}
      <rect x="96" y="112" width="208" height="256" rx="14" fill="url(#bagGrad)" />
      {/* Side highlight edge */}
      <rect x="96" y="112" width="208" height="256" rx="14" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
      {/* Top highlight */}
      <rect x="98" y="114" width="204" height="5" rx="2.5" fill="rgba(255,255,255,0.9)" />

      {/* ── GREEN BRAND RIBBON ── */}
      <rect x="96" y="112" width="208" height="20" rx="14" fill="url(#greenAccent)" />
      <rect x="96" y="122" width="208" height="10" rx="0" fill="url(#greenAccent)" />
      {/* Ribbon highlight */}
      <rect x="98" y="114" width="204" height="4" rx="2" fill="rgba(255,255,255,0.25)" />

      {/* ── BRAND LOGO AREA ── */}
      {/* Logo circle */}
      <circle cx="200" cy="182" r="38" fill="rgba(240,253,244,0.8)" />
      <circle cx="200" cy="182" r="38" fill="none" stroke="#bbf7d0" strokeWidth="1.5" />
      {/* Laundry icon inside */}
      <circle cx="200" cy="182" r="26" fill="none" stroke="#16a34a" strokeWidth="2.5" />
      <circle cx="200" cy="182" r="20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Water drops */}
      <path d="M193,175 Q200,165 207,175 Q207,182 200,185 Q193,182 193,175 Z" fill="#16a34a" />

      {/* Brand name */}
      <text x="200" y="238" textAnchor="middle" fontSize="13" fontWeight="800" fill="#241A21" letterSpacing="1">LAUNDRY FRESH</text>
      {/* Brand tagline */}
      <text x="200" y="256" textAnchor="middle" fontSize="8.5" fill="#6F626A" letterSpacing="2">DOORSTEP • CLEAN • CARE</text>

      {/* Divider */}
      <line x1="116" y1="265" x2="284" y2="265" stroke="#E8DDE1" strokeWidth="1" />

      {/* ── FRESH TAG ── */}
      <rect x="145" y="276" width="110" height="28" rx="14" fill="rgba(220,252,231,0.95)" />
      <rect x="145" y="276" width="110" height="28" rx="14" fill="none" stroke="#bbf7d0" strokeWidth="1" />
      <text x="200" y="295" textAnchor="middle" fontSize="9" fontWeight="800" fill="#15803d" letterSpacing="2">FRESH • CLEAN • READY</text>

      {/* Bottom info */}
      <text x="200" y="338" textAnchor="middle" fontSize="8" fill="#9A8D94" letterSpacing="1">HANDLE WITH CARE</text>
    </g>

    {/* ── HANDLES ── */}
    <path d="M150,112 Q142,72 152,56 Q170,42 180,56 Q184,72 176,112" fill="none" stroke="#9A8D94" strokeWidth="6" strokeLinecap="round" filter="url(#softShadow)" />
    <path d="M250,112 Q258,72 248,56 Q230,42 220,56 Q216,72 224,112" fill="none" stroke="#9A8D94" strokeWidth="6" strokeLinecap="round" filter="url(#softShadow)" />
    {/* Handle sheen */}
    <path d="M152,108 Q145,76 153,58" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
    <path d="M248,108 Q255,76 247,58" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">PREMIUM PACKAGING</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE 6 — DOORSTEP DELIVERY
   Package handed at modern home entrance
   ────────────────────────────────────────────────────────────── */
const DeliveryScene: React.FC = () => (
  <svg viewBox="0 0 400 400" fill="none" className="scene-svg" aria-hidden>

    {/* ── WARM LIGHT ATMOSPHERE ── */}
    <ellipse cx="200" cy="180" rx="200" ry="180" fill="url(#warmLight)" />

    {/* ── HOUSE / DOORWAY ── */}
    {/* Wall */}
    <rect x="0" y="85" width="400" height="315" fill="url(#floorGrad)" />
    {/* Brick texture suggestion */}
    {[0,1,2,3].map(row => (
      [0,1,2,3,4].map(col => (
        <rect key={`${row}-${col}`}
          x={col * 82 + (row % 2) * 41} y={88 + row * 22}
          width="78" height="18" rx="2"
          fill="rgba(203,213,225,0.3)" stroke="rgba(241,245,249,0.8)" strokeWidth="1"
        />
      ))
    ))}
    {/* Wall highlight top */}
    <rect x="0" y="85" width="400" height="6" fill="rgba(255,255,255,0.4)" />

    {/* ── DOOR FRAME ── */}
    <rect x="124" y="82" width="152" height="250" rx="0" fill="url(#doorFrameGrad)" filter="url(#deepShadow)" />
    {/* Door frame molding */}
    <rect x="122" y="80" width="156" height="254" rx="4" fill="none" stroke="#334155" strokeWidth="6" />
    <rect x="124" y="82" width="152" height="254" rx="2" fill="none" stroke="#6F626A" strokeWidth="2" />

    {/* ── DOOR ── */}
    <rect x="130" y="88" width="140" height="244" rx="2" fill="url(#doorGrad)" />
    {/* Door panels */}
    <rect x="138" y="98"  width="56" height="76" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <rect x="206" y="98"  width="56" height="76" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <rect x="138" y="184" width="56" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <rect x="206" y="184" width="56" height="100" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    {/* Doorknob */}
    <circle cx="262" cy="215" r="7" fill="url(#glassRing)" />
    <circle cx="262" cy="215" r="5" fill="#9A8D94" />
    <circle cx="260" cy="213" r="2" fill="rgba(255,255,255,0.5)" />
    {/* Door number */}
    <text x="200" y="160" textAnchor="middle" fontSize="18" fontWeight="800" fill="rgba(255,255,255,0.15)">42</text>

    {/* Warm interior light spilling through */}
    <rect x="130" y="88" width="140" height="244" rx="2" fill="rgba(254,249,195,0.06)" />

    {/* ── FLOOR / DOORSTEP ── */}
    <rect x="0" y="320" width="400" height="80" fill="#E8DDE1" />
    <rect x="0" y="320" width="400" height="4" fill="rgba(255,255,255,0.5)" />
    {/* Step */}
    <rect x="90" y="324" width="220" height="18" rx="4" fill="#E8DDE1" />
    <rect x="90" y="324" width="220" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
    {/* Floor reflection */}
    <ellipse cx="200" cy="342" rx="120" ry="12" fill="rgba(22,163,74,0.06)" />

    {/* ── DELIVERY BAG ── */}
    <g className="delivery-arrive" filter="url(#deepShadow)">
      {/* Bag body */}
      <rect x="148" y="255" width="104" height="70" rx="8" fill="url(#bagGrad)" />
      <rect x="148" y="255" width="104" height="70" rx="8" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      {/* Green ribbon */}
      <rect x="148" y="255" width="104" height="12" rx="8" fill="url(#greenAccent)" />
      <rect x="148" y="261" width="104" height="6" rx="0" fill="url(#greenAccent)" />
      <rect x="150" y="256" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      {/* Brand on bag */}
      <text x="200" y="286" textAnchor="middle" fontSize="9" fontWeight="800" fill="#241A21">LAUNDRY FRESH</text>
      <text x="200" y="300" textAnchor="middle" fontSize="7" fill="#6F626A" letterSpacing="1.5">FRESH • CLEAN</text>
      {/* Checkmark badge */}
      <circle cx="200" cy="316" r="10" fill="rgba(220,252,231,0.9)" />
      <circle cx="200" cy="316" r="10" fill="none" stroke="#16a34a" strokeWidth="1.5" />
      <path d="M193,316 L198,321 L208,308" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Handles */}
      <path d="M168,255 Q163,232 170,220 Q185,210 190,220 Q193,232 188,255" fill="none" stroke="#9A8D94" strokeWidth="5" strokeLinecap="round" />
      <path d="M232,255 Q237,232 230,220 Q215,210 210,220 Q207,232 212,255" fill="none" stroke="#9A8D94" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* ── RECEIVING HANDS (silhouette) ── */}
    <g className="hands-receive">
      {/* Left hand */}
      <path d="M112,322 Q120,308 142,302 Q156,298 165,305 L172,318 Q155,312 145,318 Q130,322 120,332 Z" fill="#f5f0e8" opacity="0.65" />
      <path d="M114,324 Q122,312 142,306" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      {/* Right hand */}
      <path d="M288,322 Q280,308 258,302 Q244,298 235,305 L228,318 Q245,312 255,318 Q270,322 280,332 Z" fill="#f5f0e8" opacity="0.65" />
    </g>

    {/* ── FINAL TAGLINE ── */}
    <g className="delivery-tagline">
      <text x="200" y="368" textAnchor="middle" fontSize="15" fontWeight="800" fill="#241A21" letterSpacing="-0.3">Fresh Clothes. Zero Effort.</text>
    </g>

    {/* ── SCENE LABEL ── */}
    <text x="200" y="22" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="3" fill="#9A8D94" className="scene-label-text">DOORSTEP DELIVERY</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────
   SCENE PROGRESS STEPPER
   ────────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: '🧺', label: 'PICKUP' },
  { icon: '💧', label: 'WASH' },
  { icon: '♨️', label: 'PRESS' },
  { icon: '✅', label: 'CHECK' },
  { icon: '📦', label: 'PACK' },
  { icon: '🚚', label: 'DELIVER' },
];

const ProgressStepper: React.FC<{ active: number; onSelect: (i: number) => void }> = ({ active, onSelect }) => (
  <div className="cj-stepper" role="tablist" aria-label="Journey stage">
    {STEPS.map((s, i) => (
      <button
        key={s.label}
        role="tab"
        aria-selected={i === active}
        onClick={() => onSelect(i)}
        className={`cj-step ${i === active ? 'cj-step--active' : i < active ? 'cj-step--done' : ''}`}
        aria-label={`Scene: ${s.label}`}
      >
        <span className="cj-step-icon">{s.icon}</span>
        <span className="cj-step-label">{s.label}</span>
        {i < STEPS.length - 1 && (
          <span className={`cj-step-line ${i < active ? 'cj-step-line--done' : ''}`} />
        )}
      </button>
    ))}
  </div>
);

/* ──────────────────────────────────────────────────────────────
   MAIN EXPORT — LaundryJourneyVisual
   ────────────────────────────────────────────────────────────── */
const SCENES_LIST = [
  { Component: ClothesScene,  duration: 3000 },
  { Component: WashingScene,  duration: 4000 },
  { Component: SteamScene,    duration: 3000 },
  { Component: QualityScene,  duration: 2500 },
  { Component: PackagingScene,duration: 2500 },
  { Component: DeliveryScene, duration: 3000 },
];

export const LaundryJourneyVisual: React.FC = () => {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisible = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Intersection observer — pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(el);
    document.addEventListener('visibilitychange', () => {
      isVisible.current = document.visibilityState === 'visible';
    });
    return () => obs.disconnect();
  }, []);

  // Auto-advance scenes
  const scheduleNext = (currentIdx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const duration = SCENES_LIST[currentIdx].duration;
    timerRef.current = setTimeout(() => {
      if (isVisible.current) {
        const next = (currentIdx + 1) % SCENES_LIST.length;
        setActive(next);
        scheduleNext(next);
      } else {
        // Retry later
        timerRef.current = setTimeout(() => scheduleNext(currentIdx), 500);
      }
    }, duration);
  };

  useEffect(() => {
    if (reducedMotion) return;
    scheduleNext(active);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const handleSelect = (i: number) => {
    setActive(i);
    if (!reducedMotion) {
      if (timerRef.current) clearTimeout(timerRef.current);
      scheduleNext(i);
    }
  };

  return (
    <div
      ref={containerRef}
      className="cj-container"
      role="region"
      aria-label="Laundry service journey animation"
    >
      {/* Shared SVG defs (zero render size) */}
      <SVGDefs />

      {/* ── BACKGROUND DEPTH LAYERS ── */}
      <div className="cj-bg-layer" aria-hidden>
        <div className="cj-bg-orb cj-bg-orb-1" />
        <div className="cj-bg-orb cj-bg-orb-2" />
        <div className="cj-bg-orb cj-bg-orb-3" />
      </div>

      {/* ── SCENE STAGE ── */}
      <div className="cj-stage" aria-live="polite" aria-atomic>
        {SCENES_LIST.map(({ Component }, i) => (
          <div
            key={i}
            className={`cj-scene-slot ${i === active ? 'cj-scene--active' : 'cj-scene--hidden'}`}
            aria-hidden={i !== active}
          >
            {/* Camera zoom + subtle pan */}
            <div className={`cj-camera-wrap ${i === active ? 'cj-camera-active' : ''}`}>
              <Component />
            </div>
          </div>
        ))}
      </div>

      {/* ── PROGRESS STEPPER ── */}
      <ProgressStepper active={active} onSelect={handleSelect} />

      {/* ── REDUCED MOTION LABEL ── */}
      {reducedMotion && (
        <p className="cj-reduced-note">Animation paused (reduced motion enabled)</p>
      )}
    </div>
  );
};
