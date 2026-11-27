# PAIS DUNGEON

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
