import { PCOLORS } from './constants.js';
import { state } from './state.js';
import { cellCenter } from './board.js';

export function renderStrip() {
  const strip = document.getElementById("players-strip");
  strip.innerHTML = "";
  state.players.forEach((p, i) => {
    const chip = document.createElement("div");
    chip.className = "player-chip" + (i === state.currentPlayer ? " active" : "");
    chip.id = `chip-${i}`;
    chip.style.borderColor = i === state.currentPlayer ? PCOLORS[i] : "#4a3080";
    chip.innerHTML = `<span class="chip-avatar">${p.avatar}</span>
      <span class="chip-name">${p.name}</span>
      <span class="chip-pos" style="color:${PCOLORS[i]}">${p.pos}</span>`;
    strip.appendChild(chip);
  });
}

export function updatePawns() {
  const layer = document.getElementById("pawns-layer");
  layer.innerHTML = "";
  const board = document.getElementById("game-board");
  const cw = board.offsetWidth / 10;
  const byPos = {};
  state.players.forEach((p, i) => {
    (byPos[p.pos] = byPos[p.pos] || []).push(i);
  });
  Object.entries(byPos).forEach(([pos, idxs]) => {
    const center = cellCenter(+pos),
      n = idxs.length;
    const pSize = Math.max(18, Math.min(30, cw * 0.5));
    idxs.forEach((i, j) => {
      const pawn = document.createElement("div");
      pawn.className = "pawn";
      pawn.id = `pawn-${i}`;
      pawn.style.cssText = `width:${pSize}px;height:${pSize}px;font-size:${pSize * 0.52}px;background:${PCOLORS[i]};left:${center.x - pSize / 2 + (j - (n - 1) / 2) * 16}px;top:${center.y - pSize / 2}px;position:absolute;`;
      pawn.textContent = state.players[i].avatar;
      layer.appendChild(pawn);
    });
  });
}
