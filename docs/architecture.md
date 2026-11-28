# Arquitectura de PAIS DUNGEON

## Punto de entrada

`index.html` carga `game.js` como módulo ES. No hay paso de compilación: los navegadores cargan directamente los módulos de `src/`.

## Código fuente

- `game.js`: inicia la interfaz, conserva el estado de campaña y coordina navegación, renderizado, combate, mercado, descanso y diálogos.
- `src/data/heroes.js`: fichas, estadísticas base, habilidades y umbrales de experiencia de los cinco héroes.
- `src/data/world.js`: regiones, localizaciones y descripciones narrativas.
- `src/data/encounters.js`: ataque básico, catálogo de enemigos y encuentros por localización.
- `src/data/equipment.js`: equipo, rarezas, probabilidades del Gachapón, precios y suministros.
- `styles.css`: estilos de todas las pantallas y estados visuales.
- `assets/`: ilustraciones, retratos, animaciones e iconos del juego.

## Flujo general

1. `game.js` importa los datos estáticos desde `src/data/`.
2. La partida vive en el objeto `state` y se guarda en `localStorage`.
3. `renderCampaign()` pinta la pantalla activa a partir de ese estado.
4. Los elementos interactivos usan atributos `data-action`, `data-tab` y `data-*`; los manejadores al final de `game.js` actualizan estado y vuelven a renderizar.
5. Las imágenes personalizadas de Descanso se guardan en IndexedDB; no forman parte del guardado de campaña.

## Límites actuales

La extracción inicial separa datos, que son independientes del DOM y del estado de la partida. Los sistemas de juego permanecen en `game.js` porque comparten muchas funciones y estado mutable. Si se separan más adelante, conviene hacerlo por etapas y pasando dependencias explícitas, empezando por los sistemas con límites más claros.

## Regla práctica al cambiar datos

- Ajustes de héroes y progresión: `src/data/heroes.js`.
- Texto, orden o desbloqueo de localizaciones: `src/data/world.js` y las funciones de progreso en `game.js`.
- Enemigos y composición de combates: `src/data/encounters.js`.
- Objetos y economía: `src/data/equipment.js`.
- Interfaz y mecánicas: `game.js` y `styles.css`.