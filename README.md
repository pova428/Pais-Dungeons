# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 009 — Primera sala de campo de batalla

La localización **Programacion**, dentro del Instituto Camí de Mar, ya permite entrar en una sala visual de combate.

### Vista provisional de la sala
- Aula nocturna de informática, con pizarra, ventanas, mesas y armario de servidores dibujados con CSS.
- Los cuatro personajes activos se colocan en formación a la izquierda.
- Cada héroe muestra nombre, sobrenombre, rol y vida actual/máxima en PV con su barra individual.
- Tres enemigos provisionales ocupan el lado derecho, con nombre y barra de vida ilustrativa.
- Siluetas pixeladas provisionales identifican a cada clase; el diseño está preparado para sustituirlas por sprites finales.
- Cada minilocalización seguirá usando una única sala reutilizable.

### Controles actuales
- En Ruta, selecciona una localización desbloqueada y pulsa **ENTRAR EN SALA**.
- Desde la sala, usa **VOLVER A RUTAS** para regresar a la localización seleccionada.

Esta versión solo enseña la composición del campo. No hay turnos, ataques, movimiento, daño, curación, victorias ni recompensas de combate. Los valores de vida de los enemigos son marcadores visuales provisionales.

## Personajes y progresión

La compañía tiene cinco héroes y cuatro plazas activas. Cada héroe dispone de estadísticas individuales, crecimiento por nivel, tres habilidades previstas y espacio reservado para pasiva.

## Rutas

1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

La progresión entre localizaciones se mantiene secuencial. La primera sala visual disponible es Programacion.

## Tecnología

HTML, CSS y JavaScript. Guardado local del navegador. GitHub Pages publica desde `main` y `/(root)`.

## Archivos

- `index.html`: menú y estructura de campaña.
- `styles.css`: interfaz, fichas, siluetas y escenario provisional.
- `game.js`: personajes, rutas, progresión y renderizado de la sala.
- `assets/`: retratos y sprites de personaje para futuras sustituciones.
