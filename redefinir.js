  // Importa Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAhiLhxsVtR35neB9R6gSgQBF3_SN0Y_tI",
    authDomain: "testeexe-5c80e.firebaseapp.com",
    databaseURL: "https://testeexe-5c80e-default-rtdb.firebaseio.com",
    projectId: "testeexe-5c80e",
    storageBucket: "testeexe-5c80e.firebasestorage.app",
    messagingSenderId: "334179968228",
    appId: "1:334179968228:web:3398f1ff25bb7910f478f1"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  async function resetPassword(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const msg = document.getElementById("mensagem");

    try {
      await sendPasswordResetEmail(auth, email);
      msg.style.color = "green";
      msg.innerText = "📩 Email de redefinição enviado!";
    } catch (error) {
      msg.style.color = "red";
      msg.innerText = "⚠️ Erro: " + error.message;
    }
  }

  window.resetPassword = resetPassword;