const AVATARS = [
  "🦁",
  "🐯",
  "🐺",
  "🦊",
  "🐸",
  "🐧",
  "🦅",
  "🐠",
  "🦄",
  "🐲",
  "🤖",
  "👽",
];
const PCOLORS = ["#ff6b35", "#00c9a7", "#ff4d8d", "#4d9fff"];
const SNAKES = { 99: 21, 87: 24, 62: 19, 54: 34, 46: 5, 92: 73, 75: 32 };
const LADDERS = {
  4: 56,
  13: 76,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};
const TRIVIA_CELLS = [
  ...Array.from(
    { length: 30 },
    (_, i) => 3 * i + Math.ceil(Math.random() * 3 + 1),
  ),
];
const DIE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const TRIVIA = [
  {
    img: "🦁",
    name: "אריה",
    firstLetter: "א",
    opts: ["א", "ב", "ג", "ד"],
    ans: "א",
  },
  {
    img: "🍌",
    name: "בננה",
    firstLetter: "ב",
    opts: ["א", "ב", "ג", "ד"],
    ans: "ב",
  },
  {
    img: "🐪",
    name: "גמל",
    firstLetter: "ג",
    opts: ["ב", "ג", "ד", "ה"],
    ans: "ג",
  },
  {
    img: "🌹",
    name: "דחליל",
    firstLetter: "ד",
    opts: ["ג", "ד", "ה", "ו"],
    ans: "ד",
  },
  {
    img: "🛞",
    name: "הגה",
    firstLetter: "ה",
    opts: ["ד", "ה", "ו", "ז"],
    ans: "ה",
  },
  {
    img: "🐑",
    name: "כבשה",
    firstLetter: "ו",
    opts: ["ה", "כ", "ז", "ח"],
    ans: "כ",
  },
  {
    img: "🫒",
    name: "זית",
    firstLetter: "ז",
    opts: ["ו", "ז", "ח", "ט"],
    ans: "ז",
  },
  {
    img: "🐱",
    name: "חתול",
    firstLetter: "ח",
    opts: ["ז", "ח", "ט", "י"],
    ans: "ח",
  },
  {
    img: "🦚",
    name: "טווס",
    firstLetter: "ט",
    opts: ["ח", "ט", "י", "כ"],
    ans: "ט",
  },
  {
    img: "👦",
    name: "ילד",
    firstLetter: "י",
    opts: ["ט", "י", "כ", "ל"],
    ans: "י",
  },
  {
    img: "⚽",
    name: "כדור",
    firstLetter: "כ",
    opts: ["י", "כ", "ל", "מ"],
    ans: "כ",
  },
  {
    img: "🥐",
    name: "לחמניה",
    firstLetter: "ל",
    opts: ["כ", "ל", "מ", "נ"],
    ans: "ל",
  },
  {
    img: "✈️",
    name: "מטוס",
    firstLetter: "מ",
    opts: ["ל", "מ", "נ", "ס"],
    ans: "מ",
  },
  {
    img: "🐆",
    name: "נמר",
    firstLetter: "נ",
    opts: ["מ", "נ", "ס", "ע"],
    ans: "נ",
  },
  {
    img: "🐴",
    name: "סוס",
    firstLetter: "ס",
    opts: ["נ", "ס", "ע", "פ"],
    ans: "ס",
  },
  {
    img: "👁️",
    name: "עין",
    firstLetter: "ע",
    opts: ["ס", "ע", "פ", "צ"],
    ans: "ע",
  },
  {
    img: "🦋",
    name: "פרפר",
    firstLetter: "פ",
    opts: ["ע", "פ", "צ", "ק"],
    ans: "פ",
  },
  {
    img: "🐢",
    name: "צב",
    firstLetter: "צ",
    opts: ["פ", "צ", "ק", "ר"],
    ans: "צ",
  },
  {
    img: "🫖",
    name: "קומקום",
    firstLetter: "ק",
    opts: ["צ", "ק", "ר", "ש"],
    ans: "ק",
  },
  {
    img: "🚂",
    name: "רכבת",
    firstLetter: "ר",
    opts: ["ק", "ר", "ש", "ת"],
    ans: "ר",
  },
  {
    img: "⏰",
    name: "שעון",
    firstLetter: "ש",
    opts: ["ר", "ש", "ת", "א"],
    ans: "ש",
  },
  {
    img: "🍎",
    name: "תפוח",
    firstLetter: "ת",
    opts: ["ש", "ת", "א", "ב"],
    ans: "ת",
  },
];

let numPlayers = 2,
  players = [],
  currentPlayer = 0,
  gameStarted = false,
  triviaActive = false,
  triviaAnswered = false;

function setPlayerCount(n) {
  numPlayers = n;
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.toggle("selected", +b.dataset.count === n));
  renderSetupCards();
}
function renderSetupCards() {
  const c = document.getElementById("players-setup");
  c.innerHTML = "";
  for (let i = 0; i < numPlayers; i++) {
    const d = document.createElement("div");
    d.className = "player-card-setup";
    d.style.borderColor = PCOLORS[i] + "60";
    d.innerHTML = `<h3 style="color:${PCOLORS[i]}">שחקן ${i + 1}</h3>
      <input class="player-name-input" id="pname-${i}" type="text" placeholder="שם" value="שחקן ${i + 1}" maxlength="12"/>
      <div class="avatar-grid" id="avatars-${i}">${AVATARS.map((a, j) => `<span class="avatar-opt${j === i ? " selected" : ""}" data-player="${i}" data-idx="${j}" onclick="selectAvatar(${i},${j})">${a}</span>`).join("")}</div>`;
    c.appendChild(d);
  }
}
function selectAvatar(pi, ai) {
  document
    .querySelectorAll(`#avatars-${pi} .avatar-opt`)
    .forEach((el) => el.classList.toggle("selected", +el.dataset.idx === ai));
}

// ── Board helpers ──
function cellCoords(num) {
  const n = num - 1,
    baseRow = Math.floor(n / 10),
    posInRow = n % 10;
  const gridRow = 9 - baseRow;
  const gridCol = baseRow % 2 === 0 ? posInRow : 9 - posInRow;
  return { row: gridRow, col: gridCol };
}
function cellCenter(num) {
  const board = document.getElementById("game-board");
  const w = board.offsetWidth,
    h = board.offsetHeight;
  const cw = w / 10,
    ch = h / 10;
  const { row, col } = cellCoords(num);
  return { x: col * cw + cw / 2, y: row * ch + ch / 2 };
}
function getCellNumber(row, col) {
  const baseRow = 9 - row;
  return baseRow % 2 === 0
    ? baseRow * 10 + col + 1
    : baseRow * 10 + (9 - col) + 1;
}

function buildBoard() {
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
      if (Object.values(LADDERS).includes(num) && !LADDERS[num])
        cell.classList.add("ladder-top");
      if (TRIVIA_CELLS.includes(num)) cell.classList.add("trivia-cell");
      if (num === 1) cell.classList.add("start-cell");
      if (num === 100) cell.classList.add("end-cell");
      const icon = SNAKES[num]
        ? "🐍"
        : LADDERS[num]
          ? "🪜"
          : TRIVIA_CELLS.includes(num)
            ? "❓"
            : num === 100
              ? "🏆"
              : num === 1
                ? "🏁"
                : "";
      cell.innerHTML = `<span class="cell-num">${num}</span>${icon ? `<span class="cell-icon">${icon}</span>` : ""}`;
      grid.appendChild(cell);
    }
  }
  setTimeout(drawOverlay, 60);
}

function drawOverlay() {
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

  // Ladders
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
    // Arrow at top
    svg.innerHTML += `<circle cx="${b.x}" cy="${b.y}" r="5" fill="#22aa22" opacity="0.9"/>`;
  });

  // Snakes – use seeded random for consistent curves
  const snakeEntries = Object.entries(SNAKES);
  snakeEntries.forEach(([f, t], si) => {
    const a = cellCenter(+f),
      b = cellCenter(+t);
    // Control points for wavy snake
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

// ── Players strip ──
function renderStrip() {
  const strip = document.getElementById("players-strip");
  strip.innerHTML = "";
  players.forEach((p, i) => {
    const chip = document.createElement("div");
    chip.className = "player-chip" + (i === currentPlayer ? " active" : "");
    chip.id = `chip-${i}`;
    chip.style.borderColor = i === currentPlayer ? PCOLORS[i] : "#4a3080";
    chip.innerHTML = `<span class="chip-avatar">${p.avatar}</span>
      <span class="chip-name">${p.name}</span>
      <span class="chip-pos" style="color:${PCOLORS[i]}">${p.pos}</span>`;
    strip.appendChild(chip);
  });
}

// ── Pawns ──
function updatePawns() {
  const layer = document.getElementById("pawns-layer");
  layer.innerHTML = "";
  const board = document.getElementById("game-board");
  const bw = board.offsetWidth,
    bh = board.offsetHeight;
  const cw = bw / 10,
    ch = bh / 10;
  const byPos = {};
  players.forEach((p, i) => {
    (byPos[p.pos] = byPos[p.pos] || []).push(i);
  });
  Object.entries(byPos).forEach(([pos, idxs]) => {
    const center = cellCenter(+pos),
      n = idxs.length;
    const pSize = Math.max(18, Math.min(30, cw * 0.5));
    idxs.forEach((i, j) => {
      const pawn = document.createElement("div");
      pawn.className = "pawn";
      pawn.id = `pawn=-${i}`;
      pawn.style.cssText = `width:${pSize}px;height:${pSize}px;font-size:${pSize * 0.52}px;background:${PCOLORS[i]};left:${center.x - pSize / 2 + (j - (n - 1) / 2) * 16}px;top:${center.y - pSize / 2}px;position:absolute;`;
      pawn.textContent = players[i].avatar;
      layer.appendChild(pawn);
    });
  });
}

// ── Game Flow ──
function startGame() {
  players = [];
  for (let i = 0; i < numPlayers; i++) {
    const name =
      document.getElementById(`pname-${i}`)?.value?.trim() || `שחקן ${i + 1}`;
    const sel = document.querySelector(`#avatars-${i} .avatar-opt.selected`);
    players.push({
      name,
      avatar: sel ? sel.textContent : AVATARS[i],
      pos: 1,
      color: PCOLORS[i],
    });
  }
  currentPlayer = 0;
  gameStarted = true;
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


function rollDice() {
  if (!gameStarted || triviaActive) return;
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
  const p = players[currentPlayer];
  setTimeout(() => movePlayer(currentPlayer, tot), 800);
}

function setDiceFaceRotation(dieElement, faceNumber) {
  const rotations = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(0deg) rotateY(180deg)",
    3: "rotateX(0deg) rotateY(-90deg)",
    4: "rotateX(0deg) rotateY(90deg)",
    5: "rotateX(-90deg) rotateY(0deg)",
    6: "rotateX(90deg) rotateY(0deg)",
  };
  dieElement.style.transform = rotations[faceNumber];
}

function movePlayer(idx, steps) {
  const p = players[idx];
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

function checkCell(idx, pos) {
  const p = players[idx];
  if (pos === 100) {
    showWinner(idx);
    return;
  }
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

function nextTurn() {
  currentPlayer = (currentPlayer + 1) % players.length;
  renderStrip();
  const p = players[currentPlayer];
  document.getElementById("roll-btn").disabled = false;
}

// ── Trivia ──
function showTrivia(idx) {
  triviaActive = true;
  triviaAnswered = false;
  const q = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
  document.getElementById("trivia-question").textContent =
    "באיזה אות זה מתחיל?";
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

function answerTrivia(ans, q, idx, btn) {
  if (triviaAnswered) return;
  triviaAnswered = true;
  const p = players[idx];
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
      if (p.pos === 100) {
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
    res.textContent = `❌ טעות! הנכון: ${q.ans}. ${p.name} חוזר/ת 2 תאים.`;
    setTimeout(() => {
      closeTrivia();
      p.pos = Math.max(p.pos - 2, 1);
      updatePawns();
      renderStrip();
      setTimeout(() => nextTurn(), 1000);
    }, 2100);
  }
}
function closeTrivia() {
  document.getElementById("trivia-overlay").classList.remove("active");
  triviaActive = false;
}

// ── Win ──
function showWinner(idx) {
  const p = players[idx];
  document.getElementById("win-avatar").textContent = p.avatar;
  document.getElementById("win-name").textContent = p.name;
  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("win-screen").classList.add("active");
  // Confetti
  const cols = [
    "#ffd700",
    "#ff6b35",
    "#00c9a7",
    "#ff4d8d",
    "#4d9fff",
    "#a855f7",
  ];
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

function restartGame() {
  document.getElementById("win-screen").classList.remove("active");
  document.getElementById("setup-screen").classList.add("active");
  gameStarted = false;
  renderSetupCards();
}

// Init
renderSetupCards();
window.addEventListener("resize", () => {
  if (gameStarted) {
    setTimeout(() => {
      drawOverlay();
      updatePawns();
    }, 50);
  }
});
