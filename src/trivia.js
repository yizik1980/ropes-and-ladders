import { TRIVIA } from './constants.js';
import { state } from './state.js';
import { updatePawns, renderStrip } from './players.js';
// game.js imports are resolved lazily (circular deps are fine in ES modules)
import { setStatus, nextTurn, showWinner } from './game.js';

export function showTrivia(idx) {
  state.triviaActive = true;
  state.triviaAnswered = false;
  const q = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
  document.getElementById("trivia-question").textContent = "באיזה אות זה מתחיל?";
  document.getElementById("trivia-sign-display").innerHTML =
    `<div style="font-size:8rem;margin-bottom:30px">${q.img}</div>`;
  document.getElementById("trivia-result").className = "trivia-result";
  const oc = document.getElementById("trivia-options");
  oc.innerHTML = "";
  q.opts.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "trivia-opt";
    btn.textContent = opt;
    btn.style.fontSize = "2rem";
    btn.style.padding = "20px 40px";
    btn.onclick = () => answerTrivia(opt, q, idx, btn);
    oc.appendChild(btn);
  });
  document.getElementById("trivia-overlay").classList.add("active");
}

export function answerTrivia(ans, q, idx, btn) {
  if (state.triviaAnswered) return;
  state.triviaAnswered = true;
  const p = state.players[idx];
  document.querySelectorAll(".trivia-opt").forEach((b) => (b.disabled = true));
  const res = document.getElementById("trivia-result");
  if (ans === q.ans) {
    btn.classList.add("correct");
    res.className = "trivia-result win";
    res.textContent = `✅ נכון! ${p.name} מתקדם/ת 3 תאים!`;
    setTimeout(() => {
      closeTrivia();
      p.pos = Math.min(p.pos + 3, 100);
      updatePawns();
      renderStrip();
      setStatus(`✅ נכון! ${p.avatar} <b>${p.name}</b> +3 תאים!`);
      if (p.pos === 100) { showWinner(idx); return; }
      setTimeout(() => nextTurn(), 1000);
    }, 1700);
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll(".trivia-opt").forEach((b) => {
      if (b.textContent === q.ans) b.classList.add("correct");
    });
    res.className = "trivia-result lose";
    res.textContent = `❌ טעות! הנכון: ${q.ans}. ${p.name} חוזר/ת 2 תאים.`;
    setTimeout(() => {
      closeTrivia();
      p.pos = Math.max(p.pos - 2, 1);
      updatePawns();
      renderStrip();
      setStatus(`❌ טעות. ${p.avatar} <b>${p.name}</b> -2 תאים.`);
      setTimeout(() => nextTurn(), 1000);
    }, 2100);
  }
}

export function closeTrivia() {
  document.getElementById("trivia-overlay").classList.remove("active");
  state.triviaActive = false;
}
