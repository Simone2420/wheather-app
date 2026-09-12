import { OPEN_WEATHER_API_KEY, OPEN_WEATHER_BASE_URL } from '../config';
import WeatherResponse from '../types/Weather';

// Consulta el clima actual de una ciudad por nombre.
// Lanza un error con el status HTTP para que el componente decida qué mensaje mostrar.
export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    q: city,
    appid: OPEN_WEATHER_API_KEY,
    units: 'metric', // grados Celsius
    lang: 'es'        // descripciones en español
  });

  const response = await fetch(`${OPEN_WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const error: any = new Error('Error al consultar el clima');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Construye la URL del ícono del clima que devuelve OpenWeather
export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
