const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');
const textInput = document.getElementById('text');

let image = new Image();
let textoEnCanvas = [];
let textoSeleccionado = null;

// Cargar imagen
uploadInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      renderizarCanvas();
    };
    image.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// Descargar imagen
downloadBtn.addEventListener('click', function () {
  const link = document.createElement('a');
  link.download = 'imagen_editada.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Agregar texto
function agregarTexto() {
  const texto = textInput.value.trim();
  if (texto) {
    textoEnCanvas.push({ texto, x: 50, y: 50 });
    renderizarCanvas();
    textInput.value = '';
  }
}

// Renderizar imagen y textos
function renderizarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (image.src) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  ctx.font = '24px Segoe UI';
  ctx.fillStyle = '#00ffff';
  ctx.textAlign = 'left';
  textoEnCanvas.forEach(({ texto, x, y }) => {
    ctx.fillText(texto, x, y);
  });
}

// Soporte para arrastrar texto
canvas.addEventListener('mousedown', function (e) {
  const { offsetX, offsetY } = e;
  textoSeleccionado = textoEnCanvas.find(
    t => offsetX >= t.x && offsetX <= t.x + ctx.measureText(t.texto).width &&
         offsetY >= t.y - 24 && offsetY <= t.y
  );
});

canvas.addEventListener('mousemove', function (e) {
  if (textoSeleccionado) {
    textoSeleccionado.x = e.offsetX;
    textoSeleccionado.y = e.offsetY;
    renderizarCanvas();
  }
});

canvas.addEventListener('mouseup', function () {
  textoSeleccionado = null;
});
