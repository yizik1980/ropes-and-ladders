import { io } from 'socket.io-client';
import { state } from './state.js';
import { Player } from './player.js';
import { PCOLORS, AVATARS } from './constants.js';
import { updatePawns, renderStrip } from './players.js';
import { buildBoard } from './board.js';
import { setDiceFaceRotation, showWinner } from './game.js';
import { playDiceRoll, playMove, playLadder, playSnake, playWin, playCorrect } from './sounds.js';
import { t } from './i18n.js';

let socket = null;
let myId = null;
let myRoomCode = null;
let _online = false;
let _host = false;
let onlineAvatar = AVATARS[0];

export const isOnline = () => _online;

function getServerUrl() {
  /* global __API_URL__ */
  const apiUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '';
  return apiUrl || window.location.origin;
}

function connect() {
  if (socket?.connected) return;
  socket = io(getServerUrl(), { transports: ['websocket', 'polling'] });
  socket.on('connect', () => { myId = socket.id; });
  socket.on('room-updated', onRoomUpdated);
  socket.on('game-started', onGameStarted);
  socket.on('dice-rolled', onDiceRolled);
  socket.on('trivia-answered', onTriviaAnswered);
}

export function createRoom() {
  const name = document.getElementById('online-name').value.trim() || t('online.name');
  clearOnlineError();
  connect();
  socket.emit('create-room', { playerName: name, avatar: onlineAvatar }, ({ roomCode }) => {
    myRoomCode = roomCode;
    _host = true;
    showLobby(roomCode, true);
  });
}

export function joinRoomOnline() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  const name = document.getElementById('online-name').value.trim() || t('online.name');
  if (!code || code.length < 6) return showOnlineError(t('err.code'));
  clearOnlineError();
  connect();
  socket.emit('join-room', { roomCode: code, playerName: name, avatar: onlineAvatar }, (res) => {
    if (res.error) return showOnlineError(res.error);
    myRoomCode = code;
    _host = false;
    showLobby(code, false);
  });
}

export function startOnlineGame() {
  socket.emit('start-game', { roomCode: myRoomCode });
}

export function rollDiceOnline() {
  socket.emit('roll-dice', { roomCode: myRoomCode });
  document.getElementById('roll-btn').disabled = true;
}

export function answerTriviaOnline(answer) {
  document.querySelectorAll('.trivia-opt').forEach(b => { b.disabled = true; });
  socket.emit('answer-trivia', { roomCode: myRoomCode, answer });
}

export function copyRoomCode() {
  navigator.clipboard?.writeText(myRoomCode).catch(() => {});
  const btn = document.getElementById('copy-code-btn');
  if (btn) { btn.textContent = '✅'; setTimeout(() => { btn.textContent = '📋'; }, 1500); }
}

export function setOnlineAvatar(emoji, el) {
  onlineAvatar = emoji;
  document.querySelectorAll('#online-avatars .avatar-opt').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

export function initOnlineUI() {
  const container = document.getElementById('online-avatars');
  if (!container) return;
  container.innerHTML = '';
  AVATARS.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.className = 'avatar-opt' + (i === 0 ? ' selected' : '');
    btn.textContent = a;
    btn.onclick = () => setOnlineAvatar(a, btn);
    container.appendChild(btn);
  });
  connect();
  socket.off('rooms-updated', renderRoomsList);
  socket.on('rooms-updated', renderRoomsList);
  socket.emit('get-rooms', renderRoomsList);
}

function renderRoomsList(rooms) {
  const el = document.getElementById('rooms-list');
  if (!el) return;
  if (!rooms || rooms.length === 0) {
    el.innerHTML = `<div class="rooms-empty" data-i18n="rooms.empty">${t('rooms.empty')}</div>`;
    return;
  }
  el.innerHTML = rooms.map(r => `
    <button class="room-item" onclick="window._joinRoom('${r.code}')">
      <span class="room-host">${r.hostAvatar} ${r.hostName}</span>
      <span class="room-count">${r.playerCount}/4</span>
      <span class="room-code-label">${r.code}</span>
    </button>
  `).join('');
}

window._joinRoom = (code) => {
  document.getElementById('join-code').value = code;
  joinRoomOnline();
};

function showLobby(roomCode, isHost) {
  document.getElementById('setup-screen').classList.remove('active');
  document.getElementById('lobby-screen').classList.add('active');
  document.getElementById('lobby-code').textContent = roomCode;
  const startBtn = document.getElementById('start-online-btn');
  startBtn.classList.toggle('hidden', !isHost);
  startBtn.disabled = true;
}

function onRoomUpdated(room) {
  const el = document.getElementById('lobby-players');
  if (!el) return;
  el.innerHTML = room.players.map(p =>
    `<div class="lobby-player">${p.avatar} <span>${p.name}</span>${p.isHost ? ' <span class="host-crown">👑</span>' : ''}</div>`
  ).join('');
  const startBtn = document.getElementById('start-online-btn');
  if (startBtn && _host) startBtn.disabled = room.players.length < 2;
}

function onGameStarted(room) {
  _online = true;
  syncState(room);
  document.getElementById('lobby-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  buildBoard();
  setTimeout(() => {
    updatePawns();
    renderStrip();
    setDiceFaceRotation(document.getElementById('die1'), 1);
    setDiceFaceRotation(document.getElementById('die2'), 1);
    updateRollBtn(room);
  }, 150);
}

function onDiceRolled({ d1, d2, playerIdx, eventType, triviaQuestion, room }) {
  const die1 = document.getElementById('die1');
  const die2 = document.getElementById('die2');
  playDiceRoll();
  die1.classList.add('rolling');
  die2.classList.add('rolling');
  setTimeout(() => {
    die1.classList.remove('rolling');
    die2.classList.remove('rolling');
    setDiceFaceRotation(die1, d1);
    setDiceFaceRotation(die2, d2);
  }, 600);

  setTimeout(() => {
    syncState(room);
    updatePawns();
    const pawn = document.getElementById(`pawn-${playerIdx}`);
    if (pawn) { pawn.classList.remove('bounce'); void pawn.offsetWidth; pawn.classList.add('bounce'); }

    setTimeout(() => {
      renderStrip();
      if (eventType === 'win') {
        playWin(); showWinner(playerIdx);
      } else if (eventType === 'ladder') {
        playLadder(); updateRollBtn(room);
      } else if (eventType === 'snake') {
        playSnake(); updateRollBtn(room);
      } else if (eventType === 'trivia') {
        showOnlineTrivia(triviaQuestion, room);
      } else {
        playMove(); updateRollBtn(room);
      }
    }, 700);
  }, 800);
}

function onTriviaAnswered({ correct, correctAnswer, playerIdx, won, room }) {
  syncState(room);
  updatePawns();
  renderStrip();

  const res = document.getElementById('trivia-result');
  if (correct) {
    playCorrect();
    res.className = 'trivia-result win';
    res.textContent = t('trivia.ok', state.players[playerIdx]?.name);
  } else {
    res.className = 'trivia-result lose';
    res.textContent = t('trivia.fail.online', correctAnswer);
    document.querySelectorAll('.trivia-opt').forEach(b => {
      if (b.textContent === correctAnswer) b.classList.add('correct');
    });
  }

  setTimeout(() => {
    document.getElementById('trivia-overlay').classList.remove('active');
    state.triviaActive = false;
    if (won) { playWin(); showWinner(playerIdx); }
    else updateRollBtn(room);
  }, 2200);
}

function showOnlineTrivia(question, room) {
  state.triviaActive = true;
  state.triviaAnswered = false;
  const isMyTurn = room.players[room.currentPlayer]?.id === myId;

  document.getElementById('trivia-question').textContent = t('trivia.q', question.img);
  document.getElementById('trivia-sign-display').innerHTML =
    `<div style="font-size:8rem;margin-bottom:20px;font-weight:bold;color:var(--blue)">${question.img}</div>`;
  document.getElementById('trivia-result').className = 'trivia-result';

  const oc = document.getElementById('trivia-options');
  oc.innerHTML = '';
  question.opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'trivia-opt';
    btn.textContent = opt;
    btn.style.fontSize = '2.8rem';
    btn.style.padding = '14px 20px';
    if (!isMyTurn) {
      btn.disabled = true;
      btn.title = 'לא התורך';
    } else {
      btn.onclick = () => {
        if (state.triviaAnswered) return;
        state.triviaAnswered = true;
        btn.classList.add('selected');
        answerTriviaOnline(opt);
      };
    }
    oc.appendChild(btn);
  });
  document.getElementById('trivia-overlay').classList.add('active');
}

function syncState(room) {
  state.currentPlayer = room.currentPlayer;
  state.gameStarted = true;
  state.numPlayers = room.players.length;
  state.players.length = room.players.length;
  room.players.forEach((rp, i) => {
    if (!state.players[i]) state.players[i] = new Player(rp.name, rp.avatar);
    state.players[i].pos = rp.pos;
    state.players[i].name = rp.name;
    state.players[i].avatar = rp.avatar;
    state.players[i].color = PCOLORS[i];
  });
}

function updateRollBtn(room) {
  const btn = document.getElementById('roll-btn');
  const isMyTurn = room.players[room.currentPlayer]?.id === myId;
  btn.disabled = !isMyTurn;
  btn.textContent = isMyTurn
    ? t('btn.roll')
    : t('roll.wait', room.players[room.currentPlayer]?.name);
}

function showOnlineError(msg) {
  const el = document.getElementById('online-error');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearOnlineError() {
  const el = document.getElementById('online-error');
  if (el) el.classList.add('hidden');
}
