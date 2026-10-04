# Spec Delta

## MODIFIED Requirements

### Requirement: Pantalla de inicio
Al abrir el juego, SHALL mostrarse una pantalla de inicio con una breve explicación y dos opciones: Práctica y Pro. Elegir una opción SHALL llevar a las instrucciones de ese modo, no directamente a la partida.

#### Scenario: Abrir el juego
- **WHEN** el alumno abre la página
- **THEN** ve la pantalla de inicio con los botones "Práctica" y "Pro"

#### Scenario: Elegir modo
- **WHEN** el alumno toca "Práctica" o "Pro"
- **THEN** ve la pantalla de instrucciones de ese modo

### Requirement: Reloj del modo Pro
En modo Pro, la partida SHALL empezar con 60 segundos y el reloj SHALL bajar en tiempo real a partir del final de la cuenta regresiva, visible como número y como barra. El tiempo restante no SHALL pasar de 60 ni bajar de 0.

#### Scenario: Inicio del Pro
- **WHEN** termina la cuenta regresiva de una partida Pro
- **THEN** el reloj marca 60 segundos y empieza a bajar

#### Scenario: Tope de tiempo
- **WHEN** el alumno gana tiempo con 59 segundos restantes
- **THEN** el reloj queda en 60 segundos como máximo

### Requirement: Volver a jugar
La pantalla de resultados SHALL ofrecer "Jugar otra vez", que empieza una partida nueva del mismo modo pasando directamente a la cuenta regresiva sin repetir las instrucciones, e "Inicio", que regresa a la pantalla de inicio.

#### Scenario: Jugar otra vez
- **WHEN** el alumno toca "Jugar otra vez" después de una partida Pro
- **THEN** aparece la cuenta regresiva sin pasar por las instrucciones
- **AND** al terminar la cuenta empieza una partida Pro nueva con 60 segundos y contadores en 0

#### Scenario: Inicio
- **WHEN** el alumno toca "Inicio"
- **THEN** regresa a la pantalla de inicio

## ADDED Requirements

### Requirement: Instrucciones por modo
Antes de cada partida elegida desde el inicio, el juego SHALL mostrar las reglas del modo elegido, con un botón "¡Empezar!" que inicia la cuenta regresiva y un botón "Volver" que regresa al inicio.

#### Scenario: Instrucciones de Práctica
- **WHEN** el alumno elige "Práctica"
- **THEN** ve que no hay tiempo, que cada acierto vale 10 puntos, que los errores muestran su explicación sin castigo y que puede terminar cuando quiera

#### Scenario: Instrucciones de Pro
- **WHEN** el alumno elige "Pro"
- **THEN** ve que empieza con 60 segundos, que un acierto da 5 puntos y 1 segundo, que un error quita 5 segundos, que un panel completo da 3 segundos y que la partida termina cuando el tiempo llega a 0

#### Scenario: Empezar
- **WHEN** el alumno toca "¡Empezar!"
- **THEN** comienza la cuenta regresiva de ese modo

#### Scenario: Volver
- **WHEN** el alumno toca "Volver" en las instrucciones
- **THEN** regresa a la pantalla de inicio

### Requirement: Cuenta regresiva
Antes de cada partida, el juego SHALL mostrar una cuenta regresiva "3", "2", "1", "¡Ya!" de aproximadamente un segundo por paso. Durante la cuenta, los números del panel no SHALL verse ni aceptar toques, y en Pro el reloj no SHALL correr.

#### Scenario: Cuenta antes de jugar
- **WHEN** el alumno toca "¡Empezar!"
- **THEN** ve "3", "2", "1" y "¡Ya!" en ese orden
- **AND** al terminar aparece el panel y se puede jugar

#### Scenario: Panel oculto durante la cuenta
- **WHEN** la cuenta regresiva está en curso
- **THEN** los números del panel no se ven
- **AND** tocar el área del panel no cuenta aciertos ni errores

#### Scenario: Reloj detenido durante la cuenta
- **WHEN** la cuenta regresiva de una partida Pro está en curso
- **THEN** el reloj marca 60 segundos y no baja

### Requirement: Marcador con el modo visible
Durante la partida, el juego SHALL mostrar un marcador con tarjetas separadas y etiquetadas para el modo, los puntos y el panel actual, y en Pro también para el tiempo. El modo SHALL destacarse con un color propio para cada modo.

#### Scenario: Marcador en Práctica
- **WHEN** el alumno juega en modo Práctica
- **THEN** el marcador muestra "Práctica", los puntos y el número del panel actual
- **AND** no muestra tiempo

#### Scenario: Marcador en Pro
- **WHEN** el alumno juega en modo Pro
- **THEN** el marcador muestra "Pro", los puntos, el número del panel actual y el tiempo restante
- **AND** el modo se ve con un color distinto al de Práctica

#### Scenario: Panel actual
- **WHEN** el alumno completa el segundo panel
- **THEN** el marcador indica que está en el panel 3

#### Scenario: Marcador en celular
- **WHEN** el juego se abre en una pantalla de 320 × 568 px
- **THEN** el marcador cabe en el ancho de la pantalla
- **AND** el panel, el marcador y los botones siguen visibles sin hacer scroll

### Requirement: Salir de la partida
Durante la partida y la cuenta regresiva, el juego SHALL ofrecer un botón "Salir" en ambos modos. Al tocarlo SHALL pedir confirmación; confirmar regresa al inicio sin mostrar resultados y cancelar regresa a la partida. En Pro, el reloj SHALL detenerse mientras se muestra la confirmación.

#### Scenario: Salir confirmado
- **WHEN** el alumno toca "Salir" y confirma
- **THEN** regresa a la pantalla de inicio
- **AND** no ve la pantalla de resultados

#### Scenario: Seguir jugando
- **WHEN** el alumno toca "Salir" y luego "Seguir jugando"
- **THEN** regresa a la partida con sus puntos, panel y marcas intactos

#### Scenario: Reloj en pausa al salir
- **WHEN** el alumno toca "Salir" en Pro con 40 segundos restantes, espera 5 segundos y elige "Seguir jugando"
- **THEN** el reloj sigue en 40 segundos al regresar

#### Scenario: Salir durante la cuenta regresiva
- **WHEN** el alumno sale durante la cuenta regresiva
- **THEN** la cuenta se cancela y la partida no empieza

### Requirement: Aviso de tiempo bajo en Pro
En modo Pro, cuando queden 10 segundos o menos, las tarjetas de los números SHALL moverse con un temblor ligero que no impida tocarlas. El aviso SHALL desaparecer si el tiempo vuelve a superar los 10 segundos. Si el dispositivo pide reducir el movimiento, el aviso SHALL mostrarse sin movimiento.

#### Scenario: Quedan 10 segundos
- **WHEN** el reloj del Pro llega a 10 segundos
- **THEN** las tarjetas de los números empiezan a temblar
- **AND** se pueden seguir tocando con normalidad

#### Scenario: Recupera tiempo
- **WHEN** las tarjetas tiemblan y el alumno completa un panel que lo deja con más de 10 segundos
- **THEN** las tarjetas dejan de temblar

#### Scenario: Movimiento reducido
- **WHEN** el dispositivo tiene activada la preferencia de reducir movimiento y quedan 10 segundos o menos
- **THEN** las tarjetas muestran el aviso con un borde rojo, sin moverse

#### Scenario: Práctica sin aviso
- **WHEN** el alumno juega en modo Práctica
- **THEN** las tarjetas nunca tiemblan
