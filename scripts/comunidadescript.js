const contenedor = document.getElementById("comunidades");
let comunidades = JSON.parse(localStorage.getItem("comunidades")) || [];
let paginaActual = 1;
const porPagina = 6;
localStorage.setItem("usuarioActual", "TuNombreDeUsuario");


let comunidadSeleccionada = null;

function mostrarComunidad(comunidad) {
  const div = document.createElement("div");
  div.className = "comunidad";
  const usuarioActual = localStorage.getItem("usuarioActual");
  const puedeBorrar = comunidad.creador === usuarioActual;

  div.innerHTML = `
    ${comunidad.logo ? `<img src="${comunidad.logo}" style="width:100%; border-radius:8px; margin-bottom:8px;">` : ''}
    ${puedeBorrar ? `<span class="etiqueta-propia">📌 Tu comunidad</span>` : ''}
    <h4>${comunidad.nombre}</h4>
    <p>Creada por: <strong>${comunidad.creador || "Desconocido"}</strong></p>
    <p>${comunidad.privada ? "🔒 Privada" : "🌐 Pública"}</p>
    <button onclick="accederComunidad('${comunidad.nombre}')">Acceder</button>
    ${puedeBorrar ? `<button onclick="borrarComunidad('${comunidad.nombre}')">Eliminar</button>` : ''}
  `;

  contenedor.appendChild(div);
}


function mostrarComunidades() {
  contenedor.innerHTML = "";
  const usuarioActual = localStorage.getItem("usuarioActual");
if (!usuarioActual) {
  alert("Debes iniciar sesión para crear una comunidad.");
  return;
}

  const filtro = document.getElementById("filtro").value;
  const busqueda = document.getElementById("buscador").value.toLowerCase();

  const ordenadas = [...comunidades].sort((a, b) => {
    if (a.creador === usuarioActual && b.creador !== usuarioActual) return -1;
    if (a.creador !== usuarioActual && b.creador === usuarioActual) return 1;
    return 0;
  });

  const filtradas = ordenadas.filter(c => {
    const coincideBusqueda = c.nombre.toLowerCase().includes(busqueda);
    const esPropia = c.creador === usuarioActual;
    if (filtro === "propias") return esPropia && coincideBusqueda;
    return coincideBusqueda;
  });

  const totalPaginas = Math.ceil(filtradas.length / porPagina);
  if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;

  const inicio = (paginaActual - 1) * porPagina;
  const paginaComunidades = filtradas.slice(inicio, inicio + porPagina);

  paginaComunidades.forEach(mostrarComunidad);
  renderizarPaginacion(totalPaginas);
}

function renderizarPaginacion(totalPaginas) {
  const paginacionDiv = document.getElementById("paginacion");
  paginacionDiv.innerHTML = "";

  if (totalPaginas <= 1) return;

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === paginaActual ? "activo" : "";
    btn.onclick = () => {
      paginaActual = i;
      mostrarComunidades();
    };
    paginacionDiv.appendChild(btn);
  }
}

document.getElementById("formComunidad").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const tipo = document.getElementById("tipoComunidad").value;
  const privada = tipo === "privada";
  const logoInput = document.getElementById("logo");
  const usuarioActual = localStorage.getItem("usuarioActual") || "Anónimo";

  if (!nombre) return alert("Debes ingresar un nombre");

  let logoBase64 = "";
  if (logoInput.files.length > 0) {
    logoBase64 = await convertirABase64(logoInput.files[0]);
  }

  if (comunidades.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
    alert("Ya existe una comunidad con ese nombre.");
    return;
  }

  let contrasena = "";
  if (privada) {
    contrasena = generarContrasena();
    mostrarMensaje(`Esta es la contraseña para acceder a la comunidad: <strong>${contrasena}</strong><br>Guárdala y recuérdala.`);
  }

  const nuevaComunidad = {
    nombre,
    privada,
    contrasena,
    creador: usuarioActual,
    logo: logoBase64
  };

  comunidades.push(nuevaComunidad);
  localStorage.setItem("comunidades", JSON.stringify(comunidades));

  document.getElementById("formComunidad").reset();
  mostrarComunidades();
});

function generarContrasena() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function convertirABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function mostrarMensaje(html) {
  const div = document.getElementById("mensaje");
  div.innerHTML = html + ' <button onclick="cerrarMensaje()">✖</button>';
  div.style.display = "block";
  setTimeout(() => {
    div.style.display = "none";
  }, 180000);
}

function cerrarMensaje() {
  document.getElementById("mensaje").style.display = "none";
}



function accederComunidad(nombre) {
  const comunidad = comunidades.find(c => c.nombre === nombre);
  if (!comunidad) return;

  if (!comunidad.privada) {
    localStorage.setItem("comunidadActiva", nombre);
    window.location.href = "galeria.html";
    return;
  }

  comunidadSeleccionada = comunidad;
  document.getElementById("modalAcceso").style.display = "flex";
  document.getElementById("inputContrasena").value = "";
  document.getElementById("errorContrasena").style.display = "none";
}



function cerrarModal() {
  document.getElementById("modalAcceso").style.display = "none";
}

function validarAcceso() {
  const contrasenaIngresada = document.getElementById("inputContrasena").value;
  if (contrasenaIngresada === comunidadSeleccionada.contrasena) {
    localStorage.setItem("comunidadActiva", comunidadSeleccionada.nombre);
    cerrarModal();
    window.location.href = "galeria.html";
  } else {
    document.getElementById("errorContrasena").style.display = "block";
  }
}


document.getElementById("filtro").addEventListener("change", () => {
  paginaActual = 1;
  mostrarComunidades();
});

document.getElementById("buscador").addEventListener("input", () => {
  paginaActual = 1;
  mostrarComunidades();
});

window.addEventListener("load", mostrarComunidades);
