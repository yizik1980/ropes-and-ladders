import { AVATARS } from "./constants.js";
import { Player } from "./player.js";

export const TRIVIA_CELLS = Array.from(
  { length: 30 },
  (_, i) => 3 * i + Math.ceil(Math.random() * 3 + 1),
);
export const storage = window.localStorage;
export const state = {
  numPlayers: 2,
  players: [],
  currentPlayer: 0,
  gameStarted: false,
  triviaActive: false,
  triviaAnswered: false,
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
