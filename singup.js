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

    const signUp = document.getElementById("signUp");

    signUp.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const username = document.getElementById('username').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          sendEmailVerification(user).then(() => {
            alert("Verificação enviada! Por favor, verifique seu e-mail antes de fazer login.");
          });
          set(ref(database, 'users/' + user.uid), {
            username: username,
            email: email
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    });