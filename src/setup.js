import { AVATARS, PCOLORS, HebLabel } from "./constants.js";
import { state, storage } from "./state.js";
import { Input, Player } from "./player.js";

export function setPlayerCount(n) {
  state.numPlayers = n;
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.toggle("selected", +b.dataset.count === n));
  renderSetupCards();
}

export function renderSetupCards() {
  const c = document.getElementById("players-setup");
  c.innerHTML = "";
  for (let i = 0; i < state.numPlayers; i++) {
    const savedNames = JSON.parse(storage.getItem("players")) || [];
    console.log(savedNames);
    let player = savedNames?.[i]
      ? new Player(
          savedNames?.[i].name,
          savedNames?.[i].avatar || AVATARS.at(i),
        )
      : new Player(HebLabel.player + " " + (i + 1), AVATARS.at(i));
    const d = document.createElement("div");
    d.className = "player-card-setup";
    d.style.borderColor = PCOLORS[i] + "60";
    const input = Input("text", player.name, "player-name-input");
    input.id = `pname-${i}`;
    input.maxLength = 12;
    input.onblur = (event) => {
      if (event.target.value) {
        player.name = event.target.value;
        state.setPlayers();
      }
    };
    const h3 = document.createElement("h3");
    h3.innerHTML = player.name;
    h3.style.color = PCOLORS[i];
    d.appendChild(h3);
    d.appendChild(input);
    const avaterDiv = document.createElement("div");
    avaterDiv.className = "avatar-grid";
    avaterDiv.id = `avatars-${i}`;
    AVATARS.map((a, j) => {
      let span = document.createElement("span");
      span.className = `avatar-opt${a == player?.avatar ? " selected" : ""}`;
      span.dataset["player"] = i;
      span.dataset["idx"] = j;
      span.onclick = () => selectAvatar(i, j);
      span.innerHTML = a;
      avaterDiv.appendChild(span);
    });
    d.appendChild(avaterDiv);
    c.appendChild(d);
    state.players.push(player);
  }
}

export function selectAvatar(pi, ai) {
  state.players[pi].avatar = AVATARS[ai];
  state.setPlayers();
  document
    .querySelectorAll(`#avatars-${pi} .avatar-opt`)
    .forEach((el) => el.classList.toggle("selected", +el.dataset.idx === ai));
}
