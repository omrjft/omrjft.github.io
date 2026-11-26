(() => {
  "use strict";

  /* ==========================================================================
     1. Bilingual Toggle (ES / EN)
     ========================================================================== */
  const englishToggle = document.getElementById("english-toggle");
  const spanishToggle = document.getElementById("spanish-toggle");

  function setLanguage(language) {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-es][data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });

    document.querySelectorAll("[data-es-alt][data-en-alt]").forEach((element) => {
      element.alt = language === "es" ? element.dataset.esAlt : element.dataset.enAlt;
    });

    document.title =
      language === "es"
        ? "Omar Báez — Ingeniería en Sistemas, Backend & Datos"
        : "Omar Báez — Systems Engineering, Backend & Data";

    const siteNav = document.querySelector(".site-nav");
    if (siteNav) {
      siteNav.setAttribute(
        "aria-label",
        language === "es" ? "Navegación principal" : "Main navigation"
      );
    }

    const contactFooter = document.getElementById("contacto");
    if (contactFooter) {
      contactFooter.setAttribute(
        "aria-label",
        language === "es" ? "Información de contacto" : "Contact information"
      );
    }

    if (englishToggle && spanishToggle) {
      englishToggle.hidden = language === "en";
      spanishToggle.hidden = language === "es";
    }

    try {
      localStorage.setItem("portfolio-language", language);
    } catch (error) {
      // Safe fallback if storage is unavailable
    }
  }

  if (englishToggle) {
    englishToggle.addEventListener("click", () => setLanguage("en"));
  }
  if (spanishToggle) {
    spanishToggle.addEventListener("click", () => setLanguage("es"));
  }

  let savedLanguage = "es";
  try {
    savedLanguage = localStorage.getItem("portfolio-language") === "en" ? "en" : "es";
  } catch (error) {
    savedLanguage = "es";
  }
  setLanguage(savedLanguage);

  /* ==========================================================================
     2. Scroll Reveal Observer
     ========================================================================== */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ==========================================================================
     3. Triangle Glyph Helper
     ========================================================================== */
  const PALETTE = [
    "#8052ff", // Electric Iris
    "#ffb829", // Saffron Spark
    "#15846e", // Deep Verdant
    "#a855f7", // Vivid Violet
    "#38bdf8", // Cyan Spark
    "#e040fb", // Magenta
  ];

  function drawOutlinedTriangle(ctx, x, y, radius, angle, color, alpha, lineWidth) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const theta = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const px = Math.cos(theta) * radius;
      const py = Math.sin(theta) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  }

  /* ==========================================================================
     4. Hero Constellation Visualization (Organic Brain / Neural Topology)
     ========================================================================== */
  const heroCanvas = document.getElementById("constellation-canvas");
  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    const PARTICLE_COUNT = 540;
    const particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointer = { x: 0, y: 0, active: false };

    function createBrainPoint(index, total) {
      // Parametric organic two-lobe neural / brain cloud
      const t = (index / total) * Math.PI * 2;
      const lobe = index % 2 === 0 ? 1 : -1;
      const r = Math.pow(Math.random(), 0.55);

      // Base organic silhouette
      const angle = Math.random() * Math.PI * 2;
      const rx = 0.38 * (1 + 0.14 * Math.sin(angle * 3 + lobe));
      const ry = 0.31 * (1 + 0.18 * Math.cos(angle * 2));

      let nx = Math.cos(angle) * rx * r + lobe * 0.055;
      let ny = Math.sin(angle) * ry * r - 0.03 * Math.cos(nx * 5);
      // Slight indentation at bottom stem / central fissure
      if (ny > 0.15 && Math.abs(nx) < 0.1) {
        ny -= 0.04;
      }
      const nz = (Math.random() - 0.5) * 0.55 * (1 - r * 0.4);

      return {
        bx: nx,
        by: ny,
        bz: nz,
        size: 2.2 + Math.random() * 4.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.014,
        phase: Math.random() * Math.PI * 2,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: 0.45 + Math.random() * 0.55,
      };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createBrainPoint(i, PARTICLE_COUNT));
    }

    function resizeHero() {
      const rect = heroCanvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      heroCanvas.width = Math.max(1, Math.floor(width * dpr));
      heroCanvas.height = Math.max(1, Math.floor(height * dpr));
    }

    resizeHero();
    window.addEventListener("resize", resizeHero);

    heroCanvas.addEventListener("pointermove", (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });

    heroCanvas.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    let time = 0;
    function renderHero() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const scale = Math.min(width, height);
      const cx = width / 2;
      const cy = height / 2;
      const yaw = prefersReducedMotion ? 0.25 : Math.sin(time * 0.35) * 0.28 + time * 0.12;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const drift = prefersReducedMotion ? 0 : Math.sin(time * 1.1 + p.phase) * 0.008;

        // 3D rotation around Y axis
        const x3 = (p.bx + drift) * cosY - p.bz * sinY;
        const z3 = (p.bx + drift) * sinY + p.bz * cosY;
        const y3 = p.by + (prefersReducedMotion ? 0 : Math.cos(time * 0.9 + p.phase) * 0.008);

        const perspective = 1.45 / (1.45 - z3);
        let sx = cx + x3 * scale * perspective;
        let sy = cy + y3 * scale * perspective;

        // Subtle interactive pointer repulsion
        if (pointer.active && !prefersReducedMotion) {
          const dx = sx - pointer.x;
          const dy = sy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && dist > 0.1) {
            const force = ((90 - dist) / 90) * 18;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
          }
        }

        const depthAlpha = Math.max(0.18, Math.min(1, p.alpha * (0.65 + z3 * 0.6)));
        const triSize = p.size * (0.75 + perspective * 0.25);

        drawOutlinedTriangle(
          ctx,
          sx,
          sy,
          triSize,
          p.rot + (prefersReducedMotion ? 0 : time * p.rotSpeed * 30),
          p.color,
          depthAlpha,
          1.25
        );
      }

      if (!prefersReducedMotion) {
        time += 0.012;
        requestAnimationFrame(renderHero);
      }
    }

    renderHero();
  }

  /* ==========================================================================
     5. Ambient Background Particle Field
     ========================================================================== */
  const ambientCanvas = document.getElementById("ambient-canvas");
  if (ambientCanvas) {
    const actx = ambientCanvas.getContext("2d");
    const AMBIENT_COUNT = 55;
    const ambientParticles = [];
    let aw = 0;
    let ah = 0;
    let adpr = 1;

    function resizeAmbient() {
      adpr = Math.min(window.devicePixelRatio || 1, 2);
      aw = window.innerWidth;
      ah = window.innerHeight;
      ambientCanvas.width = Math.floor(aw * adpr);
      ambientCanvas.height = Math.floor(ah * adpr);
    }

    resizeAmbient();
    window.addEventListener("resize", resizeAmbient);

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientParticles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00018,
        vy: (Math.random() - 0.5) * 0.00018,
        size: 2.5 + Math.random() * 4.5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: 0.12 + Math.random() * 0.22,
      });
    }

    function renderAmbient() {
      actx.setTransform(adpr, 0, 0, adpr, 0, 0);
      actx.clearRect(0, 0, aw, ah);

      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        if (!prefersReducedMotion) {
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;
          p.rot += p.rotSpeed;
        }

        drawOutlinedTriangle(
          actx,
          p.x * aw,
          p.y * ah,
          p.size,
          p.rot,
          p.color,
          p.alpha,
          1
        );
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderAmbient);
      }
    }

    renderAmbient();
  }
})();
