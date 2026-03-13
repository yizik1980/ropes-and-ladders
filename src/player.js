import { HebLabel } from "./constants.js";

export class Player {
  name = "";
  score = 0;
  avatar = "";
  constructor(name, avatar) {
    this.name = name;
    this.avatar = avatar;
  }
}

export function Input(type, value, className) {
  const el = document.createElement("input");
  el.type = type || "text";
  el.value = value;
  el.className = className;
  return el;
}