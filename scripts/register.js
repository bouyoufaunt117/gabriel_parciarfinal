 document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const msg = document.getElementById("regMsg");

      if (localStorage.getItem(username)) {
        msg.innerHTML = "<span class='error'>Ese nombre de usuario ya existe.</span>";
        return;
      }

      const userData = { username, email, password };
      localStorage.setItem(username, JSON.stringify(userData));
      sessionStorage.setItem("activeUser", username);
      msg.innerHTML = "<span class='success'>Registro exitoso. Redirigiendo...</span>";
      setTimeout(() => (window.location.href = "/index.html"), 1200);
    });