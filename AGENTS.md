# Guía del proyecto

PAIS DUNGEON es un RPG táctico web en español. Antes de editar una mecánica, consulta `docs/architecture.md` y conserva los identificadores de héroes, habilidades, objetos y localizaciones: las partidas guardadas los usan.

El código se sirve como módulos ES nativos desde `index.html`; no se ha añadido un bundler. Los datos estáticos viven en `src/data/`. La lógica y el estado de campaña siguen coordinados desde `game.js`; `styles.css` contiene el estilo de todas las pantallas.

Las partidas se guardan en `localStorage` y el fondo personalizado de Descanso en IndexedDB. Ten cuidado con migraciones y no sustituyas las claves de almacenamiento sin migrar las partidas existentes.