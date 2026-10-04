# Design

## Context

El juego actual (ver `openspec/specs/`) tiene tres pantallas `<section>` (inicio, juego y resultados) que se alternan con el atributo `hidden`. El estado vive en un objeto `state` dentro de `game.js`, y el reloj del Pro usa `requestAnimationFrame` con `performance.now()`. El marcador es una sola fila de texto (`.hud`). En 320 × 568 el modo Práctica ya ocupa 556 px de 568 de alto, así que cualquier fila nueva en el marcador obliga a achicar el panel. La motivación está en proposal.md.

## Goals / Non-Goals

**Goals:**
- Agregar instrucciones, cuenta regresiva, salida con confirmación y aviso de tiempo sin romper lo que ya funciona (reglas de puntos, reloj y paneles).
- Mantener todo visible sin scroll en 320 × 568, con celdas de al menos 48 px.
- Que los textos de las instrucciones sean fáciles de editar por el docente.

**Non-Goals:**
- Cambiar las reglas de puntos o tiempo, o la generación de paneles.
- Sonidos, vibración o animaciones fuera de las pedidas.
- Pausa general del juego: el reloj solo se detiene con la confirmación de salida.

## Decisions

### 1. Flujo de pantallas

```
 [Inicio] --modo--> [Instrucciones] --¡Empezar!--> [Juego: cuenta 3,2,1,¡Ya!] --> [Juego: jugando]
    ^                   |  Volver                        |  Salir (confirmado)        |  fin
    +-------------------+--------------------------------+                            v
    +------------------------------------- Inicio ------------------------------ [Resultados]
                                       [Juego: cuenta] <--- Jugar otra vez -----------+
```

Se agrega una cuarta `<section id="screen-instructions">`. Las reglas de cada modo están escritas en el HTML dentro de dos bloques (`data-instructions="practice"` y `data-instructions="pro"`), y se muestra el que corresponde. Así el docente puede editar los textos sin tocar JavaScript.

**Alternativa descartada:** generar el texto de las instrucciones desde las constantes de `game.js`. Garantizaría que los números coincidan, pero dificulta editar la redacción. Se mitiga revisando los textos contra las constantes en las tareas.

### 2. Cuenta regresiva como capa sobre el panel

La cuenta regresiva se muestra en una capa encima del panel, dentro de la pantalla de juego, para que el marcador (modo y 60 s) ya se vea durante la cuenta. Mientras dura, el panel tiene la clase `is-hidden-cells` (números con `visibility: hidden`) y `state.running` es `false`, de modo que los toques se ignoran con la misma condición que ya existe. Cada paso se programa con `setTimeout` y los identificadores se guardan para cancelarlos al salir. El reloj del Pro arranca, fijando `lastTick`, solo al terminar "¡Ya!".

**Alternativa descartada:** una pantalla separada para la cuenta. Ocultaría el marcador y haría el cambio a la partida más brusco.

### 3. Confirmación de salida con `<dialog>`

El botón "Salir" abre un `<dialog>` modal con `showModal()`, con el texto "¿Salir de la partida?" y los botones "Seguir jugando" y "Salir". El navegador se encarga del foco, del fondo bloqueado y de la tecla Esc, que cuenta como "Seguir jugando".

- **Pausa:** al abrir el diálogo, `state.paused = true` y el bucle de `requestAnimationFrame` deja de pedir cuadros. Al cerrar con "Seguir jugando", `lastTick = performance.now()` y el bucle se reanuda, así no se descuenta el tiempo de la pausa.
- **Salir durante la cuenta:** se cancelan los `setTimeout` pendientes antes de volver al inicio.

**Alternativa descartada:** `window.confirm()`. Es más simple, pero en celular se ve fuera de estilo, bloquea el hilo y algunos sitios lo desactivan dentro de iframes con `sandbox`.

### 4. Marcador en dos filas

```
 +-------------------------------------------+
 | [ PRO ]                         [ Salir ] |   fila 1: modo (pastilla de color) y salir
 +-------------+-------------+---------------+
 | PUNTOS      | PANEL       | TIEMPO        |   fila 2: tarjetas con etiqueta y valor
 | 25          | 3           | 42            |   (Práctica: solo Puntos y Panel)
 +-------------+-------------+---------------+
 [##########################--------------]     barra de tiempo (solo Pro)
```

- La pastilla del modo usa el color de cada modo (azul para Práctica, naranja para Pro), los mismos de los botones del inicio.
- "Panel" muestra el panel actual (`panelsCompleted + 1`). La pantalla de resultados sigue mostrando los paneles completados.
- Para que todo quepa en 320 × 568, el ancho máximo del panel pasa de `calc(100dvh - 250px)` a un valor que reserve el alto extra del marcador (unos 80 px más). Las celdas quedan alrededor de 53 px en esa pantalla, por encima del mínimo de 48 px. El valor exacto se ajusta midiendo.

### 5. Temblor de tarjetas

`renderTime()` ya calcula si el tiempo está bajo (10 s o menos). Ese mismo valor activa la clase `is-warning` en el panel. En CSS, las celdas de un panel con esa clase usan una animación corta e infinita (desplazamiento de ±2 px y rotación de ±1°), con retrasos distintos según la posición para que no se muevan todas igual. La amplitud es pequeña para no afectar los toques. Con `@media (prefers-reduced-motion: reduce)`, la animación se reemplaza por un borde rojo fijo.

### 6. Factores primos

Se agrega `primeFactors(n)` a `logic.js`, que divide entre cada primo de menor a mayor. `explain(n)` usa `primeFactors(n).join(' × ')`. El mensaje del 1 y el formato "n = ..." no cambian.

### 7. Verificación

Las pruebas de `logic.js` se actualizan con los ejemplos de la spec (91, 4, 27, 60 y 21). La interfaz se verifica en Chrome headless, igual que en la versión anterior: flujo de instrucciones y cuenta regresiva, reloj detenido durante la cuenta y la pausa, salida, temblor y tamaños 320 × 568, 360 × 640 y escritorio.

## Risks / Trade-offs

- [La cuenta regresiva suma unos 3,5 s antes de cada partida] → Es corta y ayuda a prepararse; "Jugar otra vez" omite las instrucciones para no alargar más.
- [La pausa al salir permite "pausar" el Pro abriendo la confirmación] → Es aceptable en clase; el alumno no ve el panel nuevo mientras está el diálogo y no gana tiempo.
- [El temblor podría dificultar tocar los números] → La amplitud es de solo 2 px y se verifica que los toques se registran mientras tiemblan.
- [`<dialog>` no existe en navegadores muy viejos (Safari anterior a 15.4)] → Se acepta; esos navegadores ya son raros. Si `showModal` no existe, se sale directamente sin confirmación.
- [El marcador más alto reduce el tamaño de las celdas en pantallas pequeñas] → Se mantiene el mínimo de 48 px y se verifica en 320 × 568.
