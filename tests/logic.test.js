const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../logic.js');

test('hay 25 primos del 1 al 100 y el 1 no es primo', () => {
  assert.equal(L.PRIMES.length, 25);
  assert.equal(L.isPrime(1), false);
  assert.equal(L.isPrime(2), true);
  assert.equal(L.isPrime(91), false);
  assert.equal(L.isPrime(97), true);
});

test('los 10 primos objetivo son del 2 al 29', () => {
  assert.deepEqual(L.TARGET_PRIMES, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  assert.equal(L.BIG_PRIMES[0], 31);
  assert.equal(L.BIG_PRIMES.length, 15);
});

test('ningún número trampa es primo', () => {
  for (const n of L.TRAP_NUMBERS) assert.equal(L.isPrime(n), false, String(n));
});

test('explain muestra la descomposición en factores primos', () => {
  assert.equal(L.explain(1), '1 no es primo: solo tiene un divisor');
  assert.equal(L.explain(4), '4 = 2 × 2');
  assert.equal(L.explain(21), '21 = 3 × 7');
  assert.equal(L.explain(91), '91 = 7 × 13');
  assert.equal(L.explain(27), '27 = 3 × 3 × 3');
  assert.equal(L.explain(60), '60 = 2 × 2 × 3 × 5');
});

test('el producto de los factores primos devuelve el número', () => {
  for (let n = 2; n <= 100; n++) {
    const f = L.primeFactors(n);
    assert.equal(f.reduce((a, b) => a * b, 1), n);
    assert.ok(f.every(L.isPrime), String(n));
  }
});

function checkPanels(rules, runs) {
  for (let r = 0; r < runs; r++) {
    const panel = L.generatePanel(rules);
    assert.equal(panel.length, 16);
    assert.equal(new Set(panel).size, 16, 'números repetidos');
    const primes = panel.filter(L.isPrime);
    assert.equal(primes.length, 5);
    const big = primes.filter((n) => n > 29);
    assert.equal(big.length, rules.includeBigPrime ? 1 : 0);
    assert.ok(panel.some((n) => L.TRAP_NUMBERS.includes(n)), 'falta trampa');
    for (const n of panel.filter((x) => !L.isPrime(x))) {
      assert.ok(n >= 1 && n <= rules.distractorMax, 'distractor fuera de rango: ' + n);
    }
  }
}

test('panel de rango reducido: 16 distintos, 5 primos objetivo, trampa, todo hasta 30', () => {
  checkPanels({ distractorMax: 30, includeBigPrime: false }, 2000);
});

test('panel de rango completo: 4 primos objetivo + 1 grande, trampa, hasta 100', () => {
  checkPanels({ distractorMax: 100, includeBigPrime: true }, 2000);
});

test('el panel no sale ordenado', () => {
  let sorted = 0;
  for (let r = 0; r < 200; r++) {
    const panel = L.generatePanel({ distractorMax: 100, includeBigPrime: true });
    if (panel.every((n, i) => i === 0 || panel[i - 1] < n)) sorted++;
  }
  assert.equal(sorted, 0);
});

test('reglas de panel por modo', () => {
  const small = { distractorMax: 30, includeBigPrime: false };
  const full = { distractorMax: 100, includeBigPrime: true };
  assert.deepEqual(L.panelRules('practice', 0), small);
  assert.deepEqual(L.panelRules('practice', 2), small);
  assert.deepEqual(L.panelRules('practice', 3), full);
  assert.deepEqual(L.panelRules('pro', 0), full);
  assert.deepEqual(L.panelRules('pro', 9), full);
});

test('mensaje final según la precisión', () => {
  assert.equal(L.feedbackMessage(19, 1), '¡Eres pro!');
  assert.equal(L.feedbackMessage(8, 2), '¡Muy bien! Ya casi dominas los primeros primos.');
  assert.equal(L.feedbackMessage(6, 4), 'Sigue practicando, ¡tú puedes!');
  assert.equal(L.feedbackMessage(0, 0), 'Sigue practicando, ¡tú puedes!');
  assert.equal(L.feedbackMessage(0, 3), 'Sigue practicando, ¡tú puedes!');
});
