  const audio = document.getElementById("bgMusic");     // <-- make sure your <audio> has id="bgMusic"
  const canvas = document.getElementById("visualizer"); // <-- and your <canvas> has id="visualizer"
  const ctx = canvas.getContext("2d");

  // --- Canvas sizing (handles HiDPI + zero-size fallbacks) ---
  function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Use layout size if available; otherwise fall back to sensible defaults
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(180, Math.round(rect.width || 220));
    const cssH = Math.max(50, Math.round(rect.height || 70));

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    // Draw using CSS pixel units
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // --- Audio / analyser setup ---
  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  let bufferLength = 0;
  let started = false;
  let sourceNode = null;

  function setupAudioOnce() {
    if (started) return;
    started = true;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();

    // Bar density / smoothing
    analyser.fftSize = 64;                // 32/64 = fewer, chunkier bars; 128/256 = more bars
    analyser.smoothingTimeConstant = 0.85;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Important: create source once per audio element
    sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Try to start playback (may still require gesture, handled below)
    tryStartPlayback();

    requestAnimationFrame(draw);
  }

  async function tryStartPlayback() {
    // Resume context if suspended, then play
    if (audioCtx && audioCtx.state === "suspended") {
      try { await audioCtx.resume(); } catch (e) { /* ignore */ }
    }
    try {
      await audio.play();
    } catch (e) {
      // Autoplay likely blocked; we’ll start on first user gesture
      // console.warn("Autoplay blocked, will start on gesture:", e);
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

    // Layout
    const gap = 2; // space between bars (CSS px)
    const bars = bufferLength;
    const barWidth = Math.max(1, (w - (bars - 1) * gap) / bars);

    let x = 0;
    for (let i = 0; i < bars; i++) {
      const v = dataArray[i] / 255;          // 0..1
      const barHeight = v * h * 0.9;         // leave a little top padding

      // Palette gradient (Niagara -> Zest) per bar
      const grad = ctx.createLinearGradient(0, h, 0, h - barHeight);
      grad.addColorStop(0, "#05A3A4");  // bottom (Niagara)
      grad.addColorStop(1, "#E8891D");  // top (Zest)

      ctx.fillStyle = grad;
      ctx.fillRect(x, h - barHeight, barWidth, barHeight);

      // Optional subtle glow
      // ctx.shadowColor = "rgba(5,163,164,0.3)";
      // ctx.shadowBlur = 6;

      x += barWidth + gap;
    }
  }

  // --- Start on first user gesture (click/tap/keydown) ---
  const kickstart = async () => {
    setupAudioOnce();
    await tryStartPlayback();
    // Remove listeners after first start
    window.removeEventListener("pointerdown", kickstart);
    window.removeEventListener("keydown", kickstart);
  };
  window.addEventListener("pointerdown", kickstart, { once: true });
  window.addEventListener("keydown", kickstart, { once: true });

  // Also attempt a silent start on load (in case the browser allows autoplay)
  window.addEventListener("load", () => {
    setupAudioOnce();
    tryStartPlayback();
  });
