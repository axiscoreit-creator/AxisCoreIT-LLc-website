const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const canvas = document.getElementById("ocean");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const hero = document.querySelector(".hero");
  const gridSvg = document.getElementById("gridSvg");
  const dataPoints = document.getElementById("dataPoints");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const waves = Array.from({ length: 9 }, (_, i) => ({
    amplitude: 6 + Math.random() * 10,
    frequency: 0.008 + Math.random() * 0.006,
    speed: 0.003 + Math.random() * 0.003,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.04 + (i / 9) * 0.12,
  }));

  const resizeCanvas = () => {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  };

  const drawLighthouse = (width, height, horizonY, time) => {
    const lx = width * 0.5;
    const top = horizonY - 60;
    const base = horizonY + 4;

    const fogBase = ctx.createRadialGradient(lx, horizonY, 0, lx, horizonY, width * 0.4);
    fogBase.addColorStop(0, "rgba(14,30,46,0.55)");
    fogBase.addColorStop(0.5, "rgba(8,18,28,0.2)");
    fogBase.addColorStop(1, "transparent");
    ctx.fillStyle = fogBase;
    ctx.fillRect(0, horizonY - 40, width, 80);

    ctx.beginPath();
    ctx.moveTo(lx - 7, base);
    ctx.lineTo(lx - 4, top + 16);
    ctx.lineTo(lx + 4, top + 16);
    ctx.lineTo(lx + 7, base);
    ctx.fillStyle = "#0d2030cc";
    ctx.fill();
    ctx.strokeStyle = "#1a3a50aa";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(lx - 5, top + 8, 10, 8);
    ctx.fillStyle = "#0a1e2ecc";
    ctx.fill();
    ctx.strokeStyle = "#1a3a50";
    ctx.stroke();

    const beamAngle = ((time * 0.3) % (Math.PI * 2)) - Math.PI;
    const beamX = lx + Math.cos(beamAngle) * 420;
    const beamY = top + 12 + Math.sin(beamAngle) * 130;
    const beamAlpha = Math.abs(Math.cos(time * 0.3)) * 0.08 + 0.02;
    const beamGrad = ctx.createLinearGradient(lx, top + 12, beamX, beamY);
    beamGrad.addColorStop(0, `rgba(180,230,255,${beamAlpha * 4})`);
    beamGrad.addColorStop(0.3, `rgba(140,200,240,${beamAlpha})`);
    beamGrad.addColorStop(1, "transparent");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lx, top + 12);
    ctx.arc(lx, top + 12, 420, beamAngle - 0.22, beamAngle + 0.22);
    ctx.closePath();
    ctx.fillStyle = beamGrad;
    ctx.fill();
    ctx.restore();

    const glow = ctx.createRadialGradient(lx, top + 10, 0, lx, top + 10, 18);
    glow.addColorStop(0, "rgba(180,230,255,0.5)");
    glow.addColorStop(0.5, "rgba(120,190,230,0.2)");
    glow.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(lx, top + 10, 18, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(lx, top + 10, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#d8f0ff";
    ctx.fill();
  };

  const drawStars = (width, height, time) => {
    const stars = [
      [0.08, 0.06],
      [0.15, 0.12],
      [0.22, 0.04],
      [0.3, 0.09],
      [0.42, 0.03],
      [0.55, 0.07],
      [0.63, 0.14],
      [0.71, 0.05],
      [0.8, 0.1],
      [0.88, 0.07],
      [0.12, 0.2],
      [0.35, 0.18],
      [0.58, 0.22],
      [0.78, 0.19],
      [0.92, 0.15],
    ];

    stars.forEach(([x, y], i) => {
      const pulse = Math.sin(time * 0.5 + i * 1.3) * 0.3 + 0.5;
      ctx.beginPath();
      ctx.arc(x * width, y * height * 0.55, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,255,${pulse * 0.5})`;
      ctx.fill();
    });
  };

  const drawScene = (time = 0) => {
    const width = canvas.width;
    const height = canvas.height;
    const horizonY = height * 0.52;

    ctx.clearRect(0, 0, width, height);

    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.62);
    sky.addColorStop(0, "#020c14");
    sky.addColorStop(0.4, "#041624");
    sky.addColorStop(0.7, "#071e30");
    sky.addColorStop(1, "#0a2438");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const fog = ctx.createRadialGradient(width * 0.5, horizonY, 0, width * 0.5, horizonY, width * 0.7);
    fog.addColorStop(0, "#0e2d4222");
    fog.addColorStop(0.3, "#07192611");
    fog.addColorStop(1, "transparent");
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, width, height);

    drawLighthouse(width, height, horizonY, time);

    const ocean = ctx.createLinearGradient(0, horizonY, 0, height);
    ocean.addColorStop(0, "#0a2030");
    ocean.addColorStop(0.3, "#071828");
    ocean.addColorStop(0.7, "#050f1a");
    ocean.addColorStop(1, "#020a12");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    waves.forEach((wave, i) => {
      const waveY = horizonY + (i / waves.length) * (height - horizonY) * 0.9;
      ctx.beginPath();
      ctx.moveTo(0, waveY);

      for (let x = 0; x <= width; x += 3) {
        const y =
          waveY +
          Math.sin(x * wave.frequency + time * wave.speed * 60 + wave.phase) * wave.amplitude +
          Math.sin(x * wave.frequency * 1.7 + time * wave.speed * 40) * (wave.amplitude * 0.4);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = `rgba(10,32,52,${wave.alpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, waveY);
      for (let x = 0; x <= width; x += 3) {
        const y =
          waveY +
          Math.sin(x * wave.frequency + time * wave.speed * 60 + wave.phase) * wave.amplitude +
          Math.sin(x * wave.frequency * 1.7 + time * wave.speed * 40) * (wave.amplitude * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(40,100,140,${wave.alpha * 0.6})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    const moonX = width * 0.75;
    const moonY = height * 0.12;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 60);
    moonGlow.addColorStop(0, "#e8f4fb08");
    moonGlow.addColorStop(0.4, "#c8e4f405");
    moonGlow.addColorStop(1, "transparent");
    ctx.fillStyle = moonGlow;
    ctx.fillRect(moonX - 60, moonY - 60, 120, 120);
    ctx.beginPath();
    ctx.arc(moonX, moonY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#d8eef833";
    ctx.fill();

    const moonReflection = ctx.createLinearGradient(moonX - 20, horizonY, moonX + 20, height);
    moonReflection.addColorStop(0, "rgba(40,100,140,0.15)");
    moonReflection.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.moveTo(moonX - 18, horizonY);
    ctx.quadraticCurveTo(moonX, horizonY + (height - horizonY) * 0.5, moonX - 10, height);
    ctx.quadraticCurveTo(moonX, horizonY + (height - horizonY) * 0.5, moonX + 18, horizonY);
    ctx.closePath();
    ctx.fillStyle = moonReflection;
    ctx.fill();

    drawStars(width, height, time);
  };

  const buildGrid = () => {
    const width = hero.offsetWidth;
    const height = hero.offsetHeight;
    const nodes = [
      [0.22, 0.38],
      [0.38, 0.62],
      [0.55, 0.45],
      [0.68, 0.72],
      [0.82, 0.55],
      [0.14, 0.55],
      [0.72, 0.38],
      [0.44, 0.78],
      [0.3, 0.7],
      [0.6, 0.28],
    ];
    const columns = 14;
    const rows = 9;
    let elements = "";

    gridSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    for (let c = 1; c < columns; c += 1) {
      elements += `<line x1="${(c * width) / columns}" y1="0" x2="${(c * width) / columns}" y2="${height}" stroke="#1a3f5533" stroke-width="0.5"/>`;
    }

    for (let r = 1; r < rows; r += 1) {
      const alpha = r < 5 ? "15" : "22";
      elements += `<line x1="0" y1="${(r * height) / rows}" x2="${width}" y2="${(r * height) / rows}" stroke="#1a4060${alpha}" stroke-width="0.5"/>`;
    }

    nodes.forEach(([x, y]) => {
      elements += `<circle cx="${x * width}" cy="${y * height}" r="2" fill="#3a7a9a44"/>`;
      elements += `<circle cx="${x * width}" cy="${y * height}" r="5" fill="none" stroke="#2a5a7a33" stroke-width="0.5"/>`;
    });

    nodes.forEach(([x, y], i) => {
      const [nextX, nextY] = nodes[(i + 2) % nodes.length];
      elements += `<line x1="${x * width}" y1="${y * height}" x2="${nextX * width}" y2="${nextY * height}" stroke="#1e4a6622" stroke-width="0.5" stroke-dasharray="4 6"/>`;
    });

    gridSvg.innerHTML = elements;
    window.setTimeout(() => gridSvg.classList.add("visible"), 300);
  };

  const buildDots = () => {
    const positions = [
      [15, 38],
      [82, 55],
      [28, 70],
      [72, 42],
      [62, 68],
      [18, 55],
      [88, 35],
      [45, 82],
      [35, 48],
      [78, 75],
    ];

    dataPoints.innerHTML = positions
      .map(([left, top], i) => `<div class="dp" style="left:${left}%;top:${top}%;--d:${2 + i * 0.4}s;--delay:${i * 0.3 + 1}s;"></div>`)
      .join("");
  };

  const animate = (timestamp) => {
    drawScene(timestamp * 0.001);

    if (!reduceMotion) {
      window.requestAnimationFrame(animate);
    }
  };

  resizeCanvas();
  buildGrid();
  buildDots();
  drawScene();

  if (!reduceMotion) {
    window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    buildGrid();
    drawScene();
  });
}
