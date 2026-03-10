import { AVATARS, PCOLORS } from './constants.js';
import { state } from './state.js';

export function setPlayerCount(n) {
  state.numPlayers = n;
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.toggle("selected", +b.dataset.count === n));
  renderSetupCards();
}

export function renderSetupCards() {
  const c = document.getElementById("players-setup");
  c.innerHTML = "";
  for (let i = 0; i < state.numPlayers; i++) {
    const d = document.createElement("div");
    d.className = "player-card-setup";
    d.style.borderColor = PCOLORS[i] + "60";
    d.innerHTML = `<h3 style="color:${PCOLORS[i]}">שחקן ${i + 1}</h3>
      <input class="player-name-input" id="pname-${i}" type="text" placeholder="שם" value="שחקן ${i + 1}" maxlength="12"/>
      <div class="avatar-grid" id="avatars-${i}">${AVATARS.map((a, j) => `<span class="avatar-opt${j === i ? " selected" : ""}" data-player="${i}" data-idx="${j}" onclick="selectAvatar(${i},${j})">${a}</span>`).join("")}</div>`;
    c.appendChild(d);
  }
}

export function selectAvatar(pi, ai) {
  document
    .querySelectorAll(`#avatars-${pi} .avatar-opt`)
    .forEach((el) => el.classList.toggle("selected", +el.dataset.idx === ai));
}
