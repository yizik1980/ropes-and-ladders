import { renderSetupCards, setPlayerCount, selectAvatar } from './setup.js';
import { startGame, rollDice as localRollDice, restartGame } from './game.js';
import { drawOverlay } from './board.js';
import { updatePawns } from './players.js';
import { state } from './state.js';
import {
  isOnline, createRoom, joinRoomOnline, startOnlineGame,
  rollDiceOnline, copyRoomCode, setOnlineAvatar, initOnlineUI,
} from './online.js';
import { setLang, lang } from './i18n.js';

// Expose to HTML onclick handlers
window.setPlayerCount = setPlayerCount;
window.selectAvatar = selectAvatar;
window.startGame = startGame;
window.rollDice = () => isOnline() ? rollDiceOnline() : localRollDice();
window.restartGame = restartGame;
window.createRoom = createRoom;
window.joinRoomOnline = joinRoomOnline;
window.startOnlineGame = startOnlineGame;
window.copyRoomCode = copyRoomCode;
window.setOnlineAvatar = setOnlineAvatar;

window.setMode = (mode) => {
  document.getElementById('local-setup').classList.toggle('hidden', mode !== 'local');
  document.getElementById('online-setup').classList.toggle('hidden', mode !== 'online');
  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );
  if (mode === 'online') initOnlineUI();
};

window.toggleLang = () => setLang(lang === 'he' ? 'en' : 'he');

// Init
renderSetupCards();

window.addEventListener('resize', () => {
  if (state.gameStarted) {
    setTimeout(() => { drawOverlay(); updatePawns(); }, 50);
  }
});
