import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   LONGEVITY LAB — v3  (Apple Glass + Bug Fixes)
   Zero dependencies beyond React. Drop into any Vite project.
   npm create vite@latest longevity -- --template react
   copy to src/App.jsx  →  npm run build
   ═══════════════════════════════════════════════════════════ */

/* ── design tokens (Apple-inspired cold palette) ── */
const T = {
  bg: "#F5F8FA",
  bgAlt: "#EDF2F7",
  glass: "rgba(255,255,255,0.72)",
  glassHover: "rgba(255,255,255,0.85)",
  glassBorder: "rgba(140,170,200,0.22)",
  glassBorderHover: "rgba(100,150,200,0.35)",
  deep: "#0C2D48",
  mid: "#1B4965",
  accent: "#3B8CC4",
  accentSoft: "#5FA8D3",
  ice: "#C5DFF0",
  faint: "#E8F1F8",
  aurora: "#2BA87D",
  auroraLight: "#5CC9A0",
  warm: "#D95843",
  warmLight: "#E89B4C",
  text: "#1A3A52",
  sub: "#5C8199",
  dim: "#8EAABB",
  white: "#FFFFFF",
  shadow: "0 8px 32px rgba(12,45,72,0.07), 0 1.5px 4px rgba(12,45,72,0.04)",
  shadowLg: "0 20px 60px rgba(12,45,72,0.10), 0 2px 8px rgba(12,45,72,0.05)",
  mono: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
  sans: "'DM Sans', -apple-system, 'Segoe UI', sans-serif",
  blur: "blur(24px)",
  blurLight: "blur(14px)",
  radius: 18,
  radiusSm: 12,
};

/* ── pillar data ── */
const PILLARS = [
  { id: "exercise", icon: "\u{1F3CB}\uFE0F", title: "Exercise", dose: "150+ min/wk moderate or 75 min vigorous", minY: 3.4, maxY: 4.5, study: "Moore et al., PLOS Medicine 2012", desc: "The single most powerful longevity intervention. A brisk 22-minute daily walk adds 3+ years. Combining cardio with strength training amplifies the benefit.", insight: "Even 15 min/day beats sedentary by 3 years" },
  { id: "nutrition", icon: "\u{1F96C}", title: "Nutrition", dose: "Plant-rich, Mediterranean-style", minY: 10, maxY: 13, study: "Fadnes et al., PLOS Medicine 2022", desc: "Switching from a Western diet to an optimised diet at age 20 adds 10.7 years. Even starting at 60 gains around 8 years. Legumes, whole grains and nuts drive the largest effect.", insight: "Largest single factor \u2014 diet shapes destiny" },
  { id: "social", icon: "\u{1F91D}", title: "Social Connection", dose: "Strong relationships and community", minY: 3, maxY: 7, study: "Holt-Lunstad et al., PLOS Medicine 2010", desc: "Loneliness is as deadly as smoking 15 cigarettes a day. A meta-analysis of 308,849 individuals found strong social bonds increase survival by 50%.", insight: "Loneliness matches smoking in mortality risk" },
  { id: "sleep", icon: "\u{1F319}", title: "Sleep Regularity", dose: "7\u20138 hours with consistent timing", minY: 2, maxY: 5, study: "Windred et al., SLEEP 2024", desc: "Sleep irregularity increases all-cause mortality by 20\u201348%. Going to bed at the same time matters as much as total hours logged.", insight: "Consistency matters more than duration" },
  { id: "sauna", icon: "\u{1F9D6}", title: "Sauna Bathing", dose: "4\u20137 sessions per week, 15\u201320 min", minY: 2, maxY: 3, study: "Laukkanen et al., JAMA Internal Med 2015", desc: "A 20-year Finnish study found 4\u20137 sauna sessions per week cut cardiovascular mortality by 50% and all-cause mortality by 40%.", insight: "50% lower CVD death at 4\u20137x per week" },
  { id: "cold", icon: "\u2744\uFE0F", title: "Cold Exposure", dose: "Cold showers, ice baths, winter swimming", minY: 1, maxY: 2, study: "\u0160r\u00e1mek et al., Eur J Appl Physiol 2000", desc: "Cold exposure activates brown fat, reduces inflammation, boosts norepinephrine, and improves insulin sensitivity.", insight: "Activates brown fat and cuts inflammation" },
  { id: "supplements", icon: "\u{1F48A}", title: "Supplements", dose: "D3, Omega-3, Magnesium (evidence-based)", minY: 0.5, maxY: 2, study: "Manson et al., VITAL Trial, NEJM 2019", desc: "Omega-3 reduced heart attacks by 28%. Vitamin D showed modest cancer mortality benefit. Most supplements lack strong evidence \u2014 target deficiencies first.", insight: "Target real deficiencies, skip the hype" },
];

/* ── calculator model ── */
const BASE_LIFE = { male: 76, female: 81 };
const DEFAULT_INPUTS = {
  age: 30, sex: "male", exerciseDays: 3, exerciseIntensity: 5,
  saunaSessions: 1, dietScore: 5, sleepScore: 5,
  supplementScore: 3, socialScore: 5, coldExposure: 2,
  smokingStatus: 0, alcoholScore: 5,
};

function round1(n) { return Math.round(n * 10) / 10; }

function calcLifespan(inp) {
  const base = BASE_LIFE[inp.sex];
  const raw = [
    { key: "exercise", label: "Exercise", years: (inp.exerciseDays / 7) * (inp.exerciseIntensity / 10) * 4.5, color: T.accent },
    { key: "nutrition", label: "Nutrition", years: (inp.dietScore / 10) * 13, color: "#2E8B6A" },
    { key: "social", label: "Social", years: (inp.socialScore / 10) * 7, color: T.mid },
    { key: "sleep", label: "Sleep", years: (inp.sleepScore / 10) * 5, color: "#6BA3C7" },
    { key: "sauna", label: "Sauna", years: Math.min(inp.saunaSessions / 4, 1) * 3, color: T.auroraLight },
    { key: "cold", label: "Cold", years: (inp.coldExposure / 10) * 2, color: "#8AC4D0" },
    { key: "supplements", label: "Supplements", years: (inp.supplementScore / 10) * 2, color: "#89CFF0" },
    { key: "smoking", label: "Smoking", years: inp.smokingStatus === 0 ? 0 : inp.smokingStatus === 1 ? -5 : -10, color: T.warm },
    { key: "alcohol", label: "Alcohol", years: inp.alcoholScore >= 4 && inp.alcoholScore <= 6 ? 1 : inp.alcoholScore > 7 ? -3 : 0, color: T.warmLight },
  ];
  /* FIX: round every factor to 1 decimal so no floating-point junk leaks to UI */
  const factors = raw.map(function (f) { return { key: f.key, label: f.label, years: round1(f.years), color: f.color }; });
  var total = base + factors.reduce(function (s, f) { return s + f.years; }, 0);
  return { base: base, total: round1(total), factors: factors };
}

/* ── scroll-reveal hook ── */
function useReveal(threshold) {
  if (threshold === undefined) threshold = 0.15;
  var ref = useRef(null);
  var _s = useState(false), visible = _s[0], setVisible = _s[1];
  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: threshold });
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, [threshold]);
  return [ref, visible];
}

/* ── animated counter (returns a plain string, safe for SVG) ── */
function useAnimatedValue(value, decimals, duration) {
  if (decimals === undefined) decimals = 1;
  if (duration === undefined) duration = 700;
  var _s = useState(value), display = _s[0], setDisplay = _s[1];
  var raf = useRef(null);
  var prev = useRef(value);
  useEffect(function () {
    var from = prev.current;
    var to = value;
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    prev.current = to;
    return function () { cancelAnimationFrame(raf.current); };
  }, [value, duration]);
  return display.toFixed(decimals);
}

/* ── frost particles ── */
function FrostParticles() {
  var ref = useRef(null);
  useEffect(function () {
    var c = ref.current;
    var ctx = c.getContext("2d");
    var w, h;
    function resize() { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; }
    resize();
    var dots = Array.from({ length: 50 }, function () {
      return { x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 0.6, vy: Math.random() * 0.18 + 0.05, vx: (Math.random() - 0.5) * 0.15, o: Math.random() * 0.25 + 0.05 };
    });
    var raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,215,240," + d.o + ")";
        ctx.fill();
        d.y += d.vy; d.x += d.vx;
        if (d.y > h) { d.y = -4; d.x = Math.random() * w; }
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return function () { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", width: "100%", height: "100%" }} />;
}

/* ── gauge (FIX: render number as plain text, not a component inside SVG) ── */
function Gauge({ value, max }) {
  if (max === undefined) max = 120;
  var displayVal = useAnimatedValue(value, 1, 700);
  var pct = Math.min(value / max, 1);
  var r = 86, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" style={{ width: 220, height: 220, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="gGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.accent} /><stop offset="100%" stopColor={T.aurora} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.glassBorder} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#gGrad)" strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform={"rotate(-90 " + cx + " " + cy + ")"}
        style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={T.deep} fontFamily={T.mono} fontWeight="700" fontSize="36">{displayVal}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={T.sub} fontFamily={T.sans} fontSize="11" fontWeight="500">estimated years</text>
    </svg>
  );
}

/* ── bar breakdown ── */
function BarBreakdown({ factors }) {
  var maxAbs = Math.max.apply(null, factors.map(function (f) { return Math.abs(f.years); }).concat([0.1]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {factors.map(function (f) {
        return (
          <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 80, textAlign: "right", fontSize: 11, color: T.sub, fontFamily: T.sans, fontWeight: 500 }}>{f.label}</span>
            <div style={{ flex: 1, height: 14, background: T.faint, borderRadius: 7, overflow: "hidden", position: "relative" }}>
              <div style={{
                position: "absolute",
                left: f.years >= 0 ? "50%" : undefined, right: f.years < 0 ? "50%" : undefined,
                width: (Math.abs(f.years) / maxAbs) * 50 + "%", height: "100%",
                background: f.years >= 0 ? f.color : T.warm,
                borderRadius: 7, transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
            <span style={{ width: 50, fontSize: 11, fontWeight: 700, fontFamily: T.mono, color: f.years >= 0 ? T.deep : T.warm, textAlign: "right" }}>
              {f.years >= 0 ? "+" : ""}{f.years.toFixed(1)}y
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── custom slider ── */
function RangeSlider({ min, max, step, value, onChange, label, displayValue }) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 10;
  if (step === undefined) step = 1;
  var pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.sans }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.accent, fontFamily: T.mono, minWidth: 60, textAlign: "right" }}>{displayValue !== undefined ? displayValue : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={function (e) { onChange(Number(e.target.value)); }}
        style={{
          width: "100%", height: 5, appearance: "none", WebkitAppearance: "none", borderRadius: 99, outline: "none", cursor: "pointer",
          background: "linear-gradient(to right, " + T.accent + " 0%, " + T.accent + " " + pct + "%, " + T.faint + " " + pct + "%, " + T.faint + " 100%)",
        }}
      />
    </div>
  );
}

/* ── pillar card (FIX: no useReveal inside map — use CSS animation delay instead) ── */
function PillarCard({ p, index }) {
  var _r = useReveal(0.1);
  var ref = _r[0], vis = _r[1];
  return (
    <div ref={ref} style={{
      padding: "28px 26px",
      background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur,
      border: "1px solid " + T.glassBorder, borderRadius: T.radius,
      boxShadow: T.shadow, transition: "all 0.4s cubic-bezier(.4,0,.2,1) " + (index * 0.05) + "s, transform 0.25s ease",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
      cursor: "default",
    }}
    onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = T.shadowLg; e.currentTarget.style.borderColor = T.glassBorderHover; }}
    onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderColor = T.glassBorder; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 26 }}>{p.icon}</span>
        <div style={{ fontFamily: T.mono, fontSize: 19, fontWeight: 700, color: T.aurora }}>
          +{p.minY}&ndash;{p.maxY}<span style={{ fontSize: 11, fontWeight: 500, color: T.sub, marginLeft: 3 }}>yrs</span>
        </div>
      </div>
      <h3 style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.deep, marginBottom: 2, letterSpacing: -0.3 }}>{p.title}</h3>
      <div style={{ fontSize: 11.5, color: T.accent, fontFamily: T.mono, marginBottom: 12, letterSpacing: -0.2 }}>{p.dose}</div>
      <p style={{ fontSize: 13, lineHeight: 1.72, color: T.sub, marginBottom: 16 }}>{p.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10, background: "rgba(43,168,125,0.06)", border: "1px solid rgba(43,168,125,0.14)" }}>
        <span style={{ fontSize: 13 }}>{"\u{1F4A1}"}</span>
        <span style={{ fontSize: 12, color: T.aurora, fontWeight: 600 }}>{p.insight}</span>
      </div>
      <div style={{ marginTop: 14, fontSize: 10, color: T.dim, fontFamily: T.mono }}>{p.study}</div>
    </div>
  );
}

/* ── evidence data ── */
var EVIDENCE = [
  { year: "2022", title: "Estimating impact of food choices on life expectancy", authors: "Fadnes et al.", journal: "PLOS Medicine", finding: "+10.7 yrs from optimal diet at age 20" },
  { year: "2015", title: "Sauna bathing and fatal cardiovascular events", authors: "Laukkanen et al.", journal: "JAMA Internal Medicine", finding: "4\u20137x/wk: 50% lower CVD mortality" },
  { year: "2012", title: "Leisure time physical activity and mortality", authors: "Moore et al.", journal: "PLOS Medicine", finding: "+4.5 yrs from 150 min/wk exercise" },
  { year: "2024", title: "Sleep regularity and all-cause mortality", authors: "Windred et al.", journal: "SLEEP", finding: "Irregular sleep: 20\u201348% higher death risk" },
  { year: "2010", title: "Social relationships and mortality risk", authors: "Holt-Lunstad et al.", journal: "PLOS Medicine", finding: "Strong ties: 50% survival increase" },
  { year: "2019", title: "Vitamin D and Omega-3 supplementation", authors: "Manson et al.", journal: "New England J of Medicine", finding: "Omega-3: 28% fewer heart attacks" },
];

/* ── label maps ── */
var LBL = {
  intensity: ["", "Light walk", "", "", "Moderate", "", "", "Vigorous", "", "", "Elite"],
  cold: ["None", "", "Occasional", "", "", "Regular", "", "", "", "", "Daily"],
  diet: ["Fast food", "", "", "", "Average", "", "", "", "Plant-rich", "", "Optimal"],
  sleep: ["Chaotic", "", "", "", "Irregular", "", "", "", "Consistent", "", "Perfect"],
  supps: ["None", "", "", "Basics", "", "", "", "Targeted", "", "", "Optimised"],
  social: ["Isolated", "", "", "", "Some", "", "", "", "Strong", "", "Thriving"],
  smoking: ["Never", "Former", "Current"],
  alcohol: ["None", "", "", "Light", "", "Moderate", "", "", "Heavy", "", "Excessive"],
};
function lbl(arr, v) { return arr[v] || String(v); }

/* ════════════════════════════════ MAIN APP ════════════════════════════════ */
export default function App() {
  var _s = useState(DEFAULT_INPUTS), inputs = _s[0], setInputs = _s[1];
  var _e = useState(false), emailSent = _e[0], setEmailSent = _e[1];
  var calcRef = useRef(null);
  var set = useCallback(function (key, v) { setInputs(function (p) { var n = {}; for (var k in p) n[k] = p[k]; n[key] = v; return n; }); }, []);
  var result = useMemo(function () { return calcLifespan(inputs); }, [inputs]);
  var top3 = useMemo(function () { return result.factors.slice().sort(function (a, b) { return b.years - a.years; }).slice(0, 3); }, [result]);
  var gained = round1(result.total - result.base);
  var gainedDisplay = useAnimatedValue(gained, 1, 700);

  var scrollToCalc = function () { calcRef.current && calcRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); };

  var _r1 = useReveal(0.08), pillarsRef = _r1[0], pillarsVis = _r1[1];
  var _r2 = useReveal(0.1), calcTitleRef = _r2[0], calcTitleVis = _r2[1];
  var _r3 = useReveal(0.1), evidenceRef = _r3[0], evidenceVis = _r3[1];
  var _r4 = useReveal(0.2), ctaRef = _r4[0], ctaVis = _r4[1];

  /* ── section separator ── */
  function Divider() { return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + T.glassBorder + ", transparent)", margin: "0 auto", maxWidth: 600 }} />; }

  return (
    <>
      <style>{"\
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');\
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\
body{background:" + T.bg + ";color:" + T.text + ";font-family:" + T.sans + ";overflow-x:hidden}\
::selection{background:" + T.ice + ";color:" + T.deep + "}\
input[type=range]{-webkit-appearance:none;appearance:none}\
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer;box-shadow:0 2px 8px rgba(12,45,72,0.15);transition:transform 0.15s ease}\
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.15)}\
input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer}\
input[type=range]:focus{outline:none}\
.mx{max-width:1120px;margin:0 auto;padding:0 28px}\
@media(max-width:840px){.cg{grid-template-columns:1fr!important}.er{grid-template-columns:1fr!important}.hero-stats{flex-direction:column;gap:4px!important}.pg{grid-template-columns:1fr!important}}\
@keyframes gentlePulse{0%,100%{box-shadow:0 0 0 0 rgba(59,140,196,0.12)}50%{box-shadow:0 0 0 14px rgba(59,140,196,0)}}\
      "}</style>

      {/* ═══════ HERO ═══════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(175deg, " + T.faint + " 0%, " + T.bg + " 40%, rgba(43,168,125,0.03) 100%)" }}>
        <FrostParticles />

        {/* nav */}
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.deep, letterSpacing: -0.4 }}>
            <span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab
          </div>
          <button onClick={scrollToCalc} style={{ background: T.glass, backdropFilter: T.blurLight, WebkitBackdropFilter: T.blurLight, color: T.deep, border: "1px solid " + T.glassBorder, padding: "8px 22px", borderRadius: 10, fontFamily: T.sans, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(12,45,72,0.06)", transition: "all 0.2s" }}>
            Calculate Now
          </button>
        </nav>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 760, padding: "0 28px" }}>
          {/* trust badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: T.glass, border: "1px solid " + T.glassBorder, marginBottom: 28, backdropFilter: T.blurLight, WebkitBackdropFilter: T.blurLight, boxShadow: "0 2px 12px rgba(12,45,72,0.04)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.aurora, display: "inline-block" }} />
            <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.sub, letterSpacing: 1.2, textTransform: "uppercase" }}>Based on 6 peer-reviewed meta-analyses</span>
          </div>

          <h1 style={{ fontFamily: T.sans, fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 700, color: T.deep, lineHeight: 1.08, marginBottom: 20, letterSpacing: -1.5 }}>
            Your Habits Decide<br />How Long You Live
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: T.sub, lineHeight: 1.78, maxWidth: 540, margin: "0 auto 40px" }}>
            Genetics account for only 20&ndash;30% of longevity. The rest is shaped by what you eat, how you move, who you spend time with, and when you sleep.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={scrollToCalc} style={{ background: T.accent, color: T.white, border: "none", padding: "14px 34px", borderRadius: 12, fontFamily: T.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: -0.2, boxShadow: "0 4px 16px rgba(59,140,196,0.25)", animation: "gentlePulse 3s ease-in-out infinite", transition: "all 0.2s" }}>
              Calculate My Lifespan
            </button>
            <button onClick={function () { document.getElementById("pillars").scrollIntoView({ behavior: "smooth" }); }} style={{ background: T.glass, color: T.mid, border: "1px solid " + T.glassBorder, padding: "14px 28px", borderRadius: 12, fontFamily: T.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", backdropFilter: T.blurLight, WebkitBackdropFilter: T.blurLight, boxShadow: "0 2px 10px rgba(12,45,72,0.04)" }}>
              Explore the Science
            </button>
          </div>
        </div>

        {/* hero stats */}
        <div className="hero-stats" style={{ position: "relative", zIndex: 1, display: "flex", gap: 48, justifyContent: "center", marginTop: 52, padding: "24px 36px", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, borderRadius: 16, border: "1px solid " + T.glassBorder, boxShadow: T.shadow }}>
          {[{ n: "+36.5", l: "max years gainable" }, { n: "308K+", l: "study participants" }, { n: "7", l: "evidence-backed pillars" }].map(function (s, i) {
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: T.mono, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: T.aurora, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: T.dim, marginTop: 4, fontFamily: T.sans, fontWeight: 500 }}>{s.l}</div>
              </div>
            );
          })}
        </div>

        {/* orbs */}
        <div style={{ position: "absolute", top: "-12%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,140,196,0.06), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-8%", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle, rgba(43,168,125,0.04), transparent 70%)", pointerEvents: "none" }} />
      </section>

      {/* journal bar */}
      <div style={{ padding: "20px 0", borderBottom: "1px solid " + T.glassBorder, background: T.white }}>
        <div className="mx" style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", alignItems: "center" }}>
          {["JAMA Internal Medicine", "PLOS Medicine", "New England Journal of Medicine", "SLEEP Journal"].map(function (j) {
            return <span key={j} style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, letterSpacing: 1.5, textTransform: "uppercase" }}>{j}</span>;
          })}
        </div>
      </div>

      {/* ═══════ 7 PILLARS ═══════ */}
      <section id="pillars" style={{ padding: "100px 0 90px" }}>
        <div className="mx">
          <div ref={pillarsRef} style={{ textAlign: "center", marginBottom: 56, opacity: pillarsVis ? 1 : 0, transform: pillarsVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>The Science</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: T.deep, letterSpacing: -0.8 }}>7 Pillars That Move the Needle</h2>
            <p style={{ color: T.sub, marginTop: 10, fontSize: 15, maxWidth: 500, margin: "10px auto 0" }}>Each backed by large-scale studies. The years shown are evidence-based ranges, not wishful thinking.</p>
          </div>
          {/* FIX: PillarCard is its own component so useReveal is called per-component, not in a loop */}
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
            {PILLARS.map(function (p, i) { return <PillarCard key={p.id} p={p} index={i} />; })}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════ COMPARISON ═══════ */}
      <section style={{ padding: "64px 0" }}>
        <div className="mx cg" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 28, alignItems: "center", maxWidth: 760, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ padding: 28, textAlign: "center", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow }}>
            <div style={{ fontSize: 10.5, fontFamily: T.mono, color: T.dim, letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>Average Person</div>
            <div style={{ fontFamily: T.mono, fontSize: 44, fontWeight: 700, color: T.sub }}>{BASE_LIFE.male}</div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>years (US male avg)</div>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 18, color: T.dim }}>vs</div>
          <div style={{ padding: 28, textAlign: "center", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1.5px solid " + T.aurora, borderRadius: T.radius, boxShadow: "0 8px 32px rgba(43,168,125,0.08)" }}>
            <div style={{ fontSize: 10.5, fontFamily: T.mono, color: T.aurora, letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>Optimised Lifestyle</div>
            <div style={{ fontFamily: T.mono, fontSize: 44, fontWeight: 700, color: T.aurora }}>112+</div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 4 }}>years (all pillars maxed)</div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════ CALCULATOR ═══════ */}
      <section ref={calcRef} style={{ padding: "90px 0 100px" }}>
        <div className="mx">
          <div ref={calcTitleRef} style={{ textAlign: "center", marginBottom: 52, opacity: calcTitleVis ? 1 : 0, transform: calcTitleVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Interactive Calculator</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: T.deep, letterSpacing: -0.8 }}>How Long Will <em style={{ fontStyle: "italic", color: T.accent }}>You</em> Live?</h2>
            <p style={{ color: T.sub, marginTop: 10, fontSize: 15, maxWidth: 460, margin: "10px auto 0" }}>Drag the sliders to match your habits. Results update instantly.</p>
          </div>

          <div className="cg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* inputs */}
            <div style={{ background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: 32 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 18, letterSpacing: 2 }}>BASICS</div>
              <RangeSlider label="Your Age" value={inputs.age} onChange={function (v) { set("age", v); }} min={18} max={90} />
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {["male", "female"].map(function (s) {
                  return (
                    <button key={s} onClick={function () { set("sex", s); }} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontFamily: T.sans, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      background: inputs.sex === s ? T.accent : T.glass, color: inputs.sex === s ? T.white : T.sub,
                      border: "1.5px solid " + (inputs.sex === s ? T.accent : T.glassBorder),
                      backdropFilter: inputs.sex === s ? "none" : T.blurLight,
                      boxShadow: inputs.sex === s ? "0 2px 8px rgba(59,140,196,0.2)" : "none",
                    }}>{s === "male" ? "Male" : "Female"}</button>
                  );
                })}
              </div>

              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 22px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 18, letterSpacing: 2 }}>ACTIVITY</div>
              <RangeSlider label="Exercise (days/week)" value={inputs.exerciseDays} onChange={function (v) { set("exerciseDays", v); }} min={0} max={7} />
              <RangeSlider label="Exercise Intensity" value={inputs.exerciseIntensity} onChange={function (v) { set("exerciseIntensity", v); }} min={1} max={10} displayValue={lbl(LBL.intensity, inputs.exerciseIntensity)} />
              <RangeSlider label="Sauna (sessions/week)" value={inputs.saunaSessions} onChange={function (v) { set("saunaSessions", v); }} min={0} max={7} />
              <RangeSlider label="Cold Exposure" value={inputs.coldExposure} onChange={function (v) { set("coldExposure", v); }} min={0} max={10} displayValue={lbl(LBL.cold, inputs.coldExposure)} />

              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 22px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 18, letterSpacing: 2 }}>LIFESTYLE</div>
              <RangeSlider label="Diet Quality" value={inputs.dietScore} onChange={function (v) { set("dietScore", v); }} displayValue={lbl(LBL.diet, inputs.dietScore)} />
              <RangeSlider label="Sleep Regularity" value={inputs.sleepScore} onChange={function (v) { set("sleepScore", v); }} displayValue={lbl(LBL.sleep, inputs.sleepScore)} />
              <RangeSlider label="Supplements" value={inputs.supplementScore} onChange={function (v) { set("supplementScore", v); }} displayValue={lbl(LBL.supps, inputs.supplementScore)} />
              <RangeSlider label="Social Connection" value={inputs.socialScore} onChange={function (v) { set("socialScore", v); }} displayValue={lbl(LBL.social, inputs.socialScore)} />

              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 22px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 18, letterSpacing: 2 }}>RISK FACTORS</div>
              <RangeSlider label="Smoking" value={inputs.smokingStatus} onChange={function (v) { set("smokingStatus", v); }} min={0} max={2} displayValue={lbl(LBL.smoking, inputs.smokingStatus)} />
              <RangeSlider label="Alcohol" value={inputs.alcoholScore} onChange={function (v) { set("alcoholScore", v); }} displayValue={lbl(LBL.alcohol, inputs.alcoholScore)} />
            </div>

            {/* results */}
            <div style={{ position: "sticky", top: 20 }}>
              <div style={{ background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: "32px 28px", textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 14 }}>ESTIMATED LIFESPAN</div>
                <Gauge value={result.total} />
                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 28 }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>Baseline</div>
                    <div style={{ fontFamily: T.mono, fontWeight: 700, color: T.deep, fontSize: 18 }}>{result.base}</div>
                  </div>
                  <div style={{ width: 1, background: T.glassBorder }} />
                  <div>
                    <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>Your Gain</div>
                    <div style={{ fontFamily: T.mono, fontWeight: 700, color: gained >= 0 ? T.aurora : T.warm, fontSize: 18 }}>
                      {gained >= 0 ? "+" : ""}{gainedDisplay}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: "22px 24px", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 12 }}>YOUR TOP 3 GAINS</div>
                {top3.map(function (f, i) {
                  return (
                    <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontFamily: T.mono, fontWeight: 700, fontSize: 11 }}>{i + 1}</div>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.deep }}>{f.label}</span>
                      <span style={{ fontFamily: T.mono, fontWeight: 700, color: T.aurora, fontSize: 14 }}>+{f.years.toFixed(1)}y</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: "22px 24px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 12 }}>FULL BREAKDOWN</div>
                <BarBreakdown factors={result.factors} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════ EVIDENCE ═══════ */}
      <section style={{ padding: "80px 0", background: T.bgAlt }}>
        <div className="mx">
          <div ref={evidenceRef} style={{ textAlign: "center", marginBottom: 44, opacity: evidenceVis ? 1 : 0, transform: evidenceVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Peer-Reviewed Research</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: T.deep, letterSpacing: -0.8 }}>The Evidence Wall</h2>
          </div>
          <div style={{ display: "grid", gap: 2 }}>
            {EVIDENCE.map(function (s, i) {
              return (
                <div key={i} className="er" style={{
                  padding: "18px 24px", display: "grid", gridTemplateColumns: "52px 1fr 220px", gap: 16, alignItems: "center",
                  background: T.white, border: "1px solid " + T.glassBorder,
                  borderRadius: i === 0 ? T.radiusSm + "px " + T.radiusSm + "px 0 0" : i === EVIDENCE.length - 1 ? "0 0 " + T.radiusSm + "px " + T.radiusSm + "px" : "0",
                }}>
                  <div style={{ fontFamily: T.mono, fontSize: 17, fontWeight: 700, color: T.accent }}>{s.year}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.deep, lineHeight: 1.4 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{s.authors} &middot; {s.journal}</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.aurora, fontFamily: T.mono, fontWeight: 600, textAlign: "right" }}>{s.finding}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{ padding: "80px 0" }}>
        <div className="mx" style={{ maxWidth: 580, textAlign: "center" }}>
          <div ref={ctaRef} style={{ opacity: ctaVis ? 1 : 0, transform: ctaVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 700, color: T.deep, marginBottom: 10, letterSpacing: -0.5 }}>Stay on the Cutting Edge</h2>
            <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              New longevity research every month, distilled into actionable insights. No spam, just science.
            </p>
            {!emailSent ? (
              <form onSubmit={function (e) { e.preventDefault(); setEmailSent(true); }} style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
                <input type="email" required placeholder="you@email.com" style={{ flex: 1, padding: "13px 18px", borderRadius: 12, border: "1.5px solid " + T.glassBorder, fontFamily: T.sans, fontSize: 14, outline: "none", background: T.white, color: T.deep, transition: "border-color 0.2s" }} />
                <button type="submit" style={{ background: T.accent, color: T.white, border: "none", padding: "13px 24px", borderRadius: 12, fontFamily: T.sans, fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(59,140,196,0.2)" }}>Subscribe</button>
              </form>
            ) : (
              <div style={{ padding: "14px 24px", borderRadius: 12, background: "rgba(43,168,125,0.06)", border: "1px solid rgba(43,168,125,0.18)", fontFamily: T.mono, fontSize: 13, color: T.aurora }}>{"\u2713"} You are in. First issue arriving soon.</div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ padding: "36px 0", borderTop: "1px solid " + T.glassBorder }}>
        <div className="mx" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.deep }}><span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>Educational tool &middot; Not medical advice</div>
          </div>
          <div style={{ fontSize: 10.5, color: T.dim, fontFamily: T.mono }}>Built on peer-reviewed science &middot; {new Date().getFullYear()}</div>
        </div>
      </footer>
    </>
  );
}
