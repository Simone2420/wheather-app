import { OPEN_WEATHER_API_KEY, OPEN_WEATHER_BASE_URL } from '../config';
import WeatherResponse from '../types/Weather';
import { DepartmentGeo } from '../data/colombiaDepartments';

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

// Consulta el clima de las 33 capitales de Colombia en paralelo
export async function getColombiaWeather(departments: DepartmentGeo[]): Promise<Record<string, WeatherResponse | null>> {
  // Creamos un array de promesas llamando a getWeatherByCity por cada capital
  const promises = departments.map(depto => getWeatherByCity(`${depto.capital}, CO`));

  // Promise.allSettled permite que si una petición falla, las demás sigan procesándose
  const results = await Promise.allSettled(promises);

  // Mapearemos el resultado con el nombre del departamento como clave
  const weatherMap: Record<string, WeatherResponse | null> = {};

  results.forEach((result, index) => {
    const deptoName = departments[index].name;
    if (result.status === 'fulfilled') {
      weatherMap[deptoName] = result.value;
    } else {
      console.error(`Falló el clima para ${deptoName} (${departments[index].capital}):`, result.reason);
      weatherMap[deptoName] = null;
    }
  });

  return weatherMap;
}
