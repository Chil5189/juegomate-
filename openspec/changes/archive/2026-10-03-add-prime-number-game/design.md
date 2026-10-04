# Design

## Context

El repositorio está vacío salvo por el `README.md`: no hay código, framework ni herramientas de build. El juego debe poder subirse tal cual al sitio web del docente o incrustarse con un `<iframe>`, y el docente no necesariamente tiene un servidor ni sabe compilar proyectos (ver proposal.md, Why). Node.js está instalado en la máquina de desarrollo, pero no se requiere en producción.

## Goals / Non-Goals

**Goals:**
- Tres archivos estáticos que funcionan abriendo `index.html` directamente (incluso con `file://`) o desde cualquier hosting.
- Separar la lógica del juego (primos, factorización, generación de paneles, puntaje) de la interfaz, para poder probarla sin navegador.
- Un reloj preciso que no se desfase aunque el navegador retrase los temporizadores.

**Non-Goals:**
- Frameworks, bundlers o paquetes de npm.
- Persistencia de datos (récords, progreso) o comunicación con un servidor.
- Accesibilidad completa por lector de pantalla y navegación por teclado más allá de lo que dan los `<button>` nativos (se puede mejorar después).

## Decisions

### 1. Archivos y estructura

```
index.html        pantallas (inicio, juego, resultados) y referencias a CSS/JS
styles.css        estilos, diseño adaptable, colores de acierto/error
logic.js          lógica pura, sin DOM
game.js           estado de la partida, reloj, render y eventos del DOM
tests/logic.test.js   pruebas de logic.js con node --test (solo desarrollo)
```

Los archivos van en la raíz del repositorio para que subir la carpeta completa sea suficiente.

**Alternativa descartada:** un solo `index.html` con todo dentro. Es aún más fácil de subir, pero impide probar la lógica por separado y complica editarlo.

### 2. Scripts clásicos, no módulos ES

`logic.js` y `game.js` se cargan con `<script src>` normales (con `defer`). Los módulos ES (`type="module"`) no funcionan al abrir el archivo con `file://` en Chrome, y es probable que el docente pruebe así antes de subirlo.

`logic.js` expone sus funciones en un único objeto global (`PrimeLogic`) y, si existe `module.exports`, también lo exporta, para que `node --test` pueda cargarlo sin cambios.

### 3. Lógica pura en `logic.js`

- Precálculo de los primos del 1 al 100 con una criba; constantes `TARGET_PRIMES` (los 10 primeros), `BIG_PRIMES` (31 a 97) y `TRAP_NUMBERS` (lista de la spec).
- `explain(n)`: devuelve "1 no es primo: solo tiene un divisor" para 1, o `n = p × (n/p)` con `p` el menor factor primo.
- `generatePanel({ distractorMax, includeBigPrime }, random)`: elige 4 o 5 primos objetivo sin repetir, 1 primo grande si aplica, 1 trampa dentro del rango y completa con no primos distintos hasta 16; luego mezcla con Fisher–Yates. Recibe la función `random` como parámetro para que las pruebas sean deterministas.
- `panelRules(mode, panelIndex)`: traduce las reglas de cada modo a parámetros del panel (Práctica: paneles 1 a 3 con rango 30 y sin primo grande; después rango 100 con primo grande. Pro: siempre rango 100 con primo grande).
- `feedbackMessage(correct, wrong)`: el mensaje final según la precisión.

### 4. Estado y flujo en `game.js`

Un objeto de estado simple (`mode`, `score`, `correct`, `wrong`, `panelsCompleted`, `mistakes` como `Set`, `timeLeftMs`, `panel`). Hay tres pantallas `<section>` en el HTML y solo se muestra una a la vez cambiando un atributo `hidden`; no hay enrutamiento.

```
 [Inicio] --Práctica/Pro--> [Juego] --Terminar o tiempo 0--> [Resultados]
    ^                                                            |
    +-------------------------- Inicio --------------------------+
                         [Juego] <-- Jugar otra vez --+
```

### 5. Reloj del modo Pro

El tiempo restante se guarda en milisegundos y se actualiza en cada `requestAnimationFrame` restando el tiempo real transcurrido (`performance.now()`), en lugar de restar 1 cada vez que se dispara un `setInterval`. Así el reloj no se desfasa si el navegador retrasa los temporizadores. Los bonos y castigos suman o restan milisegundos y se acotan al rango 0 a 60 000.

Si la pestaña se oculta (el alumno cambia de app), el reloj sigue corriendo, porque es una sobrevivencia; al volver, se aplica el tiempo transcurrido. Así se evita que alguien pause el juego minimizándolo.

### 6. Diseño adaptable y toque

- Panel con CSS Grid de 4 columnas y botones cuadrados (`aspect-ratio: 1`), con un tamaño mínimo de 48 px.
- Altura de la pantalla de juego con `100dvh` y diseño en columna (encabezado, barra de tiempo, panel, mensaje), para que todo quepa sin scroll en 320 × 568.
- En pantallas anchas, el mismo panel 4 × 4 se centra con un ancho máximo; no se cambia el número de columnas para que el juego sea igual en todos los dispositivos.
- `touch-action: manipulation` en los botones y `<meta name="viewport" content="width=device-width, initial-scale=1">` evitan el zoom por doble toque y el retraso al tocar.
- Los números son `<button>`, así que funcionan con mouse, toque y teclado sin código extra. Se usa el evento `click`, que cubre todos esos casos.
- El mensaje de explicación ocupa un espacio fijo bajo el panel para que el panel no se mueva al aparecer.

### 7. Pruebas

`node --test` (que encuentra `tests/*.test.js`) prueba la lógica pura: primalidad del 1 al 100, explicaciones (1, 4, 21, 91), reglas de cada panel (16 números distintos, 5 primos, trampa presente, rango de distractores, primo grande según modo) repitiendo la generación muchas veces, y los umbrales del mensaje final. La interfaz se verifica manualmente en un navegador de escritorio y con la vista de celular de las herramientas de desarrollo (360 × 640 y 320 × 568).

## Risks / Trade-offs

- [Los valores de tiempo (+1 s, -5 s, +3 s) pueden hacer el Pro demasiado fácil o difícil] → Se definen como constantes al inicio de `game.js` para ajustarlos fácilmente después de probarlo con alumnos.
- [Con solo 10 primos objetivo y 4 o 5 por panel, los paneles se parecen mucho entre sí] → Es intencional (la repetición es el objetivo); el orden aleatorio y los distractores variados evitan que se memoricen posiciones.
- [El sitio del docente puede tener estilos que choquen si el juego se pega dentro de otra página] → Se recomienda incrustarlo con `<iframe>`, que lo aísla.
- [Sin récords guardados, los alumnos no ven su progreso entre sesiones] → Aceptado para esta versión; se puede añadir con `localStorage` más adelante sin cambiar la estructura.

## Migration Plan

No hay versión anterior. Para publicar: subir `index.html`, `styles.css`, `logic.js` y `game.js` a una carpeta del sitio (por ejemplo `/primos/`) y enlazarla o incrustarla con `<iframe src="/primos/index.html">`. La carpeta `tests/` no es necesaria en el sitio. Para revertir, basta con borrar esa carpeta.
