# Imágenes de los cinco personajes

El selector de personajes ya está preparado para usar estos archivos. Sube las imágenes desde **Code → assets → Add file → Upload files** y confirma con **Commit changes** en la rama `main`.

## Nombres exactos

| Personaje | Retrato para la ficha | Hoja de sprites |
|---|---|---|
| Pol | `pol-portrait.png` | `pol-sprites.png` |
| Salim | Ya subido: `salim-portrait.webp` | Ya subido: `salim-sprites.webp` |
| Igor | `igor-portrait.png` | `igor-sprites.png` |
| Ivan | `ivan-portrait.png` | `ivan-sprites.png` |
| Alex | `alex-portrait.png` | `alex-sprites.png` |

Los cuatro retratos y las cuatro hojas de sprites que faltan deben subirse directamente dentro de esta carpeta `assets`, no dentro de otra subcarpeta.

## Cómo preparar cada imagen

- **Retrato:** imagen vertical de la cara y el torso, preferiblemente PNG, con el personaje centrado.
- **Sprites:** hoja de sprites PNG con fondo transparente. Para las animaciones, mantén el mismo tamaño de celda y las filas ordenadas como: reposo, caminar, ataque y daño.
- No cambies los nombres de archivo: el juego ya busca exactamente esas rutas.

Mientras falte alguna imagen, la ficha mostrará una tarjeta provisional con la inicial del personaje. En cuanto subas el archivo con el nombre correcto, aparecerá automáticamente al recargar la página.
