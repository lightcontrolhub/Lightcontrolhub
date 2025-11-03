import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtLlsM-Afp9wgrHGdHLvII2pjB8Q7uOtA",
  authDomain: "teste-9142b.firebaseapp.com",
  databaseURL: "https://teste-9142b-default-rtdb.firebaseio.com",
  projectId: "teste-9142b",
  storageBucket: "teste-9142b.appspot.com",
  messagingSenderId: "758452370683",
  appId: "1:758452370683:web:b77f3d0989725c51cb045e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.checkVerification = function() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          alert('Email verificado com sucesso!');
          window.location.href = 'sistema-com-historico.html';
        } else {
          alert('Email ainda não verificado. Verifique sua caixa de entrada.');
        }
      });
    } else {
      alert('Usuário não encontrado. Faça login novamente.');
      window.location.href = 'index.html';
    }
  });
};