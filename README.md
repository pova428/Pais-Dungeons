# PAIS DUNGEON

RPG táctico de fantasía oscura protagonizado por cinco amigos.

## Build 006 — Estadísticas y progresión de héroes

Cada personaje tiene vida máxima propia, seis atributos, fortalezas, debilidades y tres habilidades activas que se desbloquean progresivamente.

### Estadísticas

- **PV:** puntos de vida máximos.
- **ATQ:** daño físico y ataques con armas.
- **MAG:** potencia mágica y de curación.
- **DEF:** reducción de daño recibido.
- **VEL:** iniciativa y velocidad de turno.
- **AGI:** evasión y acciones ágiles.

### Atributos base y crecimiento por nivel

Cada nivel suma el crecimiento indicado. La progresión llega hasta nivel 10.

| Héroe | PV inicial | ATQ | MAG | DEF | VEL | AGI | Crecimiento PV/ATQ/MAG/DEF/VEL/AGI |
|---|---:|---:|---:|---:|---:|---:|---|
| Pol | 68 | 7 | 16 | 5 | 20 | 20 | +6/+1/+2/+1/+1/+1 |
| Salim | 54 | 17 | 1 | 4 | 18 | 19 | +5/+2/+0/+1/+1/+1 |
| Igor | 88 | 8 | 14 | 9 | 11 | 11 | +8/+1/+2/+1/+1/+1 |
| Ivan | 135 | 10 | 1 | 17 | 5 | 5 | +13/+1/+0/+2/+0/+0 |
| Alex | 105 | 13 | 2 | 10 | 12 | 12 | +9/+2/+0/+1/+1/+1 |

### Roles, habilidades y desbloqueos

- **Pol «El Flaco» — Mago:** Chispa arcana (nivel 1), Marca ígnea (nivel 4), Nova elemental (nivel 10). Es el más veloz y ágil; su punto débil es la resistencia.
- **Salim «El Moro» — Asesino:** Navajazo (nivel 1), Navajazos múltiples (nivel 4), Llamar a sus hermanos (nivel 10). Máximo daño físico y agilidad, pero la menor vida.
- **Igor «El Alto» — Sanador:** Antivirus (nivel 1), Drenaje de vida (nivel 4), Reinicio total (nivel 10, cura hasta a tres aliados). Perfil equilibrado y centrado en MAG.
- **Ivan «El Gordo» — Tanque:** Escudo protector (nivel 1), Derribo (nivel 4), Bastión de equipo (nivel 10). Máxima vida y defensa; su debilidad es la lentitud.
- **Alex «El Mujeriego» — Duelista:** Balonazo (nivel 1), Modo Mujer (nivel 4, aumenta ATQ y VEL durante dos turnos), Remate de campo (nivel 10, daño en área). Daño y resistencia intermedios.

Los porcentajes de daño, curación, quemadura, escudos y mejoras son valores de diseño para el futuro sistema de combate; aún no están ejecutándose en batallas reales.

### Progresión de nivel

| Nivel | XP acumulada necesaria | Hito |
|---:|---:|---|
| 1 | 0 | Habilidad básica |
| 2 | 100 | Mejora de atributos |
| 3 | 240 | Espacio reservado para pasiva |
| 4 | 420 | Segunda habilidad |
| 5 | 650 | Mejora de atributos |
| 6 | 930 | Mejora de atributos |
| 7 | 1.260 | Mejora de atributos |
| 8 | 1.640 | Mejora de atributos |
| 9 | 2.070 | Mejora de atributos |
| 10 | 2.550 | Ultimate |

Cada nivel aumenta las estadísticas según el crecimiento propio de cada héroe. Los combates otorgarán experiencia cuando se implemente el sistema de batalla. Por ahora, superar una localización otorga 45 XP y superar un jefe simulado otorga 120 XP. Los personajes en reserva reciben la mitad de la experiencia.

### Vida individual

La ficha muestra vida actual y máxima en PV, por ejemplo `54 / 54 PV`. La barra usa el porcentaje actual sobre el máximo individual. Descansar consume una ración y recupera un 25% de la vida máxima de cada héroe.

La ranura de pasiva queda reservada para diseño posterior y todavía no aplica efectos.

## Rutas

1. **Instituto Camí de Mar:** Programacion → Base de Datos → Patio → **Redes (jefe)**.
2. **Baix Penedes:** Bolera → N-340 → Cine → **Sushi (jefe)**.
3. **Steam:** Content warning → Labyrinthine → Escape Backrooms → **Clubes (jefe)**.

## Sistemas incluidos

- Bastión, compañía, rutas, descanso y mercader.
- Grupo de expedición de cuatro héroes.
- Guardado local de progreso y estadísticas.
- Selector lateral y ficha de personaje compartida.
- Interfaz pixelada de fantasía oscura.

## Pendiente

Combate táctico real, turnos, cálculo de daño y curación, estados alterados, pasivas, equipo, recompensas y animaciones de todos los héroes.

## Publicación

GitHub Pages usa `main` y `/(root)`.
