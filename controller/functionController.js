// Controller: liga a View ao Model
import { setLedMode, listenLedMode } from "../model/FirebaseModel.js";

// Ajuda: pegar elementos da View
const $ = (id) => document.getElementById(id);

const btnOn = $("btnOn");
const btnOff = $("btnOff");
const statusEl = $("status");

// Eventos de clique dos botões (View → Model)
btnOn.addEventListener("click", () => {
  // se quiser feedback de erro, no Model faça: `return update(...)` e aqui use await/try-catch
  setLedMode("on");
});

btnOff.addEventListener("click", () => {
  setLedMode("off");
});

// Ouve mudanças no Firebase e atualiza a View (Model → View)
listenLedMode((mode) => {
  statusEl.textContent = "LED está: " + (mode ?? "desconhecido");

  // (opcional) desabilita o botão do estado atual
  btnOn.disabled = (mode === "on");
  btnOff.disabled = (mode === "off");
});
