 document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const storedUser = JSON.parse(localStorage.getItem(username));
      const msg = document.getElementById("loginMsg");

      if (storedUser && storedUser.password === password) {
        sessionStorage.setItem("activeUser", username);
        msg.innerHTML = "<span class='success'>Inicio de sesión exitoso. Redirigiendo...</span>";
        setTimeout(() => (window.location.href = "/index.html"), 1200);
      } else {
        msg.innerHTML = "<span class='error'>Credenciales incorrectas. ¿Deseas registrarte o recuperar tu contraseña?</span>";
      }

      localStorage.setItem("usuarioActual", nombreDeUsuario);

    });