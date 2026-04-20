const SNAKES = { 99: 21, 87: 24, 62: 19, 54: 34, 46: 5, 92: 73, 75: 32 };
const LADDERS = { 4: 56, 13: 76, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

const TRIVIA = [
  { img: "א", opts: ["🐶", "🦁", "🐴", "🐘"], ans: "🦁" },
  { img: "ב", opts: ["🦢", "🐱", "🐍", "🐭"], ans: "🦢" },
  { img: "ג", opts: ["🦁", "🐪", "🦚", "🦜"], ans: "🐪" },
  { img: "ד", opts: ["🐒", "🕊️", "🐻", "🦓"], ans: "🐻" },
  { img: "ה", opts: ["🐪", "🦛", "🦎", "🐢"], ans: "🦛" },
  { img: "ז", opts: ["🐘", "🦓", "🐱", "🦢"], ans: "🦓" },
  { img: "ח", opts: ["🐻", "🐱", "🐍", "🐒"], ans: "🐱" },
  { img: "ט", opts: ["🦚", "🦁", "🐴", "🐪"], ans: "🦚" },
  { img: "י", opts: ["🦢", "🕊️", "🐭", "🐶"], ans: "🕊️" },
  { img: "כ", opts: ["🐘", "🐶", "🦜", "🦓"], ans: "🐶" },
  { img: "ל", opts: ["🐱", "🦎", "🐻", "🦚"], ans: "🦎" },
  { img: "נ", opts: ["🦁", "🐶", "🦎", "🐍"], ans: "🐍" },
  { img: "ס", opts: ["🐪", "🐴", "🦢", "🐭"], ans: "🐴" },
  { img: "ע", opts: ["🐘", "🐭", "🐍", "🦚"], ans: "🐭" },
  { img: "פ", opts: ["🐘", "🦓", "🐻", "🕊️"], ans: "🐘" },
  { img: "צ", opts: ["🐒", "🐢", "🐱", "🦁"], ans: "🐢" },
  { img: "ק", opts: ["🐴", "🦢", "🦎", "🐒"], ans: "🐒" },
  { img: "ר", opts: ["🦜", "🦌", "🐪", "🐶"], ans: "🦌" },
  { img: "ש", opts: ["🐭", "🦊", "🐘", "🐢"], ans: "🦊" },
  { img: "ת", opts: ["🦊", "🦜", "🐻", "🐍"], ans: "🦜" },
];

const rooms = new Map();

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateTriviaCells() {
  return Array.from({ length: 30 }, (_, i) => 3 * i + Math.ceil(Math.random() * 3 + 1));
}

export function createRoom(socketId, playerName, avatar) {
  const roomCode = randomCode();
  rooms.set(roomCode, {
    code: roomCode,
    players: [{ id: socketId, name: playerName, avatar, pos: 1, isHost: true }],
    started: false,
    currentPlayer: 0,
    triviaCells: [],
    triviaQuestion: null,
  });
  return { roomCode };
}

export function joinRoom(socketId, roomCode, playerName, avatar) {
  const room = rooms.get(roomCode);
  if (!room) return { ok: false, error: 'חדר לא נמצא' };
  if (room.started) return { ok: false, error: 'המשחק כבר התחיל' };
  if (room.players.length >= 4) return { ok: false, error: 'החדר מלא' };
  room.players.push({ id: socketId, name: playerName, avatar, pos: 1, isHost: false });
  return { ok: true };
}

export function getRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  return {
    ...room,
    triviaQuestion: room.triviaQuestion
      ? { img: room.triviaQuestion.img, opts: room.triviaQuestion.opts }
      : null,
  };
}

export function removePlayer(roomCode, socketId) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.players = room.players.filter(p => p.id !== socketId);
  if (room.players.length === 0) { rooms.delete(roomCode); return; }
  if (!room.players.some(p => p.isHost)) room.players[0].isHost = true;
  if (room.currentPlayer >= room.players.length) room.currentPlayer = 0;
}

export function startGame(roomCode, hostId) {
  const room = rooms.get(roomCode);
  if (!room || room.started || room.players.length < 2) return null;
  if (!room.players.find(p => p.id === hostId)?.isHost) return null;
  room.started = true;
  room.currentPlayer = 0;
  room.triviaCells = generateTriviaCells();
  room.players.forEach(p => { p.pos = 1; });
  return getRoom(roomCode);
}

export function rollDice(roomCode, socketId) {
  const room = rooms.get(roomCode);
  if (!room || !room.started || room.triviaQuestion) return null;
  const cp = room.players[room.currentPlayer];
  if (cp.id !== socketId) return null;

  const d1 = Math.ceil(Math.random() * 6);
  const d2 = Math.ceil(Math.random() * 6);
  cp.pos = Math.min(cp.pos + d1 + d2, 100);

  let eventType = 'move';
  const playerIdx = room.currentPlayer;

  if (cp.pos === 100) {
    eventType = 'win';
  } else if (SNAKES[cp.pos]) {
    eventType = 'snake';
    cp.pos = SNAKES[cp.pos];
  } else if (LADDERS[cp.pos]) {
    eventType = 'ladder';
    cp.pos = LADDERS[cp.pos];
  } else if (room.triviaCells.includes(cp.pos)) {
    eventType = 'trivia';
    room.triviaQuestion = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
  }

  if (eventType !== 'win' && eventType !== 'trivia') {
    room.currentPlayer = (room.currentPlayer + 1) % room.players.length;
  }

  return {
    d1, d2, playerIdx, eventType,
    triviaQuestion: eventType === 'trivia'
      ? { img: room.triviaQuestion.img, opts: room.triviaQuestion.opts }
      : null,
    room: getRoom(roomCode),
  };
}

export function getOpenRooms() {
  return [...rooms.values()]
    .filter(r => !r.started && r.players.length < 4)
    .map(r => ({
      code: r.code,
      hostName: r.players[0]?.name,
      hostAvatar: r.players[0]?.avatar,
      playerCount: r.players.length,
    }));
}

export function answerTrivia(roomCode, socketId, answer) {
  const room = rooms.get(roomCode);
  if (!room || !room.triviaQuestion) return null;
  const cp = room.players[room.currentPlayer];
  if (cp.id !== socketId) return null;

  const { ans: correctAnswer } = room.triviaQuestion;
  const correct = correctAnswer === answer;
  const playerIdx = room.currentPlayer;

  cp.pos = correct ? Math.min(cp.pos + 3, 100) : Math.max(cp.pos - 2, 1);
  room.triviaQuestion = null;

  const won = cp.pos === 100;
  if (!won) room.currentPlayer = (room.currentPlayer + 1) % room.players.length;

  return { correct, correctAnswer, playerIdx, won, room: getRoom(roomCode) };
}
