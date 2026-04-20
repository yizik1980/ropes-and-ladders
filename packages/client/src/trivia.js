import { state } from "./state.js";
import { updatePawns, renderStrip } from "./players.js";
import { nextTurn, showWinner } from "./game.js";
import { playCorrect, playWin } from "./sounds.js";
import { t } from "./i18n.js";

export function showTrivia(idx) {
  state.triviaActive = true;
  state.triviaAnswered = false;
  const q = state.triviaPool.shift();
  document.getElementById("trivia-question").textContent = t('trivia.q', q.img);
  document.getElementById("trivia-sign-display").innerHTML =
    `<div style="font-size:8rem;margin-bottom:20px;font-weight:bold;color:var(--blue)">${q.img}</div>`;
  document.getElementById("trivia-result").className = "trivia-result";
  const oc = document.getElementById("trivia-options");
  oc.innerHTML = "";
  q.opts.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "trivia-opt";
    btn.textContent = opt;
    btn.style.fontSize = "2.8rem";
    btn.style.padding = "14px 20px";
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
    playCorrect();
    btn.classList.add("correct");
    res.className = "trivia-result win";
    res.textContent = t('trivia.ok', p.name);
    setTimeout(() => {
      closeTrivia();
      p.pos = Math.min(p.pos + 3, 100);
      updatePawns();
      renderStrip();
      if (p.pos === 100) {
        playWin();
        showWinner(idx);
        return;
      }
      setTimeout(() => nextTurn(), 1000);
    }, 1700);
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll(".trivia-opt").forEach((b) => {
      if (b.textContent === q.ans) b.classList.add("correct");
    });
    res.className = "trivia-result lose";
    res.textContent = t('trivia.fail', q.ans, p.name);
    setTimeout(() => {
      closeTrivia();
      p.pos = Math.max(p.pos - 2, 1);
      updatePawns();
      renderStrip();
      setTimeout(() => nextTurn(), 1000);
    }, 2100);
  }
}

export function closeTrivia() {
  document.getElementById("trivia-overlay").classList.remove("active");
  state.triviaActive = false;
}
