import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {
  arrowDownOutline,
  closeOutline,
  refreshOutline,
  speedometerOutline,
  thermometerOutline,
  waterOutline
} from 'ionicons/icons';
import {
  departments,
  DepartmentGeo,
  MAP_WIDTH,
  MAP_HEIGHT
} from '../data/colombiaDepartments';
import { getWeatherForCities, getIconUrl } from '../services/weatherService';
import WeatherResponse from '../types/Weather';
import './MapaClima.css';

/**
 * Convierte la temperatura en grados Celsius a un código de color:
 * - Frío (< 15°C): Azul (#2b6cb0)
 * - Templado (15°C - 24°C): Verde (#38a169)
 * - Cálido (> 24°C): Rojo (#e53e3e)
 * - Sin datos / Fallo: Gris (#a0aec0)
 */
function temperaturaAColor(temp?: number): string {
  if (temp === undefined || temp === null || isNaN(temp)) {
    return '#a0aec0';
  }
  if (temp < 15) {
    return '#2b6cb0'; // Frío
  }
  if (temp <= 24) {
    return '#38a169'; // Templado
  }
  return '#e53e3e';   // Cálido
}

const MapaClima: React.FC = () => {
  const [climas, setClimas] = useState<Map<string, WeatherResponse | null>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deptoSeleccionado, setDeptoSeleccionado] = useState<DepartmentGeo | null>(null);

  const consultarCapitales = async () => {
    setIsLoading(true);
    try {
      const capitales = departments.map((d) => d.capital);
      const resultados = await getWeatherForCities(capitales);
      setClimas(resultados);

      // Checkpoint 3: Confirmar en consola los datos de las 33 capitales
      console.log('✅ Clima cargado para las 33 capitales:', resultados);
    } catch (err) {
      console.error('Error al consultar capitales:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    consultarCapitales();
  }, []);

  const climaSeleccionado = deptoSeleccionado
    ? climas.get(deptoSeleccionado.capital)
    : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clima por Departamento</IonTitle>
          <IonButtons slot="end">
            <IonButton
              disabled={isLoading}
              onClick={consultarCapitales}
              aria-label="Actualizar datos del clima"
            >
              <IonIcon icon={refreshOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        {isLoading ? (
          <div className="mapa-loading-container">
            <IonSpinner name="crescent" color="primary" />
            <p>Consultando el clima de las 33 capitales en paralelo...</p>
          </div>
        ) : (
          <div className="mapa-wrapper">
            {/* Reto Adicional: Leyenda visual de escala de temperatura */}
            <div className="leyenda-container">
              <div className="leyenda-item">
                <span className="leyenda-color frio" />
                <span>Frío (&lt; 15°C)</span>
              </div>
              <div className="leyenda-item">
                <span className="leyenda-color templado" />
                <span>Templado (15°C - 24°C)</span>
              </div>
              <div className="leyenda-item">
                <span className="leyenda-color calido" />
                <span>Cálido (&gt; 24°C)</span>
              </div>
              <div className="leyenda-item">
                <span className="leyenda-color sin-datos" />
                <span>Sin datos</span>
              </div>
            </div>

            <p className="depto-indicador-ayuda">
              Toca cualquier departamento para consultar los detalles climáticos de su capital.
            </p>

            {/* Mapa SVG interactivo */}
            <div className="mapa-svg-container">
              <svg
                className="mapa-svg"
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                {departments.map((dept) => {
                  const clima = climas.get(dept.capital);
                  const temp = clima?.main?.temp;
                  const color = temperaturaAColor(temp);
                  const isSelected = deptoSeleccionado?.name === dept.name;

                  return (
                    <path
                      key={dept.name}
                      d={dept.path}
                      fill={color}
                      className={`depto-path ${isSelected ? 'seleccionado' : ''}`}
                      onClick={() => setDeptoSeleccionado(dept)}
                    >
                      <title>
                        {dept.name} ({dept.capital})
                        {temp !== undefined ? ` - ${Math.round(temp)}°C` : ' - Sin datos'}
                      </title>
                    </path>
                  );
                })}
              </svg>
            </div>

            {/* Detalle del departamento seleccionado (Parte 4) */}
            {deptoSeleccionado && (
              <IonCard className="detalle-card">
                <IonCardHeader>
                  <div className="detalle-header-top">
                    <div>
                      <IonCardTitle>{deptoSeleccionado.name}</IonCardTitle>
                      <IonCardSubtitle>
                        Capital: {deptoSeleccionado.capital}
                      </IonCardSubtitle>
                    </div>
                    <IonButton
                      fill="clear"
                      size="small"
                      color="medium"
                      onClick={() => setDeptoSeleccionado(null)}
                    >
                      <IonIcon icon={closeOutline} slot="icon-only" />
                    </IonButton>
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  {climaSeleccionado ? (
                    <>
                      <div className="clima-banner">
                        <div className="clima-temp-block">
                          {climaSeleccionado.weather?.[0]?.icon && (
                            <img
                              className="clima-icono"
                              src={getIconUrl(climaSeleccionado.weather[0].icon)}
                              alt="icono del clima"
                            />
                          )}
                          <span className="clima-temp">
                            {Math.round(climaSeleccionado.main.temp)}°C
                          </span>
                        </div>
                        <span className="clima-desc">
                          {climaSeleccionado.weather?.[0]?.description ?? 'Sin descripción'}
                        </span>
                      </div>

                      <IonList lines="none">
                        <IonItem>
                          <IonIcon icon={thermometerOutline} slot="start" color="primary" />
                          <IonLabel>
                            Sensación térmica: {Math.round(climaSeleccionado.main.feels_like)}°C
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={waterOutline} slot="start" color="primary" />
                          <IonLabel>
                            Humedad: {climaSeleccionado.main.humidity}%
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={speedometerOutline} slot="start" color="primary" />
                          <IonLabel>
                            Viento: {climaSeleccionado.wind.speed} m/s
                          </IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonIcon icon={arrowDownOutline} slot="start" color="primary" />
                          <IonLabel>
                            Mín / Máx: {Math.round(climaSeleccionado.main.temp_min)}° /{' '}
                            {Math.round(climaSeleccionado.main.temp_max)}°
                          </IonLabel>
                        </IonItem>
                      </IonList>
                    </>
                  ) : (
                    <p>
                      No se pudieron obtener los datos meteorológicos para la capital{' '}
                      <strong>{deptoSeleccionado.capital}</strong> en este momento.
                    </p>
                  )}
                </IonCardContent>
              </IonCard>
            )}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapaClima;
