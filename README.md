# THE FIVE — La Maldición

RPG táctico de fantasía oscura, con cinco protagonistas inspirados en un grupo de amigos. Proyecto web original en HTML, CSS y JavaScript.

## Build 003 — Personajes y mapa personalizado

### Los cinco protagonistas

- **Pol «El Flaco»** — Guardián.
- **Salim «El Moro»** — Duelista.
- **Igor «El Alto»** — Arcanista.
- **Ivan «El Gordo»** — Rastreador.
- **Alex «El Mujeriego»** — Alquimista.

Los nombres y apodos ya están definidos. Las clases, las habilidades, los rasgos y las estadísticas todavía son provisionales y se personalizarán en una fase posterior.

### Las tres zonas

Cada zona contiene cuatro paradas: tres localizaciones y una sala final con el jefe.

1. **Instituto Camí de Mar**
   - Programacion
   - Base de Datos
   - Patio
   - **Redes — sala del jefe**

2. **Baix Penedes**
   - Bolera
   - N-340
   - Cine
   - **Sushi — sala del jefe**

3. **Steam**
   - Content warning
   - Labyrinthine
   - Escape Backrooms
   - **Clubes — sala del jefe**

### Sistemas incluidos en el esqueleto

- Bastión como refugio principal.
- Compañía con cinco héroes y selección de cuatro para expedición.
- Mapa de tres zonas con doce paradas en total.
- Selección e inspección de las salas finales.
- Descanso en el bastión, con coste de una ración y recuperación de vitalidad.
- Mercader con raciones, vendas, tónicos y aceite.
- Guardado local de campaña, grupo, inventario y preferencias.
- Migración de partidas anteriores al nuevo mapa.

## Pendiente de desarrollo

El desplazamiento por las localizaciones, los encuentros, el combate táctico, los enemigos reales, los patrones de los jefes, las habilidades, el equipo y las recompensas se desarrollarán en siguientes versiones.

## Ejecutar en local

Abre `index.html` en un navegador moderno. No necesita instalación ni dependencias de JavaScript.

## Publicar con GitHub Pages

En **Settings → Pages**:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

## Estructura

- `index.html`: pantalla de título y contenedor de campaña.
- `styles.css`: estilo de fantasía oscura, menús, mapas y paneles del juego.
- `game.js`: personajes, zonas, navegación, descanso, tienda y guardado.
- `assets/ashen-keep.svg`: escenario original del bastión en ruinas.

## Dirección artística

La interfaz se diseña como una pantalla de videojuego: paleta limitada, sombras, ornamentación sobria y controles integrados en el mundo. Es una interpretación original de fantasía oscura y no utiliza ilustraciones ni recursos de Darkest Dungeon.
