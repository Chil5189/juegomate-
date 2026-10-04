# Tasks

## 1. Factores primos en las explicaciones

- [x] 1.1 Agregar `primeFactors(n)` a `logic.js` y hacer que `explain(n)` use la descomposición completa; actualizar `tests/logic.test.js` con 91 ("91 = 7 × 13"), 4 ("4 = 2 × 2"), 27 ("27 = 3 × 3 × 3"), 60 ("60 = 2 × 2 × 3 × 5"), 21 ("21 = 3 × 7") y 1, y verificar que `node --test` pasa

## 2. Marcador con el modo visible

- [x] 2.1 Reestructurar el marcador en `index.html` y `styles.css`: fila con la pastilla del modo (azul en Práctica, naranja en Pro) y el botón "Salir"; fila de tarjetas con etiqueta y valor (Puntos, Panel y, en Pro, Tiempo); verificar en Chrome headless que en Práctica no aparece la tarjeta de tiempo y en Pro sí
- [x] 2.2 Mostrar el panel actual (`panelsCompleted + 1`) en la tarjeta "Panel" y mantener los paneles completados en los resultados; verificar que tras completar 2 paneles el marcador dice 3 y los resultados dicen 2
- [x] 2.3 Ajustar el ancho máximo del panel para el nuevo alto del marcador; verificar en 320 × 568, 360 × 640 y 1280 × 800, en ambos modos, que no hay scroll, que el marcador cabe a lo ancho y que las celdas miden al menos 48 px

## 3. Instrucciones por modo

- [x] 3.1 Agregar `screen-instructions` con un bloque de reglas por modo (`data-instructions`) y los botones "¡Empezar!" y "Volver"; los botones del inicio llevan a las instrucciones del modo elegido; revisar que los números del texto coincidan con las constantes de `game.js`; verificar que "Práctica" y "Pro" muestran cada uno solo su bloque, que "Volver" regresa al inicio y que ambas pantallas se ven sin scroll en 320 × 568

## 4. Cuenta regresiva

- [x] 4.1 Implementar la capa de cuenta regresiva sobre el panel ("3", "2", "1", "¡Ya!", unos 1 s por paso) con los números ocultos y los toques ignorados; guardar los `setTimeout` para poder cancelarlos; verificar en Chrome headless el orden de los pasos y que un clic en una celda durante la cuenta no cambia aciertos ni errores
- [x] 4.2 Arrancar el reloj del Pro solo al terminar la cuenta; verificar que durante la cuenta marca 60 y que justo después de "¡Ya!" empieza a bajar
- [x] 4.3 Hacer que "Jugar otra vez" vaya directo a la cuenta regresiva sin instrucciones; verificar que una segunda partida Pro empieza con 60 s y contadores en 0 tras la cuenta

## 5. Salir de la partida

- [x] 5.1 Agregar el `<dialog>` de confirmación ("¿Salir de la partida?", "Seguir jugando" y "Salir") y conectarlo al botón "Salir" en ambos modos, con salida directa si `showModal` no existe; verificar que confirmar lleva al inicio sin resultados y que "Seguir jugando" o Esc regresan a la partida con puntos, panel y marcas intactos
- [x] 5.2 Pausar el reloj del Pro mientras el diálogo está abierto y reanudarlo sin descontar la pausa; verificar abriendo el diálogo unos 5 s y comprobando que el reloj no bajó
- [x] 5.3 Cancelar la cuenta regresiva al salir durante ella; verificar que después de salir no empieza ninguna partida ni corre el reloj

## 6. Aviso de tiempo bajo

- [x] 6.1 Activar la clase `is-warning` del panel desde `renderTime()` cuando queden 10 s o menos (solo en Pro) y quitarla al superar los 10 s; agregar la animación de temblor (±2 px y ±1°, con retrasos por celda) y la variante sin movimiento con borde rojo para `prefers-reduced-motion`; verificar en Chrome headless que a los 10 s las celdas tienen animación, que un clic en una celda que tiembla se registra, que al completar un panel por encima de 10 s se quita, que con movimiento reducido emulado no hay animación y que en Práctica nunca aparece

## 7. Verificación integral

- [x] 7.1 Jugar una partida completa de cada modo (instrucciones, cuenta, juego, salir y resultados) en 320 × 568, 360 × 640 y escritorio, abriéndolo con `file://` y dentro de un iframe; verificar que no hay errores en la consola y actualizar el `README.md` con el flujo nuevo (instrucciones, cuenta regresiva y Salir)
