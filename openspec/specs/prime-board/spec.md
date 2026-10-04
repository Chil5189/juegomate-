# prime-board Specification

## Purpose

Define el panel de números donde el alumno identifica primos: qué números aparecen, cómo se seleccionan, qué retroalimentación recibe y cómo se ve en celular y computadora.

## Requirements

### Requirement: Contenido del panel
Cada panel SHALL mostrar 16 números enteros distintos entre 1 y 100, en orden aleatorio. Exactamente 5 de ellos SHALL ser primos y los 11 restantes no primos.

#### Scenario: Panel nuevo
- **WHEN** se genera un panel
- **THEN** contiene 16 números distintos entre 1 y 100
- **AND** exactamente 5 son primos

#### Scenario: Orden aleatorio
- **WHEN** se generan dos paneles seguidos
- **THEN** los números no aparecen en orden ascendente ni en la misma posición fija

### Requirement: Prioridad de los 10 primeros primos
Los primos de cada panel SHALL salir principalmente de los 10 primeros primos (2, 3, 5, 7, 11, 13, 17, 19, 23, 29). Un panel SHALL incluir como máximo 1 primo mayor que 29 (31 a 97), según las reglas del modo de juego.

#### Scenario: Panel con primo grande
- **WHEN** las reglas del modo permiten un primo grande en el panel
- **THEN** 4 de los 5 primos son de los 10 primeros primos
- **AND** 1 primo está entre 31 y 97

#### Scenario: Panel sin primos grandes
- **WHEN** las reglas del modo no permiten primos grandes en el panel
- **THEN** los 5 primos son de los 10 primeros primos

### Requirement: Números trampa
Cada panel SHALL incluir al menos 1 número trampa, es decir, un no primo que suele confundirse con primo: 1, 9, 15, 21, 25, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93.

#### Scenario: Trampa presente
- **WHEN** se genera un panel
- **THEN** al menos uno de sus no primos pertenece a la lista de números trampa

### Requirement: Rango de los distractores
Los no primos del panel SHALL tomarse del rango que indique el modo de juego: 1 a 30 o 1 a 100.

#### Scenario: Distractores en rango reducido
- **WHEN** el modo indica distractores del 1 al 30
- **THEN** todos los no primos del panel están entre 1 y 30

#### Scenario: Distractores en rango completo
- **WHEN** el modo indica distractores del 1 al 100
- **THEN** los no primos del panel pueden ser cualquier no primo entre 1 y 100

### Requirement: Selección de un primo
Al tocar o hacer click en un número primo, el juego SHALL marcarlo como acierto de forma visible e inmediata y SHALL contarlo como acierto. Cualquier primo del 1 al 100 cuenta como acierto.

#### Scenario: Acierto con primo objetivo
- **WHEN** el alumno toca el 23
- **THEN** el número se marca en verde como acierto
- **AND** el contador de aciertos aumenta en 1

#### Scenario: Acierto con primo grande
- **WHEN** el alumno toca el 97
- **THEN** el número se marca como acierto, igual que un primo objetivo

#### Scenario: Primo ya marcado
- **WHEN** el alumno vuelve a tocar un primo que ya marcó
- **THEN** no cambia nada ni se cuenta otro acierto

### Requirement: Selección de un no primo
Al tocar un número que no es primo, el juego SHALL marcarlo como error de forma visible, SHALL mostrar por qué no es primo y SHALL contarlo como error una sola vez.

#### Scenario: Error con número compuesto
- **WHEN** el alumno toca el 21
- **THEN** el número se marca en rojo
- **AND** se muestra el mensaje "21 = 3 × 7"
- **AND** el contador de errores aumenta en 1

#### Scenario: Error con el 1
- **WHEN** el alumno toca el 1
- **THEN** se muestra el mensaje "1 no es primo: solo tiene un divisor"

#### Scenario: Error repetido
- **WHEN** el alumno vuelve a tocar un no primo que ya marcó como error
- **THEN** no se cuenta un error nuevo

### Requirement: Explicación de los errores
La explicación de un número compuesto SHALL mostrarlo como su descomposición completa en factores primos, ordenados de menor a mayor y separados por "×".

#### Scenario: Compuesto con factores grandes
- **WHEN** el alumno toca el 91
- **THEN** el mensaje es "91 = 7 × 13"

#### Scenario: Cuadrado
- **WHEN** el alumno toca el 4
- **THEN** el mensaje es "4 = 2 × 2"

#### Scenario: Factor primo repetido
- **WHEN** el alumno toca el 27
- **THEN** el mensaje es "27 = 3 × 3 × 3"

#### Scenario: Varios factores primos distintos
- **WHEN** el alumno toca el 60
- **THEN** el mensaje es "60 = 2 × 2 × 3 × 5"

### Requirement: Panel completo
Cuando el alumno haya marcado los 5 primos del panel, el juego SHALL mostrar automáticamente un panel nuevo.

#### Scenario: Último primo del panel
- **WHEN** el alumno marca el quinto primo del panel
- **THEN** aparece un panel nuevo con números distintos
- **AND** el contador de paneles completados aumenta en 1

### Requirement: Diseño para celular
En un celular en vertical (ancho desde 320 px), el juego SHALL mostrar el panel en 4 columnas, con todo lo necesario para jugar visible sin hacer scroll y con botones de al menos 48 × 48 px.

#### Scenario: Celular en vertical
- **WHEN** el juego se abre en una pantalla de 360 × 640 px
- **THEN** el panel se ve en 4 columnas de 4 números
- **AND** el panel, el reloj y los puntos se ven completos sin hacer scroll

#### Scenario: Pantalla mínima
- **WHEN** el juego se abre en una pantalla de 320 × 568 px
- **THEN** cada número mide al menos 48 × 48 px y no hay scroll horizontal

### Requirement: Respuesta inmediata al toque
El juego SHALL funcionar con toque y con mouse, sin depender de pasar el cursor por encima, y un toque SHALL registrarse sin retraso ni hacer zoom en la página.

#### Scenario: Toques rápidos
- **WHEN** el alumno toca dos números distintos rápidamente en un celular
- **THEN** ambos toques se registran
- **AND** la página no hace zoom

#### Scenario: Computadora
- **WHEN** el alumno usa mouse en una computadora
- **THEN** puede jugar igual que con toque
