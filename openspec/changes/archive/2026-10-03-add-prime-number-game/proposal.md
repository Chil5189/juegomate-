# Proposal

## Why

Los alumnos de 2º de secundaria necesitan memorizar y reconocer con rapidez los 10 primeros números primos (2, 3, 5, 7, 11, 13, 17, 19, 23, 29). Un juego web corto, con presión de tiempo y que explique cada error, convierte esa práctica repetitiva en algo que quieran repetir, y se puede publicar en el sitio web del docente sin infraestructura adicional.

## What Changes

- Nueva aplicación web estática (HTML, CSS y JavaScript sin servidor ni dependencias) que se puede subir a cualquier hosting o incrustar con un iframe.
- Pantalla de inicio con dos modos: **Práctica** y **Pro**.
- Panel de números del 1 al 100 donde el alumno toca o hace click en los primos.
  - Los 10 primeros primos aparecen con mucha más frecuencia que los primos mayores (31 a 97).
  - Todo primo cuenta como acierto; ningún primo se marca como error.
  - Al completar todos los primos del panel aparece un panel nuevo.
- Retroalimentación inmediata: cada error explica por qué el número no es primo (por ejemplo "21 = 3 × 7" o "1 no es primo: solo tiene un divisor").
- **Modo Práctica:** sin reloj ni castigo, con más puntos por acierto; el alumno decide cuándo terminar.
- **Modo Pro (sobrevivencia):** empieza con 60 segundos; los aciertos dan menos puntos y suman poco tiempo, y los errores restan tiempo. La dificultad para encontrar primos no aumenta.
- Pantalla final con puntos, aciertos, errores, un mensaje de retroalimentación sencillo y la lista de números en los que se equivocó.
- Diseño optimizado para celular en vertical: todo en una pantalla sin scroll, botones grandes y respuesta inmediata al toque.

## Capabilities

### New Capabilities
- `prime-board`: generación del panel de números (rango, ponderación hacia los 10 primeros primos, distractores), selección por click o toque, retroalimentación de aciertos y errores, paso al siguiente panel y disposición adaptable a celular.
- `game-modes`: modos Práctica y Pro, sus reglas de puntos y tiempo, fin de la partida y pantalla de resultados con retroalimentación.

### Modified Capabilities
- Ninguna (el proyecto no tiene especificaciones previas).

## Impact

- Proyecto nuevo: hoy el repositorio solo contiene el `README.md`. Se agregan los archivos del juego en la raíz del repositorio.
- Sin dependencias externas, sin servidor, sin base de datos ni cuentas de usuario.
- Fuera de alcance por ahora: tabla de puntajes de la clase, cuentas de alumnos, guardar récords entre sesiones, sonidos y niveles desbloqueables.
