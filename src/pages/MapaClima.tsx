import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { departments, MAP_WIDTH, MAP_HEIGHT } from '../data/colombiaDepartments';
import './MapaClima.css';

const MapaClima: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clima por Departamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
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
      </IonContent>
    </IonPage>
  );
};

export default MapaClima;
