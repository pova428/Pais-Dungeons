# THE FIVE — La Maldición

RPG táctico de fantasía oscura. Proyecto web original, desarrollado en HTML, CSS y JavaScript.

## Build 002 — Esqueleto de campaña

La segunda versión añade una estructura navegable para comenzar a dar forma al juego:

- **Bastión del Último Farol:** refugio principal y zona segura.
- **Cinco héroes provisionales:** Guardián, Duelista, Arcanista, Rastreador y Alquimista.
- **Compañía:** selección de cuatro héroes para la expedición; el quinto permanece en reserva.
- **Tres territorios:** Bosque de los Ahogados, Minas de Sal Negra y Catedral Sumergida.
- **Tres localizaciones interiores por territorio**, más un jefe final al cierre de cada zona.
- **Descanso:** consume una ración y recupera hasta 25 puntos de vitalidad de cada héroe.
- **Mercader:** compra raciones, vendas, tónicos y aceite con oro.
- **Guardado local:** conserva la campaña, el grupo, el inventario y las preferencias en el navegador.

Los cinco personajes, sus nombres, clases y rasgos son provisionales y se personalizarán más adelante.

## Estado del desarrollo

Esta build establece navegación, ambientación y estructura. El desplazamiento real por las zonas, los encuentros, el combate táctico, las habilidades, el equipo y los efectos de los objetos todavía están pendientes.

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
- `game.js`: héroes, territorios, navegación, descanso, tienda y guardado.
- `assets/ashen-keep.svg`: escenario original del bastión en ruinas.

## Dirección artística

La interfaz se diseña como una pantalla de videojuego: escenario dominante, paleta limitada, sombras, ornamentación sobria y controles integrados en el mundo. Es una interpretación original de fantasía oscura y no utiliza ilustraciones ni recursos de Darkest Dungeon.
