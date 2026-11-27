# Salim — animaciones

Este héroe utiliza cinco secuencias independientes:

- `idle/` — respiración mientras espera su turno.
- `basic-attack/` — ataque básico.
- `stab/` — Navajazo.
- `multi-stab/` — Navajazos múltiples.
- `brothers/` — Llamar a sus hermanos.

Cada carpeta contiene tres PNG independientes: `frame-01.png`, `frame-02.png` y `frame-03.png`. El juego los carga automáticamente por el identificador `duelist` y el ID de la habilidad.

Formato de los sprites actuales: PNG RGBA transparente de 512 × 512 px. Mantén la escala y la línea de suelo entre los fotogramas; Salim debe mirar hacia la derecha. No incluyas texto, barras ni números de daño en los archivos.

Para sustituir una secuencia, abre su carpeta, pulsa **Add file → Upload files**, arrastra los tres PNG y confirma el commit en `main`. Conserva exactamente los nombres de archivo.
