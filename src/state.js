export const TRIVIA_CELLS = Array.from(
  { length: 30 },
  (_, i) => 3 * i + Math.ceil(Math.random() * 3 + 1),
);

export const state = {
  numPlayers: 2,
  players: [],
  currentPlayer: 0,
  gameStarted: false,
  triviaActive: false,
  triviaAnswered: false,
};
