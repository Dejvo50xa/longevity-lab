import { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { UI, CS, BIOUI } from "./content-cs.js";
import { Analytics } from '@vercel/analytics/react';

var LangCtx = createContext("cs");
function useUI() { var l = useContext(LangCtx); return { lang: l, U: UI[l], cs: l === "cs" }; }
import Avatar2D from "./Avatar2D.jsx";
import { DEFAULT_INPUTS, calcLifespan, r1, sanitizeInputs } from "./model.js";

/* ═══════════════════════════════════════════════════════════════
   LONGEVITY LAB v5 — Lifelike Avatar + A4 Deep-Dives
   Zero deps beyond React. Drop into Vite --template react.
   ═══════════════════════════════════════════════════════════════ */

var T = {
  bg: "#F5F8FA", bgAlt: "#EDF2F7", glass: "rgba(255,255,255,0.72)",
  glassBorder: "rgba(140,170,200,0.22)", glassBorderHover: "rgba(100,150,200,0.35)",
  deep: "#0C2D48", mid: "#1B4965", accent: "#296DA0", accentSoft: "#5FA8D3",
  ice: "#C5DFF0", faint: "#E8F1F8", aurora: "#1B7D58", auroraLight: "#5CC9A0",
  warm: "#C2412E", warmLight: "#E89B4C", text: "#1A3A52", sub: "#4A6F87",
  dim: "#4F7085", white: "#FFFFFF",
  shadow: "0 8px 32px rgba(12,45,72,0.07), 0 1.5px 4px rgba(12,45,72,0.04)",
  shadowLg: "0 20px 60px rgba(12,45,72,0.10), 0 2px 8px rgba(12,45,72,0.05)",
  mono: "'SF Mono','JetBrains Mono','Fira Code',monospace",
  sans: "'DM Sans',-apple-system,'Segoe UI',sans-serif",
  blur: "blur(24px)", blurLight: "blur(14px)", radius: 18, radiusSm: 12,
};

/* ════════════════════════ DEEP-DIVE CONTENT ════════════════════════ */
// Deep-dive articles live in details-en.js / details-cs.js and are loaded when a pillar is opened.
var PILLAR_COLOR = {"exercise": "#3B8CC4", "nutrition": "#2E8B6A", "social": "#1B4965", "sleep": "#6BA3C7", "sauna": "#5CC9A0", "cold": "#8AC4D0", "supplements": "#89CFF0"};

/* ══════════════ PILLAR CARD DATA ══════════════ */
var PILLARS = [
  { id: "exercise", icon: "\u{1F3CB}\uFE0F", title: "Exercise", dose: "150+ min/wk moderate or 75 min vigorous", minY: 3.4, maxY: 4.5, study: "Moore et al., PLOS Medicine 2012", desc: "150–299 minutes of brisk walking a week was associated with 3.4 more years of life after 40; the most active group gained 4.5.", insight: "Even 15 min a day was linked to 3 extra years (Wen et al., Lancet 2011)", url: "https://doi.org/10.1371/journal.pmed.1001335", est: false },
  { id: "nutrition", icon: "\u{1F96C}", title: "Nutrition", dose: "Plant-rich, Mediterranean-style", minY: 10, maxY: 13, study: "Fadnes et al., PLOS Medicine 2022", desc: "A modelling study estimates that switching from a typical Western diet to an optimised one at age 20 adds 10.7 years for women and 13.0 for men.", insight: "Biggest estimated gain — and it shrinks the later you start", url: "https://doi.org/10.1371/journal.pmed.1003889", est: false },
  { id: "social", icon: "\u{1F91D}", title: "Social Connection", dose: "Strong relationships and community", minY: 3, maxY: 7, study: "Holt-Lunstad et al., PLOS Medicine 2010", desc: "Across 148 studies, people with stronger social relationships had a 50% higher likelihood of survival — an effect the authors call comparable with quitting smoking.", insight: "An effect comparable with quitting smoking", url: "https://doi.org/10.1371/journal.pmed.1000316", est: true },
  { id: "sleep", icon: "\u{1F319}", title: "Sleep Regularity", dose: "7\u20138 hrs with consistent timing", minY: 2, maxY: 5, study: "Windred et al., SLEEP 2024", desc: "In 60,977 UK adults, the most regular sleepers had a 20–48% lower risk of death than the least regular. Regularity predicted mortality better than sleep duration.", insight: "Regularity predicted risk better than duration", url: "https://doi.org/10.1093/sleep/zsad253", est: true },
  { id: "sauna", icon: "\u{1F9D6}", title: "Sauna Bathing", dose: "4\u20137 sessions per week, 15\u201320 min", minY: 2, maxY: 3, study: "Laukkanen et al., JAMA Internal Med 2015", desc: "In 2,315 middle-aged Finnish men, 4–7 sauna sessions a week was associated with 50% lower cardiovascular mortality and 40% lower all-cause mortality than one session.", insight: "An association in one Finnish cohort, not proof of cause", url: "https://doi.org/10.1001/jamainternmed.2014.8187", est: true },
  { id: "cold", icon: "\u2744\uFE0F", title: "Cold Exposure", dose: "Cold showers, ice baths, winter swimming", minY: 1, maxY: 2, study: "\u0160r\u00e1mek et al., Eur J Appl Physiol 2000", desc: "One hour in 14 °C water raised noradrenaline by 530% and metabolic rate by 350% in a small study of young men. No study yet shows that cold exposure adds years of life.", insight: "Strong short-term response; long-term benefit unproven", url: "https://doi.org/10.1007/s004210050065", est: true },
  { id: "supplements", icon: "\u{1F48A}", title: "Supplements", dose: "D3, Omega-3, Magnesium (evidence-based)", minY: 0.5, maxY: 2, study: "Manson et al., VITAL Trial, NEJM 2019", desc: "In the VITAL trial (25,871 adults), omega-3 did not lower major cardiovascular events overall; heart attacks, a secondary outcome, were 28% lower.", insight: "Target real deficiencies, skip the hype", url: "https://doi.org/10.1056/NEJMoa1811403", est: true },
];

/* ══════════════ HOOKS ══════════════ */
function useReveal(threshold) {
  if (threshold === undefined) threshold = 0.15;
  var ref = useRef(null);
  var [vis, setVis] = useState(false);
  useEffect(function () {
    var el = ref.current; if (!el) return;
    var obs = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: threshold });
    obs.observe(el); return function () { obs.disconnect(); };
  }, [threshold]);
  return [ref, vis];
}

function useAnim(value, dec, dur) {
  if (dec === undefined) dec = 1; if (dur === undefined) dur = 700;
  var [d, setD] = useState(value);
  var raf = useRef(null); var prev = useRef(value);
  useEffect(function () {
    var from = prev.current, to = value, start = performance.now();
    function tick(now) { var t = Math.min((now - start) / dur, 1); setD(from + (to - from) * (1 - Math.pow(1 - t, 3))); if (t < 1) raf.current = requestAnimationFrame(tick); }
    raf.current = requestAnimationFrame(tick); prev.current = to;
    return function () { cancelAnimationFrame(raf.current); };
  }, [value, dur]);
  return d.toFixed(dec);
}

/* ══════════════ FROST PARTICLES ══════════════ */
function FrostParticles() {
  var ref = useRef(null);
  useEffect(function () {
    var c = ref.current, ctx = c.getContext("2d"), w, h;
    function resize() { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; }
    resize();
    var dots = Array.from({ length: 45 }, function () { return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 0.5, vy: Math.random() * 0.18 + 0.05, vx: (Math.random() - 0.5) * 0.12, o: Math.random() * 0.2 + 0.05 }; });
    var raf;
    function draw() { ctx.clearRect(0, 0, w, h); for (var i = 0; i < dots.length; i++) { var d = dots[i]; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(180,215,240," + d.o + ")"; ctx.fill(); d.y += d.vy; d.x += d.vx; if (d.y > h) { d.y = -4; d.x = Math.random() * w; } if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; } raf = requestAnimationFrame(draw); }
    draw(); window.addEventListener("resize", resize);
    return function () { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", width: "100%", height: "100%" }} />;
}

/* ══════════════ GAUGE ══════════════ */
function Gauge({ value, max }) {
  var u = useUI();
  if (max === undefined) max = 120;
  var dv = useAnim(value); var pct = Math.min(value / max, 1);
  var r = 86, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" style={{ width: 200, height: 200, display: "block", margin: "0 auto" }}>
      <defs><linearGradient id="gG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.accent} /><stop offset="100%" stopColor={T.aurora} /></linearGradient></defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.glassBorder} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#gG)" strokeWidth={8} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" transform={"rotate(-90 " + cx + " " + cy + ")"} style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={T.deep} fontFamily={T.mono} fontWeight="700" fontSize="34">{dv}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={T.sub} fontFamily={T.sans} fontSize="11" fontWeight="500">{u.U.calc.gaugeUnit}</text>
    </svg>
  );
}

/* ══════════════ BARS ══════════════ */
function Bars({ factors }) {
  var u = useUI();
  var mx = Math.max.apply(null, factors.map(function (f) { return Math.abs(f.years); }).concat([0.1]));
  return (<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{factors.map(function (f) { return (
    <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 76, textAlign: "right", fontSize: 11, color: T.sub, fontFamily: T.sans, fontWeight: 500 }}>{u.cs && CS.factors[f.key] ? CS.factors[f.key] : f.label}</span>
      <div style={{ flex: 1, height: 13, background: T.faint, borderRadius: 7, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: f.years >= 0 ? "50%" : undefined, right: f.years < 0 ? "50%" : undefined, width: (Math.abs(f.years) / mx) * 50 + "%", height: "100%", background: f.years >= 0 ? f.color : T.warm, borderRadius: 7, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ width: 48, fontSize: 11, fontWeight: 700, fontFamily: T.mono, color: f.years >= 0 ? T.deep : T.warm, textAlign: "right" }}>{f.years >= 0 ? "+" : ""}{f.years.toFixed(1)}y</span>
    </div>); })}</div>);
}

/* ══════════════ SLIDER ══════════════ */
function Sl({ min, max, step, value, onChange, label, dv }) {
  if (min === undefined) min = 0; if (max === undefined) max = 10; if (step === undefined) step = 1;
  var pct = ((value - min) / (max - min)) * 100;
  return (<div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.sans }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: T.accent, fontFamily: T.mono, minWidth: 56, textAlign: "right" }}>{dv !== undefined ? dv : value}</span>
    </div>
    <input type="range" aria-label={label} aria-valuetext={String(dv !== undefined ? dv : value)} min={min} max={max} step={step} value={value} onChange={function (e) { onChange(Number(e.target.value)); }} style={{ width: "100%", height: 5, appearance: "none", WebkitAppearance: "none", borderRadius: 99, outline: "none", cursor: "pointer", background: "linear-gradient(to right," + T.accent + " 0%," + T.accent + " " + pct + "%," + T.faint + " " + pct + "%," + T.faint + " 100%)" }} />
  </div>);
}

/* ══════════════ PILLAR CARD ══════════════ */
function PillarCard({ p, index, onOpen }) {
  var u = useUI();
  var o = (u.cs && CS.pillars[p.id]) || {};
  var [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} {...pressable(function () { onOpen(p.id); })} style={{ padding: "24px 22px", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, cursor: "pointer", transition: "all 0.4s cubic-bezier(.4,0,.2,1) " + (index * 0.05) + "s, transform 0.2s ease", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", position: "relative", overflow: "hidden" }}
      onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = T.shadowLg; e.currentTarget.style.borderColor = T.glassBorderHover; }}
      onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderColor = T.glassBorder; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{p.icon}</span>
        <div style={{ fontFamily: T.mono, fontSize: 17, fontWeight: 700, color: T.aurora }}>+{p.minY}&ndash;{p.maxY}<span style={{ fontSize: 10, fontWeight: 500, color: T.sub, marginLeft: 2 }}>{u.U.yrs}</span><span style={{ display: "block", fontFamily: T.sans, fontSize: 10, fontWeight: 500, color: T.sub, textAlign: "right", marginTop: 2 }}>{p.est ? (u.cs ? "odhad webu" : "site estimate") : (u.cs ? "ze studie" : "from the study")}</span></div>
      </div>
      <h3 style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: T.deep, marginBottom: 2, letterSpacing: -0.3 }}>{o.title || p.title}</h3>
      <div style={{ fontSize: 11, color: T.accent, fontFamily: T.mono, marginBottom: 10, letterSpacing: -0.2 }}>{o.dose || p.dose}</div>
      <p style={{ fontSize: 12.5, lineHeight: 1.7, color: T.sub, marginBottom: 14 }}>{o.desc || p.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "rgba(43,168,125,0.06)", border: "1px solid rgba(43,168,125,0.12)" }}>
        <span style={{ fontSize: 12 }}>{"\u{1F4A1}"}</span>
        <span style={{ fontSize: 11, color: T.aurora, fontWeight: 600 }}>{o.insight || p.insight}</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9.5, color: T.dim, fontFamily: T.mono }}>{o.study || p.study}</span>
        <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>{u.U.learnMore}</span>
      </div>
    </div>
  );
}

/* ══════════════ DETAIL MODAL (scrollable overlay window) ══════════════ */
/* ══════════════ DIALOG BEHAVIOUR ══════════════ */
// Shared by both modals: locks page scroll, closes on Escape, moves focus into the
// dialog, keeps Tab inside it and returns focus to the card that opened it.
function useDialog(onClose) {
  var panelRef = useRef(null), closeRef = useRef(null), closeFn = useRef(onClose);
  closeFn.current = onClose;
  useEffect(function () {
    var opener = document.activeElement;
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    function onKey(e) {
      if (e.key === "Escape") { closeFn.current(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      var f = panelRef.current.querySelectorAll("button,a[href],input,[tabindex]:not([tabindex='-1'])");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return function () {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (opener && opener.focus) opener.focus();
    };
  }, []);
  return { panelRef: panelRef, closeRef: closeRef };
}

// Makes a non-button element (a card) work like a button for keyboard and screen readers.
function pressable(fn, label) {
  return {
    role: "button", tabIndex: 0, "aria-haspopup": "dialog", "aria-label": label, onClick: fn,
    onKeyDown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } },
  };
}

// Deep-dive bodies are stored as one long string; show them as short paragraphs (wording unchanged).
function paragraphs(text) {
  // sentence end = . ! ? followed by a space and a capital letter, unless the dot belongs to an abbreviation or a number
  var parts = text.split(/(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])/);
  var sentences = [];
  parts.forEach(function (p) {
    var prev = sentences[sentences.length - 1];
    if (prev && /(\bal|\be\.g|\bi\.e|\bvs|\bcca|\bnapř|\btzv|\btj|\bkol|\bDr|\bSt|\bapprox|\d)\.$/.test(prev)) sentences[sentences.length - 1] = prev + " " + p;
    else sentences.push(p);
  });
  // a few sentences are long semicolon-separated lists: break those at the semicolons
  var pieces = [];
  sentences.forEach(function (sn) {
    if (sn.length <= 700) { pieces.push(sn); return; }
    sn.split(/(?<=;)\s+/).forEach(function (part) { pieces.push(part); });
  });
  sentences = pieces;
  var out = [], cur = "";
  sentences.forEach(function (sn) {
    if (cur && (cur.length + sn.length > 520)) { out.push(cur); cur = sn; } else cur = cur ? cur + " " + sn : sn;
  });
  if (cur) out.push(cur);
  return out;
}

function DetailModal({ pillarId, onClose }) {
  var u = useUI();
  var color = PILLAR_COLOR[pillarId];
  var [loaded, setLoaded] = useState(null);
  var key = u.lang + ":" + pillarId;
  useEffect(function () {
    var alive = true;
    (u.cs ? import("./details-cs.js") : import("./details-en.js"))
      .then(function (m) { if (alive) setLoaded({ key: key, detail: m.default[pillarId] }); })
      .catch(function () { if (alive) setLoaded({ key: key, detail: null, failed: true }); });
    return function () { alive = false; };
  }, [key, u.cs, pillarId]);
  var cur = loaded && loaded.key === key ? loaded : null;
  var data = cur && cur.detail;
  var secs = data ? data.sections : [];
  var title = data ? data.title : ((u.cs && CS.pillars[pillarId] && CS.pillars[pillarId].title) || (PILLARS.filter(function (p) { return p.id === pillarId; })[0] || {}).title);
  var study = PILLARS.filter(function (p) { return p.id === pillarId; })[0];
  var dlg = useDialog(onClose);
  if (!color) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,45,72,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <div ref={dlg.panelRef} role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", textAlign: "left", background: T.white, borderRadius: 22, maxWidth: 720, width: "100%", maxHeight: "88vh", overflow: "auto", boxShadow: "0 40px 100px rgba(12,45,72,0.25), 0 0 0 1px rgba(140,170,200,0.15)", padding: 0 }}>
        {/* header */}
        <div style={{ padding: "28px 36px 20px", borderBottom: "1px solid " + T.glassBorder, position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "22px 22px 0 0", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "color-mix(in srgb, " + color + " 35%, " + T.deep + ")", marginBottom: 4 }}>{u.U.modal.deepDive}</div>
              <h2 id="detail-title" style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 700, color: T.deep, letterSpacing: -0.5 }}>{title}</h2>
              {study && <a href={study.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 12.5, fontWeight: 600, color: T.accent }}>{u.cs ? "Hlavní studie: " : "Main study: "}{(u.cs && CS.pillars[pillarId] && CS.pillars[pillarId].study) || study.study} ↗</a>}
            </div>
            <button ref={dlg.closeRef} type="button" aria-label={u.cs ? "Zavřít" : "Close"} onClick={onClose} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid " + T.glassBorder, background: T.faint, cursor: "pointer", fontSize: 20, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 }}>&times;</button>
          </div>
        </div>
        {/* sections */}
        <div style={{ padding: "28px 36px 40px" }} aria-live="polite" aria-busy={!cur}>
          {!cur && <p style={{ fontSize: 14.5, color: T.sub }}>{u.cs ? "Načítám rozbor…" : "Loading the deep dive…"}</p>}
          {cur && cur.failed && <p style={{ fontSize: 14.5, color: T.warm }}>{u.cs ? "Rozbor se nepodařilo načíst. Zkontroluj připojení a zkus to znovu." : "The deep dive could not be loaded. Check your connection and try again."}</p>}
          {secs.map(function (sec, i) {
            return (
              <div key={i} style={{ marginBottom: i < secs.length - 1 ? 36 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 32, borderRadius: 3, background: color, flexShrink: 0 }} />
                  <h3 style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.deep, letterSpacing: -0.3 }}>{sec.heading}</h3>
                </div>
                {paragraphs(sec.body).map(function (para, k) { return <p key={k} style={{ fontSize: 14.5, lineHeight: 1.8, color: T.sub, paddingLeft: 17, marginBottom: 14, maxWidth: "68ch" }}>{para}</p>; })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ EVIDENCE ══════════════ */
var EVIDENCE = [
  { year: "2022", title: "Estimating impact of food choices on life expectancy", a: "Fadnes et al.", j: "PLOS Medicine", f: "Model: +10.7 (women) / +13.0 (men) yrs from age 20", url: "https://doi.org/10.1371/journal.pmed.1003889" },
  { year: "2015", title: "Sauna bathing and fatal cardiovascular events", a: "Laukkanen et al.", j: "JAMA Internal Medicine", f: "4\u20137x/wk: 50% lower CVD mortality (Finnish men)", url: "https://doi.org/10.1001/jamainternmed.2014.8187" },
  { year: "2012", title: "Leisure time physical activity and mortality", a: "Moore et al.", j: "PLOS Medicine", f: "+3.4 yrs at 150\u2013299 min/wk, up to +4.5", url: "https://doi.org/10.1371/journal.pmed.1001335" },
  { year: "2024", title: "Sleep regularity and all-cause mortality", a: "Windred et al.", j: "SLEEP", f: "Most regular sleepers: 20\u201348% lower death risk", url: "https://doi.org/10.1093/sleep/zsad253" },
  { year: "2010", title: "Social relationships and mortality risk", a: "Holt-Lunstad et al.", j: "PLOS Medicine", f: "Stronger ties: 50% higher likelihood of survival", url: "https://doi.org/10.1371/journal.pmed.1000316" },
  { year: "2019", title: "Vitamin D and Omega-3 supplementation", a: "Manson et al.", j: "New England J of Medicine", f: "No drop in major events; 28% fewer heart attacks", url: "https://doi.org/10.1056/NEJMoa1811403" },
  { year: "2011", title: "Minimum amount of physical activity for reduced mortality", a: "Wen et al.", j: "The Lancet", f: "15 min/day: 14% lower mortality, +3 yrs", url: "https://doi.org/10.1016/S0140-6736(11)60749-6" },
  { year: "2000", title: "Human physiological responses to immersion into water of different temperatures", a: "\u0160r\u00e1mek et al.", j: "Eur J Appl Physiol", f: "14 \u00b0C water: noradrenaline +530%", url: "https://doi.org/10.1007/s004210050065" },
];

var LBL = { intensity: ["", "Light walk", "", "", "Moderate", "", "", "Vigorous", "", "", "Elite"], cold: ["None", "", "Occasional", "", "", "Regular", "", "", "", "", "Daily"], diet: ["Fast food", "", "", "", "Average", "", "", "", "Plant-rich", "", "Optimal"], sleep: ["Chaotic", "", "", "", "Irregular", "", "", "", "Consistent", "", "Perfect"], supps: ["None", "", "", "Basics", "", "", "", "Targeted", "", "", "Optimised"], social: ["Isolated", "", "", "", "Some", "", "", "", "Strong", "", "Thriving"], smoking: ["Never", "Former", "Current"], alcohol: ["None", "", "", "Light", "", "Moderate", "", "", "Heavy", "", "Excessive"] };
function lb(a, v) { return a[v] || String(v); }

/* ══════════════ NEW KNOWLEDGE CONTENT ══════════════ */
var WHY_STATS = [
  { pre: "~", n: 10, suf: " yrs", l: "average gap between lifespan and healthspan — years lived in poor health" },
  { pre: "", n: 80, suf: "%", l: "of premature heart disease and type 2 diabetes is preventable (WHO)" },
  { pre: "20–", n: 30, suf: "%", l: "of longevity is genetic — the rest is built by daily habits" },
];

var SOLUTION_CARDS = [
  { icon: "\u{1F52C}", title: "Learn the science", body: "Seven pillars, each grounded in large studies and meta-analyses (the social-connection one alone pooled 148 studies and 308,849 people). Click any pillar for a molecular-level deep dive — no hype, no anecdotes.", link: "#pillars", cta: "Explore the pillars →" },
  { icon: "\u{1F9CD}", title: "See yourself in 3D", body: "Your personal avatar reacts to every habit in real time — body composition, posture, vitality — and estimates your biological vs. chronological age.", link: "#calculator", cta: "Meet your avatar →" },
  { icon: "\u{1F4C5}", title: "Act on a protocol", body: "A 30-day starter protocol turns the research into one small step per day. Built for consistency, not perfection — the only variable that matters at 10-year horizons.", link: "#protocol", cta: "Start the protocol →" },
];

var PROTOCOL = [
  { week: "Week 1", theme: "Foundation", color: "#3B8CC4", items: [
    "Fix a consistent sleep window (same bedtime and wake time, ±30 min — regularity beats duration)",
    "Walk 10 minutes daily after one meal (post-prandial glucose control starts here)",
    "Cut liquid sugar: sodas, juices, sweetened coffee drinks",
    "Book a blood panel: ApoB, HbA1c, hs-CRP, fasting insulin, vitamin D, Lp(a) — your baseline",
  ]},
  { week: "Week 2", theme: "Movement", color: "#2E8B6A", items: [
    "3 × 30 min Zone 2 cardio (you can hold a conversation; build the aerobic base first)",
    "2 × 20 min basic strength: squats, push-ups, rows — bodyweight is enough to start",
    "Set a daily protein target of ~1.6 g per kg of body weight",
    "Caffeine cutoff at 14:00 (half-life of 5–6 h protects deep sleep)",
  ]},
  { week: "Week 3", theme: "Plate & people", color: "#1B4965", items: [
    "Add one cup of legumes daily — the most consistent food across all Blue Zones",
    "Swap refined seed oils for olive oil; minimize ultra-processed foods",
    "Schedule two real social touchpoints per week (calls count, in-person counts double)",
    "Add 7–10 servings of vegetables across the day, anchored to existing meals",
  ]},
  { week: "Week 4", theme: "Consolidate", color: "#2BA87D", items: [
    "Add one weekly HIIT session: 4–6 hard intervals of 30–90 seconds",
    "Try heat or cold exposure: 2–3 sauna sessions or end showers with 30–60 s cold",
    "Review your blood panel against the optimal ranges below — pick your top 2 gaps",
    "Set 90-day targets and book a re-test. Consistency compounds from here.",
  ]},
];

var BIOMARKERS = [
  { name: "ApoB", optimal: "< 80 mg/dL", why: "Counts every atherogenic particle — a better predictor of cardiovascular risk than LDL-C alone.", freq: "Yearly",
    what: "Every particle capable of depositing cholesterol into your artery wall — LDL, VLDL, IDL, and Lp(a) — carries exactly one ApoB protein. Measuring ApoB therefore counts the actual number of artery-damaging particles, while standard LDL-C only weighs their cargo. Two people with identical LDL-C can differ two-fold in particle count, and it is the particle number that drives atherosclerosis.",
    improve: ["Replace saturated fat with olive oil, nuts, and fatty fish", "Add 10g+ of soluble fiber daily (oats, legumes, psyllium)", "Lose visceral fat — even 5% body weight moves ApoB meaningfully", "If lifestyle isn't enough, modern lipid-lowering therapy is cheap and well-studied — discuss with your physician"],
    test: "An inexpensive add-on to any standard lipid panel — you usually have to ask for it explicitly." },
  { name: "HbA1c", optimal: "< 5.4%", why: "Three-month average blood glucose. Tracks glycation — sugar damage to proteins that accelerates aging.", freq: "Yearly",
    what: "Red blood cells live about 120 days, and glucose gradually sticks to their hemoglobin in proportion to average blood sugar. HbA1c is the percentage that's been 'sugar-coated' — a 3-month moving average of glycemic control, and a direct window into glycation, the same protein-damaging process that stiffens arteries and skin with age.",
    improve: ["Walk 10–15 minutes after meals — post-prandial spikes drive the average", "Front-load protein and vegetables, eat refined carbs last", "Build muscle: it's your largest glucose disposal site", "Protect sleep — one bad night measurably worsens next-day glucose control"],
    test: "Standard panel item. Note: anemia and altitude can skew results; fasting insulin adds context." },
  { name: "hs-CRP", optimal: "< 1.0 mg/L", why: "High-sensitivity inflammation marker. Chronic low-grade inflammation drives most age-related disease.", freq: "Yearly",
    what: "C-reactive protein is produced by the liver in response to inflammatory signals (mainly IL-6). The high-sensitivity assay detects the chronic low-grade smolder — 'inflammaging' — that accelerates atherosclerosis, dementia, and frailty. Values above 3 mg/L roughly double cardiovascular risk versus values below 1.",
    improve: ["Regular Zone 2 exercise is the most reliable CRP-lowerer known", "Lose visceral fat — adipose tissue is an inflammation factory", "Fix oral health: gum disease quietly elevates CRP", "Prioritize omega-3 intake (fatty fish 2–3×/week)"],
    test: "Skip testing within 2–3 weeks of any infection, injury, or hard race — acute spikes swamp the baseline signal." },
  { name: "Fasting insulin", optimal: "< 6 mIU/L", why: "Rises years before glucose does — the earliest practical warning of insulin resistance.", freq: "Yearly",
    what: "When cells grow numb to insulin, the pancreas compensates by secreting more — keeping glucose normal while insulin quietly climbs. That compensation phase can run 10+ years before glucose ever looks abnormal, which makes fasting insulin the earliest practical alarm for metabolic disease. Combined with fasting glucose it yields HOMA-IR, a standard insulin-resistance index.",
    improve: ["Strength training — more muscle means more insulin-independent glucose uptake", "Zone 2 cardio improves insulin sensitivity for 24–48h per session", "Reduce refined carbohydrate load and liquid sugar to zero", "A 12-hour overnight eating pause is a gentle, sustainable start"],
    test: "Cheap but rarely included by default — ask for it with your annual panel." },
  { name: "VO2 max", optimal: "Top 25% for age", why: "Strongest single predictor of all-cause mortality. Low-to-high fitness cuts mortality risk up to 4-fold.", freq: "1–2×/yr",
    what: "The maximum volume of oxygen your body can transport and use per minute, integrating heart, lungs, blood, and mitochondria into one number. In the JAMA cohort of 122,000 patients, moving from the bottom to the top fitness quartile was associated with a ~4-fold mortality difference — a bigger effect than smoking, diabetes, or hypertension.",
    improve: ["Base: 3–4 weekly Zone 2 sessions of 45–60 minutes", "Sharpen: 1–2 weekly interval sessions (4×4 min hard / 3 min easy is the classic)", "Expect 10–25% improvement within 4–6 months from a low base", "Decline is ~10%/decade if untrained — but trainable at any age"],
    test: "Gold standard is a lab ramp test with a mask; good-enough estimates come from a Cooper 12-min run test or a sports watch." },
  { name: "Vitamin D", optimal: "40–60 ng/mL", why: "Hormone-like regulator of immune function and bone health. Most office workers run low.", freq: "Yearly",
    what: "Technically a steroid hormone, not a vitamin: it regulates 200+ genes involved in immune function, calcium handling, and muscle. Synthesized in skin under UVB — which is why indoor lifestyles and northern winters leave a large share of adults below 30 ng/mL.",
    improve: ["Midday sun on arms and legs, 10–20 minutes several times weekly (no burn)", "D3 supplementation 1000–2000 IU/day if tested low; take with a fat-containing meal", "Fatty fish and egg yolks contribute modestly", "Retest after 3 months — response varies several-fold between people"],
    test: "Ask for 25-hydroxyvitamin D. Mind the units: ng/mL × 2.5 = nmol/L." },
  { name: "Blood pressure", optimal: "< 120/80", why: "Each 20/10 mmHg above 115/75 roughly doubles cardiovascular mortality risk. Measure at home, rested.", freq: "Monthly",
    what: "The force your blood exerts on artery walls — and the most underrated longevity number you can measure for free. Risk scales continuously: there is no safe 'high-normal.' Office readings mislead in both directions (white-coat and masked hypertension), so home measurement is the standard of care.",
    improve: ["Sodium down, potassium up (vegetables, legumes, dairy)", "Aerobic exercise lowers systolic 5–8 mmHg — comparable to a first-line drug", "Alcohol reduction has a dose-dependent effect", "Snoring + high BP? Get screened for sleep apnea — it's a major hidden driver"],
    test: "Validated upper-arm cuff, seated, 5 minutes rest, feet flat, average of 2–3 readings, morning and evening for a week." },
  { name: "Lp(a)", optimal: "< 50 mg/dL", why: "Genetically set cholesterol particle, elevated in ~20% of people. High values warrant aggressive ApoB control.", freq: "Once in life",
    what: "An LDL-like particle with an extra protein tail that makes it both more artery-damaging and more clot-promoting. Levels are ~90% genetically determined and barely respond to lifestyle — which is exactly why everyone should measure it once: one in five people carries elevated levels, usually without knowing.",
    improve: ["Lifestyle barely moves Lp(a) itself — so lower everything around it", "Drive ApoB well below standard targets to compensate", "Be aggressive on blood pressure and never smoke", "Targeted therapies (e.g. pelacarsen) are in late-stage trials — worth following if you're elevated"],
    test: "Once in a lifetime is enough unless treatment changes. If high, siblings and children should test too." },
  { name: "Grip strength", optimal: "Above age median", why: "Simple proxy for total muscle mass and neuromuscular health — robustly predicts late-life independence.", freq: "Quarterly",
    what: "A 10-second squeeze of a dynamometer turns out to predict all-cause mortality, cardiovascular events, and future disability with surprising power — not because hands matter per se, but because grip is an honest census of total muscle mass, motor-neuron health, and protein status.",
    improve: ["Progressive resistance training 2–3×/week — compound pulls especially (rows, deadlifts)", "Dead hangs and farmer carries train grip directly", "Protein ~1.6 g/kg/day, spread across meals", "It responds within weeks at any age — including your 90s"],
    test: "A dynamometer costs ~€25. Test both hands, best of three. Men <40: aim 45+ kg; women: 27+ kg; targets decline gently with age." },
];

var MYTHS = [
  { myth: "Longevity is mostly genetic", truth: "Twin and adoption studies put genes at 20–30% of lifespan variance. Habits dominate until your 90s — genetics mostly decides who gets to play overtime." },
  { myth: "A daily glass of red wine protects your heart", truth: "The famous J-curve largely dissolves once 'sick quitters' are removed from the data. Resveratrol doses in wine are biologically trivial. Less alcohol is simply better; zero is fine." },
  { myth: "Running destroys your knees", truth: "Recreational runners show lower rates of knee osteoarthritis (~3.5%) than sedentary people (~10%). Cartilage adapts to load — it weakens without it." },
  { myth: "You can't build muscle after 60", truth: "Resistance-training studies in 70- and even 90-year-olds show 30–170% strength gains within months. Sarcopenia is the default, not the destiny." },
  { myth: "Supplements can replace a good diet", truth: "The VITAL trial and most mega-studies show isolated nutrients rarely replicate whole-food benefits. Supplements fix deficiencies; they don't fix eating patterns." },
  { myth: "8 hours of sleep is all that matters", truth: "Sleep regularity predicts mortality better than duration (Windred 2024). A consistent 7 h beats a chaotic 8 h — timing is a longevity lever of its own." },
];

var FAQS = [
  { q: "What single change has the biggest impact?", a: "If you are sedentary: exercise — going from nothing to 150 minutes a week is the steepest part of the benefit curve and improves nearly every other pillar (sleep, mood, insulin sensitivity). If you already train, diet quality carries the largest total potential at up to ~13 years." },
  { q: "Are biological-age tests (epigenetic clocks) worth it?", a: "They are scientifically fascinating but not yet clinical-grade: the same sample sent twice can differ by several years. For now, functional markers — VO2 max, grip strength, ApoB, fasting insulin — tell you more, are cheaper, and are directly actionable. Our avatar's bio-age estimate is a habit-based approximation, not a diagnosis." },
  { q: "Do I need supplements if I eat well?", a: "Test, don't guess. The defensible basics are vitamin D3 if your blood level is low, omega-3 (EPA/DHA) if you rarely eat fatty fish, and B12 if you are mostly plant-based. Magnesium helps many with sleep. Beyond that, evidence thins out fast — fix deficiencies, skip the hype stack." },
  { q: "Is intermittent fasting required for longevity?", a: "No. Controlled trials show time-restricted eating performs about the same as ordinary calorie control when calories match. It is a useful adherence tool for some people, not a magic mechanism. Pick the eating pattern you can sustain for decades." },
  { q: "How much alcohol is actually safe?", a: "The honest answer: the protective association of light drinking is heavily confounded, and recent Mendelian-randomization studies find no safe threshold for some outcomes. Practically — less is better, zero is fine, and keeping it light and social captures whatever benefit exists." },
  { q: "What about longevity drugs like rapamycin or metformin?", a: "Rapamycin is the most robust life-extending compound in animal studies, and the TAME trial is testing metformin in humans — but neither has human longevity data yet, and both have real side-effect profiles. They are experiments, not protocols. Everything on this site outperforms them on current human evidence." },
  { q: "If my family dies young, am I doomed? (Or: if they live long, am I safe?)", a: "Neither. Genetics explain 20–30% of lifespan variance. Bad family history makes the seven pillars more valuable, not less — you are compensating for a worse baseline. Good family history is a tailwind you can still squander." },
  { q: "When is it too late to start?", a: "Never, and this is one of the best-replicated findings in the field. Quitting smoking at 60 still adds ~3 years. Starting exercise after 70 still cuts mortality. Muscle responds to training in your 90s. The best time was 20 years ago; the second-best time is genuinely today." },
  { q: "Cardio or strength — which matters more?", a: "Both, for different reasons. VO2 max is the strongest mortality predictor; muscle mass and strength protect independence, bones, and metabolic health late in life. The evidence-based split: ~80% easy Zone 2 volume, 1–2 HIIT sessions, and 2–3 strength sessions per week." },
  { q: "How accurate is the calculator?", a: "It applies effect sizes from published meta-analyses to population baselines — useful for comparing your habits and seeing relative leverage, not for predicting your personal date. Individual biology, environment, and luck all matter. Treat the output as a compass, not a clock." },
];

/* ══════════════ DEEP CONTENT: HALLMARKS & GLOSSARY ══════════════ */
var HALLMARKS = [
  { icon: "\u{1F9EC}", name: "Genomic instability", desc: "DNA damage accumulates faster than repair can keep up. Exercise and sleep boost repair pathways; smoking and excess UV overwhelm them.", pillars: "Exercise · Sleep" },
  { icon: "⏳", name: "Telomere attrition", desc: "Protective chromosome caps shorten with each cell division. Chronic stress accelerates loss; fitness correlates with longer telomeres.", pillars: "Exercise · Social" },
  { icon: "\u{1F39B}️", name: "Epigenetic alterations", desc: "The software layer on your DNA drifts with age — genes switch on and off wrongly. Diet, exercise, and sleep measurably reshape methylation patterns.", pillars: "Nutrition · Sleep" },
  { icon: "\u{1F4E6}", name: "Loss of proteostasis", desc: "Misfolded proteins aggregate (think amyloid). Heat-shock proteins from sauna and exercise help refold or clear them.", pillars: "Sauna · Exercise" },
  { icon: "♻️", name: "Disabled macroautophagy", desc: "Cellular recycling slows, junk accumulates. Fasting periods, exercise, and deep sleep are the strongest known autophagy activators.", pillars: "Nutrition · Sleep" },
  { icon: "\u{1F37D}️", name: "Deregulated nutrient sensing", desc: "Insulin/mTOR/AMPK pathways lose calibration under constant caloric surplus. Time between meals and muscle mass restore sensitivity.", pillars: "Nutrition · Exercise" },
  { icon: "\u{1F50B}", name: "Mitochondrial dysfunction", desc: "Cellular power plants decline in number and efficiency. Zone 2 training is the single best stimulus for building new mitochondria.", pillars: "Exercise · Cold" },
  { icon: "\u{1F9DF}", name: "Cellular senescence", desc: "Damaged 'zombie cells' refuse to die and secrete inflammatory signals. Exercise reduces senescent cell burden in humans.", pillars: "Exercise · Nutrition" },
  { icon: "\u{1F331}", name: "Stem cell exhaustion", desc: "Tissue repair capacity dwindles. Sleep is when stem cell pools regenerate; chronic inflammation drains them.", pillars: "Sleep · Nutrition" },
  { icon: "\u{1F4E1}", name: "Altered communication", desc: "Hormonal and neural signaling degrades between organs. Social connection and exercise maintain neuroendocrine signaling.", pillars: "Social · Exercise" },
  { icon: "\u{1F525}", name: "Chronic inflammation", desc: "'Inflammaging' — low-grade systemic inflammation that drives nearly every age-related disease. Tracked by hs-CRP; lowered by all seven pillars.", pillars: "All pillars" },
  { icon: "\u{1F9A0}", name: "Dysbiosis", desc: "Gut microbiome diversity collapses with poor diet and age, weakening the intestinal barrier. Fiber and fermented foods rebuild it.", pillars: "Nutrition" },
];

var GLOSSARY = [
  { term: "Autophagy", def: "The cell's recycling program — damaged components are broken down and reused. Activated by fasting, exercise, and deep sleep." },
  { term: "AMPK", def: "An energy-sensing enzyme that switches cells into 'repair and recycle' mode. Activated by exercise and caloric deficit." },
  { term: "mTOR", def: "The growth switch — builds muscle when stimulated, but chronic activation suppresses cellular cleanup. The art is cycling it, not silencing it." },
  { term: "NAD+", def: "A coenzyme essential for energy production and DNA repair that declines ~50% by midlife. Exercise raises it naturally; supplements remain unproven." },
  { term: "Telomeres", def: "Protective caps on chromosome ends that shorten with each cell division — one of several biological 'clocks'." },
  { term: "Senescent cells", def: "Old, damaged cells that stop dividing but refuse to die, leaking inflammatory signals. Nicknamed zombie cells." },
  { term: "VO2 max", def: "The maximum oxygen your body can use per minute — the single strongest fitness predictor of lifespan." },
  { term: "Zone 2", def: "Easy-conversational cardio intensity (~60–70% max HR). The foundation layer that builds mitochondria and fat-burning capacity." },
  { term: "HRV", def: "Heart-rate variability — beat-to-beat timing variation reflecting nervous-system recovery. Higher generally = better recovered." },
  { term: "ApoB", def: "The protein tag on every artery-clogging particle. Counting particles (ApoB) beats weighing cargo (LDL-C)." },
  { term: "Glycation / AGEs", def: "Sugar molecules sticking to proteins, forming Advanced Glycation End-products that stiffen tissues and accelerate aging." },
  { term: "BDNF", def: "Brain-derived neurotrophic factor — 'fertilizer for neurons.' Spikes with intense exercise; supports memory and mood." },
  { term: "Sarcopenia", def: "Age-related muscle loss, ~3–8% per decade after 30. The main reversible cause of late-life frailty." },
  { term: "Epigenetic clock", def: "An age estimate read from DNA methylation patterns. Research-grade for now — interesting, not yet actionable." },
  { term: "Hormesis", def: "Beneficial stress: a dose of heat, cold, or exertion that triggers adaptation and leaves you stronger. The mechanism behind sauna and ice baths." },
  { term: "Mitochondrial biogenesis", def: "Creating new cellular power plants — the key adaptation to Zone 2 training, driven by the master regulator PGC-1α." },
  { term: "Insulin resistance", def: "Cells stop responding to insulin, forcing the pancreas to over-produce. The silent root of most metabolic disease." },
  { term: "Blue Zones", def: "Five regions (Okinawa, Sardinia, Nicoya, Ikaria, Loma Linda) where living past 100 is ~10× more common than in the West." },
  { term: "Inflammaging", def: "Chronic low-grade inflammation that rises with age and drives cardiovascular disease, dementia, and frailty. Tracked via hs-CRP." },
  { term: "Polarized training", def: "The 80/20 split: most cardio easy, a little very hard, nothing in the dead middle. How endurance elites — and longevity-minded amateurs — train." },
];

/* ══════════════ MOTION PRIMITIVES ══════════════ */
function Reveal({ children, delay, style }) {
  var [ref, vis] = useReveal(0.08);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(26px)", transition: "opacity 0.7s ease " + (delay || 0) + "s, transform 0.7s cubic-bezier(.4,0,.2,1) " + (delay || 0) + "s", ...style }}>{children}</div>;
}

function CountUp({ to, pre, suf, dec, dur }) {
  if (dur === undefined) dur = 1400;
  var [ref, vis] = useReveal(0.4);
  var [v, setV] = useState(0);
  useEffect(function () {
    if (!vis) return;
    var start = performance.now(), raf;
    function tick(now) { var t = Math.min((now - start) / dur, 1); setV(to * (1 - Math.pow(1 - t, 3))); if (t < 1) raf = requestAnimationFrame(tick); }
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); };
  }, [vis, to, dur]);
  return <span ref={ref}>{(pre || "") + v.toFixed(dec || 0) + (suf || "")}</span>;
}

function ScrollProgress() {
  var ref = useRef(null);
  useEffect(function () {
    function onScroll() {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.width = (p * 100).toFixed(2) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return function () { window.removeEventListener("scroll", onScroll); };
  }, []);
  return <div style={{ position: "absolute", bottom: -1, left: 0, height: 2.5, width: "100%", pointerEvents: "none" }}><div ref={ref} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg," + T.accent + "," + T.aurora + ")", borderRadius: 2 }} /></div>;
}

/* ══════════════ NEW UI PRIMITIVES ══════════════ */
function Eyebrow({ children, light }) {
  return <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 3, textTransform: "uppercase", color: light ? T.auroraLight : T.accent, marginBottom: 10, fontWeight: 600 }}>{children}</div>;
}

function PillBtn({ children, onClick, primary, big, style }) {
  var base = { border: "none", cursor: "pointer", fontFamily: T.sans, fontWeight: 600, borderRadius: 999, transition: "transform 0.15s ease, box-shadow 0.15s ease", padding: big ? "16px 36px" : "11px 26px", fontSize: big ? 15.5 : 13.5 };
  var look = primary
    ? { background: T.accent, color: T.white, boxShadow: "0 6px 20px rgba(59,140,196,0.30)" }
    : { background: T.glass, color: T.deep, border: "1.5px solid " + T.glassBorder, backdropFilter: T.blurLight, WebkitBackdropFilter: T.blurLight };
  return (
    <button onClick={onClick} style={{ ...base, ...look, ...style }}
      onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; if (primary) e.currentTarget.style.boxShadow = "0 10px 26px rgba(59,140,196,0.38)"; }}
      onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; if (primary) e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,140,196,0.30)"; }}>
      {children}
    </button>
  );
}

function goTo(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

function SectionHead({ eyebrow, title, sub, light }) {
  var [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 48, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: T.sans, fontSize: "clamp(28px,4.4vw,44px)", fontWeight: 700, color: light ? T.white : T.deep, letterSpacing: -1.2, lineHeight: 1.12 }}>{title}</h2>
      {sub && <p style={{ color: light ? "rgba(214,232,243,0.75)" : T.sub, marginTop: 12, fontSize: 15, maxWidth: 560, margin: "12px auto 0", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

function Faq({ q, a, light }) {
  var [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid " + (light ? "rgba(140,170,200,0.25)" : T.glassBorder), borderRadius: 16, background: light ? "rgba(255,255,255,0.04)" : T.white, marginBottom: 10, overflow: "hidden", transition: "all 0.25s ease" }}>
      <button onClick={function () { setOpen(!open); }} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: light ? T.white : T.deep, lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 99, border: "1.5px solid " + T.accent, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(.4,0,.2,1)" }}>
        <p style={{ padding: "0 22px 20px", fontSize: 13.5, lineHeight: 1.8, color: light ? "rgba(214,232,243,0.8)" : T.sub }}>{a}</p>
      </div>
    </div>
  );
}

/* ══════════════ BIOMARKER MODAL ══════════════ */
function BiomarkerModal({ marker, onClose }) {
  var u = useUI();
  var dlg = useDialog(onClose);
  if (!marker) return null;
  var c = (u.cs && CS.biomarkers[marker.name]) || {};
  var m = { name: c.name || marker.name, optimal: marker.optimal, freq: c.freq || marker.freq, what: c.what || marker.what, improve: c.improve || marker.improve, test: c.test || marker.test };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,45,72,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <div ref={dlg.panelRef} role="dialog" aria-modal="true" aria-labelledby="bio-title" onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", textAlign: "left", background: T.white, borderRadius: 22, maxWidth: 620, width: "100%", maxHeight: "86vh", overflow: "auto", boxShadow: "0 40px 100px rgba(12,45,72,0.25)", padding: "32px 36px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.accent, marginBottom: 4 }}>{u.U.bio.mTitle}</div>
            <h2 id="bio-title" style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.deep, letterSpacing: -0.6 }}>{m.name}</h2>
          </div>
          <button ref={dlg.closeRef} type="button" aria-label={u.cs ? "Zavřít" : "Close"} onClick={onClose} style={{ width: 44, height: 44, borderRadius: 99, border: "1px solid " + T.glassBorder, background: T.faint, cursor: "pointer", fontSize: 20, color: T.sub, lineHeight: 1, flexShrink: 0 }}>&times;</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.aurora, background: "rgba(43,168,125,0.08)", border: "1px solid rgba(43,168,125,0.2)", borderRadius: 99, padding: "5px 14px" }}>{u.U.bio.mOptimal}: {m.optimal}</span>
          <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 600, color: T.sub, background: T.faint, border: "1px solid " + T.glassBorder, borderRadius: 99, padding: "5px 14px" }}>{u.U.bio.mTest}: {m.freq}</span>
        </div>
        <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.deep, marginBottom: 8 }}>{u.U.bio.mWhat}</h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.8, color: T.sub, marginBottom: 20 }}>{m.what}</p>
        <h3 style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.deep, marginBottom: 10 }}>{u.U.bio.mHow}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {m.improve.map(function (it, i) { return (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: T.aurora, fontWeight: 700, flexShrink: 0, fontSize: 13 }}>✓</span>
              <span style={{ fontSize: 13, lineHeight: 1.65, color: T.sub }}>{it}</span>
            </div>); })}
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 14, background: T.faint, border: "1px solid " + T.glassBorder }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.5, color: T.dim, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{u.U.bio.mNotes}</span>
          <span style={{ fontSize: 12.5, lineHeight: 1.65, color: T.sub }}>{m.test}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ GLOSSARY (searchable) ══════════════ */
function GlossarySection() {
  var u = useUI();
  var [q, setQ] = useState("");
  var items = GLOSSARY.map(function (g) { var c = u.cs && CS.glossary[g.term]; return { key: g.term, term: c ? c.t : g.term, def: c ? c.d : g.def }; });
  var filtered = items.filter(function (g) { return (g.term + " " + g.def).toLowerCase().indexOf(q.toLowerCase()) !== -1; });
  return (
    <section id="glossary" style={{ padding: "96px 0", background: T.bgAlt }}>
      <div className="mx" style={{ maxWidth: 920 }}>
        <SectionHead eyebrow={u.U.glos.eyebrow} title={u.U.glos.title} sub={u.U.glos.sub} />
        <div style={{ maxWidth: 420, margin: "0 auto 32px", position: "relative" }}>
          <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: T.dim, fontSize: 14 }}>{"\u{1F50D}"}</span>
          <input type="search" aria-label={u.U.glos.search.replace("{n}", GLOSSARY.length)} value={q} onChange={function (e) { setQ(e.target.value); }} placeholder={u.U.glos.search.replace("{n}", GLOSSARY.length)} className="srch" style={{ width: "100%", padding: "13px 20px 13px 46px", borderRadius: 999, border: "1.5px solid " + T.glassBorder, fontFamily: T.sans, fontSize: 14, outline: "none", background: T.white, color: T.deep }} />
        </div>
        <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {filtered.map(function (g) { return (
            <div key={g.key} className="liftcard" style={{ padding: "18px 20px", borderRadius: 16, background: T.white, border: "1px solid " + T.glassBorder }}>
              <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 700, color: T.accent, marginBottom: 6 }}>{g.term}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: T.sub }}>{g.def}</p>
            </div>); })}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: "center", color: T.dim, fontSize: 13, marginTop: 10 }}>{u.U.glos.none} &ldquo;{q}&rdquo;</p>}
      </div>
    </section>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function App() {
  // Calculator answers are remembered in this browser only (never sent anywhere).
  var [inputs, setInputs] = useState(function () {
    try { return sanitizeInputs(JSON.parse(localStorage.getItem("ll-inputs"))); } catch { return sanitizeInputs(null); }
  });
  useEffect(function () { try { localStorage.setItem("ll-inputs", JSON.stringify(inputs)); } catch { /* storage unavailable */ } }, [inputs]);
  var isDefault = JSON.stringify(inputs) === JSON.stringify(DEFAULT_INPUTS);
  var [modal, setModal] = useState(null);
  var [bioModal, setBioModal] = useState(null);
  var [lang, setLang] = useState(function () { try { return localStorage.getItem("ll-lang") || "cs"; } catch { return "cs"; } });
  useEffect(function () {
    try { localStorage.setItem("ll-lang", lang); } catch { /* storage unavailable */ }
    document.documentElement.lang = lang;
    document.title = lang === "cs" ? "Longevity Lab — kolik let zdraví ti dávají tvoje návyky" : "Longevity Lab — how many healthy years your habits add";
  }, [lang]);
  var U = UI[lang], cs = lang === "cs";
  var calcRef = useRef(null);
  // Deep links such as /#calculator: the section only exists after React renders, so jump once mounted.
  useEffect(function () {
    var id = window.location.hash.slice(1);
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
  }, []);
  var set = useCallback(function (k, v) { setInputs(function (p) { var n = {}; for (var x in p) n[x] = p[x]; n[k] = v; return n; }); }, []);
  var LB = cs ? CS.lbl : LBL;
  var BU = BIOUI[lang];
  var [bio, setBio] = useState({ apob: "", hba1c: "", crp: "", bp: "", vo2: "" });
  var [bioOpen, setBioOpen] = useState(false);
  var setB = function (k, v) { setBio(function (pv) { var n = {}; for (var x in pv) n[x] = pv[x]; n[k] = v; return n; }); };
  var result = useMemo(function () { return calcLifespan(inputs, bio); }, [inputs, bio]);
  var top3 = useMemo(function () { return result.factors.slice().sort(function (a, b) { return b.years - a.years; }).slice(0, 3); }, [result]);
  var gained = r1(result.total - result.base);
  var gainedD = useAnim(gained);
  var scrollCalc = function () { calcRef.current && calcRef.current.scrollIntoView({ behavior: "smooth" }); };
  function Div() { return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + T.glassBorder + ", transparent)", margin: "0 auto", maxWidth: 600 }} />; }
  var gc = function (s) { return { background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: s }; };

  return (
    <LangCtx.Provider value={lang}>
    <>
      <style>{"\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\nhtml{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\nbody{background:" + T.bg + ";color:" + T.text + ";font-family:" + T.sans + ";overflow-x:hidden}\n::selection{background:" + T.ice + ";color:" + T.deep + "}\ninput[type=range]{-webkit-appearance:none;appearance:none}\ninput[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer;box-shadow:0 2px 8px rgba(12,45,72,0.15);transition:transform 0.15s}\ninput[type=range]::-webkit-slider-thumb:hover{transform:scale(1.15)}\ninput[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer}\ninput[type=range]:focus{outline:none}\ninput[type=range]:focus-visible,.srch:focus-visible,input[type=number]:focus-visible,a:focus-visible,button:focus-visible,[role=button]:focus-visible{outline:3px solid " + T.deep + ";outline-offset:3px;border-radius:6px}\n.skip{position:absolute;left:12px;top:-60px;z-index:300;background:" + T.deep + ";color:#fff;padding:10px 16px;border-radius:10px;font-weight:600;text-decoration:none}.skip:focus{top:12px}\n.navlink,.flink{text-decoration:none}\nsection[id],#top{scroll-margin-top:72px}\n[role=button]{-webkit-tap-highlight-color:transparent}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}}\n.mx{max-width:1120px;margin:0 auto;padding:0 28px}\n@media(max-width:840px){.cg{grid-template-columns:1fr!important}.er{grid-template-columns:1fr!important}.hs{flex-direction:column;gap:4px!important}.pg{grid-template-columns:1fr!important}.navwrap{flex-wrap:wrap;row-gap:6px!important;padding:10px 16px!important}.navlinks{order:3;width:100%;overflow-x:auto;gap:20px!important;padding:4px 2px 2px;scrollbar-width:none}.navlinks a{white-space:nowrap;padding:6px 0}section[id],#top{scroll-margin-top:110px}.hero{padding-top:128px!important;padding-bottom:40px}}\n@media(max-width:560px){.hs>div{border-left:none!important;border-top:1px solid rgba(140,170,200,0.22)}.hs>div:first-child{border-top:none}}\n@keyframes gp{0%,100%{box-shadow:0 0 0 0 rgba(59,140,196,0.12)}50%{box-shadow:0 0 0 14px rgba(59,140,196,0)}}\n@keyframes floaty{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,14px) scale(1.06)}100%{transform:translate(12px,-10px) scale(0.98)}}\n@keyframes marq{to{transform:translateX(-50%)}}\n.marq{display:flex;gap:56px;width:max-content;animation:marq 26s linear infinite;align-items:center}\n.marq:hover{animation-play-state:paused}\n.gradtxt{background:linear-gradient(95deg,#3B8CC4 10%,#2BA87D 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}\n.navlink{position:relative}\n.navlink::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;border-radius:2px;background:#3B8CC4;transition:width 0.25s ease}\n.navlink:hover::after{width:100%}\n.liftcard{transition:transform 0.3s cubic-bezier(.4,0,.2,1),box-shadow 0.3s ease,border-color 0.3s ease}\n.liftcard:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(12,45,72,0.12),0 2px 8px rgba(12,45,72,0.06)!important;border-color:rgba(100,150,200,0.4)!important}\n      "}</style>

      {modal && <DetailModal pillarId={modal} onClose={function () { setModal(null); }} />}
      {bioModal && <BiomarkerModal marker={bioModal} onClose={function () { setBioModal(null); }} />}

      {/* NAV — fixed glass bar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(245,248,250,0.82)", backdropFilter: T.blur, WebkitBackdropFilter: T.blur, borderBottom: "1px solid " + T.glassBorder }}>
        <a className="skip" href="#top">{cs ? "Přeskočit na obsah" : "Skip to content"}</a>
        <div className="mx navwrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px" }}>
          <a href="#top" className="navlink" style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15.5, color: T.deep }}><span aria-hidden="true" style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</a>
          <div className="navlinks" style={{ display: "flex", gap: 26, alignItems: "center" }}>
            {[[U.nav.science, "pillars"], [U.nav.protocol, "protocol"], [U.nav.biomarkers, "biomarkers"], [U.nav.glossary, "glossary"], [U.nav.faq, "faq"]].map(function (l) { return <a key={l[1]} href={"#" + l[1]} className="navlink" style={{ fontSize: 13.5, fontWeight: 600, color: T.mid }}>{l[0]}</a>; })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.55)", border: "1px solid " + T.glassBorder, borderRadius: 99, overflow: "hidden" }}>
              {["cs", "en"].map(function (l) { return (
                <button key={l} onClick={function () { setLang(l); }} style={{ padding: "5px 11px", background: lang === l ? T.accent : "transparent", color: lang === l ? T.white : T.sub, border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{l}</button>
              ); })}
            </div>
            <PillBtn primary onClick={scrollCalc}>{U.nav.calcNow}</PillBtn>
          </div>
        </div>
        <ScrollProgress />
      </nav>

      <main id="top">
      {/* HERO */}
      <section className="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 80, background: "linear-gradient(175deg," + T.faint + " 0%," + T.bg + " 40%,rgba(43,168,125,0.03) 100%)" }}>
        <FrostParticles />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, padding: "0 28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", borderRadius: 99, background: T.glass, border: "1px solid " + T.glassBorder, marginBottom: 30, backdropFilter: T.blurLight }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.aurora, display: "inline-block" }} />
            <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.sub, letterSpacing: 1.2, textTransform: "uppercase" }}>{U.hero.badge}</span>
          </div>
          <h1 style={{ fontFamily: T.sans, fontSize: "clamp(38px,6.5vw,68px)", fontWeight: 700, color: T.deep, lineHeight: 1.05, marginBottom: 22, letterSpacing: -2 }}>{U.hero.h1a}<br /><span className="gradtxt">{U.hero.h1b}</span></h1>
          <p style={{ fontSize: "clamp(15px,1.8vw,18.5px)", color: T.sub, lineHeight: 1.78, maxWidth: 580, margin: "0 auto 38px" }}>{U.hero.lead}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
            <PillBtn primary big onClick={scrollCalc} style={{ animation: "gp 3s ease-in-out infinite" }}>{U.hero.ctaCalc}</PillBtn>
            <PillBtn big onClick={function () { goTo("pillars"); }}>{U.hero.ctaScience}</PillBtn>
          </div>
          <div className="hs" style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap", ...gc("10px 8px") }}>
            {U.hero.trust.map(function (b, i) { return (
              <div key={i} style={{ padding: "10px 26px", textAlign: "center", borderLeft: i > 0 ? "1px solid " + T.glassBorder : "none" }}>
                <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14.5, color: T.deep }}>{b.t}</div>
                <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{b.s}</div>
              </div>); })}
          </div>
        </div>
        <div style={{ position: "absolute", top: "-12%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,140,196,0.07),transparent 70%)", pointerEvents: "none", animation: "floaty 16s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-8%", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle,rgba(43,168,125,0.05),transparent 70%)", pointerEvents: "none", animation: "floaty 20s ease-in-out infinite alternate-reverse" }} />
      </section>

      {/* PUBLISHED-IN MARQUEE */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid " + T.glassBorder, background: T.white, overflow: "hidden", position: "relative" }}>
        <p style={{ textAlign: "center", fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>{cs ? "Studie, ze kterých vycházíme, vyšly v časopisech" : "The studies we cite were published in"}</p>
        <div className="marq" aria-hidden="true">
          {[0, 1].map(function (rep) { return ["PLOS Medicine", "JAMA Internal Medicine", "New England Journal of Medicine", "SLEEP", "The Lancet", "European Journal of Applied Physiology"].map(function (j) { return <span key={rep + j} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: "#8FA6B8", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{j}</span>; }); })}
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg," + T.white + " 0%,transparent 8%,transparent 92%," + T.white + " 100%)" }} />
      </div>

      {/* WHY LONGEVITY — narrative band */}
      <section style={{ padding: "96px 0", background: T.bgAlt }}>
        <div className="mx" style={{ maxWidth: 980 }}>
          <div className="cg" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <Eyebrow>{U.why.eyebrow}</Eyebrow>
              <h2 style={{ fontFamily: T.sans, fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, color: T.deep, letterSpacing: -1, lineHeight: 1.15, marginBottom: 18 }}>{U.why.title}</h2>
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.85, marginBottom: 14 }}>{U.why.p1}</p>
              <p style={{ fontSize: 15, color: T.sub, lineHeight: 1.85 }}>{U.why.p2}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {WHY_STATS.map(function (s, i) { return (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="liftcard" style={{ ...gc("20px 24px"), display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 24, fontWeight: 700, color: T.aurora, whiteSpace: "nowrap", minWidth: 92 }}><CountUp to={s.n} pre={s.pre} suf={s.suf} /></div>
                    <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.55 }}>{cs && CS.why[i] ? CS.why[i] : s.l}</div>
                  </div>
                </Reveal>); })}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION CARDS */}
      <section style={{ padding: "96px 0 80px" }}>
        <div className="mx">
          <SectionHead eyebrow={U.solution.eyebrow} title={U.solution.title} sub={U.solution.sub} />
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {SOLUTION_CARDS.map(function (c, i) { return (
              <Reveal key={i} delay={i * 0.14} style={{ height: "100%" }}>
                <div className="liftcard" style={{ ...gc("30px 28px"), display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: T.faint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{c.icon}</div>
                  <h3 style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.deep, letterSpacing: -0.4, marginBottom: 10 }}>{cs && CS.solution[i] ? CS.solution[i].title : c.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: T.sub, flex: 1, marginBottom: 16 }}>{cs && CS.solution[i] ? CS.solution[i].body : c.body}</p>
                  <a href={c.link} className="flink" style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>{cs && CS.solution[i] ? CS.solution[i].cta : c.cta}</a>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* PILLARS (clickable) */}
      <section id="pillars" style={{ padding: "80px 0", background: T.bgAlt }}>
        <div className="mx">
          <SectionHead eyebrow={U.pillars.eyebrow} title={U.pillars.title} sub={U.pillars.sub} />
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {PILLARS.map(function (p, i) { return <PillarCard key={p.id} p={p} index={i} onOpen={setModal} />; })}
          </div>
        </div>
      </section>

      <Div />

      {/* CALCULATOR */}
      <section id="calculator" ref={calcRef} style={{ padding: "88px 0 100px" }}>
        <div className="mx">
          <SectionHead eyebrow={U.calc.eyebrow} title={<span>{U.calc.titleA}<em style={{ fontStyle: "italic", color: T.accent }}>{U.calc.titleEm}</em>{U.calc.titleB}</span>} sub={U.calc.sub} />

          <div className="cg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* INPUTS */}
            <div style={gc(32)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>{U.calc.basics}</div>
                <button type="button" disabled={isDefault} onClick={function () { setInputs(sanitizeInputs(null)); setBio({ apob: "", hba1c: "", crp: "", bp: "", vo2: "" }); }} style={{ background: "none", border: "none", padding: "6px 0", fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, color: isDefault ? T.dim : T.accent, cursor: isDefault ? "default" : "pointer", textDecoration: isDefault ? "none" : "underline", opacity: isDefault ? 0.75 : 1 }}>{cs ? "Začít znovu" : "Start over"}</button>
              </div>
              <Sl label={U.calc.age} value={inputs.age} onChange={function (v) { set("age", v); }} min={18} max={90} />
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["male", "female"].map(function (s) { return (<button key={s} onClick={function () { set("sex", s); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontFamily: T.sans, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: inputs.sex === s ? T.accent : T.glass, color: inputs.sex === s ? T.white : T.sub, border: "1.5px solid " + (inputs.sex === s ? T.accent : T.glassBorder), boxShadow: inputs.sex === s ? "0 2px 8px rgba(59,140,196,0.2)" : "none" }}>{s === "male" ? U.calc.male : U.calc.female}</button>); })}
              </div>
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>{U.calc.activity}</div>
              <Sl label={U.calc.exDays} value={inputs.exerciseDays} onChange={function (v) { set("exerciseDays", v); }} min={0} max={7} />
              <Sl label={U.calc.exInt} value={inputs.exerciseIntensity} onChange={function (v) { set("exerciseIntensity", v); }} min={1} max={10} dv={lb(LB.intensity, inputs.exerciseIntensity)} />
              <Sl label={U.calc.sauna} value={inputs.saunaSessions} onChange={function (v) { set("saunaSessions", v); }} min={0} max={7} />
              <Sl label={U.calc.cold} value={inputs.coldExposure} onChange={function (v) { set("coldExposure", v); }} min={0} max={10} dv={lb(LB.cold, inputs.coldExposure)} />
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>{U.calc.lifestyle}</div>
              <Sl label={U.calc.diet} value={inputs.dietScore} onChange={function (v) { set("dietScore", v); }} dv={lb(LB.diet, inputs.dietScore)} />
              <Sl label={U.calc.sleep} value={inputs.sleepScore} onChange={function (v) { set("sleepScore", v); }} dv={lb(LB.sleep, inputs.sleepScore)} />
              <Sl label={U.calc.supps} value={inputs.supplementScore} onChange={function (v) { set("supplementScore", v); }} dv={lb(LB.supps, inputs.supplementScore)} />
              <Sl label={U.calc.social} value={inputs.socialScore} onChange={function (v) { set("socialScore", v); }} dv={lb(LB.social, inputs.socialScore)} />
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>{U.calc.risk}</div>
              <Sl label={U.calc.smoking} value={inputs.smokingStatus} onChange={function (v) { set("smokingStatus", v); }} min={0} max={2} dv={lb(LB.smoking, inputs.smokingStatus)} />
              {inputs.smokingStatus === 1 && <Sl label={U.calc.yearsQuit} value={inputs.yearsQuit} onChange={function (v) { set("yearsQuit", v); }} min={0} max={30} />}
              <Sl label={U.calc.alcohol} value={inputs.alcoholScore} onChange={function (v) { set("alcoholScore", v); }} dv={lb(LB.alcohol, inputs.alcoholScore)} />

              <div style={{ height: 1, background: T.glassBorder, margin: "18px 0 14px" }} />
              <button onClick={function () { setBioOpen(!bioOpen); }} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, letterSpacing: 2, textAlign: "left" }}>{BU.title}</span>
                <span style={{ fontSize: 11, color: T.accent, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 8 }}>{bioOpen ? BU.hide : BU.show}</span>
              </button>
              {bioOpen && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.6, marginBottom: 14 }}>{BU.hint}</p>
                  {[["apob", BU.apob, BU.uApob, "80"], ["hba1c", BU.hba1c, BU.uHba1c, "5.4"], ["crp", BU.crp, BU.uCrp, "1.0"], ["bp", BU.bp, BU.uBp, "120"], ["vo2", BU.vo2, BU.uVo2, "38"]].map(function (f) {
                    return (
                      <div key={f[0]} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                        <span style={{ flex: 1, fontSize: 12.5, color: T.text, fontWeight: 500 }}>{f[1]}</span>
                        <input type="number" step="any" inputMode="decimal" aria-label={f[1] + " (" + f[2] + ")"} value={bio[f[0]]} placeholder={f[3]} onChange={function (e) { setB(f[0], e.target.value); }}
                          style={{ width: 78, padding: "7px 10px", borderRadius: 8, border: "1.5px solid " + T.glassBorder, background: T.white, color: T.deep, fontFamily: T.mono, fontSize: 13, textAlign: "right" }} />
                        <span style={{ width: 64, fontSize: 10.5, color: T.dim, fontFamily: T.mono }}>{f[2]}</span>
                      </div>
                    );
                  })}
                  <button onClick={function () { setBio({ apob: "", hba1c: "", crp: "", bp: "", vo2: "" }); }} style={{ marginTop: 4, background: "none", border: "none", color: T.dim, fontSize: 11, cursor: "pointer", padding: 0, textDecoration: "underline" }}>{BU.clear}</button>
                  {result.bioUsed && (
                    <div style={{ marginTop: 12, padding: "9px 12px", borderRadius: 10, background: result.bioAdj >= 0 ? "rgba(43,168,125,0.07)" : "rgba(217,88,67,0.07)", border: "1px solid " + (result.bioAdj >= 0 ? "rgba(43,168,125,0.20)" : "rgba(217,88,67,0.20)"), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11.5, color: T.sub }}>{BU.adj}</span>
                      <span style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 12.5, color: result.bioAdj >= 0 ? T.aurora : T.warm }}>{result.bioAdj >= 0 ? "+" : ""}{result.bioAdj.toFixed(1)} {U.yrs}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RESULTS */}
            <div style={{ position: "sticky", top: 20 }}>
              {/* character */}
              <div style={{ ...gc("20px 20px 12px"), textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 8 }}>{U.calc.avatar}</div>
                <Avatar2D inputs={inputs} gained={gained} />
                <div style={{ fontSize: 11, color: T.dim, marginTop: 8, fontStyle: "italic" }}>{U.calc.avatarNote}</div>
              </div>

              {/* gauge */}
              <div style={{ ...gc("28px 24px"), textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>{U.calc.estLifespan}</div>
                <Gauge value={result.total} />
                <div style={{ marginTop: 2, marginBottom: 4 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: 1.4, color: T.dim, textTransform: "uppercase" }}>{BU.range}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: T.mid }}>{result.low} &ndash; {result.high}</div>
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 24 }}>
                  <div><div style={{ fontSize: 10, color: T.dim }}>{U.calc.baseline}</div><div style={{ fontFamily: T.mono, fontWeight: 700, color: T.deep, fontSize: 17 }}>{result.base}</div></div>
                  <div style={{ width: 1, background: T.glassBorder }} />
                  <div><div style={{ fontSize: 10, color: T.dim }}>{U.calc.yourGain}</div><div style={{ fontFamily: T.mono, fontWeight: 700, color: gained >= 0 ? T.aurora : T.warm, fontSize: 17 }}>{gained >= 0 ? "+" : ""}{gainedD}</div></div>
                </div>
              </div>

              {/* top 3 */}
              <div style={{ ...gc("20px 22px"), marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>{U.calc.top3}</div>
                {top3.map(function (f, i) { return (<div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 8 : 0 }}><div style={{ width: 24, height: 24, borderRadius: 7, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontFamily: T.mono, fontWeight: 700, fontSize: 11 }}>{i + 1}</div><span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.deep }}>{f.label}</span><span style={{ fontFamily: T.mono, fontWeight: 700, color: T.aurora, fontSize: 13 }}>+{f.years.toFixed(1)}y</span></div>); })}
              </div>

              {/* breakdown */}
              <div style={gc("20px 22px")}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>{U.calc.breakdown}</div>
                <Bars factors={result.factors} />
                <p style={{ fontSize: 10.5, color: T.dim, lineHeight: 1.6, marginTop: 12, paddingTop: 10, borderTop: "1px solid " + T.glassBorder }}>{BU.method} {BU.rangeNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 30-DAY PROTOCOL */}
      <section id="protocol" style={{ padding: "96px 0", background: T.bgAlt }}>
        <div className="mx" style={{ maxWidth: 880 }}>
          <SectionHead eyebrow={U.protocol.eyebrow} title={U.protocol.title} sub={U.protocol.sub} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PROTOCOL.map(function (w, i) { return (
              <Reveal key={i} delay={i * 0.1}>
              <div style={{ ...gc("26px 30px"), display: "grid", gridTemplateColumns: "120px 1fr", gap: 24 }} className="er liftcard">
                <div>
                  <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, color: T.dim, textTransform: "uppercase" }}>{cs && CS.protocol[i] ? CS.protocol[i].week : w.week}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 19, fontWeight: 700, color: w.color, letterSpacing: -0.4, marginTop: 2 }}>{cs && CS.protocol[i] ? CS.protocol[i].theme : w.theme}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {(cs && CS.protocol[i] ? CS.protocol[i].items : w.items).map(function (it, j) { return (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 99, background: w.color + "22", color: w.color, fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontFamily: T.mono }}>{j + 1}</span>
                      <span style={{ fontSize: 13.5, color: T.sub, lineHeight: 1.65 }}>{it}</span>
                    </div>); })}
                </div>
              </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* BIOMARKERS — deep band */}
      <section id="biomarkers" style={{ padding: "96px 0", background: "linear-gradient(180deg," + T.deep + " 0%,#11385A 100%)" }}>
        <div className="mx">
          <SectionHead light eyebrow={U.bio.eyebrow} title={U.bio.title} sub={U.bio.sub} />
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {BIOMARKERS.map(function (b, i) { return (
              <Reveal key={i} delay={(i % 3) * 0.1} style={{ height: "100%" }}>
                <div {...pressable(function () { setBioModal(b); })} style={{ padding: "22px 24px", borderRadius: T.radius, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(140,170,200,0.2)", cursor: "pointer", transition: "all 0.3s ease", height: "100%" }}
                  onMouseEnter={function (e) { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(92,201,160,0.4)"; }}
                  onMouseLeave={function (e) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(140,170,200,0.2)"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: T.white }}>{(cs && CS.biomarkers[b.name] ? CS.biomarkers[b.name].name : b.name)}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ice, opacity: 0.7 }}>{(cs && CS.biomarkers[b.name] ? CS.biomarkers[b.name].freq : b.freq)}</span>
                  </div>
                  <div style={{ display: "inline-block", fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.auroraLight, background: "rgba(43,168,125,0.12)", border: "1px solid rgba(92,201,160,0.25)", borderRadius: 99, padding: "3px 12px", marginBottom: 10 }}>{b.optimal}</div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "rgba(214,232,243,0.75)", marginBottom: 10 }}>{(cs && CS.biomarkers[b.name] ? CS.biomarkers[b.name].why : b.why)}</p>
                  <span style={{ fontSize: 11.5, color: T.auroraLight, fontWeight: 600 }}>{U.bio.deepDive}</span>
                </div>
              </Reveal>); })}
          </div>
          <p style={{ textAlign: "center", fontSize: 11.5, color: "rgba(214,232,243,0.5)", marginTop: 28 }}>{U.bio.note}</p>
        </div>
      </section>

      {/* MYTHS */}
      <section style={{ padding: "96px 0 80px" }}>
        <div className="mx" style={{ maxWidth: 920 }}>
          <SectionHead eyebrow={U.myths.eyebrow} title={U.myths.title} sub={U.myths.sub} />
          <div className="cg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {MYTHS.map(function (m, i) { return (
              <Reveal key={i} delay={(i % 2) * 0.12} style={{ height: "100%" }}>
              <div className="liftcard" style={{ ...gc("24px 26px"), height: "100%" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: T.warm, fontWeight: 700, fontSize: 15, flexShrink: 0 }}>✗</span>
                  <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.deep, lineHeight: 1.4, textDecoration: "line-through", textDecorationColor: "rgba(217,88,67,0.45)", textDecorationThickness: 2 }}>{cs && CS.myths[i] ? CS.myths[i].myth : m.myth}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: T.aurora, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: T.sub }}>{cs && CS.myths[i] ? CS.myths[i].truth : m.truth}</p>
                </div>
              </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* HALLMARKS OF AGING */}
      <section style={{ padding: "96px 0", background: T.white, borderTop: "1px solid " + T.glassBorder, borderBottom: "1px solid " + T.glassBorder }}>
        <div className="mx">
          <SectionHead eyebrow={U.hall.eyebrow} title={U.hall.title} sub={U.hall.sub} />
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {HALLMARKS.map(function (h, i) { return (
              <Reveal key={i} delay={(i % 4) * 0.08} style={{ height: "100%" }}>
                <div className="liftcard" style={{ padding: "20px 20px", borderRadius: 16, background: T.bg, border: "1px solid " + T.glassBorder, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{h.icon}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 700, color: T.deep, marginBottom: 6, letterSpacing: -0.2 }}>{(cs && CS.hallmarks[h.name] ? CS.hallmarks[h.name].name : h.name)}</div>
                  <p style={{ fontSize: 11.5, lineHeight: 1.65, color: T.sub, flex: 1, marginBottom: 10 }}>{(cs && CS.hallmarks[h.name] ? CS.hallmarks[h.name].desc : h.desc)}</p>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.aurora, letterSpacing: 0.5, paddingTop: 8, borderTop: "1px dashed " + T.glassBorder }}>↳ {(cs && CS.hallmarks[h.name] ? CS.hallmarks[h.name].pillars : h.pillars)}</div>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* EVIDENCE */}
      <section style={{ padding: "76px 0", background: T.bgAlt }}>
        <div className="mx">
          <SectionHead eyebrow={U.evid.eyebrow} title={U.evid.title} sub={U.evid.sub} />
          <div style={{ display: "grid", gap: 2 }}>
            {EVIDENCE.map(function (s, i) { return (<a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="er" style={{ textDecoration: "none", padding: "16px 22px", display: "grid", gridTemplateColumns: "50px 1fr 200px", gap: 14, alignItems: "center", background: T.white, border: "1px solid " + T.glassBorder, borderRadius: i === 0 ? "12px 12px 0 0" : i === EVIDENCE.length - 1 ? "0 0 12px 12px" : "0", transition: "background 0.2s ease" }}
              onMouseEnter={function (e) { e.currentTarget.style.background = T.faint; }}
              onMouseLeave={function (e) { e.currentTarget.style.background = T.white; }}>
              <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.accent }}>{s.year}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: T.deep, lineHeight: 1.4 }}>{(cs && CS.evidence[s.year] ? CS.evidence[s.year].title : s.title)}</div><div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{s.a} &middot; {s.j}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11.5, color: T.aurora, fontFamily: T.mono, fontWeight: 600 }}>{(cs && CS.evidence[s.year] ? CS.evidence[s.year].f : s.f)}</div><div style={{ fontSize: 10.5, color: T.accent, fontWeight: 600, marginTop: 3 }}>{U.evid.read}</div></div>
            </a>); })}
          </div>
        </div>
      </section>

      <GlossarySection />

      {/* FAQ */}
      <section id="faq" style={{ padding: "96px 0" }}>
        <div className="mx" style={{ maxWidth: 760 }}>
          <SectionHead eyebrow={U.faq.eyebrow} title={U.faq.title} />
          {FAQS.map(function (f, i) { var o = cs && CS.faqs[i] ? CS.faqs[i] : f; return <Faq key={i} q={o.q} a={o.a} />; })}
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ padding: "0 0 96px" }}>
        <div className="mx">
          <div style={{ borderRadius: 28, padding: "clamp(40px,6vw,72px) clamp(24px,5vw,64px)", textAlign: "center", background: "linear-gradient(135deg," + T.deep + " 0%,#16466B 60%,#1E5E5A 100%)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(92,201,160,0.18),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4.5vw,44px)", fontWeight: 700, color: T.white, letterSpacing: -1.2, lineHeight: 1.12, marginBottom: 14 }}>{U.cta.titleA}<br />{U.cta.titleB}</h2>
              <p style={{ color: "rgba(214,232,243,0.75)", fontSize: 15, lineHeight: 1.7, marginBottom: 30, maxWidth: 480, margin: "0 auto 30px" }}>{U.cta.sub}</p>
              <div style={{ marginTop: 26 }}>
                <PillBtn primary big onClick={scrollCalc} style={{ background: T.white, color: T.deep, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>{U.cta.btn}</PillBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid " + T.glassBorder, background: T.white }}>
        <div className="mx" style={{ padding: "56px 28px 0" }}>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 16, color: T.deep, marginBottom: 10 }}><span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</div>
              <p style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.7, maxWidth: 280 }}>{U.footer.desc}</p>
            </div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, textTransform: "uppercase", marginBottom: 14 }}>{U.footer.explore}</div>
              {[[U.footer.lPillars, "pillars"], [U.footer.lCalc, "calculator"], [U.footer.lProtocol, "protocol"], [U.footer.lBio, "biomarkers"]].map(function (l) { return <a key={l[1]} href={"#" + l[1]} className="flink" style={{ display: "block", fontSize: 13, color: T.sub, marginBottom: 9, fontWeight: 500 }}>{l[0]}</a>; })}
            </div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, textTransform: "uppercase", marginBottom: 14 }}>{U.footer.knowledge}</div>
              {[[U.footer.lMyths, "faq"], [U.footer.lEvid, "faq"], [U.footer.lFaq, "faq"]].map(function (l, i) { return <a key={i} href={"#" + l[1]} className="flink" style={{ display: "block", fontSize: 13, color: T.sub, marginBottom: 9, fontWeight: 500 }}>{l[0]}</a>; })}
            </div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, textTransform: "uppercase", marginBottom: 14 }}>{U.footer.sources}</div>
              {["JAMA Internal Med", "PLOS Medicine", "NEJM", "SLEEP Journal"].map(function (j) { return <div key={j} style={{ fontSize: 13, color: T.sub, marginBottom: 9, fontWeight: 500 }}>{j}</div>; })}
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + T.glassBorder, marginTop: 44, padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 11, color: T.dim }}>{U.footer.disclaimer}</span>
            <span style={{ fontSize: 10.5, color: T.dim, fontFamily: T.mono }}>{U.footer.science} &middot; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
      <Analytics />
    </>
    </LangCtx.Provider>
  );
}
