export const COLORS = {
  bg: '#000000',
  surface: '#111111',
  surface2: '#1a1a1a',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  border: '#27272a',
  inputBg: '#1a1a1a',
} as const;

export const SCREEN = {
  SNAP_THRESHOLD: 0.4,
  VELOCITY_THRESHOLD: 0.5,
} as const;

export const CHATS = [
  { id: '1', name: 'General', lastMessage: 'Hello everyone!', time: '10:30' },
  { id: '2', name: 'Random', lastMessage: 'Check this out', time: '09:15' },
  { id: '3', name: 'Support', lastMessage: 'Thanks for help', time: 'Yesterday' },
] as const;

export const MESSAGES = [
  { id: '1', text: 'Hey there!', sender: 'other' as const, time: '10:30' },
  { id: '2', text: 'Hi! How are you?', sender: 'me' as const, time: '10:31' },
  { id: '3', text: 'Doing great, thanks!', sender: 'other' as const, time: '10:32' },
] as const;
