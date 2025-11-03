import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
    import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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

    document.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('senha').value;
      const username = document.getElementById('nome').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // Primeiro salva os dados do usuário
          return set(ref(database, 'users/' + user.uid), {
            username: username,
            email: email,
            emailVerified: false
          }).then(() => {
            // Depois envia a verificação
            return sendEmailVerification(user);
          }).then(() => {
            alert("Verificação enviada! Por favor, verifique seu e-mail e clique no link para ativar sua conta.");
            window.location.href = 'verificacao.html';
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    });