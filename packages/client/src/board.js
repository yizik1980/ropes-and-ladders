import { SNAKES, LADDERS } from './constants.js';
import { TRIVIA_CELLS } from './state.js';

export function cellCoords(num) {
  const n = num - 1,
    baseRow = Math.floor(n / 10),
    posInRow = n % 10;
  const gridRow = 9 - baseRow;
  const gridCol = baseRow % 2 === 0 ? posInRow : 9 - posInRow;
  return { row: gridRow, col: gridCol };
}

export function cellCenter(num) {
  const board = document.getElementById("game-board");
  const w = board.offsetWidth,
    h = board.offsetHeight;
  const cw = w / 10,
    ch = h / 10;
  const { row, col } = cellCoords(num);
  return { x: col * cw + cw / 2, y: row * ch + ch / 2 };
}

export function getCellNumber(row, col) {
  const baseRow = 9 - row;
  return baseRow % 2 === 0
    ? baseRow * 10 + col + 1
    : baseRow * 10 + (9 - col) + 1;
}

export function buildBoard() {
  const grid = document.getElementById("board-grid");
  grid.innerHTML = "";
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const num = getCellNumber(row, col);
      const cell = document.createElement("div");
      cell.className = "cell " + (num % 2 === 0 ? "even" : "odd");
      cell.id = `cell-${num}`;
      if (SNAKES[num]) cell.classList.add("snake-head");
      if (Object.values(SNAKES).includes(num)) cell.classList.add("snake-tail");
      if (LADDERS[num]) cell.classList.add("ladder-bottom");
      if (Object.values(LADDERS).includes(num) && !LADDERS[num]) cell.classList.add("ladder-top");
      if (TRIVIA_CELLS.includes(num)) cell.classList.add("trivia-cell");
      if (num === 1) cell.classList.add("start-cell");
      if (num === 100) cell.classList.add("end-cell");
      const icon = SNAKES[num] ? "🐍"
        : LADDERS[num] ? "🪜"
        : TRIVIA_CELLS.includes(num) ? "❓"
        : num === 100 ? "🏆"
        : num === 1 ? "🏁"
        : "";
      cell.innerHTML = `<span class="cell-num">${num}</span>${icon ? `<span class="cell-icon">${icon}</span>` : ""}`;
      grid.appendChild(cell);
    }
  }
  setTimeout(drawOverlay, 60);
}

export function drawOverlay() {
  const svg = document.getElementById("board-svg");
  const board = document.getElementById("game-board");
  const w = board.offsetWidth,
    h = board.offsetHeight;
  if (!w || !h) {
    setTimeout(drawOverlay, 80);
    return;
  }
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  Object.entries(LADDERS).forEach(([f, t]) => {
    const a = cellCenter(+f),
      b = cellCenter(+t);
    const dx = b.x - a.x,
      dy = b.y - a.y,
      len = Math.sqrt(dx * dx + dy * dy);
    const nx = (-dy / len) * 4,
      ny = (dx / len) * 4;
    const rail = (ox, oy) =>
      `<line x1="${a.x + ox}" y1="${a.y + oy}" x2="${b.x + ox}" y2="${b.y + oy}" stroke="#228822" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>`;
    svg.innerHTML += rail(-nx, -ny) + rail(nx, ny);
    for (let i = 1; i <= 5; i++) {
      const t2 = i / 6,
        mx = a.x + dx * t2,
        my = a.y + dy * t2;
      svg.innerHTML += `<line x1="${mx - nx * 2}" y1="${my - ny * 2}" x2="${mx + nx * 2}" y2="${my + ny * 2}" stroke="#33aa33" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>`;
    }
    svg.innerHTML += `<circle cx="${b.x}" cy="${b.y}" r="5" fill="#22aa22" opacity="0.9"/>`;
  });

  Object.entries(SNAKES).forEach(([f, t], si) => {
    const a = cellCenter(+f),
      b = cellCenter(+t);
    const midX = (a.x + b.x) / 2 + (si % 2 === 0 ? 30 : -30);
    const midY = (a.y + b.y) / 2 + (si % 3 === 0 ? 20 : -20);
    svg.innerHTML += `
      <path d="M${a.x},${a.y} Q${midX},${midY} ${b.x},${b.y}"
        fill="none" stroke="#cc1111" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
      <circle cx="${a.x}" cy="${a.y}" r="6" fill="#ff3333" opacity="0.95"/>
      <circle cx="${a.x}" cy="${a.y}" r="3" fill="#fff" opacity="0.7"/>
      <circle cx="${b.x}" cy="${b.y}" r="4" fill="#881111" opacity="0.9"/>`;
  });
}
