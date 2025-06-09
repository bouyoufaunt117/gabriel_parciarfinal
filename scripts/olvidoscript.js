 document.getElementById("recoverForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("recoverUsername").value.trim();
      const userData = JSON.parse(localStorage.getItem(username));
      const msg = document.getElementById("recoverMsg");

      if (userData) {
        msg.innerHTML = `<span class="success">Se ha enviado un correo a: ${userData.email}</span>`;
      } else {
        msg.innerHTML = "<span class='error'>Usuario no encontrado. Intenta registrarte.</span>";
      }
    });