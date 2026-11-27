# Igor · life-drain

Sube aquí los tres PNG de esta animación: `frame-01.png`, `frame-02.png` y `frame-03.png`.

Cada animación utiliza exactamente tres PNG con transparencia y el mismo tamaño de lienzo:

1. `frame-01.png` — preparación: el personaje carga, se mueve o inicia el gesto.
2. `frame-02.png` — impacto: aparece el golpe, hechizo, curación o efecto principal.
3. `frame-03.png` — recuperación: termina el movimiento y vuelve a la pose normal.

**Recomendación:** lienzo de 512 × 512 px o 512 × 640 px, PNG RGBA, sin fondo, personaje completo y centrado. Mantén la misma escala y la misma línea de suelo en los tres fotogramas para evitar saltos.

En el combate se muestran seguidos, uno detrás de otro, con una pausa de unos 0,38 segundos por fotograma. El juego añade por encima destellos, sacudida, brillo, anillos de impacto y números de daño/curación. No dibujes esos efectos dentro del PNG salvo que formen parte del diseño del personaje.

Los héroes deben mirar hacia la derecha, porque atacan a los enemigos que tienen enfrente. Los enemigos deben mirar hacia la izquierda. En habilidades de apoyo o área, conserva el personaje en el centro y deja espacio alrededor para los efectos.

Sube los tres archivos a esta carpeta exacta con **Add file → Upload files** y haz Commit changes en `main`. No cambies los nombres ni la extensión.