# Spec Delta

## MODIFIED Requirements

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
