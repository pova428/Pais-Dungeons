# PAIS DUNGEON

## Build 018 — Mercado, equipo y Gachapón

Se ha añadido el nuevo mercado medieval, con un puesto de objetos y una máquina de cápsulas independiente.

### Mercado físico
- Escenario provisional de plaza medieval pixel-art: techo de madera, puestos, estanterías, hogar central, suelo de piedra y Gachapón.
- Se muestran cuatro objetos de equipo a la vez.
- Las existencias se renuevan al superar una localización o pagando 35 monedas.
- Los suministros antiguos siguen disponibles en el mostrador secundario.
- El fondo se puede sustituir por `assets/shop/merchant-market.png`.

### Rarezas y Gachapón
Cada tirada cuesta **100 monedas**. Probabilidades acumuladas al 100%:

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

**Fondo de la tienda**
Sube `merchant-market.png` a `assets/shop/`. Formato PNG horizontal 16:9, recomendado 1920 × 1080. El dibujo debe tener una plaza medieval, puesto de mercader y zona para el gachapón. El juego oscurece la imagen para mantener la estética del proyecto.

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
