import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyBtLlsM-Afp9wgrHGdHLvII2pjB8Q7uOtA",
  authDomain: "teste-9142b.firebaseapp.com",
  databaseURL: "https://teste-9142b-default-rtdb.firebaseio.com",
  projectId: "teste-9142b",
  storageBucket: "teste-9142b.appspot.com",
  messagingSenderId: "xxxx",
  appId: "1:758452370683:web:b77f3d0989725c51cb045e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const deviceId = "dispositivo-do-breno";

export function setLedMode(mode) {
  console.log("Enviando para Firebase:", mode);
  return set(ref(db, `devices/${deviceId}/config/led13Mode`), mode)
    .then(() => console.log(" Gravado com sucesso"))
    .catch((err) => console.error(" Erro ao gravar:", err));
}

export function listenLedMode(callback) {
  onValue(ref(db, `devices/${deviceId}/config/led13Mode`), (snapshot) => {
    callback(snapshot.val());
  });
}
