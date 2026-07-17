// ─────────────────────────────────────────────────────────────
// Osiemnastka — wspólny skrypt.
// Renderuje zaproszenie (imienne, gdy strona ustawi window.GUEST,
// albo ogólne na stronie głównej), odlicza czas, robi konfetti
// po potwierdzeniu obecności.
// ─────────────────────────────────────────────────────────────
(function () {
  const P = window.PARTY;
  const G = window.GUEST || null;

  // ── Render strony ──────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  const smsBody = encodeURIComponent(
    `Hej ${P.solenizant}! ${G ? "Tu " + G.imie + " — b" : "B"}ędę na Twojej osiemnastce 16 sierpnia.`
  );

  const heroHtml = G
    ? `
      <p class="eyebrow">Osiemnastka &middot; ${esc(P.dataTekst)}</p>
      <h1>Hej, <span class="gradient-text">${esc(G.imie)}</span>.</h1>
      <p class="subtitle">Zapraszam Cię na moje 18. urodziny. Bez Ciebie to nie będzie to samo.</p>
      <div class="hero-arrow"><i data-lucide="chevron-down"></i></div>`
    : `
      <p class="eyebrow">Osiemnastka &middot; ${esc(P.dataTekst)}</p>
      <h1><span class="gradient-text">${esc(P.solenizant)}</span> kończy 18 lat.</h1>
      <p class="subtitle">Każde zaproszenie jest osobiste — otwórz swój link, żeby zobaczyć wiadomość dla Ciebie.</p>
      <div class="hero-arrow"><i data-lucide="chevron-down"></i></div>`;

  const photoHtml = G && G.zdjecie
    ? `
      <section class="photo-card reveal">
        <div class="photo-frame">
          <img src="${esc(G.zdjecie)}" alt="Zdjęcie: ${esc(G.imie)}"
               onerror="this.outerHTML='<div class=&quot;photo-initials&quot;>${esc(G.imie.trim()[0] || "?")}</div>'">
        </div>
        ${G.podpisZdjecia ? `<p class="photo-caption">${esc(G.podpisZdjecia)}</p>` : ""}
      </section>`
    : "";

  const opisHtml = G && G.opis
    ? `
      <section class="reveal">
        <p class="eyebrow">Dlaczego Ty</p>
        <p class="lead">${G.opis}</p>
      </section>`
    : "";

  const detail = (icon, label, value) => `
    <div class="detail-row">
      <i data-lucide="${icon}"></i>
      <div>
        <div class="detail-label">${label}</div>
        <div class="detail-value">${value}</div>
      </div>
    </div>`;

  const detailsHtml = `
    <section class="reveal">
      <p class="eyebrow">Szczegóły</p>
      <div class="details-list">
        ${detail("calendar", "Kiedy", `${esc(P.dzienTygodnia)}, ${esc(P.dataTekst)}`)}
        ${detail("clock", "O której", esc(P.godzina))}
        ${detail("map-pin", "Gdzie", `${esc(P.miejsce)}<br><a href="${esc(P.mapaUrl)}" target="_blank" rel="noopener">${esc(P.adres)}</a>`)}
        ${detail("shirt", "Dress code", esc(P.dresscode))}
      </div>
    </section>`;

  const countdownHtml = `
    <section class="reveal">
      <p class="eyebrow">Do imprezy</p>
      <div class="countdown" id="countdown">
        <div><span class="count-num" id="cd-d">–</span><span class="count-label">dni</span></div>
        <div><span class="count-num" id="cd-h">–</span><span class="count-label">godz</span></div>
        <div><span class="count-num" id="cd-m">–</span><span class="count-label">min</span></div>
        <div><span class="count-num" id="cd-s">–</span><span class="count-label">sek</span></div>
      </div>
    </section>`;

  const rsvpHtml = `
    <section class="reveal">
      <p class="eyebrow">Potwierdź obecność</p>
      <p class="lead">Daj znać do <strong>${esc(P.rsvpDo)}</strong>.</p>
      <div class="rsvp-buttons">
        <a class="btn btn-primary" id="btn-yes" href="sms:${esc(P.telefon)}?body=${smsBody}">
          Będę
        </a>
        <a class="btn btn-secondary" href="tel:${esc(P.telefon)}">
          <i data-lucide="phone"></i> Zadzwoń
        </a>
      </div>
      <p class="rsvp-note">Masz pytania? Pisz śmiało o każdej porze.</p>
    </section>`;

  const footerHtml = `
    <footer class="reveal">
      <p>Do zobaczenia.</p>
      <p class="signature">${esc(P.solenizant)}</p>
    </footer>`;

  document.getElementById("app").innerHTML = `
    <div class="container">
      <section class="hero">${heroHtml}</section>
      ${photoHtml}
      ${opisHtml}
      ${detailsHtml}
      ${countdownHtml}
      ${rsvpHtml}
      ${footerHtml}
    </div>
    <canvas id="confetti-canvas"></canvas>`;

  if (window.lucide) lucide.createIcons();

  // ── Scroll reveal ──────────────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ── Odliczanie ─────────────────────────────────────────────
  const target = new Date(P.dataISO).getTime();
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById("countdown").innerHTML =
        `<div class="countdown-done gradient-text">To dziś. Impreza trwa!</div>`;
      clearInterval(timer);
      return;
    }
    document.getElementById("cd-d").textContent = String(Math.floor(diff / 86400000));
    document.getElementById("cd-h").textContent = pad(Math.floor(diff / 3600000) % 24);
    document.getElementById("cd-m").textContent = pad(Math.floor(diff / 60000) % 60);
    document.getElementById("cd-s").textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  const timer = setInterval(tick, 1000);

  // ── Konfetti (tylko po kliknięciu „Będę") ──────────────────
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#f5c26b", "#f472b6", "#a78bfa", "#f5f5f7"];
  let particles = [];
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function burst(count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
        y: -20 - Math.random() * canvas.height * 0.3,
        w: 5 + Math.random() * 5,
        h: 7 + Math.random() * 7,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    if (!rafId) loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.y < canvas.height + 30);
    for (const p of particles) {
      p.x += p.vx + Math.sin(p.y * 0.02) * 0.8;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    rafId = particles.length ? requestAnimationFrame(loop) : null;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const btn = document.getElementById("btn-yes");
  if (btn && !reduced) {
    btn.addEventListener("click", () => burst(160));
  }
})();
