// La API key se lee desde .env.local (nunca se sube al repositorio).
// Cada integrante del equipo debe crear su propio .env.local con su propia key.
// Ver .env.example como plantilla.
export const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY as string;
export const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
