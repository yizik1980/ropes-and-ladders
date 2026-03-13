import { PCOLORS, SNAKES, LADDERS } from './constants.js';
import { TRIVIA_CELLS, state } from './state.js';
import { buildBoard, drawOverlay } from './board.js';
import { renderStrip, updatePawns } from './players.js';
import { renderSetupCards } from './setup.js';
import { showTrivia } from './trivia.js';

const DIE_ROTATIONS = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateX(0deg) rotateY(180deg)",
  3: "rotateX(0deg) rotateY(-90deg)",
  4: "rotateX(0deg) rotateY(90deg)",
  5: "rotateX(-90deg) rotateY(0deg)",
  6: "rotateX(90deg) rotateY(0deg)",
};

export function setDiceFaceRotation(dieElement, faceNumber) {
  dieElement.style.transform = DIE_ROTATIONS[faceNumber];
}


export function startGame() {
  state.players.forEach((p, i) => {
    const nameInput = document.getElementById(`pname-${i}`);
    if (nameInput?.value?.trim()) p.name = nameInput.value.trim();
    const sel = document.querySelector(`#avatars-${i} .avatar-opt.selected`);
    if (sel) p.avatar = sel.textContent;
    p.pos = 1;
    p.color = PCOLORS[i];
  });
  state.currentPlayer = 0;
  state.gameStarted = true;
  document.getElementById("setup-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  buildBoard();
  setTimeout(() => {
    updatePawns();
    renderStrip();
    setDiceFaceRotation(document.getElementById("die1"), 1);
    setDiceFaceRotation(document.getElementById("die2"), 1);
    document.getElementById("roll-btn").disabled = false;
  }, 150);
}

export function rollDice() {
  if (!state.gameStarted || state.triviaActive) return;
  document.getElementById("roll-btn").disabled = true;
  const d1 = Math.ceil(Math.random() * 6),
    d2 = Math.ceil(Math.random() * 6),
    tot = d1 + d2;
  const die1 = document.getElementById("die1"),
    die2 = document.getElementById("die2");
  die1.classList.add("rolling");
  die2.classList.add("rolling");
  setTimeout(() => {
    die1.classList.remove("rolling");
    die2.classList.remove("rolling");
    setDiceFaceRotation(die1, d1);
    setDiceFaceRotation(die2, d2);
  }, 600);
  const p = state.players[state.currentPlayer];
  setTimeout(() => movePlayer(state.currentPlayer, tot), 800);
}

export function movePlayer(idx, steps) {
  const p = state.players[idx];
  p.pos = Math.min(p.pos + steps, 100);
  updatePawns();
  const pawn = document.getElementById(`pawn-${idx}`);
  if (pawn) {
    pawn.classList.remove("bounce");
    void pawn.offsetWidth;
    pawn.classList.add("bounce");
  }
  setTimeout(() => {
    renderStrip();
    checkCell(idx, p.pos);
  }, 700);
}

export function checkCell(idx, pos) {
  const p = state.players[idx];
  if (pos === 100) { showWinner(idx); return; }
  if (SNAKES[pos]) {
    const np = SNAKES[pos];
    setTimeout(() => {
      p.pos = np;
      updatePawns();
      renderStrip();
      setTimeout(() => nextTurn(), 1200);
    }, 700);
    return;
  }
  if (LADDERS[pos]) {
    const np = LADDERS[pos];
    setTimeout(() => {
      p.pos = np;
      updatePawns();
      renderStrip();
      setTimeout(() => nextTurn(), 1200);
    }, 700);
    return;
  }
  if (TRIVIA_CELLS.includes(pos)) {
    setTimeout(() => showTrivia(idx), 500);
    return;
  }
  setTimeout(() => nextTurn(), 700);
}

export function nextTurn() {
  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  renderStrip();
  document.getElementById("roll-btn").disabled = false;
}

export function showWinner(idx) {
  const p = state.players[idx];
  document.getElementById("win-avatar").textContent = p.avatar;
  document.getElementById("win-name").textContent = p.name;
  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("win-screen").classList.add("active");
  const cols = ["#ffd700", "#ff6b35", "#00c9a7", "#ff4d8d", "#4d9fff", "#a855f7"];
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.cssText = `left:${Math.random() * 100}vw;background:${cols[Math.floor(Math.random() * cols.length)]};width:${Math.random() * 10 + 6}px;height:${Math.random() * 10 + 6}px;animation-duration:${Math.random() * 3 + 2}s;animation-delay:${Math.random()}s;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 25);
  }
}

export function restartGame() {
  document.getElementById("win-screen").classList.remove("active");
  document.getElementById("setup-screen").classList.add("active");
  state.gameStarted = false;
  renderSetupCards();
}
