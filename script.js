// --------------------
// Audio + Visualizer
// --------------------
const audio = document.getElementById("bgMusic");

// Track *all* canvases instead of just one
let canvases = [];
let ctxs = [];

let audioCtx, analyser, dataArray, bufferLength, sourceNode;
let started = false;
let animationId = null;

// --- Resize all canvases ---
function resizeCanvas() {
  canvases.forEach((canvas, i) => {
    const ctx = ctxs[i];
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(180, Math.round(rect.width || 220));
    const cssH = Math.max(50, Math.round(rect.height || 70));

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
}

// --- Setup audio + analyser ---
function setupAudio() {
  if (started) return;
  started = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.85;

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  sourceNode = audioCtx.createMediaElementSource(audio);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  draw();
}

// --- Draw visualizer on *all* canvases ---
function draw() {
  animationId = requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  canvases.forEach((canvas, i) => {
    const ctx = ctxs[i];
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);

    const gap = 2;
    const bars = bufferLength;
    const barWidth = Math.max(1, (w - (bars - 1) * gap) / bars);

    let x = 0;
    for (let j = 0; j < bars; j++) {
      const v = dataArray[j] / 255;
      const barHeight = Math.max(2, v * h * 0.9);

      const grad = ctx.createLinearGradient(0, h, 0, h - barHeight);
      grad.addColorStop(0, "#05A3A4");
      grad.addColorStop(1, "#E8891D");

      ctx.fillStyle = grad;
      ctx.fillRect(x, h - barHeight, barWidth, barHeight);

      x += barWidth + gap;
    }
  });
}

// --- Play/Pause controls (class based) ---
function setupMusicControls(root = document) {
  const buttons = root.querySelectorAll(".playPauseBtn");

  buttons.forEach(btn => {
    const playI = btn.querySelector(".play-icon");
    const pauseI = btn.querySelector(".pause-icon");

    btn.addEventListener("click", async () => {
      if (!audioCtx) setupAudio();

      if (audio.paused) {
        await audioCtx.resume();
        audio.play();
      } else {
        audio.pause();
      }

      syncAllButtons();
    });
  });
}

// --- Sync desktop & mobile buttons ---
function syncAllButtons() {
  const buttons = document.querySelectorAll(".playPauseBtn");
  buttons.forEach(btn => {
    const playI = btn.querySelector(".play-icon");
    const pauseI = btn.querySelector(".pause-icon");
    if (audio.paused) {
      playI.style.display = "block";
      pauseI.style.display = "none";
    } else {
      playI.style.display = "none";
      pauseI.style.display = "block";
    }
  });
}

// --------------------
// Init
// --------------------
window.addEventListener("load", () => {
  // collect all canvases (desktop + mobile clone)
  canvases = document.querySelectorAll("canvas[id^='visualizer']");
  ctxs = Array.from(canvases).map(c => c.getContext("2d"));
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  setupMusicControls(); // desktop
  if (!animationId) draw();
  setupAudio();

  // keep in sync when audio ends
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play();
    syncAllButtons();
  });

  audio.play().catch(() => {
    console.log("Autoplay blocked, waiting for user gesture.");
  });
});

// --------------------
// Navbar (desktop + mobile)
// --------------------
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const desktopLinks = document.querySelector(".navbar ul");
const desktopControls = document.querySelector(".music-controls");

// Clone links
mobileNav.innerHTML = `<div class="mobile-links">${desktopLinks.outerHTML}</div>`;

// Duplicate the music controls but FIX ID
const mobileControls = desktopControls.cloneNode(true);
const mobileCanvas = mobileControls.querySelector("#visualizer");
if (mobileCanvas) mobileCanvas.id = "visualizer-mobile";
mobileNav.appendChild(mobileControls);

// Setup controls for mobile copy
setupMusicControls(mobileNav);



// hambuger navbar button
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileNav.classList.toggle("open");
});

// --------------------
// Timeline
// --------------------
function toggleContent(dotElement) {
  const item = dotElement.closest(".timeline-item");
  item.classList.toggle("open");
}

// --------------------
// Confetti
// --------------------
function createConfetti() {
  const colors = [
    "confetti-square",
    "confetti-circle",
    "confetti-triangle",
    "confetti-star"
  ];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = `confetti ${
        colors[Math.floor(Math.random() * colors.length)]
      }`;

      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";

      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;

      confetti.style.animation = `confetti-fall ${duration}s linear ${delay}s forwards`;

      document.body.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, (duration + delay) * 1000);
    }, i * 10);
  }

  const badge = document.querySelector(".content-badge");
  if (badge) {
    badge.style.animation = "none";
    setTimeout(() => {
      badge.style.animation = "pulse 2s infinite";
    }, 100);
  }
}

// --------------------
// Ambient sparkles
// --------------------
setInterval(() => {
  if (Math.random() > 0.7) {
    createAmbientSparkle();
  }
}, 2000);

function createAmbientSparkle() {
  const sparkle = document.createElement("div");
  sparkle.style.position = "fixed";
  sparkle.style.width = "3px";
  sparkle.style.height = "3px";
  sparkle.style.background = "#FFD700";
  sparkle.style.borderRadius = "50%";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "999";
  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";
  sparkle.style.animation = "sparkle 1s ease-out forwards";

  document.body.appendChild(sparkle);

  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.parentNode.removeChild(sparkle);
    }
  }, 1000);
}
