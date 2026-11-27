# PAIS DUNGEON

## Build 017 — revisión final del ritmo y números de combate

- El ataque enemigo tiene tres fases más lentas: preparación 900 ms, impacto 650 ms y recuperación 650 ms.
- Durante la preparación aparece el aviso **EL ENEMIGO PREPARA EL GOLPE**; al impactar, la interfaz muestra el aviso de impacto.
- El movimiento del enemigo sigue una misma animación a través de los tres fotogramas, sin reiniciarse en cada actualización.
- El número flotante mantiene su tiempo de animación original aunque el juego reconstruya la interfaz. Un golpe normal crea un solo número; un multiataque muestra un número por cada impacto real.
- Los números se eliminan al finalizar su duración y sus temporizadores se recuperan después de continuar una partida.
- Las partidas guardadas de versiones anteriores normalizan los tiempos de la animación y no repiten un impacto ya resuelto.

Los efectos son: daño rojo, curación verde y escudo azul.

## Build 016 — Ritmo de enemigos y corrección de números flotantes

- Los enemigos tardan más en preparar un ataque: 900 ms antes del impacto.
- El impacto permanece visible 650 ms y la recuperación dura otros 650 ms.
- Las animaciones del atacante mantienen su progreso al cambiar de fotograma.
- El panel de turno anuncia cuándo el enemigo prepara el golpe y cuándo impacta.
- Los números de daño, curación y escudo sincronizan su animación con el tiempo real transcurrido. Redibujar la interfaz ya no vuelve a reproducir el mismo número desde el principio.
- Los números se eliminan al terminar su duración y sus temporizadores se recuperan después de recargar una partida.

## Tiempos del combate

| Acción | Preparación | Impacto | Recuperación | Total |
|---|---:|---:|---:|---:|
| Héroe | 420 ms | 420 ms | 380 ms | 1,22 s |
| Enemigo | 900 ms | 650 ms | 650 ms | 2,20 s |

Los turnos enemigos duran aproximadamente el doble que antes, para que se pueda ver venir el ataque, observar el impacto y entender el resultado.

## Números de combate

- Daño: rojo, solo muestra los PV realmente perdidos.
- Curación: verde, muestra los PV efectivamente recuperados.
- Escudo: azul, muestra la protección aplicada o absorbida.
- Los multiataques generan un número por cada impacto real, no por las actualizaciones visuales de la pantalla.
- El tiempo de vida del número continúa correctamente tras redibujar o recargar la pantalla.

## Animaciones

Cada acción usa tres fotogramas PNG: preparación, impacto y recuperación. Los efectos de brillo, sacudida, estela y anillo de impacto los añade el juego.

Los nombres y estructura de las carpetas están explicados en:
- `assets/battles/animations/README.md`
- `assets/battles/animations/heroes/README.md`
- `assets/battles/animations/enemies/README.md`

Sigue las guías de cada habilidad o enemigo para subir `frame-01.png`, `frame-02.png` y `frame-03.png`.

## Publicación

GitHub Pages publica desde la rama `main`, carpeta `/(root)`.
