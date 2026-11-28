# PAIS DUNGEON

## Build 032 — hoguera pixel-art de fantasía oscura

- La hoguera geométrica se sustituye por una ilustración pixel-art propia de troncos cruzados, carbón encendido y un anillo de piedras con sombreado por bloques.
- Las llamas usan una paleta más oscura de brasa, terracota y ámbar, con animación por pasos; se mantienen el humo y las chispas.
- Se reduce el resplandor naranja y se oscurece la iluminación ambiental del campamento para reforzar el ambiente nocturno.
- La nueva composición se adapta a escritorio, tablet y móvil. Los botones, contadores y la recuperación del descanso siguen siendo elementos reales de la interfaz.

## Build 031 — ritmo unificado de las animaciones de combate

- Los tres frames de los ataques de los héroes pasan a durar 520 ms por fase, con 440 ms de recuperación.
- Los enemigos usan un ritmo muy parecido: 620 ms de preparación, 520 ms de impacto y 440 ms de recuperación.
- Se sincronizan los movimientos, los destellos de impacto, las magias, las curaciones y los escudos con esos tiempos.
- Se iguala la transición visual de los sprites en móvil y escritorio para que las animaciones mantengan el mismo ritmo.
- Los números de daño y curación permanecen visibles 1,5 segundos.

## Build 030 — ajuste de curación de Chupadita

La curación de Igor se calcula sobre el daño que realmente ha recibido el enemigo, no sobre el daño potencial. Así Chupadita no cura de más cuando el rival tiene pocos puntos de vida.


## Build 029 — nuevas habilidades y efectos de combate

- **Pol:** Ataque Maligno lanza una esfera arcana, Materia oscura invoca un rayo descendente y Estallido primordial golpea a todos con una gran esfera que estalla. Los tres efectos usan magia oscura pixelada.
- **Igor:** Antivirus cura a un aliado; Chupadita inflige daño y devuelve a Igor el 50% del daño; Diarrea para todos cura a todos los aliados vivos.
- **Ivan:** Escudo protector absorbe el siguiente golpe de un aliado; Barrilete derriba y hace perder el próximo turno; Culo Gordo concede un escudo de un golpe a cada aliado y expira al terminar la ronda.
- **Alex:** Dedeo golpea a todos los enemigos y aplica veneno durante dos turnos.
- Se conservan los identificadores internos de las habilidades y sus niveles de desbloqueo para respetar las partidas guardadas.


## Build 028 — Eliminación del spritesheet antiguo de Salim

Se elimina el spritesheet heredado `assets/salim-sprites.webp` y sus referencias en todo el juego. La ficha de personaje y la ruta muestran ahora la animación idle con los mismos PNG nuevos de tres frames que utiliza el combate. El PNG de combate se amplía y conserva una escala idéntica en reposo y ataque.


## Build 027 — Sprite real de Salim sin figura provisional y tamaño ampliado

Salim ya no incluye la silueta CSS provisional en la escena de combate. Solo utiliza sus PNG reales para reposo y ataques. La animación idle se mantiene detrás de la de ataque hasta que el PNG correspondiente carga, por lo que un retraso o error de carga no hace reaparecer el personaje antiguo. El mismo lienzo de mayor tamaño y la misma escala se aplican a reposo y ataques, con ajustes específicos para móvil.


## Build 026 — Escala coherente de sprites en combate

- Las imágenes de reposo y ataque de los héroes comparten ahora el mismo marco visual.
- Se elimina el escalado independiente de hasta el 190% que hacía que Salim creciera bruscamente al atacar.
- El tamaño base del personaje aumenta y se ajusta por anchura de pantalla.
- Los PNG de ataque se colocan dentro del marco del personaje y mantienen proporción, línea de suelo y posición.
- La figura provisional solo se oculta cuando el PNG de ataque se ha cargado correctamente.


## Build 025 — Corrección de las animaciones de Salim

- Las 15 imágenes PNG de Salim se han colocado en la estructura estándar `heroes/duelist/`, en vez de una carpeta anidada dentro de `guardian/`.
- El combate resuelve la ruta de los sprites a partir del identificador del héroe y de la habilidad, tanto para la respiración idle como para los ataques.
- Quedan conectadas las secuencias `idle`, `basic-attack`, `stab`, `multi-stab` y `brothers`.
- Cada acción reproduce los tres PNG en orden: preparación, impacto y recuperación.
- Cuando la imagen de ataque carga, se oculta la silueta provisional para evitar que aparezcan dos personajes superpuestos. Si el PNG falla, se conserva la figura provisional.


## Build 022 — Base de descanso y hoguera animada

La pantalla de descanso se ha rediseñado como un campamento nocturno en torno a una hoguera central.

- Fuego pixelado animado con varias capas de llama, brasas y resplandor.
- Humo que asciende en bucle y pequeñas chispas que saltan de la hoguera.
- Escenario nocturno con luna, estrellas, pinos y suelo de campamento.
- Contador destacado de **descansos disponibles**.
- Cada descanso consume exactamente **1 ración**. Por tanto, las raciones que tengas son el número de descansos que puedes realizar.
- El botón principal queda desactivado si no quedan raciones y ofrece un acceso directo al mercado para comprar.
- Se muestra el estado de vida y maná de los cinco personajes, incluidos los que estén en reserva.
- Cada descanso recupera un 25% de la vida máxima y del maná máximo de los cinco héroes.
- Diseño adaptable a móvil y respeto de la opción de reducir movimiento.

No se ha añadido un límite diario ni un contador adicional: se mantiene la regla existente de una ración por descanso.

## Build 021 — Respiración idle de los cinco héroes

El campo de batalla ya admite una animación de reposo independiente para cada personaje. Mientras un héroe está quieto, reproduce tres PNG en bucle: reposo, inspiración y espiración. Cada frame se mantiene aproximadamente un segundo, para un ciclo de tres segundos. Cuando ataca o recibe un golpe, la animación se oculta y vuelve al terminar la acción.

Carpetas:
- `assets/battles/animations/heroes/guardian/idle/` — Pol
- `assets/battles/animations/heroes/duelist/idle/` — Salim
- `assets/battles/animations/heroes/arcanist/idle/` — Igor
- `assets/battles/animations/heroes/tracker/idle/` — Ivan
- `assets/battles/animations/heroes/alchemist/idle/` — Alex

En cada carpeta sube `frame-01.png`, `frame-02.png` y `frame-03.png`. PNG transparente de 512 × 640 px recomendado, con los pies en la misma línea y el personaje mirando hacia la derecha. Si falta algún PNG, se conserva la figura provisional. No hace falta GIF ni spritesheet.

Consulta `assets/battles/animations/heroes/README.md` y los README de cada carpeta `idle` para las instrucciones de subida.

## Build 020 — Mercado pixel-art y animación del Gachapón

Se ha añadido el nuevo mercado medieval, con un puesto de objetos y una máquina de cápsulas independiente.

### Mercado físico
- Puesto del mercader ampliado, con expositores más grandes, mercancía ordenada y suministros de viaje plegables.
- Se ha eliminado el escenario superior decorativo que no tenía acciones.
- Se muestran cuatro objetos de equipo a la vez.
- Las existencias se renuevan al superar una localización o pagando 35 monedas.
- Los suministros antiguos siguen disponibles en el mostrador secundario.
- La tienda y la máquina se construyen con elementos pixel-art provisionales; no hace falta subir un fondo de mercado adicional.

### Rarezas y Gachapón
Cada tirada cuesta **100 monedas**. La animación tiene cuatro fases: la máquina se carga y gira, cae la cápsula, se abre y muestra el premio a gran tamaño. El objeto se añade a la colección una sola vez al iniciar la tirada y la presentación se puede recuperar tras recargar la partida.

Probabilidades acumuladas al 100%:

| Rareza | Probabilidad |
|---|---:|
| Común | 50% |
| Poco común | 25% |
| Rara | 15% |
| Épica | 7% |
| Legendaria | 2,5% |
| Hyperrara | 0,5% |

La colección Hyperrara contiene cinco piezas únicas ligadas a un personaje:
- **Navaja de Ala** — Salim
- **Varita del Aula Prohibida** — Pol
- **Antivirus Raíz** — Igor
- **Escudo de los Cinco** — Ivan
- **Balón del Último Gol** — Alex

Las piezas Hyperraras no se pueden comprar directamente en el mercader ni equipar a otro personaje. Cuando ya se han conseguido las cinco, un resultado Hyperraro adicional devuelve el coste de la tirada.

### Inventario y equipamiento
- La colección conserva cada unidad de objeto individualmente.
- Cada unidad solo puede estar equipada por un héroe a la vez.
- Cada personaje tiene un máximo de **cinco ranuras de equipo**.
- El equipo se gestiona desde Compañía, en la ficha de cada héroe.
- Se puede equipar y retirar sin perder el objeto.
- Los atributos de ataque, magia, defensa, velocidad y agilidad afectan a las estadísticas del personaje.
- Los objetos también pueden mejorar crítico, curación y escudos.
- El equipo se conserva en el guardado local y se migra desde las partidas antiguas sin borrar la campaña.

### Imágenes para sustituir los gráficos provisionales

**Fondo del mercado**
En esta versión no se necesita una imagen de fondo del mercado: el puesto y el Gachapón están dibujados con elementos de interfaz pixel-art. La carpeta `assets/shop/` queda reservada para futuras piezas gráficas del escenario.

**Iconos de objetos**
Sube un PNG transparente por objeto a `assets/items/`, usando exactamente el identificador del objeto:
`assets/items/navaja-de-ala.png`, `assets/items/antivirus-raiz.png`, etc.
Recomendado 256 × 256 px. Si no existe la imagen, se usa el símbolo pixel-art provisional del objeto.

Consulta las guías:
- `assets/shop/README.md`
- `assets/items/README.md`

En GitHub: abre la carpeta → **Add file → Upload files** → arrastra la imagen → **Commit changes** en `main`.

## Rutas y combate
Se mantienen las tres rutas y los encuentros provisionales. El equipo modifica las estadísticas en combate, incluidos golpes críticos, curación y escudos.
