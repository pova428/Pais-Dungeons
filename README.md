# PAIS DUNGEON

RPG táctico por turnos de fantasía oscura protagonizado por cinco amigos.

## Build 011 — Primer combate por turnos

La primera sala de **Programacion**, en el Instituto Camí de Mar, ahora incorpora un combate provisional por turnos inspirado en la disposición clásica de los RPG tácticos de grupo.

### Campo de batalla
- Cuatro héroes en una fila a la izquierda y tres enemigos a la derecha.
- Escenario provisional de aula informática.
- Vida y maná individuales bajo cada héroe, con barras separadas.
- Vida de enemigos y estados visibles.
- Orden de iniciativa en la parte superior y ronda actual.
- Personaje cuyo turno está activo resaltado.
- Habilidades del personaje activo en el panel inferior.
- Selección de objetivo para ataques, curaciones y escudos.
- Registro de los últimos movimientos.

### Habilidades
Las habilidades de nivel 1 ya se pueden utilizar. Las de nivel 4 y las definitivas de nivel 10 se muestran bloqueadas hasta alcanzar el nivel correspondiente. El maná se consume al usar habilidades; cada aliado recupera 3 PM al comenzar su turno.

- **Pol — Mago:** Chispa arcana, Marca ígnea, Nova elemental.
- **Salim — Asesino:** Navajazo, Navajazos múltiples, Llamar a sus hermanos.
- **Igor — Sanador:** Antivirus, Drenaje de vida, Reinicio total.
- **Ivan — Tanque:** Escudo protector, Derribo, Bastión de equipo.
- **Alex — Duelista:** Balonazo, Modo Mujer, Remate de campo.

### Enemigos provisionales
Proceso corrupto, Virus de aula y Fragmento de código. Sus nombres, estadísticas, aspecto y ataques son marcadores iniciales que podremos sustituir.

### Mecánicas implementadas en esta primera prueba
- Orden automático por velocidad.
- Turnos automáticos de los enemigos.
- Ataques, curación, escudos, quemadura y derribo.
- Victoria al derrotar a todos los enemigos y derrota al caer toda la compañía.
- Reintento tras derrota.
- La victoria completa Programacion, concede 45 XP y abre Base de Datos.
- El estado del combate se conserva al recargar el navegador.

Esta es una primera implementación jugable para probar el ritmo y la interfaz. Los números, ataques enemigos y efectos son provisionales y habrá que balancearlos.

## Personajes y progresión

Cinco héroes, cuatro plazas activas, estadísticas individuales, crecimiento del nivel 1 al 10 y una ranura reservada para pasiva.

## Rutas

1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

## Publicación

GitHub Pages usa `main` y `/(root)`.

## Archivos

- `index.html`: menú y estructura de campaña.
- `styles.css`: interfaz, escenario y estilos de combate.
- `game.js`: personajes, turnos, habilidades, progresión y guardado.
- `assets/`: retratos y sprites de personajes.
