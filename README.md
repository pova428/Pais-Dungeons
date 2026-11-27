# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 013 — Balance, IA y las tres rutas

Las 12 localizaciones ya tienen un encuentro provisional. Las tres últimas paradas de cada zona son jefes y se combaten como encuentros normales, con estadísticas y comportamiento especial.

### Rutas y encuentros

| Zona | Localización | Enemigos provisionales |
|---|---|---|
| Instituto Camí de Mar | Programacion | Eco de proceso, Larva de virus, Fragmento de código |
| Instituto Camí de Mar | Base de Datos | Mímico de archivo, Sanguijuela SQL, Centinela nulo |
| Instituto Camí de Mar | Patio | Sabueso de ceniza, Aparición del patio, Pupitre roto |
| Instituto Camí de Mar | Redes · Jefe | Espectro del router, Acechador de cable, Dron cortafuegos |
| Baix Penedes | Bolera | Necrófago de bolera, Fantasma de pista, Aplastabolos |
| Baix Penedes | N-340 | Desollador de asfalto, Rastrero de señal, Sabueso de chatarra |
| Baix Penedes | Cine | Aparición de pantalla, Mímico de fotograma, Acomodador espectral |
| Baix Penedes | Sushi · Jefe | El chef de la última mesa, Demonio de wasabi, Sombra de soja |
| Steam | Content warning | Acechador de cámara, Demonio de clip, Fantasma grabado |
| Steam | Labyrinthine | Tejedor del laberinto, Minotauro de espinas, Rastrero de pared |
| Steam | Escape Backrooms | Corredor sin rostro, Mímico amarillo, Vigía del techo |
| Steam | Clubes · Jefe | Maestro de Clubes, Bruto del bajo, Bruja estroboscópica |

La progresión es secuencial: completa una localización para abrir la siguiente. Al derrotar al jefe se desbloquea la siguiente zona.

### Balance inicial
- Se han reducido PV, ataque, magia, maná y crecimiento de los héroes.
- Se han moderado los coeficientes de daño, curación y escudo de las habilidades.
- Los encuentros normales aumentan progresivamente su resistencia y daño.
- Los jefes tienen más vida y entran en fase de furia por debajo del 40% de su vida.
- La recompensa provisional es de 45 XP por sala y 120 XP por jefe.

### IA enemiga
- **Cazadores:** priorizan al sanador y al mago, especialmente si están debilitados.
- **Brutos:** buscan héroes con poca vida y golpean con más fuerza.
- **Espectros:** lanzan una maldición que aumenta el daño recibido durante dos turnos.
- **Soporte:** cura a un enemigo herido en vez de atacar cuando resulta útil.
- **Jefes:** combinan selección de objetivos y fase de furia.

La IA es táctica pero sigue siendo una primera versión; el daño y la prioridad de objetivos se ajustarán después de probar varias partidas.

## Imágenes provisionales

Las carpetas que debes utilizar son:

- `assets/battles/backgrounds/`: fondos de las salas.
- `assets/battles/enemies/`: retratos/sprites de los enemigos.

Los nombres de archivo son exactos y están listados en los README de esas carpetas. Sube las imágenes con **Add file → Upload files** y confirma en `main`. Los fondos deben ser JPG 16:9 y los enemigos PNG con transparencia. Si una imagen todavía no existe, el juego mantiene el escenario o enemigo provisional.

## Personajes y progresión

Cinco héroes, cuatro plazas activas, estadísticas individuales, crecimiento del nivel 1 al 10 y una ranura reservada para pasiva.

## Publicación

GitHub Pages usa `main` y `/(root)`.
