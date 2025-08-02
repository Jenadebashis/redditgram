export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

// Derive the WebSocket URL from the API origin, allowing an explicit override.
const apiUrl = new URL(API_BASE_URL);
const wsScheme = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
const derivedWsUrl = `${wsScheme}//${apiUrl.host}`;

// Override the WebSocket URL by setting VITE_WS_BASE_URL in your environment.
export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL || derivedWsUrl;
