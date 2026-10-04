# Tasks

## 1. Estructura base

- [x] 1.1 Crear `index.html` con el viewport para celular, las tres pantallas (inicio, juego, resultados) como `<section>` y la carga con `defer` de `logic.js` y `game.js`; verificar que al abrirlo con `file://` se ve la pantalla de inicio sin errores en la consola
- [x] 1.2 Crear `styles.css` con los colores base, el contenedor de pantalla completa (`100dvh`) y los estilos de los botones de inicio; verificar que la pantalla de inicio se ve bien en 360 × 640 y en escritorio

## 2. Lógica del juego (`logic.js`)

- [x] 2.1 Implementar la criba del 1 al 100, `TARGET_PRIMES`, `BIG_PRIMES`, `TRAP_NUMBERS` y la exportación dual (global `PrimeLogic` y `module.exports`); verificar con `tests/logic.test.js` que hay 25 primos, que el 1 no es primo y que los 10 objetivo son 2 a 29
- [x] 2.2 Implementar `explain(n)`; verificar con pruebas los mensajes de 1, 4 ("4 = 2 × 2"), 21 ("21 = 3 × 7") y 91 ("91 = 7 × 13")
- [x] 2.3 Implementar `generatePanel(rules, random)` con mezcla Fisher–Yates; verificar con pruebas repetidas (al menos 1000 paneles por caso) que siempre hay 16 números distintos, exactamente 5 primos, al menos 1 trampa, distractores dentro del rango y 0 o 1 primo grande según la regla
- [x] 2.4 Implementar `panelRules(mode, panelIndex)`; verificar con pruebas que en Práctica los paneles 1 a 3 usan rango 30 sin primo grande, el 4 usa rango 100 con primo grande y en Pro todos usan rango 100 con primo grande
- [x] 2.5 Implementar `feedbackMessage(correct, wrong)`; verificar con pruebas los casos 19/1 ("¡Eres pro!"), 8/2 (mensaje de "¡Muy bien!..."), 6/4 y 0/0 ("Sigue practicando, ¡tú puedes!")
- [x] 2.6 Agregar al `README.md` cómo ejecutar las pruebas (`node --test`); verificar que el comando documentado pasa sin errores

## 3. Panel y selección (`game.js`)

- [x] 3.1 Implementar el estado de la partida, el cambio entre pantallas y el inicio desde los botones "Práctica" y "Pro"; verificar en el navegador que cada botón abre la pantalla de juego con contadores en 0
- [x] 3.2 Renderizar el panel de 16 botones en una cuadrícula de 4 columnas usando `generatePanel` y `panelRules`; verificar que en 320 × 568 y 360 × 640 se ve completo, sin scroll y con botones de al menos 48 px
- [x] 3.3 Manejar el toque en un primo (verde, contar acierto, ignorar repetidos) y en un no primo (rojo, explicación en un área fija bajo el panel, contar el error una sola vez, guardar en `mistakes`); verificar a mano con 23, 97, 21 y 1, y que el panel no se mueve al aparecer la explicación
- [x] 3.4 Al marcar el quinto primo, contar el panel completado y mostrar un panel nuevo; verificar en Práctica que los paneles 1 a 3 solo tienen números del 1 al 30 y que el 4 ya puede traer números mayores
- [x] 3.5 Aplicar `touch-action: manipulation` y revisar que no haya estilos que dependan de `:hover`; verificar con la emulación de celular que dos toques rápidos se registran y la página no hace zoom

## 4. Modos de juego

- [x] 4.1 Modo Práctica: +10 por acierto, sin castigo por error y botón "Terminar" siempre visible que lleva a resultados; verificar jugando una partida corta
- [x] 4.2 Modo Pro: reloj de 60 s con `requestAnimationFrame` y `performance.now()`, mostrado como número y barra; constantes de +5 puntos, +1 s por acierto, -5 s por error y +3 s por panel, con tope entre 0 y 60 s; verificar que el reloj no sube de 60 y que el tiempo transcurrido coincide con un cronómetro externo
- [x] 4.3 Fin del Pro al llegar a 0 (también por un error): bloquear el panel y mostrar resultados con "¡Se acabó el tiempo!"; verificar dejando correr el reloj y con un error a menos de 5 s

## 5. Resultados

- [x] 5.1 Pantalla de resultados con modo, puntos, aciertos, errores, paneles completados, el mensaje de `feedbackMessage` y "Te confundiste con:" (ordenado, sin repetir, oculto si no hubo errores); verificar con una partida con errores repetidos y otra sin errores
- [x] 5.2 Botones "Jugar otra vez" (mismo modo, todo en 0 y 60 s en Pro) e "Inicio"; verificar que una segunda partida Pro no arrastra el tiempo ni los puntos de la anterior

## 6. Verificación integral

- [x] 6.1 Jugar una partida completa de cada modo en un navegador de escritorio y en la emulación de celular (320 × 568 y 360 × 640), recorriendo los escenarios de `specs/prime-board` y `specs/game-modes`; verificar que no haya errores en la consola
- [x] 6.2 Probar el juego incrustado en una página de prueba con `<iframe>` y abriéndolo con `file://`; verificar que funciona igual en ambos casos y documentar en el `README.md` cómo subirlo e incrustarlo en el sitio
