import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, update, ref } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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
const database = getDatabase(app);
const auth = getAuth();

const loginBtn = document.querySelector('.btn-entrar');
const signupBtn = document.querySelector('.btn-criar');

// Redirecionamento para página de cadastro
signupBtn.addEventListener('click', () => {
  window.location.href = 'signup.html';
});

loginBtn.addEventListener('click', (e) => {
e.preventDefault();
const email = document.getElementById('email').value;
const password = document.getElementById('senha').value;

signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  const user = userCredential.user;

  if (!user.emailVerified) {
    alert("Você precisa verificar seu e-mail antes de fazer login.");
    signOut(auth);
    return;
  }

  const dt = new Date();
  update(ref(database, 'users/' + user.uid), {
    last_login: dt
  });

  // Salva token de autenticação no localStorage
  localStorage.setItem('authToken', user.accessToken);
  localStorage.setItem('user', JSON.stringify({ userId: user.uid, email: user.email }));

  alert('Login feito com sucesso!');
  // redireciona para sistema-com-historico.html depois do login
  window.location.href = "sistema-com-historico.html";
})
.catch((error) => {
  alert(error.message);
});

// Função para resetar senha
window.resetPassword = function() {
  const email = prompt('Digite seu email para resetar a senha:');
  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Email de recuperação enviado! Verifique sua caixa de entrada.');
      })
      .catch((error) => {
        alert('Erro: ' + error.message);
      });
  }
};
});