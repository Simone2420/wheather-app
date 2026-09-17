# Laboratorio 3: Mapa del Clima de Colombia
**Estudiante:** Brian Aldana  
**Asignatura:** Programación para Dispositivos Nativos - V Semestre  
**Universidad de Cundinamarca**

---

## 1. Entregable Teórico: Justificación de `Promise.allSettled` vs `Promise.all`

> **Pregunta:** *¿Por qué `Promise.allSettled` es más apropiado que `Promise.all` para este caso? ¿Qué hubiera pasado con `Promise.all` si una sola capital fallaba?*

`Promise.allSettled` es más apropiado porque implementa una estrategia tolerante a fallos (*fail-safe*) indispensable cuando se consultan múltiples servicios distribuidos de manera masiva e independiente. Si hubiésemos utilizado `Promise.all`, la arquitectura sufriría del comportamiento *fail-fast* (cortocircuito): bastaría con que una sola de las 33 peticiones fallara (por ejemplo, debido a límites de tasa de peticiones, nombres no encontrados en OpenWeather o problemas puntuales de red) para que toda la promesa global fuera rechazada inmediatamente, arrojando un error y dejando la pantalla en blanco sin mostrar ninguno de los otros 32 departamentos que sí respondieron correctamente. Con `Promise.allSettled`, la aplicación espera a que todas las solicitudes terminen y permite renderizar individualmente cada departamento exitoso, asignando un estado controlado (neutro/sin datos) a los que no tuvieron éxito sin degradar la experiencia de usuario.

---

## 2. Preguntas de Reflexión para Cierre de Clase

### Pregunta 1
**¿Qué hubiera pasado con tu mapa si una sola capital fallaba y hubieras usado `Promise.all` en vez de `Promise.allSettled`?**
* **Respuesta:**
  Al invocar `Promise.all()`, la promesa combinada se rechaza tan pronto como cualquiera de las promesas componentes sea rechazada. En consecuencia, la ejecución habría saltado de inmediato al bloque `catch`, impidiendo almacenar los resultados en el `Map` de climas. Como resultado, la interfaz de usuario no habría podido dibujar los colores de ningún departamento ni desplegar información meteorológica, perdiendo por completo la utilidad del mapa interactivo por culpa de un único fallo aislado.

### Pregunta 2
**¿Por qué tenía sentido que el archivo de coordenadas del mapa viniera ya hecho, en vez de ser parte del laboratorio?**
* **Respuesta:**
  Construir la geometría de las fronteras departamentales a partir de datos geoespaciales (GeoJSON oficial del DANE) implica procesos cartográficos complejos ajenos a los objetivos pedagógicos del laboratorio: simplificación topológica de vértices mediante algoritmos (como Ramer-Douglas-Peucker), proyección de coordenadas geográficas (latitud/longitud en grados WGS84) a coordenadas de pantalla bidimensionales (SVG en píxeles con su respectivo `viewBox`), y cálculo de centroides. Entregar el archivo preconstruido permite al estudiante enfocarse estrictamente en la lógica de desarrollo móvil e híbrido con Ionic/React: enrutamiento con pestañas (`IonTabs`), consumo asíncrono y concurrente de APIs REST, manipulación dinámica del DOM/SVG (`fill`, `onClick`) y renderizado reactivo condicional de interfaces.

### Pregunta 3
**Si tuvieras que agregar el pronóstico de 5 días a cada capital (33 llamadas adicionales), ¿qué problema práctico podrías encontrar con el plan gratuito de la API?**
* **Respuesta:**
  El plan gratuito (*Free Tier*) de la API de OpenWeather impone una restricción de cuota de **60 llamadas por minuto** (además del límite diario de 1,000,000 de llamadas). Al consultar el clima actual de 33 ciudades sumado al pronóstico de 5 días de otras 33 ciudades, se emitirían **66 peticiones HTTP prácticamente simultáneas** en el montaje de la vista. Esto excedería de inmediato el umbral de 60 peticiones por minuto, provocando que los servidores de OpenWeather respondan masivamente con códigos de estado HTTP `429 Too Many Requests` (Rate Limiting). Para mitigar este problema en el plan gratuito se requerirían mecanismos de optimización tales como paginación/bloques con retrasos (*throttling*), almacenamiento en caché local (*localStorage* o SQLite/Ionic Storage) con tiempo de vida (*TTL*), o carga bajo demanda (*lazy loading*) del pronóstico únicamente cuando el usuario seleccione un departamento específico.
