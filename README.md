# juegomate-

## Cazador de primos

Juego web para que alumnos de 2º de secundaria aprendan a reconocer los números primos, sobre todo los 10 primeros (2, 3, 5, 7, 11, 13, 17, 19, 23, 29). El alumno toca los primos de un panel de 16 números del 1 al 100.

- **Práctica:** sin tiempo. Cada acierto vale 10 puntos y los errores solo muestran la explicación (por ejemplo "21 = 3 × 7"). Los primeros 3 paneles usan números del 1 al 30.
- **Pro:** sobrevivencia de 60 segundos. Cada acierto vale 5 puntos y +1 s, cada error resta 5 s y cada panel completo da +3 s.

Cada partida sigue este orden:

1. El alumno elige un modo y ve sus **instrucciones**. "¡Empezar!" inicia la partida y "Volver" regresa al inicio.
2. Una **cuenta regresiva** ("3, 2, 1, ¡Ya!") oculta el panel. En Pro, el reloj empieza a correr al terminar la cuenta.
3. Durante la partida, el marcador muestra el modo, los puntos, el panel actual y, en Pro, el tiempo. En Pro, con 10 segundos o menos las tarjetas tiemblan.
4. Si te equivocas, verás la descomposición en factores primos del número (por ejemplo "27 = 3 × 3 × 3").
5. **Salir** pide confirmación y regresa al inicio sin resultados. En Pro, el reloj se pausa mientras se decide.
6. Al terminar se muestran los puntos, los aciertos, los errores y los números en los que el alumno se confundió. "Jugar otra vez" repite el mismo modo, sin volver a mostrar las instrucciones.

Las reglas de cada modo que se muestran antes de jugar están escritas en `index.html`. Si cambias los puntos o los tiempos en `game.js`, actualiza también esos textos.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Las pantallas del juego |
| `styles.css` | Estilos y diseño para celular |
| `logic.js` | Lógica pura: primos, explicaciones, generación de paneles |
| `game.js` | Partida, reloj y botones. Los tiempos y puntos se ajustan al inicio del archivo |
| `tests/` | Pruebas de `logic.js` (no hace falta subirlas al sitio) |

## Probarlo

Abre `index.html` con doble clic: funciona sin servidor.

Para ejecutar las pruebas (requiere Node.js 18 o superior):

```
node --test
```

## Publicarlo en tu sitio web

1. Sube `index.html`, `styles.css`, `logic.js` y `game.js` a una carpeta de tu sitio, por ejemplo `/primos/`.
2. Enlázalo directamente (`https://tusitio.com/primos/`) o incrústalo en una página con un iframe:

```html
<iframe src="/primos/index.html" style="width: 100%; max-width: 480px; height: 680px; border: 0;" title="Cazador de primos"></iframe>
```

El iframe aísla el juego de los estilos de tu página.
