// Lógica pura del juego de números primos (sin DOM).
// Se carga como script clásico en el navegador (global PrimeLogic)
// y con require() en Node para las pruebas.
(function (root) {
  'use strict';

  const MAX = 100;
  const PANEL_SIZE = 16;
  const PRIMES_PER_PANEL = 5;

  // Criba de Eratóstenes del 1 al MAX.
  const primeTable = new Array(MAX + 1).fill(true);
  primeTable[0] = false;
  primeTable[1] = false;
  for (let i = 2; i * i <= MAX; i++) {
    if (primeTable[i]) {
      for (let j = i * i; j <= MAX; j += i) primeTable[j] = false;
    }
  }

  const PRIMES = [];
  for (let n = 1; n <= MAX; n++) if (primeTable[n]) PRIMES.push(n);

  const TARGET_PRIMES = PRIMES.slice(0, 10); // 2 ... 29
  const BIG_PRIMES = PRIMES.slice(10); // 31 ... 97
  const TRAP_NUMBERS = [1, 9, 15, 21, 25, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];

  function isPrime(n) {
    return Number.isInteger(n) && n >= 0 && n <= MAX && primeTable[n];
  }

  // Factores primos de menor a mayor: 60 -> [2, 2, 3, 5].
  function primeFactors(n) {
    const factors = [];
    for (let p = 2; n > 1; p++) {
      while (n % p === 0) {
        factors.push(p);
        n /= p;
      }
    }
    return factors;
  }

  // "27 = 3 × 3 × 3": descomposición completa en factores primos.
  function explain(n) {
    if (n === 1) return '1 no es primo: solo tiene un divisor';
    if (isPrime(n)) return n + ' es primo';
    return n + ' = ' + primeFactors(n).join(' × ');
  }

  // Elige k elementos distintos de arr (Fisher–Yates parcial).
  function pick(arr, k, random) {
    const copy = arr.slice();
    for (let i = 0; i < k; i++) {
      const j = i + Math.floor(random() * (copy.length - i));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy.slice(0, k);
  }

  function shuffle(arr, random) {
    return pick(arr, arr.length, random);
  }

  // rules: { distractorMax: 30 | 100, includeBigPrime: boolean }
  function generatePanel(rules, random) {
    random = random || Math.random;
    const targetCount = rules.includeBigPrime ? PRIMES_PER_PANEL - 1 : PRIMES_PER_PANEL;
    const primes = pick(TARGET_PRIMES, targetCount, random);
    if (rules.includeBigPrime) primes.push(pick(BIG_PRIMES, 1, random)[0]);

    const trap = pick(TRAP_NUMBERS.filter((n) => n <= rules.distractorMax), 1, random)[0];
    const others = [];
    for (let n = 1; n <= rules.distractorMax; n++) {
      if (!isPrime(n) && n !== trap) others.push(n);
    }
    const distractors = [trap].concat(pick(others, PANEL_SIZE - PRIMES_PER_PANEL - 1, random));

    return shuffle(primes.concat(distractors), random);
  }

  // panelIndex empieza en 0 (el primer panel de la partida).
  function panelRules(mode, panelIndex) {
    if (mode === 'practice' && panelIndex < 3) {
      return { distractorMax: 30, includeBigPrime: false };
    }
    return { distractorMax: 100, includeBigPrime: true };
  }

  function feedbackMessage(correct, wrong) {
    const total = correct + wrong;
    const accuracy = total === 0 ? 0 : correct / total;
    if (correct > 0 && accuracy >= 0.9) return '¡Eres pro!';
    if (correct > 0 && accuracy >= 0.7) return '¡Muy bien! Ya casi dominas los primeros primos.';
    return 'Sigue practicando, ¡tú puedes!';
  }

  const api = {
    MAX,
    PANEL_SIZE,
    PRIMES_PER_PANEL,
    PRIMES,
    TARGET_PRIMES,
    BIG_PRIMES,
    TRAP_NUMBERS,
    isPrime,
    primeFactors,
    explain,
    generatePanel,
    panelRules,
    feedbackMessage,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PrimeLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
