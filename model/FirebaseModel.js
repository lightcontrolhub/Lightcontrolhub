import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtLlsM-Afp9wgrHGdHLvII2pjB8Q7uOtA",
  authDomain: "teste-9142b.firebaseapp.com",
  databaseURL: "https://teste-9142b-default-rtdb.firebaseio.com",
  projectId: "teste-9142b",
  storageBucket: "teste-9142b.appspot.com",
  messagingSenderId: "xxxx",
  appId: "1:758452370683:web:b77f3d0989725c51cb045e"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ID do Arduino
const deviceId = "dispositivo-do-breno";

// ===== Funções do Model =====
export function setLedMode(mode) {
  update(ref(db, "devices/" + deviceId + "/config"), {
    led13Mode: mode
  });
}

export function listenLedMode(callback) {
  onValue(ref(db, "devices/" + deviceId + "/config/led13Mode"), (snapshot) => {
    callback(snapshot.val());
  });
}
