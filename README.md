# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 015 — Combate animado y números de daño

### Ritmo de combate
Cada acción se reproduce en tres fases visibles:
1. **Preparación:** el atacante carga el movimiento.
2. **Impacto:** se aplica el daño, curación, escudo o efecto.
3. **Recuperación:** el personaje vuelve a su posición antes del siguiente turno.

Cada fotograma dura aproximadamente 0,38 segundos y hay una breve fase de recuperación. Durante la secuencia, los botones de habilidad quedan bloqueados para evitar acciones dobles. Los turnos enemigos también utilizan el mismo sistema de tres fases.

### Números flotantes
- Daño a héroes y enemigos: número rojo con el PV realmente perdido.
- Curación de héroes y enemigos: número verde con los PV recuperados.
- Escudos: número azul con los puntos de protección.
- En ataques múltiples aparecen varios números, separados para que no se tapen.

### Efectos visuales
El juego añade efectos por encima de los fotogramas:
- movimiento hacia el objetivo y retroceso del atacante;
- sacudida y destello al recibir un golpe;
- anillo de impacto y brillo;
- efectos de magia, fuego, curación, drenaje, escudo, maldición y golpes fuertes;
- barra de vida actualizada en el momento del impacto.

No necesitas dibujar estos efectos en las imágenes: los crea el juego. Los PNG solo representan el movimiento del personaje o enemigo.

### Dónde subir las animaciones

Cada animación tiene tres archivos PNG con transparencia y nombres exactos.

**Héroes:**
`assets/battles/animations/heroes/<personaje>/<habilidad>/frame-01.png`

Personajes:
- `guardian` — Pol
- `duelist` — Salim
- `arcanist` — Igor
- `tracker` — Ivan
- `alchemist` — Alex

Cada personaje tiene `basic-attack` y tres carpetas de habilidades.

**Enemigos:**
`assets/battles/animations/enemies/<enemy-id>/attack/frame-01.png`

Los 36 enemigos ya tienen su carpeta `attack`. Dentro de cada una sube `frame-01.png`, `frame-02.png` y `frame-03.png`.

### Cómo dibujar los tres fotogramas

| Archivo | Qué debe mostrar |
|---|---|
| `frame-01.png` | Preparación: cargar el brazo, agacharse, levantar el arma o concentrar energía |
| `frame-02.png` | Impacto: ejecutar el golpe, lanzar el hechizo o emitir la curación |
| `frame-03.png` | Recuperación: terminar el gesto y volver a una pose estable |

Recomendaciones:
- PNG RGBA, fondo transparente.
- 512 × 512 px o 512 × 640 px.
- Mantén el mismo tamaño, escala, punto de apoyo y línea de suelo en los tres fotogramas.
- Héroes mirando hacia la derecha; enemigos mirando hacia la izquierda.
- Deja un margen alrededor para que los efectos de brillo y golpe no queden cortados.
- No pongas texto, números ni barras de vida dentro del dibujo.

### Subir una animación a GitHub

1. Abre la carpeta exacta de la habilidad o enemigo.
2. Pulsa **Add file → Upload files**.
3. Arrastra los tres PNG.
4. Verifica que se llamen `frame-01.png`, `frame-02.png` y `frame-03.png`.
5. Pulsa **Commit changes** en la rama `main`.

Puedes subir solo una animación para probarla. Si faltan imágenes, se mantienen las figuras y efectos provisionales. Al subir los tres fotogramas con el nombre correcto, el juego los reproduce automáticamente en orden.

## Rutas y encuentros

Las 12 localizaciones mantienen sus encuentros provisionales:
- Instituto Camí de Mar: Programacion, Base de Datos, Patio y Redes.
- Baix Penedes: Bolera, N-340, Cine y Sushi.
- Steam: Content warning, Labyrinthine, Escape Backrooms y Clubes.

## Publicación

GitHub Pages usa `main` y `/(root)`.
