// Interfaz y estado de la partida. Usa PrimeLogic (logic.js).
(function () {
  'use strict';

  const L = window.PrimeLogic;

  // Reglas ajustables. Si las cambias, actualiza también las instrucciones en index.html.
  const PRACTICE_POINTS = 10;
  const PRO_POINTS = 5;
  const PRO_START_MS = 60000;
  const PRO_MAX_MS = 60000;
  const PRO_CORRECT_BONUS_MS = 1000;
  const PRO_WRONG_PENALTY_MS = 5000;
  const PRO_PANEL_BONUS_MS = 3000;
  const PRO_LOW_TIME_MS = 10000;

  // Cuenta regresiva antes de cada partida: [texto, duración en ms].
  const COUNTDOWN_STEPS = [['3', 1000], ['2', 1000], ['1', 1000], ['¡Ya!', 600]];

  const MODE_NAMES = { practice: 'Práctica', pro: 'Pro' };

  const $ = (id) => document.getElementById(id);
  const screens = {
    start: $('screen-start'),
    instructions: $('screen-instructions'),
    game: $('screen-game'),
    results: $('screen-results'),
  };
  const ui = {
    board: $('board'),
    countdown: $('countdown'),
    feedback: $('feedback'),
    hudMode: $('hud-mode'),
    hudScore: $('hud-score'),
    hudPanel: $('hud-panel'),
    hudTimeCard: $('hud-time-card'),
    hudTime: $('hud-time'),
    timebar: $('timebar'),
    timebarFill: $('timebar-fill'),
    finish: $('btn-finish'),
    exitDialog: $('exit-dialog'),
  };

  let selectedMode = 'practice';
  let state = null;

  function showScreen(name) {
    for (const key in screens) screens[key].hidden = key !== name;
  }

  function setModePill(el, mode) {
    el.textContent = MODE_NAMES[mode];
    el.classList.toggle('is-pro', mode === 'pro');
  }

  function showInstructions(mode) {
    selectedMode = mode;
    setModePill($('instr-mode'), mode);
    for (const block of document.querySelectorAll('[data-instructions]')) {
      block.hidden = block.dataset.instructions !== mode;
    }
    showScreen('instructions');
  }

  function startGame(mode) {
    if (state) cancelCountdown();
    state = {
      mode,
      phase: 'countdown', // 'countdown' | 'playing' | 'ended'
      paused: false,
      score: 0,
      correct: 0,
      wrong: 0,
      panelsCompleted: 0,
      mistakes: new Set(),
      panel: [],
      marked: new Map(), // número -> 'correct' | 'wrong'
      timeLeftMs: PRO_START_MS,
      lastTick: 0,
      timers: [],
    };

    const isPro = mode === 'pro';
    setModePill(ui.hudMode, mode);
    ui.hudTimeCard.hidden = !isPro;
    ui.timebar.hidden = !isPro;
    ui.finish.hidden = isPro;
    ui.board.classList.remove('is-locked', 'is-warning');
    ui.countdown.classList.toggle('is-pro', isPro);
    setFeedback('', '');
    newPanel();
    updateHud();
    if (isPro) renderTime();
    showScreen('game');
    runCountdown();
  }

  // Muestra 3, 2, 1, ¡Ya! sobre el panel; los números quedan ocultos y sin toques.
  function runCountdown() {
    state.phase = 'countdown';
    ui.board.classList.add('is-hidden-cells');
    ui.countdown.hidden = false;
    let delay = 0;
    for (const [text, ms] of COUNTDOWN_STEPS) {
      state.timers.push(setTimeout(() => showCountdownStep(text), delay));
      delay += ms;
    }
    state.timers.push(setTimeout(beginPlay, delay));
  }

  function showCountdownStep(text) {
    const span = document.createElement('span');
    span.textContent = text;
    ui.countdown.replaceChildren(span);
  }

  function cancelCountdown() {
    for (const id of state.timers) clearTimeout(id);
    state.timers = [];
    ui.countdown.hidden = true;
    ui.countdown.replaceChildren();
  }

  function beginPlay() {
    cancelCountdown();
    ui.board.classList.remove('is-hidden-cells');
    state.phase = 'playing';
    if (state.mode === 'pro') startClock();
  }

  // Cada arranque del reloj tiene su id; un ciclo viejo (de antes de una pausa
  // o de otra partida) se detiene solo en lugar de correr en paralelo.
  let clockId = 0;

  function startClock() {
    const id = ++clockId;
    state.lastTick = performance.now();
    requestAnimationFrame((now) => tick(now, id));
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

  function isPlaying() {
    return state && state.phase === 'playing' && !state.paused;
  }

  function onCellClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell || !isPlaying()) return;
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
  // Se detiene durante la cuenta regresiva y la confirmación de salida.
  function tick(now, id) {
    if (id !== clockId || !isPlaying() || state.mode !== 'pro') return;
    state.timeLeftMs = Math.max(0, state.timeLeftMs - (now - state.lastTick));
    state.lastTick = now;
    renderTime();
    if (state.timeLeftMs <= 0) {
      endGame();
      return;
    }
    requestAnimationFrame((next) => tick(next, id));
  }

  function renderTime() {
    const low = state.timeLeftMs <= PRO_LOW_TIME_MS;
    ui.hudTime.textContent = Math.ceil(state.timeLeftMs / 1000);
    ui.hudTime.classList.toggle('is-low', low);
    ui.timebarFill.style.transform = 'scaleX(' + state.timeLeftMs / PRO_MAX_MS + ')';
    ui.timebarFill.classList.toggle('is-low', low);
    ui.board.classList.toggle('is-warning', low && state.timeLeftMs > 0);
  }

  function updateHud() {
    ui.hudScore.textContent = state.score;
    ui.hudPanel.textContent = state.panelsCompleted + 1;
  }

  function setFeedback(text, kind) {
    ui.feedback.textContent = text;
    ui.feedback.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function endGame() {
    state.phase = 'ended';
    ui.board.classList.remove('is-warning');
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

  // --- Salir de la partida ---

  function askExit() {
    if (!state || state.phase === 'ended') return;
    if (typeof ui.exitDialog.showModal !== 'function') {
      exitToStart();
      return;
    }
    state.paused = true;
    // La cuenta regresiva se reinicia al volver, para no empezar a mitad.
    if (state.phase === 'countdown') cancelCountdown();
    ui.exitDialog.returnValue = '';
    ui.exitDialog.showModal();
  }

  function onExitDialogClose() {
    if (ui.exitDialog.returnValue === 'exit') {
      exitToStart();
      return;
    }
    // "Seguir jugando" o Esc.
    state.paused = false;
    if (state.phase === 'countdown') runCountdown();
    else if (state.phase === 'playing' && state.mode === 'pro') startClock();
  }

  function exitToStart() {
    cancelCountdown();
    state.phase = 'ended';
    state.paused = false;
    ui.board.classList.remove('is-warning');
    showScreen('start');
  }

  // --- Eventos ---

  for (const btn of document.querySelectorAll('[data-mode]')) {
    btn.addEventListener('click', () => showInstructions(btn.dataset.mode));
  }
  $('btn-go').addEventListener('click', () => startGame(selectedMode));
  $('btn-back').addEventListener('click', () => showScreen('start'));
  ui.board.addEventListener('click', onCellClick);
  ui.finish.addEventListener('click', () => {
    if (isPlaying()) endGame();
  });
  $('btn-exit').addEventListener('click', askExit);
  $('btn-stay').addEventListener('click', () => ui.exitDialog.close('stay'));
  $('btn-exit-confirm').addEventListener('click', () => ui.exitDialog.close('exit'));
  ui.exitDialog.addEventListener('close', onExitDialogClose);
  $('btn-again').addEventListener('click', () => startGame(state.mode));
  $('btn-home').addEventListener('click', () => showScreen('start'));
})();
