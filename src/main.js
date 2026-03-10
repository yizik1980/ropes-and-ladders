import { renderSetupCards, setPlayerCount, selectAvatar } from './setup.js';
import { startGame, rollDice, restartGame } from './game.js';
import { drawOverlay } from './board.js';
import { updatePawns } from './players.js';
import { state } from './state.js';

// Expose functions needed by inline HTML onclick handlers
window.setPlayerCount = setPlayerCount;
window.selectAvatar = selectAvatar;
window.startGame = startGame;
window.rollDice = rollDice;
window.restartGame = restartGame;

// Init
renderSetupCards();

window.addEventListener("resize", () => {
  if (state.gameStarted) {
    setTimeout(() => {
      drawOverlay();
      updatePawns();
    }, 50);
  }
});
