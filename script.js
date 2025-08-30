const audio = document.getElementById("bgMusic");     // <audio id="bgMusic">
const canvas = document.getElementById("visualizer"); // <canvas id="visualizer">
const ctx = canvas.getContext("2d");

// --- Canvas sizing (handles HiDPI) ---
function resizeCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(180, Math.round(rect.width || 220));
  const cssH = Math.max(50, Math.round(rect.height || 70));

  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- Audio / analyser setup ---
let audioCtx, analyser, dataArray, bufferLength, sourceNode;
let started = false;

function setupAudioOnce() {
  if (started) return;
  started = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  analyser.fftSize = 64; // 32/64 = chunky bars; 128/256 = smoother
  analyser.smoothingTimeConstant = 0.85;

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Connect audio source → analyser → destination
  if (!sourceNode) {
    sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  requestAnimationFrame(draw);
}

async function tryStartPlayback() {
  if (!audioCtx) return;

  // Resume context if suspended
  if (audioCtx.state === "suspended") {
    try { await audioCtx.resume(); } catch (e) {}
  }

  // Try to play audio (will fail silently if gesture required)
  try {
    await audio.play();
  } catch (e) {
    // Autoplay blocked — will retry on user gesture
  }
}

// --- Render loop (frequency bars with gradient shading) ---
function draw() {
  requestAnimationFrame(draw);
  if (!analyser || !dataArray) return;

  analyser.getByteFrequencyData(dataArray);

  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);

  const gap = 2;
  const bars = bufferLength;
  const barWidth = Math.max(1, (w - (bars - 1) * gap) / bars);

  let x = 0;
  for (let i = 0; i < bars; i++) {
    const v = dataArray[i] / 255;
    const barHeight = v * h * 0.9;

    const grad = ctx.createLinearGradient(0, h, 0, h - barHeight);
    grad.addColorStop(0, "#05A3A4"); // bottom (Niagara)
    grad.addColorStop(1, "#E8891D"); // top (Zest)

    ctx.fillStyle = grad;
    ctx.fillRect(x, h - barHeight, barWidth, barHeight);

    x += barWidth + gap;
  }
}

// --- Start on first user gesture ---
async function kickstart() {
  setupAudioOnce();
  await tryStartPlayback();
  window.removeEventListener("pointerdown", kickstart);
  window.removeEventListener("keydown", kickstart);
}
window.addEventListener("pointerdown", kickstart, { once: true });
window.addEventListener("keydown", kickstart, { once: true });

// --- Attempt silent start on load (desktop may allow autoplay) ---
window.addEventListener("load", () => {
  setupAudioOnce();
  tryStartPlayback();
});


  // timeline----------------------------------------------
  function toggleContent(dotElement) {
    const item = dotElement.closest('.timeline-item');
    item.classList.toggle('open');
  }
  

  // confetti 
  function createConfetti() {
    const colors = ['confetti-square', 'confetti-circle', 'confetti-triangle', 'confetti-star'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = `confetti ${colors[Math.floor(Math.random() * colors.length)]}`;
            
            // Random starting position across the top of the screen
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            
            // Random animation duration and delay
            const duration = Math.random() * 3 + 2; // 2-5 seconds
            const delay = Math.random() * 0.5; // 0-0.5 second delay
            
            confetti.style.animation = `confetti-fall ${duration}s linear ${delay}s forwards`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (duration + delay) * 1000);
        }, i * 10); // Stagger creation slightly
    }
    
    // Add a celebration pulse to the badge
    const badge = document.querySelector('.content-badge');
    badge.style.animation = 'none';
    setTimeout(() => {
        badge.style.animation = 'pulse 2s infinite';
    }, 100);
}

// Optional: Add some ambient sparkles that appear randomly
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every interval
        createAmbientSparkle();
    }
}, 2000);

function createAmbientSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.width = '3px';
    sparkle.style.height = '3px';
    sparkle.style.background = '#FFD700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}