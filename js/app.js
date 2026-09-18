/* =========================================================
   PRESETS DE ANIMAÇÃO — simulam cada movimento de câmera
   w* = câmera inteira (pan/zoom, sem parallax)
   m* = parallax por profundidade (dolly/truck/pedestal)
   o* = órbita (fundo e primeiro plano em sentidos opostos)
   ========================================================= */
const PRESETS = {
  static:   { cls: "breathe" },
  panR:     { wx: -110 },
  panL:     { wx: 110 },
  whipR:    { wx: -300, ease: "cubic-bezier(.85,0,.15,1)", dur: 3, cls: "whip" },
  whipL:    { wx: 300, ease: "cubic-bezier(.85,0,.15,1)", dur: 3, cls: "whip" },
  tiltU:    { wy: 85 },
  tiltD:    { wy: -70 },
  zoomInS:  { ws: 1.55, dur: 6 },
  zoomOutS: { ws0: 1.55, dur: 6 },
  zoomInF:  { ws: 1.9, dur: 3.2, ease: "cubic-bezier(.6,0,.2,1)" },
  zoomOutF: { ws0: 1.9, dur: 3.2, ease: "cubic-bezier(.6,0,.2,1)" },
  crashIn:  { ws: 2.7, dur: 3, ease: "cubic-bezier(.95,0,.05,1)" },
  crashOut: { ws0: 2.7, dur: 3, ease: "cubic-bezier(.95,0,.05,1)" },
  dollyIn:  { ms: .55 },
  dollyOut: { ms0: .55 },
  tracking: { mx: -150, sd: 0, cls: "walk", ease: "linear" },
  follow:   { ms: .45, sd: 0, cls: "walk back", ease: "linear", cam: "translate(0px,6px) scale(1.12)" },
  reverse:  { ms0: .45, sd: 0, cls: "walk", ease: "linear" },
  side:     { mx: -170, sd: 0, cls: "walk", ease: "linear" },
  low:      { mx: -150, sd: 0, cls: "walk", ease: "linear", cam: "translate(0px,-34px) scale(1.25)" },
  vehicle:  { mx: -260, sd: 0, cls: "car", ease: "linear", dur: 4 },
  chase:    { ms: .6, sd: 0, cls: "walk chase", ease: "cubic-bezier(.3,0,.7,1)", dur: 3.6 },
  truckR:   { mx: -75 },
  truckL:   { mx: 75 },
  pedUp:    { my: 55 },
  pedDown:  { my: -45 },
  sliderR:  { mx: -32, dur: 6 },
  sliderL:  { mx: 32, dur: 6 },
  pushPast: { ms: 1.6, sd: .25, cls: "pushpast" },
  arcR:     { ox: -50, cls: "turn" },
  arcL:     { ox: 50, cls: "turn" },
  orbitCW:  { ox: -130, dur: 6, cls: "turn" },
  orbitCCW: { ox: 130, dur: 6, cls: "turn" },
  handheld: { ms: .08, cls: "hand" },
  snorri:   { mx: -30, sd: 0, cls: "snorri" },
  craneUp:  { my: 80, ws: .92, dur: 6 },
  craneDown:{ my0: 80, ws0: .92, dur: 6 },
  droneIn:  { ms: .45, cam: "translate(0px,26px) scale(.9)", cls: "fly" },
  droneOut: { ms0: .45, cam: "translate(0px,26px) scale(.9)", cls: "fly" },
  heli:     { mx: -60, ws: .9, dur: 7, ease: "linear", cam: "translate(0px,42px) scale(.8)" },
  fpv:      { ms: .5, cls: "fpv" },
  tiltshift:{ mx: -26, dur: 7, ease: "linear", cam: "translate(0px,30px) scale(.86)", cls: "ts" },
  infinite: { ws: 9, wox: "232px", woy: "58px", dur: 4.6, ease: "cubic-bezier(.7,0,.95,.5)", cls: "inf" },
  earth:    { ws: .075, woy: "124px", dur: 6, ease: "cubic-bezier(.55,0,.15,1)", cls: "earth" },
  timelapse:{ dur: 6, cls: "tl" },
  passThrough: { ms: 2.4, sd: .2, cls: "portal" },
};

function presetStyle(p) {
  const c = PRESETS[p] || {};
  const v = {
    "--wx0": c.wx0 || 0, "--wx": c.wx || 0, "--wy0": c.wy0 || 0, "--wy": c.wy || 0,
    "--ws0": c.ws0 ?? 1, "--ws": c.ws ?? 1,
    "--mx0": c.mx0 || 0, "--mx": c.mx || 0, "--my0": c.my0 || 0, "--my": c.my || 0,
    "--ms0": c.ms0 || 0, "--ms": c.ms || 0, "--ox0": c.ox0 || 0, "--ox": c.ox || 0,
    "--dur": (c.dur || 5) + "s", "--ease": c.ease || "cubic-bezier(.45,.05,.35,1)",
    "--wox": c.wox || "160px", "--woy": c.woy || "105px",
  };
  if (c.sd !== undefined) v["--sd"] = c.sd;
  return Object.entries(v).map(([k, val]) => `${k}:${val}`).join(";");
}

/* =========================================================
   CENA SVG — céu, montanhas, chão, assunto, primeiro plano
   ========================================================= */
function sceneSVG(p) {
  const c = PRESETS[p] || {};
  const marks = [];
  for (let x = -700; x < 1020; x += 38) marks.push(`<rect x="${x}" y="150" width="14" height="2" rx="1"/>`);
  const posts = [-260, -120, 18, 292, 430, 560]
    .map((x, i) => `<rect x="${x}" y="${i % 2 ? 30 : 12}" width="${i % 3 ? 14 : 20}" height="220" rx="2"/>`).join("");
  return `
  <svg class="scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect class="sky" x="0" y="0" width="320" height="180" fill="url(#gSky)"/>
    <rect class="tint" x="0" y="0" width="320" height="180"/>
    <g class="shake"><g class="cam" ${c.cam ? `style="transform:${c.cam}"` : ""}><g class="world">
      <circle class="globe" cx="160" cy="124" r="1300"/>
      <g class="lay sunL"><circle class="sun" cx="232" cy="58" r="15"/><circle class="sunHalo" cx="232" cy="58" r="30"/></g>
      <g class="bgset">
        <g class="lay far">
          <g class="clouds"><ellipse cx="60" cy="40" rx="30" ry="5"/><ellipse cx="150" cy="28" rx="22" ry="4"/><ellipse cx="300" cy="44" rx="34" ry="5"/><ellipse cx="-80" cy="34" rx="30" ry="4"/><ellipse cx="440" cy="30" rx="26" ry="4"/></g>
          <polygon class="mtn2" points="-700,118 -560,70 -430,104 -300,62 -170,100 -40,66 70,98 170,58 270,96 380,64 500,100 620,70 760,104 1020,80 1020,120 -700,120"/>
          <polygon class="mtn1" points="-700,120 -600,94 -480,112 -360,88 -230,114 -100,90 20,112 120,84 230,110 340,86 470,114 600,92 740,112 1020,96 1020,122 -700,122"/>
        </g>
        <g class="lay gnd">
          <rect class="ground" x="-700" y="118" width="1720" height="800"/>
          <g class="persp"><line x1="160" y1="118" x2="-400" y2="600"/><line x1="160" y1="118" x2="-60" y2="600"/><line x1="160" y1="118" x2="160" y2="600"/><line x1="160" y1="118" x2="380" y2="600"/><line x1="160" y1="118" x2="720" y2="600"/></g>
          <g class="marks">${marks.join("")}</g>
        </g>
      </g>
      <g class="lay sub">
        <ellipse class="shadow" cx="160" cy="141" rx="13" ry="2.5"/>
        <g class="person"><circle cx="160" cy="102" r="6.5"/><rect x="153.5" y="110" width="13" height="21" rx="5"/><rect class="leg l1" x="155" y="127" width="4" height="14" rx="2"/><rect class="leg l2" x="161" y="127" width="4" height="14" rx="2"/></g>
        <g class="car"><path d="M134 136 v-9 q0-4 4-4 h8 l8-8 h16 l9 8 h5 q4 0 4 4 v9 z"/><circle class="wheel" cx="145" cy="137" r="4.5"/><circle class="wheel" cx="175" cy="137" r="4.5"/></g>
      </g>
      <g class="fgset"><g class="lay fg">
        <g class="posts">${posts}</g>
        <path class="portalFrame" fill-rule="evenodd" d="M-600 -400 H920 V600 H-600 Z M122 62 H198 V146 H122 Z"/>
      </g></g>
    </g></g></g>
    <rect class="blink" x="0" y="0" width="320" height="180"/>
  </svg>`;
}

function shotHTML(m, big = false) {
  const c = PRESETS[m.p] || {};
  return `<div class="shot ${c.cls || ""} ${big ? "big" : ""}" data-p="${m.p}" style="${presetStyle(m.p)}">
    ${sceneSVG(m.p)}
    <div class="ts-blur top"></div><div class="ts-blur bot"></div>
    <div class="vf"><i></i><i></i><i></i><i></i></div>
    <span class="rec"><b></b>REC</span>
    <span class="shot-id">SHOT ${m.id}</span>
  </div>`;
}

/* =========================================================
   UTILIDADES
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

async function copy(text, label = "Prompt copiado") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  toast(label);
}

/* Toca as animações só quando o card está na tela */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle("on", e.isIntersecting)),
  { rootMargin: "80px" }
);
const observe = (root) => $$(".shot", root).forEach((s) => io.observe(s));

/* =========================================================
   HERO — viewer que alterna movimentos
   ========================================================= */
const HERO_SEQ = ["08", "15", "10", "25", "07A", "S3", "19", "S5", "13", "23", "S4", "04"];
let heroIdx = 0;
function heroNext() {
  const m = MOVES.find((x) => x.id === HERO_SEQ[heroIdx % HERO_SEQ.length]);
  const stage = $("#heroStage");
  stage.innerHTML = shotHTML(m, true);
  observe(stage);
  $("#heroName").textContent = m.pt;
  $("#heroCat").textContent = MOVE_CATS[m.cat];
  $("#heroNum").textContent = String((heroIdx % HERO_SEQ.length) + 1).padStart(2, "0");
  heroIdx++;
  const d = (PRESETS[m.p].dur || 5) * 1000;
  clearTimeout(heroNext.t);
  heroNext.t = setTimeout(heroNext, Math.max(d, 4200));
}

function timecode() {
  const el = $("#tc");
  const start = performance.now();
  (function tick() {
    const t = (performance.now() - start) / 1000;
    const f = Math.floor((t % 1) * 24), s = Math.floor(t) % 60, mi = Math.floor(t / 60) % 60;
    el.textContent = `00:${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
    requestAnimationFrame(tick);
  })();
}

/* =========================================================
   BIBLIOTECA DE MOVIMENTOS
   ========================================================= */
let moveCat = "all", moveQuery = "";
function renderMoveFilters() {
  const counts = MOVES.reduce((a, m) => ((a[m.cat] = (a[m.cat] || 0) + 1), a), {});
  const chips = [["all", "Todos", MOVES.length], ...Object.entries(MOVE_CATS).map(([k, v]) => [k, v, counts[k]])];
  $("#moveFilters").innerHTML = chips
    .map(([k, v, n]) => `<button class="chip ${k === moveCat ? "act" : ""}" data-cat="${k}">${v}<sup>${n}</sup></button>`)
    .join("");
}
function renderMoves() {
  const q = moveQuery.trim().toLowerCase();
  const list = MOVES.filter((m) => (moveCat === "all" || m.cat === moveCat) &&
    (!q || (m.pt + " " + m.en + " " + m.uso + " " + m.id).toLowerCase().includes(q)));
  $("#moveGrid").innerHTML = list.length
    ? list.map((m) => `
    <article class="mcard" data-id="${m.id}">
      ${shotHTML(m)}
      <div class="mbody">
        <div class="mmeta"><span>${MOVE_CATS[m.cat]}</span></div>
        <h3>${esc(m.pt)}</h3>
        <p class="uso">${esc(m.uso)}</p>
        <pre class="prompt">${esc(m.en)}</pre>
        <div class="actions">
          <button class="btn sm solid" data-copy-move="${m.id}">Copiar prompt</button>
          <button class="btn sm ghost" data-build-move="${m.id}">Construtor →</button>
        </div>
      </div>
    </article>`).join("")
    : `<p class="empty">Nenhum movimento encontrado para “${esc(moveQuery)}”.</p>`;
  $("#moveCount").textContent = `${list.length} de ${MOVES.length}`;
  observe($("#moveGrid"));
}

/* =========================================================
   DIAGRAMA DE LUZ (vista de cima) + ESFERA DE TESTE
   ========================================================= */
const HARD = ["bare", "grid", "sun"];
function lightShape(l) {
  const col = l.c || "#f4ecdf";
  switch (l.t) {
    case "soft": return `<rect x="-17" y="-4" width="34" height="8" rx="1.5" fill="${col}"/><rect x="-17" y="-4" width="34" height="2" fill="#0d0c0b" opacity=".35"/>`;
    case "strip": return `<rect x="-5" y="-3" width="10" height="6" rx="1" fill="${col}" transform="scale(1)"/><rect x="-3" y="-15" width="6" height="30" rx="1.5" fill="${col}" opacity=".9" transform="rotate(90)"/>`;
    case "dish": return `<path d="M-13 3 A13 13 0 0 1 13 3 Z" fill="${col}"/><circle cx="0" cy="1" r="3" fill="#0d0c0b"/>`;
    case "bare": return `<circle r="5" fill="${col}"/><g stroke="${col}" stroke-width="1.2">${[0,45,90,135,180,225,270,315].map(a=>`<line x1="0" y1="-8" x2="0" y2="-11" transform="rotate(${a})"/>`).join("")}</g>`;
    case "grid": return `<rect x="-11" y="-4" width="22" height="8" rx="1" fill="${col}"/><g stroke="#0d0c0b" stroke-width=".9">${[-7,-3.5,0,3.5,7].map(x=>`<line x1="${x}" y1="-4" x2="${x}" y2="4"/>`).join("")}</g>`;
    case "refl": return `<path d="M-16 5 Q0 -5 16 5" fill="none" stroke="${col === "#f4ecdf" ? "#f4ecdf" : col}" stroke-width="3.5" stroke-linecap="round"/>`;
    case "window": return `<rect x="-26" y="-3.5" width="52" height="7" fill="#9fc4d8" opacity=".85"/><g stroke="#0d0c0b" stroke-width="1"><line x1="-9" y1="-3.5" x2="-9" y2="3.5"/><line x1="9" y1="-3.5" x2="9" y2="3.5"/></g>`;
    case "sun": return `<circle r="7" fill="#f3b25a"/><g stroke="#f3b25a" stroke-width="1.4">${[0,45,90,135,180,225,270,315].map(a=>`<line x1="0" y1="-10" x2="0" y2="-14" transform="rotate(${a})"/>`).join("")}</g>`;
    case "flag": return `<rect x="-14" y="-2.5" width="28" height="5" fill="#0d0c0b" stroke="#6d665c" stroke-width=".8"/>`;
    case "wand": return `<path d="M-18 0 H18" stroke="${col}" stroke-width="2.4" stroke-dasharray="3 3"/><path d="M14 -4 L19 0 L14 4" fill="none" stroke="${col}" stroke-width="1.4"/>`;
    case "amb": return `<g fill="${col === "#f4ecdf" ? "#f3b25a" : col}">${[-16,-8,0,8,16].map((x,i)=>`<circle cx="${x}" cy="${i%2?2:-2}" r="2"/>`).join("")}</g>`;
    case "bg": return `<rect x="-9" y="-5" width="18" height="10" rx="2" fill="${col}"/><circle cx="0" cy="0" r="2.4" fill="#0d0c0b"/>`;
    default: return "";
  }
}
function lightDiagram(t) {
  const cx = 100, cy = 94, R = 64;
  const hasBg = t.lights.some((l) => l.t === "bg") || ["white", "grad", "gel", "color"].includes(t.bg);
  const parts = t.lights.map((l) => {
    let x, y, rot;
    if (l.t === "bg") {
      x = cx + Math.sin((l.a * Math.PI) / 180) * 46; y = 38; rot = 180;
    } else {
      const r = (l.r || 1) * R;
      x = cx + Math.sin((l.a * Math.PI) / 180) * r;
      y = cy + Math.cos((l.a * Math.PI) / 180) * r;
      rot = -l.a;
    }
    const col = l.c || (l.t === "sun" ? "#f3b25a" : "#f4ecdf");
    const beam = ["flag", "refl", "amb"].includes(l.t) ? "" :
      l.t === "bg" ? `<path d="M${x} ${y} L${x - 22} 20 L${x + 22} 20 Z" fill="${col}" opacity=".13"/>` :
      `<path d="M${x} ${y} L${cx - 10} ${cy} L${cx + 10} ${cy} Z" fill="${col}" opacity="${HARD.includes(l.t) ? .2 : .12}"/>`;
    const s = l.t === "bg" ? 0 : Math.sin((l.a * Math.PI) / 180), co = l.t === "bg" ? -1 : Math.cos((l.a * Math.PI) / 180);
    const side = Math.abs(s) > .6, front = !side && co > 0, flip = front && x > 120;
    const lx = side ? x - s * 4 : front ? (flip ? x - 21 : x + 21) : x, ly = side ? y + 21 : front ? y + 3 : y - 12;
    return `${beam}<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">${lightShape(l)}</g>
      <text x="${lx.toFixed(1)}" y="${Math.min(Math.max(ly, 10), 176).toFixed(1)}" text-anchor="${side ? (s > 0 ? "end" : "start") : front ? (flip ? "end" : "start") : "middle"}">${esc(l.n)}</text>`;
  }).join("");
  return `<svg class="ldiag" viewBox="0 0 200 180" role="img" aria-label="Esquema de luz de ${esc(t.nome)} visto de cima">
    <defs><pattern id="dg" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern></defs>
    <rect width="200" height="180" fill="url(#dg)"/>
    ${hasBg ? `<path d="M22 20 H178" stroke="#6d665c" stroke-width="2"/><text x="100" y="14" text-anchor="middle" class="dim">fundo</text>` : ""}
    ${parts}
    <circle cx="${cx}" cy="${cy}" r="10" fill="#1a1715" stroke="#ff4d1c" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${cy}" r="2.2" fill="#ff4d1c"/>
    <g transform="translate(${cx} 166)"><rect x="-9" y="-5" width="18" height="11" rx="2" fill="#6d665c"/><rect x="-4" y="-9" width="8" height="5" fill="#6d665c"/></g>
  </svg>`;
}

function sphere(t) {
  const L = t.lights;
  const front = L.filter((l) => !["bg", "flag", "amb"].includes(l.t) && Math.abs(l.a) <= 110);
  const rims = L.filter((l) => !["bg", "flag", "amb", "refl"].includes(l.t) && Math.abs(l.a) > 110);
  const key = front.find((l) => l.t !== "refl") || front[0];
  const hasFill = front.length > 1 || front.some((l) => l.t === "refl");
  const dark = hasFill ? "#3a332c" : "#100e0d";
  const layers = [];
  if (key) {
    const x = 50 + Math.sin((key.a * Math.PI) / 180) * 34;
    const y = 50 - (key.el || 0) * 28;
    const col = key.c || "#fff6ea";
    layers.push(HARD.includes(key.t)
      ? `radial-gradient(circle at ${x}% ${y}%, ${col} 0%, #e6dccd 16%, #8b8173 34%, ${dark} 52%)`
      : `radial-gradient(circle at ${x}% ${y}%, ${col} 0%, #cfc4b4 22%, #6f665b 48%, ${dark} 80%)`);
    front.filter((l) => l !== key).forEach((l) => {
      const fx = 50 + Math.sin((l.a * Math.PI) / 180) * 34, fy = 50 - (l.el || 0) * 28;
      const c = l.c || "#fff6ea";
      const a = l.t === "refl" ? "40" : "b0";
      layers.unshift(`radial-gradient(circle at ${fx}% ${fy}%, ${c}${a} 0%, transparent 55%)`);
    });
  } else {
    layers.push(`radial-gradient(circle at 50% 50%, #1a1715 0%, #0b0a09 100%)`);
  }
  const shadows = rims.map((l) => {
    const s = Math.sin((l.a * Math.PI) / 180);
    const c = l.c || (l.t === "sun" ? "#ffcf86" : "#fff3e2");
    if (Math.abs(s) < .2) return `inset 0 0 6px 2px ${c}cc`;
    return `inset ${(-s * 7).toFixed(1)}px ${((l.el || 0) * 4 + 1).toFixed(1)}px 5px -1px ${c}`;
  });
  if (key && HARD.includes(key.t)) {
    const s = Math.sin((key.a * Math.PI) / 180);
    shadows.push(`${(-s * 16).toFixed(1)}px 12px 2px rgba(0,0,0,.45)`);
  } else shadows.push("0 14px 24px -8px rgba(0,0,0,.6)");
  // fundo
  const bgs = {
    black: "#0a0909", dark: "radial-gradient(circle at 50% 40%, #2a2420, #0d0c0b 75%)",
    white: "#f1ece4", light: "linear-gradient(160deg,#dcd4c7,#b9b0a2)",
    grad: "radial-gradient(circle at 50% 42%, #6b5b4c, #1a1614 70%)",
    warm: "linear-gradient(180deg,#f3b25a,#b4552b 70%,#3b1f16)",
    night: "radial-gradient(circle at 30% 30%, #ff4d1c55, transparent 40%), radial-gradient(circle at 75% 60%, #2fd3ff44, transparent 45%), #0c0b12",
    color: t.bgc || "#c9a27a",
    gel: `radial-gradient(circle at 50% 42%, ${t.bgc || "#ff4d1c"}, #2a120b 78%)`,
  };
  const trails = t.bg === "night" ? `<div class="trails"></div>` : "";
  return `<div class="stage-bg" style="background:${bgs[t.bg] || bgs.grad}">
    ${trails}
    <div class="ball" style="background:${layers.join(",")};box-shadow:${shadows.join(",")}"></div>
    ${t.bg === "black" && t.lights.some(l => l.a === 0 && l.el === 1) ? `<div class="ball refl" style="background:${layers.join(",")}"></div>` : ""}
  </div>`;
}

/* Miniaturas de composição */
function compSVG(k) {
  const fg = "#efe9dd", ac = "#ff4d1c", dim = "#6d665c";
  const frame = `<rect x="1" y="1" width="238" height="158" fill="none" stroke="${dim}" stroke-width="1"/>`;
  const map = {
    thirds: `<g stroke="${dim}" stroke-dasharray="3 3"><line x1="80" y1="0" x2="80" y2="160"/><line x1="160" y1="0" x2="160" y2="160"/><line x1="0" y1="53" x2="240" y2="53"/><line x1="0" y1="107" x2="240" y2="107"/></g>
      <circle cx="160" cy="53" r="14" fill="${ac}"/><rect x="146" y="70" width="28" height="90" rx="12" fill="${fg}"/><circle cx="80" cy="53" r="3" fill="${dim}"/><circle cx="80" cy="107" r="3" fill="${dim}"/><circle cx="160" cy="107" r="3" fill="${dim}"/>`,
    negative: `<rect x="20" y="42" width="110" height="14" fill="${fg}"/><rect x="20" y="64" width="80" height="14" fill="${fg}"/><rect x="20" y="96" width="60" height="6" fill="${dim}"/><rect x="20" y="108" width="70" height="6" fill="${dim}"/>
      <rect x="170" y="44" width="34" height="96" rx="6" fill="${ac}"/><rect x="178" y="30" width="18" height="16" rx="2" fill="${ac}"/><text x="20" y="32" class="ct">TÍTULO</text>`,
    sym: `<line x1="120" y1="0" x2="120" y2="160" stroke="${dim}" stroke-dasharray="3 3"/><rect x="30" y="30" width="30" height="130" fill="${dim}"/><rect x="180" y="30" width="30" height="130" fill="${dim}"/>
      <path d="M60 30 Q120 -10 180 30" fill="none" stroke="${dim}" stroke-width="3"/><rect x="100" y="70" width="40" height="80" rx="8" fill="${ac}"/><rect x="110" y="56" width="20" height="16" fill="${ac}"/>`,
    low: `<g stroke="${dim}"><line x1="0" y1="160" x2="100" y2="0"/><line x1="240" y1="160" x2="140" y2="0"/></g>
      <path d="M92 160 L104 30 L136 30 L148 160 Z" fill="${fg}"/><circle cx="120" cy="22" r="13" fill="${ac}"/><path d="M120 150 v-30 m-6 6 l6-6 l6 6" stroke="${ac}" fill="none" stroke-width="2"/>`,
    top: [0,1,2,3].map(i=>[0,1,2].map(j=>{const x=40+i*52,y=28+j*48; return (i+j)%3===0?`<circle cx="${x}" cy="${y}" r="15" fill="${(i===1&&j===1)?ac:fg}"/>`:`<rect x="${x-14}" y="${y-14}" width="28" height="28" fill="${(i===2&&j===0)?ac:dim}"/>`}).join("")).join(""),
    macro: `<circle cx="180" cy="120" r="150" fill="${dim}"/><g stroke="${fg}" stroke-opacity=".5">${Array.from({length:14},(_, i)=>`<circle cx="180" cy="120" r="${20+i*10}" fill="none"/>`).join("")}</g><circle cx="120" cy="70" r="5" fill="${ac}"/><circle cx="120" cy="70" r="16" fill="none" stroke="${ac}"/>`,
    frame: `<path fill-rule="evenodd" d="M0 0H240V160H0Z M70 24H170V160H70Z" fill="#0b0a09"/><rect x="70" y="24" width="100" height="136" fill="${dim}" opacity=".35"/><circle cx="120" cy="72" r="10" fill="${ac}"/><rect x="109" y="84" width="22" height="50" rx="9" fill="${fg}"/>`,
    lines: `<g stroke="${fg}" stroke-opacity=".7">${[-200,-80,0,80,200,320,440].map(x=>`<line x1="${x}" y1="160" x2="120" y2="62"/>`).join("")}<line x1="0" y1="62" x2="240" y2="62"/></g><circle cx="120" cy="56" r="7" fill="${ac}"/>`,
  };
  return `<svg class="csvg" viewBox="0 0 240 160" role="img" aria-label="Esquema de composição">${map[k] || ""}${frame}</svg>`;
}

/* =========================================================
   TÉCNICAS
   ========================================================= */
let techCat = "produto";
function renderTechTabs() {
  $("#techTabs").innerHTML = Object.entries(TECH_CATS).map(([k, v], i) =>
    `<button class="tab ${k === techCat ? "act" : ""}" data-tcat="${k}" role="tab" aria-selected="${k === techCat}"><em>0${i + 1}</em>${v}<sup>${TECHS.filter(t => t.cat === k).length}</sup></button>`).join("");
}
function renderTechs() {
  const list = TECHS.filter((t) => t.cat === techCat);
  $("#techGrid").innerHTML = list.map((t) => `
    <article class="tcard">
      <div class="tvis ${t.comp ? "comp" : ""}">
        ${t.comp ? compSVG(t.comp) : `${sphere(t)}${lightDiagram(t)}`}
      </div>
      <div class="tbody">
        <div class="mmeta"><span>${t.id}</span><span>${TECH_CATS[t.cat]}</span></div>
        <h3>${esc(t.nome)}</h3>
        <p class="uso">${esc(t.quando)}</p>
        <ol class="steps">${t.passos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
        <p class="tip"><b>Dica de set</b>${esc(t.dica)}</p>
        <pre class="prompt">${esc(t.prompt)}</pre>
        <div class="actions">
          <button class="btn sm solid" data-copy-tech="${t.id}">Copiar prompt</button>
          <button class="btn sm ghost" data-build-tech="${t.id}">Construtor →</button>
        </div>
      </div>
    </article>`).join("");
}

/* =========================================================
   CONSTRUTOR DE PROMPT
   ========================================================= */
let mode = "video";
function fillSelects() {
  const byCat = (cats, arr, label) => Object.entries(cats).map(([k, v]) =>
    `<optgroup label="${v}">${arr.filter((x) => x.cat === k).map((x) => `<option value="${x.id}">${x.id} · ${esc(label(x))}</option>`).join("")}</optgroup>`).join("");
  $("#bMove").innerHTML = byCat(MOVE_CATS, MOVES, (m) => m.pt);
  $("#bLight").innerHTML = `<option value="">— sem técnica específica —</option>` +
    byCat({ produto: TECH_CATS.produto, editorial: TECH_CATS.editorial }, TECHS, (t) => t.nome);
  $("#bComp").innerHTML = `<option value="">— livre —</option>` +
    TECHS.filter((t) => t.cat === "composicao").map((t) => `<option value="${t.id}">${esc(t.nome)}</option>`).join("");
  $("#bMove").value = "08";
}
function buildPrompt() {
  const v = (id) => $(id).value.trim();
  const s = v("#bSubj") || "[subject]", l = v("#bLoc"), a = v("#bAct"), md = v("#bMood");
  const ar = $("input[name=ar]:checked").value;
  const mv = MOVES.find((m) => m.id === $("#bMove").value);
  const lt = TECHS.find((t) => t.id === $("#bLight").value);
  const cp = TECHS.find((t) => t.id === $("#bComp").value);
  let out;
  if (mode === "video") {
    out = `${cap(s)}${l ? " " + l : ""}${a ? ", " + a : ""}.\n\nCamera: ${mv.en}`;
    if (lt) out += `\n\nLighting: ${lt.light}.`;
    if (cp) out += `\n\nComposition: ${cp.light}.`;
    if (md) out += `\n\nMood: ${md}.`;
    out += `\n\nCinematic commercial film look, natural motion, no text, no watermark. Aspect ratio ${ar}.`;
  } else {
    out = `Advertising photograph of ${s}${l ? " " + l : ""}${a ? ", " + a : ""}.`;
    if (lt) out += ` Lighting: ${lt.light}.`;
    if (cp) out += ` Composition: ${cp.light}.`;
    if (md) out += ` Mood: ${md}.`;
    out += ` Shot on a medium-format camera, tack-sharp focus, true-to-life colors, high-end retouching, no text, no watermark. Aspect ratio ${ar}.`;
  }
  $("#bOut").textContent = out;
  $("#bMoveRow").style.display = mode === "video" ? "" : "none";
  const pm = $("#bPreview");
  if (mode === "video" && pm.dataset.p !== mv.p) {
    pm.dataset.p = mv.p;
    pm.innerHTML = shotHTML(mv);
    observe(pm);
  }
  pm.style.display = mode === "video" ? "" : "none";
  $("#bLabel").textContent = mode === "video" ? `${mv.id} · ${mv.pt}` : "Prompt de imagem";
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function goBuilder() {
  $("#construtor").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================================================
   CONTATO
   ========================================================= */
function wa(msg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}
function applyConfig() {
  $$("[data-cfg]").forEach((el) => (el.textContent = CONFIG[el.dataset.cfg]));
  const base = `Olá, ${CONFIG.nome}! Vi a biblioteca de movimentos e quero um orçamento de produção.`;
  $$("[data-wa]").forEach((a) => (a.href = wa(a.dataset.wa || base)));
  $$("[data-ig]").forEach((a) => (a.href = `https://instagram.com/${CONFIG.instagram}`));
  $$("[data-mail]").forEach((a) => (a.href = `mailto:${CONFIG.email}`));
  $("#year").textContent = new Date().getFullYear();
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  $("#statMoves").textContent = MOVES.length;
  $("#statTechs").textContent = TECHS.length;
  $("#ticker").innerHTML = (() => {
    const names = [...MOVES.map((m) => m.pt), ...TECHS.map((t) => t.nome)];
    const row = names.map((n) => `<span>${esc(n)}</span>`).join("<i>✦</i>");
    return `<div>${row}<i>✦</i>${row}<i>✦</i></div>`;
  })();

  heroNext();
  timecode();
  renderMoveFilters();
  renderMoves();
  renderTechTabs();
  renderTechs();
  fillSelects();
  buildPrompt();

  $("#moveFilters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    moveCat = b.dataset.cat;
    renderMoveFilters();
    renderMoves();
  });
  $("#moveSearch").addEventListener("input", (e) => { moveQuery = e.target.value; renderMoves(); });
  $("#techTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tcat]");
    if (!b) return;
    techCat = b.dataset.tcat;
    renderTechTabs();
    renderTechs();
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.copyMove) copy(MOVES.find((m) => m.id === t.dataset.copyMove).en);
    if (t.dataset.copyTech) copy(TECHS.find((x) => x.id === t.dataset.copyTech).prompt);
    if (t.dataset.buildMove) {
      mode = "video"; syncMode();
      $("#bMove").value = t.dataset.buildMove; buildPrompt(); goBuilder();
    }
    if (t.dataset.buildTech) {
      const tech = TECHS.find((x) => x.id === t.dataset.buildTech);
      if (tech.cat === "composicao") $("#bComp").value = tech.id; else $("#bLight").value = tech.id;
      buildPrompt(); goBuilder();
    }
  });
  // expandir prompt
  document.addEventListener("click", (e) => {
    const pre = e.target.closest("pre.prompt");
    if (pre) pre.classList.toggle("open");
  });

  $("#builder").addEventListener("input", buildPrompt);
  $("#builder").addEventListener("change", buildPrompt);
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.mode; syncMode(); buildPrompt(); }));
  function syncMode() { $$("[data-mode]").forEach((b) => b.classList.toggle("act", b.dataset.mode === mode)); }

  $("#bCopy").addEventListener("click", () => copy($("#bOut").textContent));
  $("#bRandom").addEventListener("click", () => {
    const ex = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    $("#bSubj").value = ex.s; $("#bLoc").value = ex.l; $("#bAct").value = ex.a; $("#bMood").value = ex.m;
    $("#bMove").value = MOVES[Math.floor(Math.random() * MOVES.length)].id;
    const lights = TECHS.filter((t) => t.cat !== "composicao");
    $("#bLight").value = lights[Math.floor(Math.random() * lights.length)].id;
    buildPrompt();
  });
  $("#bClear").addEventListener("click", () => {
    ["#bSubj", "#bLoc", "#bAct", "#bMood"].forEach((id) => ($(id).value = ""));
    $("#bLight").value = ""; $("#bComp").value = "";
    buildPrompt();
  });
  $("#bQuote").addEventListener("click", (e) => {
    e.currentTarget.href = wa(`Olá, ${CONFIG.nome}! Montei esta referência no seu site e quero produzir de verdade:\n\n${$("#bOut").textContent}`);
  });

  // revelar seções ao rolar
  const rv = new IntersectionObserver((es) => es.forEach((x) => x.isIntersecting && x.target.classList.add("in")), { threshold: 0, rootMargin: "0px 0px -12% 0px" });
  $$(".reveal").forEach((el) => rv.observe(el));
});
