// Lifespan estimate model. Pure functions, no React — tested in src/model.test.js.
/* ══════════════ CALCULATOR ══════════════ */
export var BASE_LIFE = { male: 76, female: 81 };
export var DEFAULT_INPUTS = { age: 30, sex: "male", exerciseDays: 3, exerciseIntensity: 5, saunaSessions: 1, dietScore: 5, sleepScore: 5, supplementScore: 3, socialScore: 5, coldExposure: 2, smokingStatus: 0, alcoholScore: 5, yearsQuit: 5 };

export function r1(n) { return Math.round(n * 10) / 10; }

/* prumerne chovani populace — zaklad 76/81 uz ho zahrnuje, proto se roky
   pocitaji PROTI nemu, ne od nuly (jinak by prumerny clovek dostal roky navic) */
var AVG = { exVol: 8 / 70, diet: 4.5, sleep: 5, social: 5, cold: 0, supp: 2.5 };
function dr(x, max) { return max * (1 - Math.exp(-3 * x)); }
function smokingYears(inp) {
  if (inp.smokingStatus === 0) return 0;
  if (inp.smokingStatus === 2) return -10;
  var q = (inp.yearsQuit === undefined || inp.yearsQuit === null) ? 5 : inp.yearsQuit;
  return -10 * Math.exp(-q / 9); // riziko odeznivá, vetsina do 15-20 let
}

export function calcLifespan(inp, bio) {
  var base = BASE_LIFE[inp.sex];
  var exVol = Math.min((inp.exerciseDays * inp.exerciseIntensity) / 70, 1);
  var saunaN = Math.min(inp.saunaSessions / 5, 1);
  var raw = [
    { key: "exercise", label: "Exercise", years: dr(exVol, 4.5) - dr(AVG.exVol, 4.5), color: "#296DA0" },
    { key: "nutrition", label: "Nutrition", years: (inp.dietScore - AVG.diet) * 1.55, color: "#2E8B6A" },
    { key: "social", label: "Social", years: (inp.socialScore - AVG.social) * 0.70, color: "#1B4965" },
    { key: "sleep", label: "Sleep", years: (inp.sleepScore - AVG.sleep) * 0.50, color: "#6BA3C7" },
    { key: "sauna", label: "Sauna", years: dr(saunaN, 3), color: "#5CC9A0" },
    { key: "cold", label: "Cold", years: (inp.coldExposure - AVG.cold) * 0.11, color: "#8AC4D0" },
    { key: "supplements", label: "Supplements", years: (inp.supplementScore - AVG.supp) * 0.13, color: "#89CFF0" },
    { key: "smoking", label: "Smoking", years: smokingYears(inp), color: "#C2412E" },
    { key: "alcohol", label: "Alcohol", years: -Math.pow(Math.min(Math.max(inp.alcoholScore - 2, 0), 8) / 8, 1.3) * 5, color: "#E89B4C" },
  ];  // ── metodika ──
  // 1) zisky klesaji s vekem (Fadnes 2022: +10,7 roku ve 20 letech, vyrazne min v 60)
  var ageF = Math.min(Math.max(1 - (inp.age - 20) * 0.0135, 0.22), 1);
  // 2) pilire se prekryvaji (spolecne mechanismy) -> klesajici vynosy, ne proste secteni
  var posRaw = 0, negRaw = 0;
  raw.forEach(function (f) { if (f.years >= 0) posRaw += f.years; else negRaw += f.years; });
  var CAP = 18;
  var posAdj = CAP * (1 - Math.exp(-(posRaw * ageF) / CAP));
  var kPos = posRaw > 0 ? posAdj / posRaw : 0;
  var kNeg = 0.65 + 0.35 * ageF;
  var negAdj = negRaw * kNeg;
  var factors = raw.map(function (f) {
    return { key: f.key, label: f.label, years: r1(f.years >= 0 ? f.years * kPos : f.years * kNeg), color: f.color };
  });
  // 3) volitelne biomarkery (vaha 0,6 kvuli castecnemu prekryvu se zivotospravou)
  var bioAdj = 0, bioUsed = false;
  if (bio) {
    var num = function (v) { var x = Number(v); return (v === "" || v === null || v === undefined || isNaN(x)) ? null : x; };
    var cl = function (x, lo, hi) { return Math.min(Math.max(x, lo), hi); };
    var a = num(bio.apob), hb = num(bio.hba1c), cr = num(bio.crp), bp = num(bio.bp), vo = num(bio.vo2);
    if (a !== null) { bioAdj += cl((80 - a) / 20 * 0.6, -3, 1.5); bioUsed = true; }
    if (hb !== null) { bioAdj += cl((5.4 - hb) / 0.5 * 0.8, -4, 1.2); bioUsed = true; }
    if (cr !== null) { bioAdj += cl((1.0 - cr) * 0.6, -3, 0.8); bioUsed = true; }
    if (bp !== null) { bioAdj += cl((120 - bp) / 10 * 0.7, -4, 1.2); bioUsed = true; }
    if (vo !== null) { bioAdj += cl((vo - 32) / 3.5 * 0.8, -4, 5); bioUsed = true; }
    bioAdj *= 0.6 * ageF;
  }
  var total = base + posAdj + negAdj + bioAdj;
  // 4) pasmo nejistoty misto jednoho cisla
  var band = 2.2 + Math.abs(posAdj) * 0.12 + (bioUsed ? 0 : 0.8);
  return { base: base, total: r1(total), low: r1(total - band), high: r1(total + band),
           factors: factors, bioAdj: r1(bioAdj), bioUsed: bioUsed, ageF: ageF };
}

/* ══════════════ SAVED ANSWERS ══════════════ */
// Allowed range of every calculator input (same limits as the sliders).
export var INPUT_RANGE = { age: [18, 90], exerciseDays: [0, 7], exerciseIntensity: [1, 10], saunaSessions: [0, 7], dietScore: [0, 10], sleepScore: [0, 10], supplementScore: [0, 10], socialScore: [0, 10], coldExposure: [0, 10], smokingStatus: [0, 2], alcoholScore: [0, 10], yearsQuit: [0, 30] };

// Turns anything read from storage into safe inputs: unknown keys are dropped,
// missing or out-of-range values fall back to the defaults.
export function sanitizeInputs(saved) {
  var out = {};
  for (var k in DEFAULT_INPUTS) out[k] = DEFAULT_INPUTS[k];
  if (!saved || typeof saved !== "object") return out;
  if (saved.sex === "male" || saved.sex === "female") out.sex = saved.sex;
  for (var key in INPUT_RANGE) {
    var v = saved[key], r = INPUT_RANGE[key];
    if (typeof v === "number" && isFinite(v) && v >= r[0] && v <= r[1]) out[key] = v;
  }
  return out;
}
