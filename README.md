# PAIS DUNGEON

RPG táctico de fantasía oscura protagonizado por cinco amigos.

## Build 004 — Identidad, pixel art y progresión

### Los cinco protagonistas
- **Pol «El Flaco»** — Guardián.
- **Salim «El Moro»** — Duelista.
- **Igor «El Alto»** — Arcanista.
- **Ivan «El Gordo»** — Rastreador.
- **Alex «El Mujeriego»** — Alquimista.

Los nombres y apodos aparecen juntos en las fichas y en la compañía. Las clases y estadísticas siguen siendo provisionales.

### Tres zonas en orden obligatorio
1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

La primera zona comienza abierta. Cada parada se desbloquea al superar la anterior. La sala del jefe solo se abre al superar las tres paradas previas. Al superar el jefe de una zona se desbloquea la siguiente. Las paradas y zonas cerradas muestran candados y no se pueden seleccionar.

La victoria del jefe se simula temporalmente desde el menú, ya que el combate real todavía está pendiente.

### Interfaz
- Título visible: **Pais Dungeon**.
- Tipografía pixelada y paneles de bordes duros.
- Menos texto ambiental y controles más grandes.
- Indicadores destacados de vida, oro y raciones con colores diferenciados.

### Sistemas incluidos
- Bastión, compañía, rutas, descanso y tienda.
- Cinco héroes con cuatro plazas para expedición.
- Guardado local en el navegador.
- Descanso y tienda con inventario básico.
- Progresión secuencial por las doce localizaciones y tres jefes.

## Pendiente
Combate táctico, exploración jugable, habilidades, enemigos, objetos con efectos reales, recompensas y retratos pixel art definitivos.

## Publicar
GitHub Pages usa la rama main y la carpeta root.

## Archivos
- index.html: menú y estructura de campaña.
- styles.css: interfaz de fantasía oscura pixelada.
- game.js: personajes, mapa, progresión, tienda, descanso y guardado.
- assets/ashen-keep.svg: escenario original del bastión.


## Salim «El Moro» — retrato y sprite

- `assets/salim-portrait.webp`: retrato pixel art para el selector de personajes.
- `assets/salim-sprites.webp`: atlas 4×4 (48×49 px por fotograma) con filas de reposo (4), caminar (4), ataque (4) y daño (2).
- La ficha de Salim muestra su retrato, alias, clase Duelista, vida, sprite animado y cuatro espacios de habilidad.
- El ataque básico queda señalado como animación preparada; las otras habilidades se mantienen como «Por definir» hasta diseñarlas.
