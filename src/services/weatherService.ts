import { OPEN_WEATHER_API_KEY, OPEN_WEATHER_BASE_URL } from '../config';
import WeatherResponse from '../types/Weather';

// Consulta el clima actual de una ciudad por nombre.
// Lanza un error con el status HTTP para que el componente decida qué mensaje mostrar.
export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    q: `${city},CO`,
    appid: OPEN_WEATHER_API_KEY,
    units: 'metric', // grados Celsius
    lang: 'es'        // descripciones en español
  });

  const response = await fetch(`${OPEN_WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    // Si falla con el país, intentar sin ",CO" como respaldo
    const fallbackParams = new URLSearchParams({
      q: city,
      appid: OPEN_WEATHER_API_KEY,
      units: 'metric',
      lang: 'es'
    });
    const fallbackResponse = await fetch(`${OPEN_WEATHER_BASE_URL}?${fallbackParams.toString()}`);
    if (!fallbackResponse.ok) {
      const error: any = new Error('Error al consultar el clima');
      error.status = fallbackResponse.status;
      throw error;
    }
    return fallbackResponse.json();
  }

  return response.json();
}

// Construye la URL del ícono del clima que devuelve OpenWeather
export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Consulta el clima de múltiples ciudades en paralelo utilizando Promise.allSettled
// para que el fallo de una sola ciudad no interrumpa la carga de las demás.
export async function getWeatherForCities(cities: string[]): Promise<Map<string, WeatherResponse | null>> {
  const results = new Map<string, WeatherResponse | null>();

  // 1. Usar Promise.allSettled sobre cities.map(city => getWeatherByCity(city))
  const settledResults = await Promise.allSettled(
    cities.map(city => getWeatherByCity(city))
  );

  // 2. Recorrer los resultados con forEach (result, index)
  settledResults.forEach((result, index) => {
    const cityName = cities[index];
    // 3. Si result.status === "fulfilled", guardar result.value
    if (result.status === 'fulfilled') {
      results.set(cityName, result.value);
    } else {
      // 4. Si falló, registrar advertencia y guardar null
      console.warn(`No se pudo obtener el clima para "${cityName}":`, result.reason);
      results.set(cityName, null);
    }
  });

  return results;
}
