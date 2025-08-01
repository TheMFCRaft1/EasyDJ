const audioA = document.getElementById('audioA');
const audioB = document.getElementById('audioB');
const fileA = document.getElementById('fileA');
const fileB = document.getElementById('fileB');
const volumeA = document.getElementById('volumeA');
const volumeB = document.getElementById('volumeB');
const crossfader = document.getElementById('crossfader');

const playA = document.getElementById('playA');
const stopA = document.getElementById('stopA');
const cueA = document.getElementById('cueA');

const playB = document.getElementById('playB');
const stopB = document.getElementById('stopB');
const cueB = document.getElementById('cueB');

const jogA = document.getElementById('jogA');
const jogB = document.getElementById('jogB');

let cuePointA = 0;
let cuePointB = 0;

// Laden
fileA.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) audioA.src = URL.createObjectURL(file);
});
fileB.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) audioB.src = URL.createObjectURL(file);
});

// Volume
volumeA.addEventListener('input', () => audioA.volume = parseFloat(volumeA.value));
volumeB.addEventListener('input', () => audioB.volume = parseFloat(volumeB.value));

// Crossfader
crossfader.addEventListener('input', () => {
  const v = parseFloat(crossfader.value);
  audioA.volume = 1 - v;
  audioB.volume = v;
  volumeA.value = audioA.volume;
  volumeB.value = audioB.volume;
});

// Jogwheel Rotation
function updateJogRotation(audio, jogElement) {
  if (audio.paused) {
    jogElement.classList.remove('rotating');
  } else {
    jogElement.classList.add('rotating');
  }
}

setInterval(() => {
  updateJogRotation(audioA, jogA);
  updateJogRotation(audioB, jogB);
}, 200);

// Transport
playA.addEventListener('click', () => audioA.play());
stopA.addEventListener('click', () => {
  audioA.pause();
  audioA.currentTime = 0;
});
cueA.addEventListener('click', () => cuePointA = audioA.currentTime);

playB.addEventListener('click', () => audioB.play());
stopB.addEventListener('click', () => {
  audioB.pause();
  audioB.currentTime = 0;
});
cueB.addEventListener('click', () => cuePointB = audioB.currentTime);

// Jogwheel Scrub
function setupJogwheel(jog, audio) {
  jog.addEventListener('mousedown', (e) => {
    e.preventDefault();
    let startX = e.clientX;
    const move = (ev) => {
      const delta = (ev.clientX - startX) * 0.01;
      audio.currentTime += delta;
      startX = ev.clientX;
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
}
setupJogwheel(jogA, audioA);
setupJogwheel(jogB, audioB);

const musicList = document.getElementById('musicList');

window.electronAPI.getMusicFiles().then(files => {
  files.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    li.draggable = true;
    li.dataset.filename = file;
    musicList.appendChild(li);
  });
});

// Drag/Drop für Deck A und B
function setupDrop(deckAudio, dropZone) {
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.style.border = '2px dashed #aaa';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.border = '';
  });

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.style.border = '';
    const file = e.dataTransfer.getData('text/plain');
    const filePath = `../Musik/${file}`;
    deckAudio.src = filePath;
  });
}

setupDrop(audioA, jogA);
setupDrop(audioB, jogB);

// Li drag data setzen
musicList.addEventListener('dragstart', e => {
  if (e.target.tagName === 'LI') {
    e.dataTransfer.setData('text/plain', e.target.dataset.filename);
  }
});
