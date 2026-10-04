# Proposal

## Why

Después de probar la primera versión, el docente detectó varios problemas de uso. El modo actual no se distingue a simple vista. La partida empieza de golpe y sin instrucciones propias de cada modo. No hay forma de salir de una partida Pro. En el modo Pro nada avisa que el tiempo se acaba, más allá del número. Además, el docente prefiere que los errores se expliquen con la descomposición completa en factores primos.

## What Changes

- **Instrucciones por modo:** al elegir Práctica o Pro aparece una pantalla con las reglas de ese modo y un botón "¡Empezar!".
- **Cuenta regresiva:** antes de cada partida se muestra "3, 2, 1, ¡Ya!". Durante la cuenta no se puede tocar el panel y el reloj del Pro no corre. "Jugar otra vez" omite las instrucciones, pero no la cuenta regresiva.
- **Modo siempre visible:** el marcador muestra el modo actual (Práctica o Pro) de forma destacada, con un color distinto para cada modo.
- **Marcador con más estructura:** el modo, los puntos, el número de panel y el tiempo aparecen en tarjetas separadas con etiqueta y valor, en lugar de una línea de texto.
- **Botón "Salir":** está disponible en ambos modos. Pide confirmación y regresa a la pantalla de inicio sin mostrar resultados. En Pro, el reloj se pausa mientras se decide.
- **Aviso de tiempo en Pro:** con 10 segundos o menos, las tarjetas de los números tiemblan ligeramente, además del reloj en rojo que ya existe.
- **BREAKING (comportamiento):** las explicaciones de error usan la descomposición completa en factores primos ("27 = 3 × 3 × 3") en lugar de menor factor por cociente ("27 = 3 × 9").

## Capabilities

### New Capabilities
- Ninguna.

### Modified Capabilities
- `prime-board`: la explicación de errores pasa a ser la descomposición en factores primos.
- `game-modes`: se agregan las instrucciones por modo, la cuenta regresiva, el marcador con el modo visible, el botón "Salir" y el aviso de tiempo del Pro. Cambian el paso de la pantalla de inicio a la partida y el comportamiento de "Jugar otra vez".

## Impact

- `index.html`: nuevas pantallas o capas para instrucciones, cuenta regresiva y confirmación de salida; marcador reestructurado.
- `styles.css`: estilos del marcador, cuenta regresiva, temblor de tarjetas y confirmación.
- `game.js`: flujo nuevo (instrucciones, cuenta regresiva, salir y pausa) y aviso de tiempo bajo.
- `logic.js` y `tests/logic.test.js`: nueva función de explicación con factores primos y sus pruebas.
- Sin dependencias nuevas; el juego sigue funcionando sin servidor y con `file://`.
