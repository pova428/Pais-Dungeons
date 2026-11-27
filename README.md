# PAIS DUNGEON

RPG táctico de fantasía oscura protagonizado por cinco amigos.

## Build 005 — Gestión de personajes

La sección **Compañía** ahora presenta un selector vertical a la izquierda y una ficha detallada reutilizable para los cinco héroes.

- **Pol «El Flaco»** — Guardián.
- **Salim «El Moro»** — Duelista.
- **Igor «El Alto»** — Arcanista.
- **Ivan «El Gordo»** — Rastreador.
- **Alex «El Mujeriego»** — Alquimista.

Cada ficha incluye retrato, vista previa de sprite, clase, nivel, vida, estado de grupo y cuatro huecos de habilidades futuras. Las habilidades son propuestas provisionales, no ataques implementados.

Salim ya tiene retrato y hoja de sprites en `assets/salim-portrait.webp` y `assets/salim-sprites.webp`. Los otros cuatro muestran una tarjeta provisional hasta que se suban sus imágenes.

Consulta `assets/CHARACTER-ASSETS.md` para ver los nombres exactos de archivos y cómo subir los retratos y las hojas de sprites desde GitHub.

## Rutas y progresión

1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

Cada localización se desbloquea al superar la anterior. El jefe abre la siguiente zona. La victoria de jefes es una simulación temporal hasta desarrollar los combates.

## Sistemas incluidos

- Bastión, compañía, rutas, descanso y mercader.
- Grupo de expedición de cuatro héroes.
- Guardado local del progreso en el navegador.
- Interfaz pixelada de fantasía oscura.
- Panel de personajes con mini menú lateral y fichas grandes.

## Pendiente

Combate táctico real, encuentros, enemigos, animaciones de todos los héroes, habilidades definitivas, equipamiento, recompensas y retratos finales del resto del grupo.

## Publicar

GitHub Pages usa la rama `main` y la carpeta `/(root)`.

## Archivos principales

- `index.html`: menú y estructura de campaña.
- `styles.css`: interfaz, mapas y fichas de personajes.
- `game.js`: personajes, progresión, tienda, descanso y guardado.
- `assets/`: escenario, retratos y hojas de sprites.
