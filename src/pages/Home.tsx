import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonIcon, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from '@ionic/react';
import {
  locationOutline,
  alertCircleOutline,
  thermometerOutline,
  waterOutline,
  speedometerOutline,
  arrowDownOutline
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { getWeatherByCity, getIconUrl } from '../services/weatherService';
import WeatherResponse from '../types/Weather';
import './Home.css';

const Home: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const buscarClima = async () => {
    const ciudad = city.trim();

    if (!ciudad) {
      setError('Escribe el nombre de una ciudad.');
      return;
    }

    // Reiniciamos los estados antes de cada consulta
    setIsLoading(true);
    setError('');
    setWeather(null);

    try {
      const data = await getWeatherByCity(ciudad);
      setWeather(data);
    } catch (err: any) {
      if (err.status === 404) {
        setError('No se encontró esa ciudad. Verifica el nombre.');
      } else if (err.status === 401) {
        setError('API Key inválida. Revisa src/config.ts.');
      } else {
        setError('Ocurrió un error al consultar el clima. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hook para buscar el clima de Buenos Aires al cargar la app
  
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clima Actual</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Clima Actual</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonInput
            label="Ciudad"
            labelPlacement="stacked"
            value={city}
            onIonInput={(e) => setCity(e.detail.value ?? '')}
            placeholder="Ingresa una ciudad"
            ></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={buscarClima} >
          Consultar clima
        </IonButton>
        </IonList>
        {/* Estado: cargando */}
        {isLoading && (
          <div className="estado-container">
            <IonSpinner name="crescent" color="primary" />
            <p>Consultando el clima...</p>
          </div>
        )}
        {/* Estado: error */}
        {error && !isLoading && (
          <IonText color="danger">
            <p className="mensaje-error">
              <IonIcon icon={alertCircleOutline} />
              {error}
            </p>
          </IonText>
        )}
        {weather && !isLoading && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>{weather.name}, {weather.sys.country}</IonCardSubtitle>
              <IonCardTitle>{Math.round(weather.main.temp)}°C</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <div className="clima-principal">
                <img src={getIconUrl(weather.weather[0].icon)} alt="icono del clima" />
                <p className="descripcion">{weather.weather[0].description}</p>
              </div>

              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={thermometerOutline} slot="start" />
                  <IonLabel>Sensación térmica: {Math.round(weather.main.feels_like)}°C</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={waterOutline} slot="start" />
                  <IonLabel>Humedad: {weather.main.humidity}%</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={speedometerOutline} slot="start" />
                  <IonLabel>Viento: {weather.wind.speed} m/s</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={arrowDownOutline} slot="start" />
                  <IonLabel>
                    Mín/Máx: {Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;
