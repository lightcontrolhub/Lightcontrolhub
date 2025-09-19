
import { setLedMode, listenLedMode } from "../model/FirebaseModel.js";

const $ = (id) => document.getElementById(id);

const btnOn = $("btnOn");
const btnOff = $("btnOff");
const statusEl = $("status");


btnOn.addEventListener("click", () => {
  setLedMode("on");
});


btnOff.addEventListener("click", () => {
  setLedMode("off");
});


listenLedMode((mode) => {
  statusEl.textContent = "LED está: " + (mode ?? "desconhecido");
  btnOn.disabled = (mode === "on");
  btnOff.disabled = (mode === "off");
});
