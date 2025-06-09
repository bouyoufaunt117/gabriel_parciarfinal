// Sesión
const sessionUser = sessionStorage.getItem('activeUser');
const topBar = document.getElementById('topBar');

if (sessionUser) {
  const userLabel = document.createElement('span');
  userLabel.textContent = `Hola, ${sessionUser}`;
  userLabel.style.color = 'white';

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.className = 'logout-button';
  logoutBtn.onclick = () => {
    sessionStorage.removeItem('activeUser');
    window.location.reload();
  };

  topBar.appendChild(userLabel);
  topBar.appendChild(logoutBtn);
} else {
  const loginLink = document.createElement('a');
  loginLink.href = 'pages/Login.html';
  loginLink.textContent = 'Iniciar sesión';
  topBar.appendChild(loginLink);
}

// MEME IMAGES API
//https://pixabay.com/api/docs/

// Cargar memes desde Reddit y meme-api

async function loadMemes() {
  const container = document.getElementById('meme-container');
  container.innerHTML = '';

  try {
    const [memeRes, redditRes] = await Promise.all([
      fetch('https://meme-api.com/gimme/10'),
      fetch('https://www.reddit.com/r/MemesEnEspanol/top.json?limit=10')
    ]);

    const memeData = await memeRes.json();
    const redditData = await redditRes.json();

    const redditImages = redditData.data.children
      .map(c => c.data.url)
      .filter(u => /\.(jpe?g|png|gif)$/i.test(u));

    const memeImages = memeData.memes || [memeData];

    const combinado = [];
    let i = 0;
    while (combinado.length < 20 && (i < memeImages.length || i < redditImages.length)) {
      if (i < memeImages.length) combinado.push(memeImages[i].url);
      if (i < redditImages.length) combinado.push(redditImages[i]);
      i++;
    }


    const aleatorio = combinado.sort(() => Math.random() - 0.5).slice(0, 10);

    aleatorio.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'meme';
      img.className = 'meme-img';
      container.appendChild(img);
    });

  } catch (err) {
    container.innerHTML = 'Error cargando memes.';
    console.error('Error cargando APIs:', err);
  }

}



setInterval(loadMemes, 10000);
loadMemes();




const videoFrame = document.getElementById('meme-video');
const funnyVideos = [
  'https://www.youtube.com/embed/tgbNymZ7vqY',
  'https://www.youtube.com/embed/9Deg7VrpHbM',
  "https://www.youtube.com/embed/IvUU8joBb1Q",
  "https://www.youtube.com/embed/hY7m5jjJ9mM",
  
];

// Razon por la cual no permitia usar videos de youtube
// https://support.google.com/youtube/thread/16355036/www-youtube-com-rechaz%C3%B3-la-conexi%C3%B3n?hl=es

function updateVideo() {
  const index = Math.floor(Math.random() * funnyVideos.length);
  videoFrame.src = funnyVideos[index];
}
updateVideo();
setInterval(updateVideo, 120000); 

function rotateVideo() {
  const random = Math.floor(Math.random() * funnyVideos.length);
  videoFrame.src = funnyVideos[random];
}
rotateVideo();
setInterval(rotateVideo, 120000);

// Modo ahorro
const ahorroSwitch = document.getElementById('modoAhorro');
ahorroSwitch?.addEventListener('change', () => {
    if (ahorroSwitch.checked) {
        memeVideo.pause();
        memeVideo.controls = true;
    } else {
        memeVideo.play();
        memeVideo.controls = true;
    }
});



  document.getElementById('generate-btn').addEventListener('click', () => {
    const template = document.getElementById('template').value;
    const text0 = encodeURIComponent(document.getElementById('text0').value.trim().replace(/ /g, '_'));
    const text1 = encodeURIComponent(document.getElementById('text1').value.trim().replace(/ /g, '_'));

    const url = `https://api.memegen.link/images/${template}/${text0}/${text1}.png`;
    
    const img = document.getElementById('meme-img');
    img.src = url;

    img.onload = () => {
      document.getElementById('meme-preview').style.display = 'flex';
      const downloadBtn = document.getElementById('download-btn');
      downloadBtn.href = url;
    };
  });




