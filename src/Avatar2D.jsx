import { useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 2D (SVG) — reaguje na VŠECH 12 metrik kalkulačky.
   Bez závislostí (žádné three.js). Lehké, funguje všude.

     age             → šedivění vlasů, vrásky, mírné shrbení
     sex             → proporce (ramena/boky), délka vlasů, barva trička
     exerciseDays×intensity → svaly (ramena, paže, nohy), vzpřímenost
     dietScore       → tělesná kompozice (pas, břicho)
     sleepScore      → přivřená víčka, kruhy pod očima
     socialScore     → úsměv / zamračení, obočí
     supplementScore → jiskřičky vitality
     saunaSessions   → prokrvená pleť, teplá záře
     coldExposure    → chladnější odstín pleti
     smokingStatus   → 2 = CIGARETA + kouř + šedá pleť, 1 = bývalý (našedlá pleť)
     alcoholScore    → 8+ = SKLENICE PIVA + zarudlý nos/tváře + naklonění
     gained (roky)   → aura, jádro vitality, biologický věk
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };

function derive(inputs, gained) {
  var ex = (inputs.exerciseDays * inputs.exerciseIntensity) / 10;
  var muscle = clamp(ex / 5, 0, 1);
  var fat = clamp(1.16 - (inputs.dietScore / 10) * 0.30, 0.82, 1.16);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;

  var smoke = inputs.smokingStatus === 2 ? 1 : inputs.smokingStatus === 1 ? 0.5 : 0;
  var alcohol = clamp((inputs.alcoholScore - 5) / 5, 0, 1);
  var heavyDrink = inputs.alcoholScore >= 8;
  var supp = clamp(inputs.supplementScore / 10, 0, 1);
  var female = inputs.sex === "female";

  var sleepy = clamp((5 - inputs.sleepScore) / 5, 0, 1);
  var sad = clamp((4 - inputs.socialScore) / 4, 0, 1);
  var happy = clamp((inputs.socialScore - 5) / 5, 0, 1) * clamp(health * 1.4, 0, 1);
  var bioAge = clamp(inputs.age - gained * 0.45, 18, 100);

  /* pleť */
  var r = 236 + health * 16, g = 196 + health * 30, b = 168 + health * 18;
  if (smoke > 0) { r *= (1 - 0.12 * smoke); g *= (1 - 0.20 * smoke); b *= (1 - 0.24 * smoke); }
  var cold = inputs.coldExposure / 10, sauna = Math.min(inputs.saunaSessions / 5, 1);
  if (cold > 0.5) { r *= 0.95; g *= 0.97; b *= 1.05; }
  r += sauna * 10 + alcohol * 16; g -= alcohol * 6; b -= alcohol * 8;
  var rgb = function (a, b2, c) { return "rgb(" + Math.round(clamp(a, 0, 255)) + "," + Math.round(clamp(b2, 0, 255)) + "," + Math.round(clamp(c, 0, 255)) + ")"; };

  var vit = clamp(0.5 + gained / 30, 0, 1);
  var hairGray = clamp((inputs.age - 36) / 32, 0, 1);
  var hairCol = "rgb(" + Math.round(58 + hairGray * 130) + "," + Math.round(37 + hairGray * 148) + "," + Math.round(24 + hairGray * 164) + ")";
  var coreHue = 6 + vit * 130; // červená → zelená

  return {
    muscle: muscle, fat: fat, health: health, smoke: smoke, alcohol: alcohol,
    heavyDrink: heavyDrink, supp: supp, female: female, sleepy: sleepy, sad: sad,
    happy: happy, bioAge: bioAge, vit: vit, cold: cold, sauna: sauna,
    skin: rgb(r, g, b), skinLight: rgb(r + 12, g + 10, b + 8), skinDark: rgb(r * 0.86, g * 0.86, b * 0.86),
    hair: hairCol, coreHue: coreHue,
    wrinkle: clamp((inputs.age - 45) / 45, 0, 1),
    slump: sleepy * 0.13 + sad * 0.12 + clamp((inputs.age - 55) / 45, 0, 1) * 0.12 - muscle * 0.07,
  };
}

export default function Avatar2D({ inputs, gained, height }) {
  var p = derive(inputs, gained || 0);
  var uid = useMemo(function () { return "av" + Math.random().toString(36).slice(2, 7); }, []);
  var tr = { transition: "all 0.55s cubic-bezier(.4,0,.2,1)" };

  /* proporce */
  var cx = 130;
  var shoulderW = 46 + p.muscle * 22 - (p.female ? 5 : 0);
  var waistW = 32 + (p.fat - 0.82) * 52 + (p.female ? 1 : 0);
  var hipW = 36 + (p.fat - 0.82) * 34 + (p.female ? 9 : 0);
  var armW = 8.5 + p.muscle * 6.5;
  var legW = 13 + (p.fat - 0.82) * 16 + p.muscle * 3;
  var tilt = p.alcohol * 3.5;             // opilecké naklonění
  var stoop = p.slump * 26;               // shrbení v px

  var shoulderY = 126 + stoop * 0.35;
  var waistY = 196, hipY = 236;

  var shirt = p.female
    ? "hsl(" + (330 - p.health * 20) + ",45%," + (46 + p.health * 12) + "%)"
    : "hsl(" + (205 - p.health * 8) + ",45%," + (42 + p.health * 14) + "%)";
  var pants = p.muscle > 0.5 ? "#2C5A7F" : "#4A6478";

  /* ruce — konce paží (kde drží rekvizity) */
  var handRX = cx + shoulderW / 2 + 16, handRY = 226 - p.smoke * 26;
  var handLX = cx - shoulderW / 2 - 16, handLY = 226 - (p.heavyDrink ? 30 : 0);

  var eyeOpen = clamp(1 - p.sleepy * 0.62, 0.3, 1);
  var mouthCurve = p.happy * 7 - p.sad * 6 + 0.8;

  var badges = [];
  if (inputs.smokingStatus === 2) badges.push(["🚬", "kuřák"]);
  else if (inputs.smokingStatus === 1) badges.push(["🚭", "bývalý kuřák"]);
  if (inputs.alcoholScore >= 8) badges.push(["🍺", "hodně alkoholu"]);
  if (inputs.sleepScore < 4) badges.push(["😴", "nevyspalý"]);
  if (inputs.exerciseDays * inputs.exerciseIntensity / 10 >= 3.5) badges.push(["💪", "vytrénovaný"]);
  if (inputs.supplementScore >= 7) badges.push(["✨", "doplňky"]);

  return (
    <div>
      <style>{"@keyframes " + uid + "smoke{0%{opacity:.45;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(-7px,-34px) scale(1.6)}}" +
        "@keyframes " + uid + "spark{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:.95;transform:scale(1.15)}}" +
        "@keyframes " + uid + "breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.012)}}" +
        "." + uid + "sm{animation:" + uid + "smoke 2.6s ease-out infinite}" +
        "." + uid + "sp{animation:" + uid + "spark 2.2s ease-in-out infinite}" +
        "." + uid + "bd{animation:" + uid + "breathe 4s ease-in-out infinite;transform-origin:130px 240px}"}</style>

      <svg viewBox="0 0 260 400" style={{ width: "100%", maxWidth: 260, height: height || 360, display: "block", margin: "0 auto" }}>
        <defs>
          <linearGradient id={uid + "sk"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.skinLight} /><stop offset="100%" stopColor={p.skin} />
          </linearGradient>
          <linearGradient id={uid + "sh"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shirt} /><stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
          <radialGradient id={uid + "au"}>
            <stop offset="55%" stopColor={"hsla(" + p.coreHue + ",70%,55%,0)"} />
            <stop offset="100%" stopColor={"hsla(" + p.coreHue + ",70%,55%," + (0.05 + p.health * 0.16) + ")"} />
          </radialGradient>
          <radialGradient id={uid + "gl"}>
            <stop offset="0%" stopColor="rgba(12,45,72,0.16)" /><stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* aura zdraví */}
        <ellipse cx={cx} cy="215" rx={104} ry={172} fill={"url(#" + uid + "au)"} style={tr} />

        {/* stín na zemi */}
        <ellipse cx={cx} cy="372" rx={46 + p.fat * 12} ry="8" fill={"url(#" + uid + "gl)"} style={tr} />

        <g className={uid + "bd"} style={{ transform: "rotate(" + tilt + "deg)", transformOrigin: "130px 300px", transition: "transform 0.6s ease" }}>

          {/* ── NOHY ── */}
          <path d={"M" + (cx - hipW / 2 + 5) + "," + hipY + " Q" + (cx - 13) + ",300 " + (cx - 15) + ",352"}
            fill="none" stroke={pants} strokeWidth={legW} strokeLinecap="round" style={tr} />
          <path d={"M" + (cx + hipW / 2 - 5) + "," + hipY + " Q" + (cx + 13) + ",300 " + (cx + 15) + ",352"}
            fill="none" stroke={pants} strokeWidth={legW} strokeLinecap="round" style={tr} />
          {/* boty */}
          <ellipse cx={cx - 16} cy="360" rx="12" ry="6" fill="#EDEFF2" style={tr} />
          <ellipse cx={cx + 16} cy="360" rx="12" ry="6" fill="#EDEFF2" style={tr} />

          {/* ── TRUP ── */}
          <path d={
            "M" + (cx - shoulderW / 2) + "," + shoulderY +
            " C" + (cx - shoulderW / 2 - 3) + "," + (shoulderY + 34) + " " + (cx - waistW / 2 - 2) + "," + (waistY - 28) + " " + (cx - waistW / 2) + "," + waistY +
            " L" + (cx - hipW / 2) + "," + hipY +
            " L" + (cx + hipW / 2) + "," + hipY +
            " L" + (cx + waistW / 2) + "," + waistY +
            " C" + (cx + waistW / 2 + 2) + "," + (waistY - 28) + " " + (cx + shoulderW / 2 + 3) + "," + (shoulderY + 34) + " " + (cx + shoulderW / 2) + "," + shoulderY + " Z"
          } fill={"url(#" + uid + "sh)"} style={tr} />

          {/* jádro vitality na hrudi */}
          <circle cx={cx} cy={shoulderY + 44} r={5 + p.vit * 3} fill={"hsl(" + p.coreHue + ",75%,58%)"} opacity={0.35 + p.vit * 0.5} style={tr} />

          {/* ── PAŽE ── */}
          {/* levá (drží sklenici) */}
          <path d={"M" + (cx - shoulderW / 2 + 3) + "," + (shoulderY + 6) + " Q" + (cx - shoulderW / 2 - 14) + ",180 " + handLX + "," + handLY}
            fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={armW} strokeLinecap="round" style={tr} />
          {/* pravá (drží cigaretu) */}
          <path d={"M" + (cx + shoulderW / 2 - 3) + "," + (shoulderY + 6) + " Q" + (cx + shoulderW / 2 + 14) + ",180 " + handRX + "," + handRY}
            fill="none" stroke={"url(#" + uid + "sk)"} strokeWidth={armW} strokeLinecap="round" style={tr} />

          {/* ── CIGARETA (jen aktivní kuřák) ── */}
          {p.smoke === 1 && (
            <g style={tr}>
              <rect x={handRX - 2} y={handRY - 15} width="4.5" height="15" rx="1.6" fill="#F7F3E9" />
              <rect x={handRX - 2} y={handRY - 4} width="4.5" height="5" rx="1.6" fill="#C79A4E" />
              <circle cx={handRX + 0.25} cy={handRY - 15.5} r="2.4" fill="#FF6A1E" />
              {[0, 0.9, 1.8].map(function (d, i) {
                return <circle key={i} className={uid + "sm"} cx={handRX + 0.25} cy={handRY - 19} r={3 + i} fill="#9AA3AB"
                  style={{ animationDelay: d + "s" }} />;
              })}
            </g>
          )}

          {/* ── SKLENICE PIVA (alkohol 8+) ── */}
          {p.heavyDrink && (
            <g style={tr}>
              <rect x={handLX - 9} y={handLY - 24} width="18" height="26" rx="2.5" fill="#DCE9F2" opacity="0.55" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
              <rect x={handLX - 7.5} y={handLY - 16} width="15" height="17" rx="1.5" fill="#D98D18" />
              <rect x={handLX - 8} y={handLY - 22} width="16" height="7" rx="2.5" fill="#FAF3E2" />
            </g>
          )}

          {/* ── KRK ── */}
          <rect x={cx - 8} y={shoulderY - 20} width="16" height="24" rx="7" fill={p.skinDark} style={tr} />

          {/* ── HLAVA ── */}
          <g style={{ transform: "translate(0," + stoop * 0.5 + "px)", transition: "transform 0.55s ease" }}>
            {/* uši */}
            <ellipse cx={cx - 29} cy="76" rx="4.5" ry="7" fill={p.skinDark} style={tr} />
            <ellipse cx={cx + 29} cy="76" rx="4.5" ry="7" fill={p.skinDark} style={tr} />

            {/* dlouhé vlasy vzadu (žena) */}
            {p.female && <path d={"M" + (cx - 30) + ",66 Q" + (cx - 40) + ",110 " + (cx - 26) + ",128 L" + (cx + 26) + ",128 Q" + (cx + 40) + ",110 " + (cx + 30) + ",66 Z"} fill={p.hair} opacity="0.95" style={tr} />}

            {/* obličej */}
            <ellipse cx={cx} cy="74" rx="28" ry="34" fill={"url(#" + uid + "sk)"} style={tr} />

            {/* vlasy */}
            <path d={"M" + (cx - 28) + ",70 Q" + (cx - 26) + ",40 " + cx + ",40 Q" + (cx + 26) + ",40 " + (cx + 28) + ",70 Q" + (cx + 18) + ",54 " + cx + ",54 Q" + (cx - 18) + ",54 " + (cx - 28) + ",70 Z"} fill={p.hair} style={tr} />

            {/* obočí */}
            <rect x={cx - 22} y={64 - p.sleepy * 1.5} width="14" height="2.6" rx="1.3" fill={p.hair}
              style={{ transformOrigin: (cx - 15) + "px 65px", transform: "rotate(" + (-4 - p.sad * 13 + p.happy * 3) + "deg)", transition: "all .5s ease" }} />
            <rect x={cx + 8} y={64 - p.sleepy * 1.5} width="14" height="2.6" rx="1.3" fill={p.hair}
              style={{ transformOrigin: (cx + 15) + "px 65px", transform: "rotate(" + (4 + p.sad * 13 - p.happy * 3) + "deg)", transition: "all .5s ease" }} />

            {/* oči */}
            {[-12, 12].map(function (dx, i) {
              return (
                <g key={i}>
                  <ellipse cx={cx + dx} cy="74" rx="6" ry={5 * eyeOpen} fill="#F7F7FA" style={tr} />
                  <circle cx={cx + dx} cy="74" r={2.9 * clamp(eyeOpen * 1.3, 0, 1)} fill="#3C5A70" style={tr} />
                  <circle cx={cx + dx} cy="74" r={1.4 * clamp(eyeOpen * 1.3, 0, 1)} fill="#16202A" style={tr} />
                  {/* kruhy pod očima */}
                  <ellipse cx={cx + dx} cy="81.5" rx="6" ry="2.4" fill="#9A6E6E" opacity={p.sleepy * 0.4} style={tr} />
                </g>
              );
            })}

            {/* vrásky (věk) */}
            {p.wrinkle > 0.15 && (
              <g stroke={p.skinDark} strokeWidth="1" fill="none" opacity={p.wrinkle * 0.55} style={tr}>
                <path d={"M" + (cx - 25) + ",70 q4,-3 8,-1"} />
                <path d={"M" + (cx + 17) + ",69 q4,-2 8,1"} />
                <path d={"M" + (cx - 10) + ",90 q10,3 20,0"} />
              </g>
            )}

            {/* nos (zarudlý při alkoholu) */}
            <path d={"M" + cx + ",78 l-3.5,9 h7 z"} fill={p.skinDark} style={tr} />
            <ellipse cx={cx} cy="88" rx="4.5" ry="3" fill="#D9614C" opacity={p.alcohol * 0.6} style={tr} />

            {/* tváře — ruměnec (sauna + alkohol + zdraví) */}
            <ellipse cx={cx - 18} cy="86" rx="7" ry="4.5" fill="#E0705C"
              opacity={clamp(p.alcohol * 0.55 + p.sauna * 0.2 + Math.max(p.health - 0.6, 0) * 0.3, 0, 0.7)} style={tr} />
            <ellipse cx={cx + 18} cy="86" rx="7" ry="4.5" fill="#E0705C"
              opacity={clamp(p.alcohol * 0.55 + p.sauna * 0.2 + Math.max(p.health - 0.6, 0) * 0.3, 0, 0.7)} style={tr} />

            {/* ústa */}
            <path d={"M" + (cx - 9) + ",97 Q" + cx + "," + (97 + mouthCurve) + " " + (cx + 9) + ",97"}
              fill="none" stroke="#A85C50" strokeWidth="2.4" strokeLinecap="round" style={tr} />
          </g>
        </g>

        {/* jiskřičky (doplňky) */}
        {p.supp > 0.3 && [[52, 150], [206, 190], [46, 258], [212, 286], [70, 96], [190, 110]].map(function (pt, i) {
          return <circle key={i} className={uid + "sp"} cx={pt[0]} cy={pt[1]} r="2.6" fill="#F0C67A"
            style={{ animationDelay: (i * 0.34) + "s", opacity: p.supp }} />;
        })}
      </svg>

      {badges.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
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
