// Shared visual language constants for Motion Canvas animations.
// Import from '../_shared/theme' in any scene.tsx.
//
// Customize these per-presentation to match your color scheme.

export const COLORS = {
  bg: '#0f0f0f',

  // Primary accent
  accent: '#2dd4bf',
  accentText: '#ffffff',

  // Context / secondary
  context: '#1e1e2e',
  contextText: '#8888aa',

  // Labels and secondary
  label: '#444455',
  arrow: '#555566',
  dimText: '#666677',
  subtle: '#333344',

  // Message array roles (useful for agent/chat visualizations)
  user: '#3b82f6',        // blue-500
  userBg: '#1e3a5f',
  assistant: '#22c55e',   // green-500
  assistantBg: '#1a3d2a',
  toolCall: '#2dd4bf',    // teal (matches accent)
  toolCallBg: '#1a3d3d',
  toolResult: '#a78bfa',  // purple-400
  toolResultBg: '#2d1f5e',
  system: '#6b7280',      // gray-500
  systemBg: '#1f2937',

  // Failure / error
  error: '#ef4444',       // red-500
  errorBg: '#3d1a1a',

  // Zones
  llmZone: '#1a1a2e',
  infraZone: '#1a2e1a',
  boundary: '#555566',

  white: '#ffffff',
  black: '#000000',
};

export const FONT = 'monospace';

export const SIZES = {
  tokenFont: 48,
  labelFont: 28,
  smallFont: 22,
  titleFont: 64,
  subtitleFont: 40,
  tokenPadding: [16, 28] as [number, number],
  tokenRadius: 14,
  tokenGap: 14,
  rowGap: 24,
  messageGap: 12,
  messagePadding: [14, 24] as [number, number],
  messageRadius: 12,
};
