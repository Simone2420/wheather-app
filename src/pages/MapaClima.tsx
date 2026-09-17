import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { departments, MAP_WIDTH, MAP_HEIGHT } from '../data/colombiaDepartments';
import { getWeatherForCities } from '../services/weatherService';
import WeatherResponse from '../types/Weather';
import './MapaClima.css';

const MapaClima: React.FC = () => {
  const [climas, setClimas] = useState<Map<string, WeatherResponse | null>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarClimas = async () => {
      setIsLoading(true);
      try {
        const capitales = departments.map((d) => d.capital);
        const resultados = await getWeatherForCities(capitales);
        setClimas(resultados);

        // Checkpoint 3: Confirmar en consola los datos de las 33 capitales
        console.log('✅ Clima cargado para las 33 capitales:', resultados);
      } catch (err) {
        console.error('Error al cargar clima de capitales:', err);
      } finally {
        setIsLoading(false);
      }
    };

    cargarClimas();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clima por Departamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {isLoading ? (
          <div className="mapa-loading-container">
            <IonSpinner name="crescent" color="primary" />
            <p>Consultando el clima de los 33 departamentos...</p>
          </div>
        ) : (
          <div className="mapa-container">
            <svg
              className="mapa-svg"
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              {departments.map((dept) => (
                <path
                  key={dept.name}
                  d={dept.path}
                  className="depto-path"
                >
                  <title>{dept.name} ({dept.capital})</title>
                </path>
              ))}
            </svg>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapaClima;
