# Imágenes de los cinco personajes

El selector de personajes está preparado para usar estos archivos. Sube las imágenes desde **Code → assets → Add file → Upload files** y confirma con **Commit changes** en la rama `main`.

## Nombres exactos

| Personaje | Retrato para la ficha | Hoja de sprites |
|---|---|---|
| Pol | `pol-portrait.png` | `pol-sprites.png` |
| Salim | `salim-portrait.png` | `salim-sprites.webp` |
| Igor | `igor-portrait.png` | `igor-sprites.png` |
| Ivan | `ivan-portrait.png` | `ivan-sprites.png` |
| Alex | `alex-portrait.png` | `alex-sprites.png` |

Salim ya tiene su retrato en `assets/salim-portrait.png`. Para el sprite de campo se usará por ahora una silueta provisional hasta diseñar la hoja de sprites definitiva.

Los retratos y las hojas de sprites que falten deben subirse directamente dentro de esta carpeta `assets`, no dentro de otra subcarpeta.

## Cómo preparar cada imagen

- **Retrato:** imagen vertical de la cara y torso, preferiblemente PNG, con el personaje centrado.
- **Sprites:** hoja PNG con fondo transparente. Para las animaciones, mantén celdas iguales y filas ordenadas como: reposo, caminar, ataque y daño.
- No cambies los nombres de archivo ni sus extensiones.
