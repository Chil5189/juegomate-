# Spec Delta

## Purpose

Define los dos modos de juego (Práctica y Pro), sus reglas de puntos y tiempo, cómo termina una partida y qué resultados y retroalimentación ve el alumno al final.

## ADDED Requirements

### Requirement: Pantalla de inicio
Al abrir el juego, SHALL mostrarse una pantalla de inicio con una breve explicación y dos opciones: Práctica y Pro.

#### Scenario: Abrir el juego
- **WHEN** el alumno abre la página
- **THEN** ve la pantalla de inicio con los botones "Práctica" y "Pro"

#### Scenario: Elegir modo
- **WHEN** el alumno toca "Práctica" o "Pro"
- **THEN** empieza una partida nueva de ese modo con puntos, aciertos y errores en 0

### Requirement: Puntos en modo Práctica
En modo Práctica no SHALL haber reloj. Cada acierto SHALL sumar 10 puntos y los errores no SHALL restar puntos ni tener otro castigo además de la explicación.

#### Scenario: Acierto en Práctica
- **WHEN** el alumno acierta en modo Práctica
- **THEN** suma 10 puntos

#### Scenario: Error en Práctica
- **WHEN** el alumno se equivoca en modo Práctica
- **THEN** sus puntos no cambian
- **AND** ve la explicación del error

### Requirement: Progresión del panel en Práctica
En modo Práctica, los 3 primeros paneles SHALL usar distractores del 1 al 30 y no incluir primos grandes. A partir del cuarto panel SHALL usar distractores del 1 al 100 e incluir 1 primo grande.

#### Scenario: Primeros paneles
- **WHEN** el alumno juega el panel 1, 2 o 3 en Práctica
- **THEN** todos los números están entre 1 y 30
- **AND** los 5 primos son de los 10 primeros primos

#### Scenario: Paneles avanzados
- **WHEN** el alumno llega al cuarto panel en Práctica
- **THEN** el panel tiene distractores del 1 al 100 y 1 primo grande

### Requirement: Terminar la Práctica
El modo Práctica SHALL tener un botón "Terminar" siempre visible que lleve a la pantalla de resultados.

#### Scenario: Terminar
- **WHEN** el alumno toca "Terminar" en Práctica
- **THEN** ve la pantalla de resultados de su partida

### Requirement: Reloj del modo Pro
En modo Pro, la partida SHALL empezar con 60 segundos y el reloj SHALL bajar en tiempo real, visible como número y como barra. El tiempo restante no SHALL pasar de 60 ni bajar de 0.

#### Scenario: Inicio del Pro
- **WHEN** empieza una partida Pro
- **THEN** el reloj marca 60 segundos y empieza a bajar

#### Scenario: Tope de tiempo
- **WHEN** el alumno gana tiempo con 59 segundos restantes
- **THEN** el reloj queda en 60 segundos como máximo

### Requirement: Puntos y tiempo en modo Pro
En modo Pro, cada acierto SHALL sumar 5 puntos y 1 segundo, cada error SHALL restar 5 segundos y cada panel completo SHALL sumar 3 segundos. Los errores no SHALL restar puntos.

#### Scenario: Acierto en Pro
- **WHEN** el alumno acierta en modo Pro
- **THEN** suma 5 puntos y 1 segundo

#### Scenario: Error en Pro
- **WHEN** el alumno se equivoca en modo Pro
- **THEN** pierde 5 segundos
- **AND** ve la explicación del error

#### Scenario: Panel completo en Pro
- **WHEN** el alumno completa un panel en modo Pro
- **THEN** suma 3 segundos además del tiempo del último acierto

### Requirement: Dificultad constante en Pro
En modo Pro, todos los paneles SHALL usar distractores del 1 al 100 e incluir 1 primo grande. La velocidad del reloj y las reglas de puntos no SHALL cambiar durante la partida.

#### Scenario: Panel avanzado en Pro
- **WHEN** el alumno llega al décimo panel en modo Pro
- **THEN** el panel sigue las mismas reglas que el primero
- **AND** el reloj baja a la misma velocidad

### Requirement: Fin de la partida Pro
Cuando el reloj del modo Pro llegue a 0, la partida SHALL terminar, el panel SHALL dejar de aceptar toques y SHALL mostrarse la pantalla de resultados.

#### Scenario: Se acaba el tiempo
- **WHEN** el reloj llega a 0
- **THEN** ya no se pueden marcar números
- **AND** aparece la pantalla de resultados con el título "¡Se acabó el tiempo!"

#### Scenario: Error que agota el tiempo
- **WHEN** el alumno se equivoca con 3 segundos restantes
- **THEN** el reloj queda en 0 y la partida termina

### Requirement: Pantalla de resultados
La pantalla de resultados SHALL mostrar el modo jugado, los puntos, los aciertos, los errores, los paneles completados, un mensaje de retroalimentación y la lista de números en los que se equivocó, sin repetir.

#### Scenario: Resultados con errores
- **WHEN** termina una partida en la que el alumno se equivocó con 1, 21 y 51
- **THEN** la pantalla muestra "Te confundiste con: 1, 21, 51"

#### Scenario: Resultados sin errores
- **WHEN** termina una partida sin errores
- **THEN** no se muestra la lista de confusiones

### Requirement: Mensaje de retroalimentación
El mensaje final SHALL depender de la precisión (aciertos entre aciertos más errores): 90% o más, "¡Eres pro!"; de 70% a 89%, "¡Muy bien! Ya casi dominas los primeros primos."; menos de 70% o sin aciertos, "Sigue practicando, ¡tú puedes!".

#### Scenario: Alta precisión
- **WHEN** el alumno termina con 19 aciertos y 1 error
- **THEN** ve el mensaje "¡Eres pro!"

#### Scenario: Precisión media
- **WHEN** el alumno termina con 8 aciertos y 2 errores
- **THEN** ve el mensaje "¡Muy bien! Ya casi dominas los primeros primos."

#### Scenario: Sin aciertos
- **WHEN** el alumno termina sin aciertos
- **THEN** ve el mensaje "Sigue practicando, ¡tú puedes!"

### Requirement: Volver a jugar
La pantalla de resultados SHALL ofrecer "Jugar otra vez", que empieza una partida nueva del mismo modo, e "Inicio", que regresa a la pantalla de inicio.

#### Scenario: Jugar otra vez
- **WHEN** el alumno toca "Jugar otra vez" después de una partida Pro
- **THEN** empieza una partida Pro nueva con 60 segundos y contadores en 0

#### Scenario: Inicio
- **WHEN** el alumno toca "Inicio"
- **THEN** regresa a la pantalla de inicio
