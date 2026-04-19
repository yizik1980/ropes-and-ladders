import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  createRoom, joinRoom, getRoom, removePlayer,
  startGame, rollDice, answerTrivia,
} from './rooms.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.join(__dirname, '../../client/dist');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());
app.use(express.static(CLIENT_DIST));
app.post('/api/game', (_req, res) => res.json({ ok: true }));
app.get('/{*path}', (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));

io.on('connection', (socket) => {
  socket.on('create-room', ({ playerName, avatar }, cb) => {
    const { roomCode } = createRoom(socket.id, playerName, avatar);
    socket.join(roomCode);
    cb({ roomCode });
    io.to(roomCode).emit('room-updated', getRoom(roomCode));
  });

  socket.on('join-room', ({ roomCode, playerName, avatar }, cb) => {
    const code = roomCode.toUpperCase();
    const result = joinRoom(socket.id, code, playerName, avatar);
    if (!result.ok) return cb({ error: result.error });
    socket.join(code);
    cb({ ok: true });
    io.to(code).emit('room-updated', getRoom(code));
  });

  socket.on('start-game', ({ roomCode }) => {
    const room = startGame(roomCode, socket.id);
    if (room) io.to(roomCode).emit('game-started', room);
  });

  socket.on('roll-dice', ({ roomCode }) => {
    const result = rollDice(roomCode, socket.id);
    if (result) io.to(roomCode).emit('dice-rolled', result);
  });

  socket.on('answer-trivia', ({ roomCode, answer }) => {
    const result = answerTrivia(roomCode, socket.id, answer);
    if (result) io.to(roomCode).emit('trivia-answered', result);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room === socket.id) continue;
      removePlayer(room, socket.id);
      const roomData = getRoom(room);
      if (roomData) io.to(room).emit('room-updated', roomData);
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🎮 Server → http://localhost:${PORT}`));
