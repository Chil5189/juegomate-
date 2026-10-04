// Interfaz y estado de la partida. Usa PrimeLogic (logic.js).
(function () {
  'use strict';

  const L = window.PrimeLogic;

  // Reglas ajustables.
  const PRACTICE_POINTS = 10;
  const PRO_POINTS = 5;
  const PRO_START_MS = 60000;
  const PRO_MAX_MS = 60000;
  const PRO_CORRECT_BONUS_MS = 1000;
  const PRO_WRONG_PENALTY_MS = 5000;
  const PRO_PANEL_BONUS_MS = 3000;
  const PRO_LOW_TIME_MS = 10000;

  const MODE_NAMES = { practice: 'Práctica', pro: 'Pro' };

  const $ = (id) => document.getElementById(id);
  const screens = {
    start: $('screen-start'),
    game: $('screen-game'),
    results: $('screen-results'),
  };
  const ui = {
    board: $('board'),
    feedback: $('feedback'),
    hudMode: $('hud-mode'),
    hudScore: $('hud-score'),
    hudPanels: $('hud-panels'),
    hudTime: $('hud-time'),
    timebar: $('timebar'),
    timebarFill: $('timebar-fill'),
    finish: $('btn-finish'),
  };

  let state = null;

  function showScreen(name) {
    for (const key in screens) screens[key].hidden = key !== name;
  }

  function startGame(mode) {
    state = {
      mode,
      score: 0,
      correct: 0,
      wrong: 0,
      panelsCompleted: 0,
      mistakes: new Set(),
      panel: [],
      marked: new Map(), // número -> 'correct' | 'wrong'
      timeLeftMs: PRO_START_MS,
      lastTick: 0,
      running: true,
    };

    const isPro = mode === 'pro';
    ui.hudMode.textContent = MODE_NAMES[mode];
    ui.hudMode.classList.toggle('is-pro', isPro);
    ui.hudTime.hidden = !isPro;
    ui.timebar.hidden = !isPro;
    ui.finish.hidden = isPro;
    ui.board.classList.remove('is-locked');
    setFeedback('', '');
    newPanel();
    updateHud();
    showScreen('game');

    if (isPro) {
      state.lastTick = performance.now();
      renderTime();
      requestAnimationFrame(tick);
    }
  }

  function newPanel() {
    state.panel = L.generatePanel(L.panelRules(state.mode, state.panelsCompleted));
    state.marked = new Map();
    ui.board.replaceChildren(
      ...state.panel.map((n) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.textContent = n;
        cell.dataset.n = n;
        return cell;
      })
    );
    // Reinicia la animación de entrada.
    ui.board.classList.remove('is-new');
    void ui.board.offsetWidth;
    ui.board.classList.add('is-new');
  }

  function onCellClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell || !state || !state.running) return;
    const n = Number(cell.dataset.n);
    if (state.marked.has(n)) return;

    if (L.isPrime(n)) {
      state.marked.set(n, 'correct');
      cell.classList.add('is-correct');
      state.correct++;
      if (state.mode === 'pro') {
        state.score += PRO_POINTS;
        addTime(PRO_CORRECT_BONUS_MS);
      } else {
        state.score += PRACTICE_POINTS;
      }
      setFeedback('✓ ' + L.explain(n), 'is-correct');

      const found = state.panel.filter((x) => state.marked.get(x) === 'correct').length;
      if (found === L.PRIMES_PER_PANEL) {
        state.panelsCompleted++;
        if (state.mode === 'pro') addTime(PRO_PANEL_BONUS_MS);
        setFeedback('¡Panel completo!', 'is-correct');
        newPanel();
      }
    } else {
      state.marked.set(n, 'wrong');
      cell.classList.add('is-wrong');
      state.wrong++;
      state.mistakes.add(n);
      setFeedback('✗ ' + L.explain(n), 'is-wrong');
      if (state.mode === 'pro') {
        addTime(-PRO_WRONG_PENALTY_MS);
        if (state.timeLeftMs <= 0) {
          updateHud();
          endGame();
          return;
        }
      }
    }
    updateHud();
  }

  function addTime(ms) {
    state.timeLeftMs = Math.min(PRO_MAX_MS, Math.max(0, state.timeLeftMs + ms));
    renderTime();
  }

  // El reloj resta el tiempo real transcurrido, así no se desfasa
  // aunque el navegador retrase los cuadros o la pestaña se oculte.
  function tick(now) {
    if (!state || !state.running || state.mode !== 'pro') return;
    state.timeLeftMs = Math.max(0, state.timeLeftMs - (now - state.lastTick));
    state.lastTick = now;
    renderTime();
    if (state.timeLeftMs <= 0) {
      endGame();
      return;
    }
    requestAnimationFrame(tick);
  }

  function renderTime() {
    const low = state.timeLeftMs <= PRO_LOW_TIME_MS;
    ui.hudTime.textContent = Math.ceil(state.timeLeftMs / 1000);
    ui.hudTime.classList.toggle('is-low', low);
    ui.timebarFill.style.transform = 'scaleX(' + state.timeLeftMs / PRO_MAX_MS + ')';
    ui.timebarFill.classList.toggle('is-low', low);
  }

  function updateHud() {
    ui.hudScore.textContent = state.score;
    ui.hudPanels.textContent = state.panelsCompleted;
  }

  function setFeedback(text, kind) {
    ui.feedback.textContent = text;
    ui.feedback.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function endGame() {
    state.running = false;
    ui.board.classList.add('is-locked');
    showResults();
  }

  function showResults() {
    $('results-title').textContent =
      state.mode === 'pro' ? '¡Se acabó el tiempo!' : '¡Práctica terminada!';
    $('results-mode').textContent = 'Modo ' + MODE_NAMES[state.mode];
    $('res-score').textContent = state.score;
    $('res-correct').textContent = state.correct;
    $('res-wrong').textContent = state.wrong;
    $('res-panels').textContent = state.panelsCompleted;
    $('res-message').textContent = L.feedbackMessage(state.correct, state.wrong);

    const mistakes = $('res-mistakes');
    const list = Array.from(state.mistakes).sort((a, b) => a - b);
    mistakes.hidden = list.length === 0;
    mistakes.textContent = 'Te confundiste con: ' + list.join(', ');

    showScreen('results');
  }

  for (const btn of document.querySelectorAll('[data-mode]')) {
    btn.addEventListener('click', () => startGame(btn.dataset.mode));
  }
  ui.board.addEventListener('click', onCellClick);
  ui.finish.addEventListener('click', () => {
    if (state && state.running) endGame();
  });
  $('btn-again').addEventListener('click', () => startGame(state.mode));
  $('btn-home').addEventListener('click', () => showScreen('start'));
})();
