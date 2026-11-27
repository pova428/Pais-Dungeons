# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 012 — Revisión y pulido del combate

La primera sala de **Programacion**, en el Instituto Camí de Mar, dispone de un combate provisional por turnos.

### Campo de batalla e interfaz
- Cuatro héroes en fila a la izquierda y tres enemigos a la derecha.
- Escenario provisional de aula informática.
- PV y PM actuales/máximos con barras separadas bajo cada héroe.
- PV y estados de enemigos visibles.
- Orden de iniciativa y ronda en la parte superior.
- El actor actual queda resaltado; los turnos enemigos se identifican aparte.
- Las habilidades se muestran en el panel inferior, con coste de PM y requisitos.
- Los objetivos seleccionables se iluminan y también pueden seleccionarse con teclado.
- Registro de acciones recientes y estados visibles de quemadura, derribo, escudo y mejora.

### Reglas funcionales de esta prueba
- La iniciativa se ordena por velocidad; la mejora de velocidad de Alex cuenta en la ronda siguiente.
- Los enemigos actúan de uno en uno, con una pausa visual antes de ejecutar su ataque.
- Los héroes recuperan 3 PM al empezar su turno, sin duplicar la recuperación al recargar.
- Los ataques, la curación, los escudos, la quemadura, el derribo y la mejora de Alex tienen efectos.
- Los escudos duran dos turnos del héroe protegido y desaparecen antes si se consumen.
- Victoria al derrotar a todos los enemigos; derrota al caer toda la compañía.
- La victoria completa Programacion, concede 45 XP y abre Base de Datos. La partida se puede reanudar durante un turno enemigo o una selección de objetivo.
- Tras una derrota, reintentar restaura los PV/PM con los que la compañía entró en la sala.
- Una partida guardada puede continuar incluso si se recarga el navegador durante un turno enemigo o una selección de objetivo.
- Descansar consume una ración y recupera un 25% de PV y PM máximos de cada héroe.

### Habilidades
Las habilidades de nivel 1 están disponibles desde el principio. La segunda habilidad se desbloquea en nivel 4 y la definitiva en nivel 10. Cada una tiene coste de maná.

- **Pol — Mago:** Chispa arcana, Marca ígnea, Nova elemental.
- **Salim — Asesino:** Navajazo, Navajazos múltiples, Llamar a sus hermanos.
- **Igor — Sanador:** Antivirus, Drenaje de vida, Reinicio total.
- **Ivan — Tanque:** Escudo protector, Derribo, Bastión de equipo.
- **Alex — Duelista:** Balonazo, Modo Mujer, Remate de campo.

### Enemigos provisionales
Proceso corrupto, Virus de aula y Fragmento de código. Sus estadísticas, aspecto y ataques son marcadores iniciales que podremos sustituir.

Los números de daño, defensa, curación, PM y enemigos siguen siendo valores de prototipo y necesitan pruebas de balance.

## Personajes y progresión

Cinco héroes, cuatro plazas activas, estadísticas individuales, crecimiento del nivel 1 al 10 y una ranura reservada para pasiva.

## Rutas

1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

Solo Programacion dispone actualmente de este combate provisional. Los jefes y el resto de localizaciones deben desarrollarse.

## Publicación

GitHub Pages usa `main` y `/(root)`.

## Archivos

- `index.html`: menú y estructura de campaña.
- `styles.css`: interfaz, escenario y estilos de combate.
- `game.js`: personajes, turnos, habilidades, progresión y guardado.
- `assets/`: retratos y sprites de personajes.
