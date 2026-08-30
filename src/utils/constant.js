export const BASE_URL = location.hostname === 'localhost' ? 'http://localhost:7777' : '/api';

export const THEMES = [
  { id: 'light', name: 'Light', type: 'light', color: '#ffffff' },
  { id: 'dark', name: 'Dark', type: 'dark', color: '#1d232a' },
  { id: 'cupcake', name: 'Cupcake', type: 'light', color: '#faf7f5' },
  { id: 'emerald', name: 'Emerald', type: 'light', color: '#ffffff' },
  { id: 'nord', name: 'Nord', type: 'light', color: '#eceff4' },
  { id: 'dim', name: 'Dim', type: 'dark', color: '#2a323c' },
  { id: 'dracula', name: 'Dracula', type: 'dark', color: '#282a36' },
  { id: 'synthwave', name: 'Synthwave', type: 'dark', color: '#1a103c' },
  { id: 'sunset', name: 'Sunset', type: 'dark', color: '#121c24' },
];
