# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 014 — Balance, IA y las tres rutas

Las 12 localizaciones ya tienen un encuentro provisional. Los tres encuentros finales son jefes y se combaten como encuentros reales.

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

La progresión es secuencial. Completa una localización para desbloquear la siguiente; al derrotar al jefe se abre la siguiente zona.

### Botón de entrada
El botón **ENTRAR/CONTINUAR** de una zona inicia directamente el primer mapa disponible de esa zona. El botón de cada localización inicia el mapa seleccionado. Los jefes usan el mismo sistema de combate.

### Balance provisional
- Se han reducido PV, ataque, magia, maná y crecimiento de los héroes.
- Se han moderado daño, curación y escudos de las habilidades.
- Todos disponen de **Ataque básico**, que no consume maná. Esto permite que Igor e Ivan ataquen cuando no necesitan curar o proteger.
- Los enemigos aumentan progresivamente su resistencia y daño.
- Los jefes entran en fase de furia cuando bajan del 40% de su vida.
- Recompensa: 45 XP por sala normal y 120 XP por jefe.

### IA enemiga
- **Cazadores:** priorizan al sanador y al mago, especialmente si están debilitados.
- **Brutos:** buscan héroes con poca vida y golpean más fuerte.
- **Espectros:** aplican una maldición que aumenta el daño recibido durante dos turnos.
- **Soporte:** cura a un enemigo herido cuando resulta útil.
- **Jefes:** seleccionan objetivos y entran en fase de furia.

La IA y el balance siguen siendo provisionales. Se irán ajustando tras probar partidas completas.

## Imágenes para sustituir los gráficos provisionales

- `assets/battles/backgrounds/`: fondos de mapas. Sube un JPG 16:9, preferiblemente 1920 × 1080, con el nombre exacto del mapa, por ejemplo `institute-programming.jpg`.
- `assets/battles/enemies/`: enemigos. Sube un PNG con fondo transparente por tipo de enemigo, usando los nombres listados en `assets/battles/enemies/README.md`.

Encontrarás los nombres exactos y las instrucciones dentro de cada carpeta. En GitHub: abre la carpeta → **Add file → Upload files** → arrastra la imagen → **Commit changes** en `main`. Puedes subirlas poco a poco; las imágenes que falten mantienen los gráficos provisionales.

## Personajes y progresión

Cinco héroes, cuatro plazas activas, estadísticas individuales, crecimiento del nivel 1 al 10 y una ranura reservada para pasiva.

## Publicación

GitHub Pages usa `main` y `/(root)`.
