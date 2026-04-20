import { AVATARS } from "./constants.js";
import { Player } from "./player.js";

export const TRIVIA_CELLS = Array.from(
  { length: 30 },
  (_, i) => 3 * i + Math.ceil(Math.random() * 3 + 1),
);
export const storage = window.localStorage;
export function generateBoard() {
  const used = new Set([1, 100]);
  const snakes = {}, ladders = {};
  let att = 0;
  while (Object.keys(snakes).length < 7 && att++ < 2000) {
    const head = 15 + Math.floor(Math.random() * 84);
    const tail = Math.max(2, head - 40) + Math.floor(Math.random() * Math.max(1, Math.min(30, head - 12)));
    if (tail >= head - 9 || used.has(head) || used.has(tail)) continue;
    snakes[head] = tail; used.add(head); used.add(tail);
  }
  att = 0;
  while (Object.keys(ladders).length < 8 && att++ < 2000) {
    const bottom = 2 + Math.floor(Math.random() * 79);
    const top = bottom + 10 + Math.floor(Math.random() * Math.min(40, 98 - bottom - 9));
    if (top > 98 || used.has(bottom) || used.has(top)) continue;
    ladders[bottom] = top; used.add(bottom); used.add(top);
  }
  return { snakes, ladders };
}

export const state = {
  numPlayers: 2,
  players: [],
  currentPlayer: 0,
  gameStarted: false,
  triviaActive: false,
  triviaAnswered: false,
  snakes: {},
  ladders: {},
  triviaPool: [],
  setPlayers:function(){
    this.players && storage.setItem('players',JSON.stringify(this.players))
  },
  getPlayers:function (){
    const statePlayes = JSON.parse(storage.getItem('players')||[]);
    statePlayes.map((playName,i)=>{
      this.players.push(new Player(playName,AVATARS.at(i)))
    });
    return statePlayes;
  }
};
