# Alex — Animación idle

Esta carpeta contiene la animación de respiración de Alex (El Mujeriego) durante los turnos en los que permanece quieto en el campo de batalla.

Sube exactamente estos tres archivos:

- `frame-01.png` — postura neutra, respiración en reposo.
- `frame-02.png` — inspiración: pecho y hombros suben ligeramente; el pelo o la ropa se mueven un poco.
- `frame-03.png` — espiración: vuelve suavemente hacia la postura neutra.

## Formato de los archivos

- PNG RGBA con fondo transparente.
- Lienzo recomendado: **512 × 640 px** en los tres frames.
- Misma escala, posición horizontal y línea de suelo en todas las imágenes.
- Personaje entero, centrado y mirando hacia la derecha, hacia los enemigos.
- El movimiento debe ser sutil: no cambiar de sitio ni levantar los pies.
- No incluyas sombras nuevas, texto, barras de vida ni efectos de ataque.

## Cómo se reproduce

El combate muestra los tres PNG en bucle, manteniendo cada frame aproximadamente un segundo. El ciclo completo dura 3 segundos. Cuando el personaje ataca o recibe un golpe, la respiración se oculta y vuelve al terminar la acción.

**No subas un GIF ni una spritesheet:** el juego espera tres imágenes PNG independientes con estos nombres exactos. Si faltan archivos o alguno no carga, se mantiene la figura provisional.

Para subirlos: abre esta carpeta → **Add file → Upload files** → arrastra los tres PNG → **Commit changes** en `main`.
