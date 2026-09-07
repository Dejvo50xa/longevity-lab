import { useEffect, useRef, useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 2D v2 — detailní SVG postava s plynulým morfováním.
   Bez závislostí. Reaguje na všech 12 metrik kalkulačky.

     age             → šedivění, vrásky, ustupující vlasy, shrbení
     sex             → proporce, vlasy, barva trička
     exerciseDays×intensity → svalstvo (ramena, biceps, stehna), vzpřímenost
     dietScore       → tělesná kompozice (pas, břicho, plnost obličeje)
     sleepScore      → přivřená víčka, kruhy pod očima
     socialScore     → úsměv / zamračení, obočí
     supplementScore → jiskřičky vitality
     saunaSessions   → prokrvení + kapky potu
     coldExposure    → chladnější pleť + pára od úst
     smokingStatus   → 2 = CIGARETA + kouř, 1 = našedlá pleť
     alcoholScore    → 8+ = SKLENICE PIVA + zarudlý nos/tváře + naklonění
     gained          → aura, jádro vitality, biologický věk
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
var rgb = function (r, g, b) { return "rgb(" + Math.round(clamp(r, 0, 255)) + "," + Math.round(clamp(g, 0, 255)) + "," + Math.round(clamp(b, 0, 255)) + ")"; };

function targetParams(inputs, gained) {
  var ex = (inputs.exerciseDays * inputs.exerciseIntensity) / 10;
  var muscle = clamp(ex / 5, 0, 1);
  var fat = clamp(1.16 - (inputs.dietScore / 10) * 0.30, 0.82, 1.16);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;

  var smoke = inputs.smokingStatus === 2 ? 1 : inputs.smokingStatus === 1 ? 0.5 : 0;
  var alcohol = clamp((inputs.alcoholScore - 5) / 5, 0, 1);
  var heavy = inputs.alcoholScore >= 8 ? 1 : 0;
  var supp = clamp(inputs.supplementScore / 10, 0, 1);
  var female = inputs.sex === "female" ? 1 : 0;

  var sleepy = clamp((5 - inputs.sleepScore) / 5, 0, 1);
  var sad = clamp((4 - inputs.socialScore) / 4, 0, 1);
  var happy = clamp((inputs.socialScore - 5) / 5, 0, 1) * clamp(health * 1.4, 0, 1);
  var cold = inputs.coldExposure / 10;
  var sauna = Math.min(inputs.saunaSessions / 5, 1);

  var r = 236 + health * 16, g = 196 + health * 30, b = 168 + health * 18;
  if (smoke > 0) { r *= (1 - 0.13 * smoke); g *= (1 - 0.21 * smoke); b *= (1 - 0.25 * smoke); }
  if (cold > 0.5) { r *= 0.95; g *= 0.97; b *= 1.05; }
  r += sauna * 10 + alcohol * 16; g -= alcohol * 6; b -= alcohol * 8;

  return {
    muscle: muscle, fat: fat, health: health, smoke: smoke, alcohol: alcohol, heavy: heavy,
    supp: supp, female: female, sleepy: sleepy, sad: sad, happy: happy,
    cold: cold, sauna: sauna,
    vit: clamp(0.5 + gained / 30, 0, 1),
    hairGray: clamp((inputs.age - 36) / 32, 0, 1),
    wrinkle: clamp((inputs.age - 42) / 46, 0, 1),
    recede: clamp((inputs.age - 48) / 40, 0, 1) * (1 - (inputs.sex === "female" ? 1 : 0)),
    slump: sleepy * 0.13 + sad * 0.12 + clamp((inputs.age - 55) / 45, 0, 1) * 0.13 - muscle * 0.07,
    bioAge: clamp(inputs.age - gained * 0.45, 18, 100),
    sr: r, sg: g, sb: b,
  };
}

/* plynulé dojíždění všech hodnot (lerp po snímcích) */
function useSmooth(target) {
  var _s = useState(target), val = _s[0], setVal = _s[1];
  var ref = useRef(target);
  useEffect(function () {
    var raf;
    function tick() {
      var cur = ref.current, next = {}, done = true;
      for (var k in target) {
        var t = target[k], c = cur[k];
        if (typeof c !== "number") { next[k] = t; continue; }
        var d = t - c;
        if (Math.abs(d) > 0.0015) { next[k] = c + d * 0.13; done = false; }
        else next[k] = t;
      }
      ref.current = next; setVal(next);
      if (!done) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); };
  }, [target]);
  return val;
}

export default function Avatar2D({ inputs, gained, height }) {
  var sig = [inputs.age, inputs.sex, inputs.exerciseDays, inputs.exerciseIntensity, inputs.saunaSessions,
    inputs.dietScore, inputs.sleepScore, inputs.supplementScore, inputs.socialScore,
    inputs.coldExposure, inputs.smokingStatus, inputs.alcoholScore, gained].join("|");
  var target = useMemo(function () { return targetParams(inputs, gained || 0); }, [sig]);
  var p = useSmooth(target);
  var uid = useMemo(function () { return "av" + Math.random().toString(36).slice(2, 7); }, []);

  /* mrkání */
  var _b = useState(false), blink = _b[0], setBlink = _b[1];
  useEffect(function () {
    var to, iv = setInterval(function () {
      setBlink(true); to = setTimeout(function () { setBlink(false); }, 130);
    }, 3800 + Math.random() * 2200);
    return function () { clearInterval(iv); clearTimeout(to); };
  }, []);

  /* ── geometrie ── */
  var cx = 140;
  var shoulderY = 122, waistY = 198, hipY = 234, kneeY = 300, ankleY = 364;

  var sW = 36 + p.muscle * 13 - p.female * 3.5;              // půl-šířka ramen
  var wW = 23 + (p.fat - 0.82) * 46 + p.female * 1;          // půl-šířka pasu
  var hW = 29 + (p.fat - 0.82) * 26 + p.female * 7;          // půl-šířka boků
  var aW = 9 + p.muscle * 5;                                  // paže
  var lW = 15.5 + (p.fat - 0.82) * 15 + p.muscle * 4;         // nohy
  var hr = 25 + (p.fat - 0.82) * 9;                           // půl-šířka obličeje
  var neckW = 8 + p.muscle * 2.6 + (p.fat - 0.82) * 6;

  var tilt = p.alcohol * 3.2;
  var stoop = p.slump * 26;

  var skin = rgb(p.sr, p.sg, p.sb);
  var skinL = rgb(p.sr + 13, p.sg + 11, p.sb + 9);
  var skinD = rgb(p.sr * 0.87, p.sg * 0.86, p.sb * 0.86);
  var skinDD = rgb(p.sr * 0.74, p.sg * 0.72, p.sb * 0.72);
  var hairC = rgb(58 + p.hairGray * 132, 38 + p.hairGray * 150, 26 + p.hairGray * 166);
  var hairD = rgb((58 + p.hairGray * 132) * 0.7, (38 + p.hairGray * 150) * 0.72, (26 + p.hairGray * 166) * 0.74);
  var coreHue = 6 + p.vit * 130;
  var shirtH = p.female ? 332 - p.health * 18 : 205 - p.health * 8;
  var shirt = "hsl(" + shirtH + "," + (40 + p.health * 22) + "%," + (44 + p.health * 12) + "%)";
  var shirtD = "hsl(" + shirtH + "," + (40 + p.health * 22) + "%," + (30 + p.health * 8) + "%)";
  var shortsC = p.muscle > 0.5 ? "#2B5878" : "#465F72";

  /* ruce (pozice se mění podle rekvizit) */
  var elbowRY = 182 - p.smoke * 12, elbowLY = 182 - p.heavy * 12;
  var handRX = cx + sW + 10 - p.smoke * 7, handRY = 236 - p.smoke * 36;
  var handLX = cx - sW - 10 + p.heavy * 7, handLY = 236 - p.heavy * 38;

  var eyeOpen = clamp(1 - p.sleepy * 0.6, 0.32, 1) * (blink ? 0.08 : 1);
  var browTiltL = -5 - p.sad * 14 + p.happy * 4;
  var browTiltR = 5 + p.sad * 14 - p.happy * 4;
  var smile = p.happy * 6.5 - p.sad * 5.5 + 0.8;
  var blush = clamp(p.alcohol * 0.6 + p.sauna * 0.22 + Math.max(p.health - 0.6, 0) * 0.32, 0, 0.75);
  var hairTop = 27 + p.recede * 7;

  var badges = [];
  if (inputs.smokingStatus === 2) badges.push(["🚬", "kuřák"]);
  else if (inputs.smokingStatus === 1) badges.push(["🚭", "bývalý kuřák"]);
  if (inputs.alcoholScore >= 8) badges.push(["🍺", "hodně alkoholu"]);
  if (inputs.sleepScore < 4) badges.push(["😴", "nevyspalý"]);
  if (inputs.exerciseDays * inputs.exerciseIntensity / 10 >= 3.5) badges.push(["💪", "vytrénovaný"]);
  if (inputs.supplementScore >= 7) badges.push(["✨", "doplňky"]);
  if (inputs.coldExposure >= 6) badges.push(["❄️", "otužilec"]);
  if (inputs.saunaSessions >= 4) badges.push(["🔥", "sauna"]);

  var css =
    "@keyframes " + uid + "br{0%,100%{transform:scaleY(1) scaleX(1)}50%{transform:scaleY(1.014) scaleX(1.007)}}" +
    "@keyframes " + uid + "sw{0%{opacity:.5;transform:translate(0,0) scale(.55)}100%{opacity:0;transform:translate(-9px,-40px) scale(1.7)}}" +
    "@keyframes " + uid + "sp{0%,100%{opacity:.12;transform:scale(.6)}50%{opacity:.95;transform:scale(1.2)}}" +
    "@keyframes " + uid + "dr{0%{opacity:0;transform:translateY(0)}25%{opacity:.85}100%{opacity:0;transform:translateY(15px)}}" +
    "@keyframes " + uid + "pf{0%{opacity:0;transform:translate(0,0) scale(.4)}30%{opacity:.5}100%{opacity:0;transform:translate(11px,-7px) scale(1.5)}}" +
    "." + uid + "b{animation:" + uid + "br 4.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}" +
    "." + uid + "s{animation:" + uid + "sw 2.8s ease-out infinite}" +
    "." + uid + "k{animation:" + uid + "sp 2.3s ease-in-out infinite}" +
    "." + uid + "d{animation:" + uid + "dr 3.2s ease-in infinite}" +
    "." + uid + "p{animation:" + uid + "pf 3.4s ease-out infinite}";

  return (
    <div>
      <style>{css}</style>
      <svg viewBox="0 0 280 420" style={{ width: "100%", maxWidth: 280, height: height || 380, display: "block", margin: "0 auto" }}>
        <defs>
          <linearGradient id={uid + "sk"} x1="0.2" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor={skinL} /><stop offset="55%" stopColor={skin} /><stop offset="100%" stopColor={skinD} />
          </linearGradient>
          <linearGradient id={uid + "sh"} x1="0.15" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor={shirt} /><stop offset="100%" stopColor={shirtD} />
          </linearGradient>
          <linearGradient id={uid + "hg"} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={hairC} /><stop offset="100%" stopColor={hairD} />
          </linearGradient>
          <radialGradient id={uid + "au"}>
            <stop offset="52%" stopColor={"hsla(" + coreHue + ",72%,55%,0)"} />
            <stop offset="100%" stopColor={"hsla(" + coreHue + ",72%,55%," + (0.05 + p.health * 0.17) + ")"} />
          </radialGradient>
          <radialGradient id={uid + "gl"}>
            <stop offset="0%" stopColor="rgba(12,45,72,0.20)" /><stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id={uid + "cr"}>
            <stop offset="0%" stopColor={"hsla(" + coreHue + ",85%,60%,0.55)"} />
            <stop offset="100%" stopColor={"hsla(" + coreHue + ",85%,60%,0)"} />
          </radialGradient>
        </defs>

        <ellipse cx={cx} cy="218" rx="112" ry="186" fill={"url(#" + uid + "au)"} />
        <ellipse cx={cx} cy="382" rx={44 + p.fat * 14} ry="8" fill={"url(#" + uid + "gl)"} />

        <g style={{ transform: "rotate(" + tilt + "deg)", transformOrigin: "140px 330px" }}>
          <g className={uid + "b"}>

            {/* ── LEVÁ PAŽE (za tělem) ── */}
            <path d={"M" + (cx - sW + 3) + "," + (shoulderY + 9) + " Q" + (cx - sW - 9) + "," + (elbowLY - 22) + " " + (cx - sW - 9) + "," + elbowLY}
              fill="none" stroke={skinD} strokeWidth={aW} strokeLinecap="round" />
            <path d={"M" + (cx - sW - 9) + "," + elbowLY + " Q" + (handLX - 3) + "," + ((elbowLY + handLY) / 2) + " " + handLX + "," + handLY}
              fill="none" stroke={skinD} strokeWidth={aW * 0.87} strokeLinecap="round" />

            {/* ── NOHY ── */}
            {[-1, 1].map(function (s) {
              return (
                <g key={s}>
                  <path d={"M" + (cx + s * hW * 0.52) + "," + (hipY + 30) + " Q" + (cx + s * 19) + "," + (kneeY - 34) + " " + (cx + s * 15) + "," + kneeY}
                    fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={lW} strokeLinecap="round" />
                  <path d={"M" + (cx + s * 15) + "," + kneeY + " Q" + (cx + s * 17.5) + "," + (kneeY + 32) + " " + (cx + s * 16) + "," + ankleY}
                    fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={lW * 0.74} strokeLinecap="round" />
                  {/* definice stehna a lýtka */}
                  <path d={"M" + (cx + s * (hW * 0.52 + 2)) + "," + (hipY + 44) + " Q" + (cx + s * 21) + "," + (kneeY - 40) + " " + (cx + s * 17) + "," + (kneeY - 14)}
                    fill="none" stroke={skinDD} strokeWidth="1.6" strokeLinecap="round" opacity={p.muscle * 0.4} />
                  <ellipse cx={cx + s * (17 + s * 0)} cy={kneeY + 20} rx={lW * 0.3} ry="12" fill={skinDD} opacity={p.muscle * 0.22} />
                  {/* bota */}
                  <path d={"M" + (cx + s * 16 - 11) + "," + (ankleY + 3) + " q11,-6 22,0 l1,7 q-12,4 -24,0 z"} fill="#EFF1F4" />
                  <path d={"M" + (cx + s * 16 - 11) + "," + (ankleY + 9) + " q12,4 24,0 l0,3 q-12,4 -24,0 z"} fill="#C9D2DA" />
                </g>
              );
            })}

            {/* ── KRAŤASY ── */}
            <path d={"M" + (cx - hW - 1) + "," + (hipY - 8) +
              " L" + (cx + hW + 1) + "," + (hipY - 8) +
              " L" + (cx + hW - 1) + "," + (hipY + 38) +
              " L" + (cx + 5) + "," + (hipY + 34) +
              " L" + cx + "," + (hipY + 22) +
              " L" + (cx - 5) + "," + (hipY + 34) +
              " L" + (cx - hW + 1) + "," + (hipY + 38) + " Z"} fill={shortsC} />
            <path d={"M" + (cx - hW - 1) + "," + (hipY - 8) + " L" + (cx + hW + 1) + "," + (hipY - 8) + " l-1,6 l-" + (hW * 2 - 1) + ",0 z"} fill="rgba(0,0,0,0.18)" />

            {/* ── TRUP / TRIČKO ── */}
            <path d={
              "M" + (cx - sW) + "," + (shoulderY + 3) +
              " C" + (cx - sW - 2) + "," + (shoulderY + 30) + " " + (cx - wW - 5) + "," + (waistY - 32) + " " + (cx - wW) + "," + waistY +
              " L" + (cx - hW) + "," + (hipY - 2) +
              " L" + (cx + hW) + "," + (hipY - 2) +
              " L" + (cx + wW) + "," + waistY +
              " C" + (cx + wW + 5) + "," + (waistY - 32) + " " + (cx + sW + 2) + "," + (shoulderY + 30) + " " + (cx + sW) + "," + (shoulderY + 3) +
              " L" + (cx + 12) + "," + (shoulderY - 5) +
              " Q" + cx + "," + (shoulderY + 7) + " " + (cx - 12) + "," + (shoulderY - 5) + " Z"
            } fill={"url(#" + uid + "sh)"} />

            {/* stínování trupu + hrudní svaly */}
            <path d={"M" + (cx - sW + 8) + "," + (shoulderY + 14) + " Q" + cx + "," + (shoulderY + 34) + " " + (cx + sW - 8) + "," + (shoulderY + 14)}
              fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="2" opacity={0.35 + p.muscle * 0.55} />
            <path d={"M" + cx + "," + (shoulderY + 20) + " L" + cx + "," + (waistY - 22)}
              stroke="rgba(0,0,0,0.13)" strokeWidth="1.6" opacity={p.muscle * 0.7} />
            {/* břicho při vyšším tuku */}
            <ellipse cx={cx} cy={waistY - 12} rx={wW * 0.76} ry="20" fill="rgba(0,0,0,0.07)" opacity={clamp((p.fat - 0.94) * 4, 0, 1)} />

            {/* ── JÁDRO VITALITY ── */}
            <circle cx={cx} cy={shoulderY + 42} r="17" fill={"url(#" + uid + "cr)"} />
            <circle cx={cx} cy={shoulderY + 42} r={4.2 + p.vit * 2.6} fill={"hsl(" + coreHue + ",80%,60%)"} opacity={0.45 + p.vit * 0.45} />

            {/* ── PRAVÁ PAŽE (před tělem) ── */}
            <path d={"M" + (cx + sW - 3) + "," + (shoulderY + 9) + " Q" + (cx + sW + 9) + "," + (elbowRY - 22) + " " + (cx + sW + 9) + "," + elbowRY}
              fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={aW} strokeLinecap="round" />
            {/* biceps */}
            <ellipse cx={cx + sW + 7} cy={elbowRY - 30} rx={aW * 0.42} ry="13" fill={skinL} opacity={p.muscle * 0.5} />
            <path d={"M" + (cx + sW + 9) + "," + elbowRY + " Q" + (handRX + 3) + "," + ((elbowRY + handRY) / 2) + " " + handRX + "," + handRY}
              fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={aW * 0.87} strokeLinecap="round" />

            {/* ramenní svaly */}
            <ellipse cx={cx - sW + 2} cy={shoulderY + 8} rx={9 + p.muscle * 4} ry={10 + p.muscle * 4} fill={shirtD} opacity={0.5 + p.muscle * 0.4} />
            <ellipse cx={cx + sW - 2} cy={shoulderY + 8} rx={9 + p.muscle * 4} ry={10 + p.muscle * 4} fill={shirtD} opacity={0.5 + p.muscle * 0.4} />

            {/* ruce */}
            <ellipse cx={handLX} cy={handLY} rx={aW * 0.44} ry={aW * 0.56} fill={skinD} />
            <ellipse cx={handRX} cy={handRY} rx={aW * 0.44} ry={aW * 0.56} fill={skin} />

            {/* ── CIGARETA ── */}
            {p.smoke > 0.7 && (
              <g opacity={clamp((p.smoke - 0.7) * 3.4, 0, 1)}>
                <rect x={handRX - 2.2} y={handRY - 19} width="4.6" height="16" rx="1.8" fill="#F8F4EA" />
                <rect x={handRX - 2.2} y={handRY - 6} width="4.6" height="5.5" rx="1.8" fill="#C89B4F" />
                <circle cx={handRX + 0.1} cy={handRY - 19.5} r="2.5" fill="#FF6A1E" />
                <circle cx={handRX + 0.1} cy={handRY - 19.5} r="4.5" fill="#FF6A1E" opacity="0.25" />
                {[0, 0.95, 1.9].map(function (d, i) {
                  return <circle key={i} className={uid + "s"} cx={handRX + 0.1} cy={handRY - 24} r={3.2 + i * 0.9} fill="#A2AAB2" style={{ animationDelay: d + "s" }} />;
                })}
              </g>
            )}

            {/* ── SKLENICE PIVA ── */}
            {p.heavy > 0.35 && (
              <g opacity={clamp((p.heavy - 0.35) * 2.2, 0, 1)}>
                <path d={"M" + (handLX - 9.5) + "," + (handLY - 27) + " l19,0 l-1.6,26 q-8,3 -15.8,0 z"} fill="#DCEAF4" opacity="0.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                <path d={"M" + (handLX - 8) + "," + (handLY - 18) + " l16,0 l-1.3,17 q-6.8,2.5 -13.4,0 z"} fill="#D98D18" />
                <ellipse cx={handLX} cy={handLY - 26} rx="9.4" ry="3.4" fill="#FAF3E2" />
                <circle cx={handLX - 3} cy={handLY - 10} r="1.2" fill="#F6E3B8" opacity="0.8" />
                <circle cx={handLX + 2.5} cy={handLY - 5} r="1" fill="#F6E3B8" opacity="0.7" />
              </g>
            )}

            {/* ── KRK ── */}
            <path d={"M" + (cx - neckW) + ",100 q" + neckW + ",9 " + (neckW * 2) + ",0 l1," + (shoulderY - 100) + " q-" + (neckW + 1) + ",7 -" + (neckW * 2 + 2) + ",0 z"} fill={skinD} />

            {/* ── HLAVA ── */}
            <g style={{ transform: "translate(0," + stoop * 0.42 + "px)" }}>
              {/* dlouhé vlasy (žena) */}
              {p.female > 0.4 && (
                <path d={"M" + (cx - hr - 3) + ",58 q-7,44 3,62 l" + (hr * 2 + 0) + ",0 q10,-18 3,-62 z"} fill={"url(#" + uid + "hg)"} opacity={p.female} />
              )}

              {/* uši */}
              <ellipse cx={cx - hr - 1} cy="68" rx="4.6" ry="7.5" fill={skinD} />
              <ellipse cx={cx + hr + 1} cy="68" rx="4.6" ry="7.5" fill={skinD} />

              {/* obličej */}
              <path d={
                "M" + (cx - hr) + ",62" +
                " C" + (cx - hr) + ",40 " + (cx - hr * 0.58) + ",31 " + cx + ",31" +
                " C" + (cx + hr * 0.58) + ",31 " + (cx + hr) + ",40 " + (cx + hr) + ",62" +
                " C" + (cx + hr) + ",83 " + (cx + hr * 0.54) + ",101 " + cx + ",101" +
                " C" + (cx - hr * 0.54) + ",101 " + (cx - hr) + ",83 " + (cx - hr) + ",62 Z"
              } fill={"url(#" + uid + "sk)"} />

              {/* vlasy */}
              <path d={
                "M" + (cx - hr - 1.5) + ",62" +
                " C" + (cx - hr - 1.5) + "," + (hairTop + 8) + " " + (cx - hr * 0.55) + "," + hairTop + " " + cx + "," + hairTop +
                " C" + (cx + hr * 0.55) + "," + hairTop + " " + (cx + hr + 1.5) + "," + (hairTop + 8) + " " + (cx + hr + 1.5) + ",62" +
                " C" + (cx + hr * 0.8) + "," + (48 + p.recede * 5) + " " + (cx + hr * 0.2) + "," + (52 + p.recede * 6) + " " + cx + "," + (51 + p.recede * 6) +
                " C" + (cx - hr * 0.2) + "," + (52 + p.recede * 6) + " " + (cx - hr * 0.8) + "," + (48 + p.recede * 5) + " " + (cx - hr - 1.5) + ",62 Z"
              } fill={"url(#" + uid + "hg)"} />

              {/* vrásky na čele */}
              <g stroke={skinDD} strokeWidth="1.1" fill="none" opacity={p.wrinkle * 0.5} strokeLinecap="round">
                <path d={"M" + (cx - 12) + ",56 q12,-3 24,0"} />
                <path d={"M" + (cx - 10) + ",61 q10,-2.5 20,0"} />
              </g>

              {/* obočí */}
              <path d={"M" + (cx - 19) + ",63 q8,-4 15,-1"} fill="none" stroke={hairD} strokeWidth="3.2" strokeLinecap="round"
                style={{ transformOrigin: (cx - 11) + "px 62px", transform: "rotate(" + browTiltL + "deg) translateY(" + (-p.sleepy * 1.2) + "px)" }} />
              <path d={"M" + (cx + 4) + ",62 q7,-3 15,1"} fill="none" stroke={hairD} strokeWidth="3.2" strokeLinecap="round"
                style={{ transformOrigin: (cx + 11) + "px 62px", transform: "rotate(" + browTiltR + "deg) translateY(" + (-p.sleepy * 1.2) + "px)" }} />

              {/* oči */}
              {[-1, 1].map(function (s) {
                var ex2 = cx + s * 10.5;
                return (
                  <g key={s}>
                    <ellipse cx={ex2} cy="72" rx="7.2" ry={5.6 * eyeOpen + 0.4} fill="#FAFAFC" />
                    <circle cx={ex2} cy="72" r={3.5 * clamp(eyeOpen * 1.4, 0, 1)} fill="#3E6076" />
                    <circle cx={ex2} cy="72" r={1.7 * clamp(eyeOpen * 1.4, 0, 1)} fill="#14202B" />
                    <circle cx={ex2 - 1.5} cy="70" r={1.1 * clamp(eyeOpen * 1.4, 0, 1)} fill="#FFF" opacity="0.9" />
                    {/* horní víčko */}
                    <path d={"M" + (ex2 - 7.4) + ",72 a7.4,6 0 0,1 14.8,0 z"} fill={skin}
                      style={{ transform: "translateY(" + (-(1 - eyeOpen) * -5.8) + "px)" }} />
                    <path d={"M" + (ex2 - 7.2) + "," + (72 - 5.6 * eyeOpen) + " a7.2,5 0 0,1 14.4,0"} fill="none" stroke={skinDD} strokeWidth="1.1" opacity="0.75" />
                    {/* kruhy pod očima */}
                    <ellipse cx={ex2} cy="80.5" rx="6.6" ry="2.6" fill="#8C6472" opacity={p.sleepy * 0.42} />
                    {/* vrásky u očí */}
                    <g stroke={skinDD} strokeWidth="0.9" fill="none" opacity={p.wrinkle * 0.55} strokeLinecap="round">
                      <path d={"M" + (ex2 + s * 8) + ",70 l" + (s * 4) + ",-2.5"} />
                      <path d={"M" + (ex2 + s * 8) + ",73 l" + (s * 4.5) + ",0.5"} />
                    </g>
                  </g>
                );
              })}

              {/* nos */}
              <path d={"M" + cx + ",70 q-1.5,9 -4,13 q4,2.5 8,0 q-2.5,-4 -4,-13"} fill={skinD} opacity="0.85" />
              <ellipse cx={cx} cy="84.5" rx="4.6" ry="3" fill="#D9614C" opacity={p.alcohol * 0.62} />
              <circle cx={cx - 2.6} cy="84.5" r="1.1" fill={skinDD} opacity="0.6" />
              <circle cx={cx + 2.6} cy="84.5" r="1.1" fill={skinDD} opacity="0.6" />

              {/* nosoretní rýhy */}
              <g stroke={skinDD} strokeWidth="1.1" fill="none" opacity={p.wrinkle * 0.45} strokeLinecap="round">
                <path d={"M" + (cx - 7) + ",84 q-5,7 -3,12"} />
                <path d={"M" + (cx + 7) + ",84 q5,7 3,12"} />
              </g>

              {/* tváře */}
              <ellipse cx={cx - 15} cy="86" rx="7.5" ry="5" fill="#E0705C" opacity={blush} />
              <ellipse cx={cx + 15} cy="86" rx="7.5" ry="5" fill="#E0705C" opacity={blush} />

              {/* ústa */}
              <path d={"M" + (cx - 8.5) + ",94 Q" + cx + "," + (94 + smile) + " " + (cx + 8.5) + ",94"}
                fill="none" stroke="#9E5248" strokeWidth="2.4" strokeLinecap="round" />
              <path d={"M" + (cx - 7) + ",93.4 Q" + cx + "," + (91.4 + smile * 0.25) + " " + (cx + 7) + ",93.4"}
                fill="none" stroke={skinDD} strokeWidth="1" opacity="0.5" strokeLinecap="round" />

              {/* pot ze sauny */}
              {p.sauna > 0.45 && [[cx - hr + 6, 52], [cx + hr - 8, 58]].map(function (pt, i) {
                return <ellipse key={i} className={uid + "d"} cx={pt[0]} cy={pt[1]} rx="1.9" ry="2.8" fill="#8EC5E8"
                  style={{ animationDelay: (i * 1.5) + "s", opacity: p.sauna }} />;
              })}

              {/* pára od úst (chlad) */}
              {p.cold > 0.5 && [0, 1.2].map(function (d, i) {
                return <ellipse key={i} className={uid + "p"} cx={cx + 12} cy="95" rx="5" ry="3.5" fill="#CFE4F2"
                  style={{ animationDelay: d + "s", opacity: p.cold * 0.7 }} />;
              })}
            </g>
          </g>
        </g>

        {/* jiskřičky — doplňky */}
        {p.supp > 0.28 && [[46, 158], [232, 196], [40, 272], [238, 296], [64, 100], [214, 118]].map(function (pt, i) {
          return (
            <g key={i} className={uid + "k"} style={{ animationDelay: (i * 0.36) + "s", opacity: p.supp, transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={pt[0]} cy={pt[1]} r="2.6" fill="#F2CB7E" />
              <circle cx={pt[0]} cy={pt[1]} r="5.5" fill="#F2CB7E" opacity="0.25" />
            </g>
          );
        })}
      </svg>

      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 8, marginTop: 2 }}>
          {badges.map(function (b, i) {
            return (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#5C8199", background: "rgba(140,170,200,0.10)", border: "1px solid rgba(140,170,200,0.22)", borderRadius: 99, padding: "3px 9px" }}>
                <span style={{ fontSize: 12 }}>{b[0]}</span>{b[1]}
              </span>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#8EAABB", fontFamily: "'JetBrains Mono',monospace" }}>KALENDÁŘNÍ</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, color: "#1A3A52" }}>{inputs.age}</div>
        </div>
        <div style={{ width: 1, background: "rgba(140,170,200,0.25)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#8EAABB", fontFamily: "'JetBrains Mono',monospace" }}>BIOLOGICKÝ</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, color: p.bioAge <= inputs.age ? "#2BA87D" : "#D95843" }}>{Math.round(p.bioAge)}</div>
        </div>
      </div>
    </div>
  );
}
