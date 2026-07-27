import React from 'react';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';

export type SymbolState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'low-energy' | 'success' | 'error';

interface LivingSymbolProps {
  state: SymbolState;
  volume?: number;
  size?: number; // px — display size
}

export const LivingSymbol: React.FC<LivingSymbolProps> = ({ state, volume = 0, size = 38 }) => {
  // Map SKY SymbolState -> thinking-orbs OrbState
  const getOrbState = (s: SymbolState): OrbState => {
    switch (s) {
      case 'listening':
        return 'listening';
      case 'thinking':
        return 'solving';
      case 'speaking':
        return 'composing';
      case 'success':
        return 'shaping';
      case 'error':
        return 'searching';
      case 'low-energy':
        return 'working';
      case 'idle':
      default:
        return 'working';
    }
  };

  // Map SKY SymbolState -> SKY signature color palette
  const getColorTheme = (s: SymbolState) => {
    switch (s) {
      case 'listening':
        return {
          primary: '#22d3ee', // Cyan
          glow: 'rgba(34, 211, 238, 0.7)',
          bg: 'rgba(34, 211, 238, 0.25)',
          speed: 1 + volume * 2.5,
        };
      case 'thinking':
        return {
          primary: '#a855f7', // Purple
          glow: 'rgba(168, 85, 247, 0.7)',
          bg: 'rgba(168, 85, 247, 0.25)',
          speed: 1.0,
        };
      case 'speaking':
        return {
          primary: '#6366f1', // Indigo
          glow: 'rgba(99, 102, 241, 0.7)',
          bg: 'rgba(99, 102, 241, 0.25)',
          speed: 1.2,
        };
      case 'success':
        return {
          primary: '#22c55e', // Green
          glow: 'rgba(34, 197, 94, 0.8)',
          bg: 'rgba(34, 197, 94, 0.3)',
          speed: 1.0,
        };
      case 'error':
        return {
          primary: '#ef4444', // Red
          glow: 'rgba(239, 68, 68, 0.8)',
          bg: 'rgba(239, 68, 68, 0.3)',
          speed: 1.0,
        };
      case 'low-energy':
        return {
          primary: '#f59e0b', // Amber
          glow: 'rgba(245, 158, 11, 0.5)',
          bg: 'rgba(245, 158, 11, 0.15)',
          speed: 0.4,
        };
      case 'idle':
      default:
        return {
          primary: '#818cf8', // Indigo/Blue
          glow: 'rgba(99, 102, 241, 0.5)',
          bg: 'rgba(99, 102, 241, 0.18)',
          speed: 0.6,
        };
    }
  };

  const theme = getColorTheme(state);
  const orbState = getOrbState(state);
  const orbPresetSize = size <= 28 ? 20 : 64;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Dynamic atmospheric background glow tinted with SKY state color */}
      <div
        style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${theme.bg} 0%, ${theme.glow} 45%, transparent 70%)`,
          opacity: 0.9,
          filter: 'blur(4px)',
          transition: 'background 400ms ease, opacity 400ms ease',
        }}
      />

      {/* ThinkingOrb from thinking-orbs library */}
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `drop-shadow(0 0 4px ${theme.primary}) drop-shadow(0 0 8px ${theme.glow})`,
          transition: 'filter 400ms ease',
        }}
      >
        <ThinkingOrb
          state={orbState}
          size={orbPresetSize}
          theme="dark"
          speed={theme.speed}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </div>
    </div>
  );
};
