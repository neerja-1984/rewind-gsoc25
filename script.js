const audio = document.getElementById("bgMusic");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioCtx, analyser, source, dataArray, bufferLength;

function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  audio.play();
  draw();
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let i = 0; i < bufferLength; i++) {
    let x = (i / bufferLength) * canvas.width;
    let y = (dataArray[i] / 255) * canvas.height * 0.9;
    ctx.lineTo(x, canvas.height - y);
  }

  ctx.strokeStyle = "#05A3A4";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// 🔑 Unlock audio on first click
document.body.addEventListener("click", () => {
  if (!audioCtx) {
    setupAudio();
  }
}, { once: true });
