// ─────────────────────────────────────────────────────────────
// Osiemnastka — zaproszenie w formie „instagram story".
// Slajdy: Hej → Dlaczego Ty → Zdjęcie → Szczegóły + RSVP.
// Nawigacja: tap w prawo/lewo, przytrzymanie pauzuje,
// paski postępu u góry, auto-przejście po 7 s.
// RSVP: formularz Pageclip (albo SMS/telefon, gdy brak klucza).
// ─────────────────────────────────────────────────────────────
(function () {
  const P = window.PARTY;
  const G = window.GUEST || null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  // ── Treść slajdów ──────────────────────────────────────────
  const msLeft = new Date(P.dataISO).getTime() - Date.now();
  const days = Math.max(0, Math.ceil(msLeft / 86400000));
  const daysTxt = msLeft <= 0
    ? "<strong>To dziś!</strong>"
    : days === 1
      ? "już <strong>jutro</strong>"
      : `za <strong>${days} dni</strong>`;

  const slides = [];

  slides.push(`
    <div class="slide-inner">
      <p class="eyebrow">Osiemnastka &middot; ${esc(P.dataTekst)}</p>
      ${G
        ? `<h1>Hej, <span class="gradient-text">${esc(G.imie)}</span>.</h1>
           <p class="subtitle">Zapraszam Cię na moje 18. urodziny. Bez Ciebie to nie będzie to samo.</p>`
        : `<h1><span class="gradient-text">${esc(P.solenizant)}</span> kończy 18 lat.</h1>
           <p class="subtitle">Każde zaproszenie jest osobiste — otwórz swój link, żeby zobaczyć wiadomość dla Ciebie.</p>`}
      <p class="days-left">${daysTxt}</p>
      <p class="tap-hint">Dotknij, aby przejść dalej <i data-lucide="chevron-right"></i></p>
    </div>`);

  if (G && G.opis) {
    slides.push(`
      <div class="slide-inner">
        <p class="eyebrow">Dlaczego Ty</p>
        <p class="lead">${G.opis}</p>
      </div>`);
  }

  if (G && G.zdjecie) {
    slides.push(`
      <div class="slide-inner slide-photo">
        <img class="photo-bg" src="${esc(G.zdjecie)}" alt="Zdjęcie: ${esc(G.imie)}"
             onerror="this.outerHTML='<div class=&quot;photo-initials&quot;>${esc(G.imie.trim()[0] || "?")}</div>'">
        <div class="photo-overlay"></div>
        ${G.podpisZdjecia ? `<p class="photo-caption">${esc(G.podpisZdjecia)}</p>` : ""}
      </div>`);
  }

  const detail = (icon, label, value) => `
    <div class="detail-row">
      <i data-lucide="${icon}"></i>
      <div>
        <div class="detail-label">${label}</div>
        <div class="detail-value">${value}</div>
      </div>
    </div>`;

  const hasPageclip = P.pageclipKey && !/TODO|TWOJ/i.test(P.pageclipKey);

  const smsBody = encodeURIComponent(
    `Hej ${P.solenizant}! ${G ? "Tu " + G.imie + " — b" : "B"}ędę na Twojej osiemnastce 16 sierpnia.`
  );

  const rsvpHtml = hasPageclip
    ? `
      <form id="rsvp-form" class="rsvp-block"
            action="https://send.pageclip.co/${esc(P.pageclipKey)}/osiemnastka" method="post">
        <input type="hidden" name="imie" value="${esc(G ? G.imie : "Gość (strona główna)")}">
        <div class="pill-group">
          <label><input type="radio" name="obecnosc" value="Będę" required><span>Będę 🎉</span></label>
          <label><input type="radio" name="obecnosc" value="Nie dam rady"><span>Nie dam rady</span></label>
        </div>
        <textarea name="wiadomosc" rows="2" placeholder="Krótka wiadomość (opcjonalnie)"></textarea>
        <button type="submit" class="btn btn-primary" id="btn-submit">Wyślij</button>
      </form>
      <div class="rsvp-success" id="rsvp-success" hidden>
        <i data-lucide="check-circle-2"></i>
        <p id="rsvp-success-text">Dzięki, zapisane!</p>
      </div>`
    : `
      <div class="rsvp-block">
        <a class="btn btn-primary" id="btn-yes" href="sms:${esc(P.telefon)}?body=${smsBody}">Będę 🎉</a>
        <a class="btn btn-secondary" href="tel:${esc(P.telefon)}"><i data-lucide="phone"></i> Zadzwoń</a>
      </div>`;

  slides.push(`
    <div class="slide-inner">
      <p class="eyebrow">Szczegóły</p>
      <div class="details-list">
        ${detail("calendar", "Kiedy", `${esc(P.dzienTygodnia)}, ${esc(P.dataTekst)}, ${esc(P.godzina)}`)}
        ${detail("map-pin", "Gdzie", `${esc(P.miejsce)} &middot; <a href="${esc(P.mapaUrl)}" target="_blank" rel="noopener">${esc(P.adres)}</a>`)}
        ${detail("shirt", "Dress code", esc(P.dresscode))}
      </div>
      <p class="eyebrow">Potwierdź do ${esc(P.rsvpDo)}</p>
      ${rsvpHtml}
      <p class="rsvp-note">Masz pytania? Pisz śmiało o każdej porze. — ${esc(P.solenizant)}</p>
    </div>`);

  // ── Render ─────────────────────────────────────────────────
  document.getElementById("app").innerHTML = `
    <div class="story-stage">
      <div class="story-viewport" id="viewport">
        <div class="progress">
          ${slides.map(() => `<div class="seg"><span class="seg-fill"></span></div>`).join("")}
        </div>
        ${slides.map((s) => `<div class="slide">${s}</div>`).join("")}
        <canvas id="confetti-canvas"></canvas>
      </div>
    </div>`;

  if (window.lucide) lucide.createIcons();

  // ── Sterowanie story ───────────────────────────────────────
  const DUR = 7000; // ms na slajd
  const viewport = document.getElementById("viewport");
  const slideEls = Array.from(viewport.querySelectorAll(".slide"));
  const fills = Array.from(viewport.querySelectorAll(".seg-fill"));
  const N = slideEls.length;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // #2, #3… w adresie otwiera od razu dany slajd (numeracja od 1)
  let idx = Math.max(0, Math.min(N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  let elapsed = 0;
  let paused = false;
  let pressedAt = 0;
  let lastT = null;

  function show(i) {
    idx = Math.max(0, Math.min(N - 1, i));
    elapsed = 0;
    slideEls.forEach((el, j) => el.classList.toggle("active", j === idx));
    paint();
  }

  function paint() {
    fills.forEach((f, j) => {
      f.style.width = j < idx ? "100%" : j > idx ? "0%" : `${(elapsed / DUR) * 100}%`;
    });
  }

  show(idx);

  function frame(t) {
    if (lastT !== null && !paused && idx < N - 1 && !reduced) {
      elapsed += t - lastT;
      if (elapsed >= DUR) {
        show(idx + 1);
      } else {
        paint();
      }
    }
    if (idx === N - 1) {
      // ostatni slajd: pasek pełny, bez auto-przejścia
      fills[idx].style.width = "100%";
    }
    lastT = t;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Tap: prawa strona → dalej, lewa 1/3 → wstecz. Przytrzymanie: pauza.
  const INTERACTIVE = "a, button, input, textarea, label, form";

  viewport.addEventListener("pointerdown", (e) => {
    pressedAt = performance.now();
    if (!e.target.closest(INTERACTIVE)) paused = true;
  });

  viewport.addEventListener("pointerup", (e) => {
    paused = false;
    if (e.target.closest(INTERACTIVE)) return;
    if (performance.now() - pressedAt < 300) {
      const x = e.clientX - viewport.getBoundingClientRect().left;
      if (x < viewport.clientWidth / 3) show(idx - 1);
      else show(idx + 1);
    }
  });

  viewport.addEventListener("pointercancel", () => { paused = false; });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });

  // ── Konfetti (po potwierdzeniu „Będę") ─────────────────────
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const COLORS = ["#f5c26b", "#f472b6", "#a78bfa", "#f5f5f7"];
  let particles = [];
  let rafId = null;

  function resize() {
    canvas.width = viewport.clientWidth;
    canvas.height = viewport.clientHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function burst(count) {
    if (reduced) return;
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

  // ── RSVP ───────────────────────────────────────────────────
  const form = document.getElementById("rsvp-form");
  if (form && window.Pageclip) {
    const submitBtn = document.getElementById("btn-submit");
    Pageclip.form(form, {
      onSubmit: function () {
        submitBtn.disabled = true;
        submitBtn.textContent = "Wysyłanie…";
      },
      onResponse: function (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Wyślij";
        if (error) {
          alert("Ups, nie udało się wysłać. Spróbuj jeszcze raz albo napisz SMS.");
          return false;
        }
        const attending = form.elements.obecnosc.value === "Będę";
        document.getElementById("rsvp-success-text").textContent = attending
          ? "Super, do zobaczenia 16 sierpnia! 🎉"
          : "Szkoda! Ale dzięki, że dałeś/aś znać. 💜";
        form.hidden = true;
        document.getElementById("rsvp-success").hidden = false;
        if (attending) burst(180);
        return false; // własny komunikat zamiast domyślnego Pageclip
      },
    });
  } else if (!form) {
    const btnYes = document.getElementById("btn-yes");
    if (btnYes) btnYes.addEventListener("click", () => burst(160));
  }
})();
