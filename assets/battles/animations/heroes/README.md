# Animaciones de los héroes

Los identificadores internos de los personajes son:

- `guardian` — Pol «El Flaco»
- `duelist` — Salim «El Moro»
- `arcanist` — Igor «El Alto»
- `tracker` — Ivan «El Gordo»
- `alchemist` — Alex «El Mujeriego»

Cada héroe tiene carpetas separadas para su respiración en reposo y para sus habilidades de combate.

## Respiración en reposo — `idle/`

Cada personaje tiene una carpeta `idle` donde se suben tres PNG independientes:

- `frame-01.png` — reposo.
- `frame-02.png` — inspiración, pecho y hombros ligeramente elevados.
- `frame-03.png` — espiración, regreso suave a la postura neutra.

Ruta completa: `assets/battles/animations/heroes/<personaje>/idle/`.

Los archivos tienen los mismos nombres en las cinco carpetas, por lo que no se pisan entre sí. El combate los reproduce automáticamente en bucle cuando el héroe está quieto. Cada frame dura aproximadamente un segundo, para un ciclo de respiración de tres segundos. Cuando el héroe ataca o recibe un golpe, la animación idle se oculta y vuelve al terminar la acción.

Formato: PNG RGBA transparente, recomendado 512 × 640 px. Mantén el personaje centrado, mirando a la derecha, con los pies en la misma línea y sin desplazamiento entre frames. Sube los tres archivos juntos. Si faltan o no cargan, se mantiene la figura provisional.

Consulta el README dentro de cada carpeta `idle` para ver la guía específica del personaje.

## Animaciones de habilidades

Las habilidades también tienen una carpeta propia con tres fotogramas:

- `frame-01.png` — preparación: el personaje carga o inicia el movimiento.
- `frame-02.png` — impacto: golpe, hechizo, curación o efecto principal.
- `frame-03.png` — recuperación: termina el movimiento y vuelve a la pose normal.

Las carpetas de habilidades son `basic-attack` y las tres habilidades de cada héroe. Mantén la misma escala y línea de suelo entre los tres frames.

Para ataques, los héroes deben mirar hacia la derecha, hacia los enemigos. No dibujes efectos, números ni barras de vida dentro de los PNG: el juego genera los destellos, sacudidas y números por separado.

Para subir imágenes: abre la carpeta exacta → **Add file → Upload files** → arrastra los PNG → **Commit changes** en `main`.
