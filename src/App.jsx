import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   LONGEVITY LAB v4 — Clickable Deep-Dives + Animated Character
   Zero deps beyond React. Drop into Vite --template react.
   ═══════════════════════════════════════════════════════════════ */

var T = {
  bg: "#F5F8FA", bgAlt: "#EDF2F7", glass: "rgba(255,255,255,0.72)",
  glassBorder: "rgba(140,170,200,0.22)", glassBorderHover: "rgba(100,150,200,0.35)",
  deep: "#0C2D48", mid: "#1B4965", accent: "#3B8CC4", accentSoft: "#5FA8D3",
  ice: "#C5DFF0", faint: "#E8F1F8", aurora: "#2BA87D", auroraLight: "#5CC9A0",
  warm: "#D95843", warmLight: "#E89B4C", text: "#1A3A52", sub: "#5C8199",
  dim: "#8EAABB", white: "#FFFFFF",
  shadow: "0 8px 32px rgba(12,45,72,0.07), 0 1.5px 4px rgba(12,45,72,0.04)",
  shadowLg: "0 20px 60px rgba(12,45,72,0.10), 0 2px 8px rgba(12,45,72,0.05)",
  mono: "'SF Mono','JetBrains Mono','Fira Code',monospace",
  sans: "'DM Sans',-apple-system,'Segoe UI',sans-serif",
  blur: "blur(24px)", blurLight: "blur(14px)", radius: 18, radiusSm: 12,
};

/* ════════════════════════ DEEP-DIVE CONTENT ════════════════════════ */
var PILLAR_DETAILS = {
  exercise: {
    title: "Exercise Deep Dive",
    color: T.accent,
    sections: [
      { heading: "What Happens in Your Body", body: "Exercise triggers a cascade of biological upgrades. Your mitochondria multiply and grow more efficient at producing ATP. Telomeres (the protective caps on chromosomes) erode more slowly, literally slowing cellular aging. BDNF (brain-derived neurotrophic factor) surges, growing new neurons in the hippocampus. VO2 max increases, which is now considered the single strongest predictor of all-cause mortality. Your resting heart rate drops as the heart muscle strengthens, reducing lifetime cardiac workload." },
      { heading: "The Dose That Matters", body: "The mortality curve is J-shaped: the biggest drop comes from going from zero to just 15 minutes a day (14% mortality reduction). 150 minutes per week of moderate activity cuts mortality by 31%. Adding 2 days of resistance training on top reduces cancer mortality by another 20%. Zone 2 cardio (conversational pace, 60-70% max HR) is the sweet spot for mitochondrial density. High-intensity intervals (VO2 max training) once a week give the most longevity bang per minute." },
      { heading: "Practical Tips", body: "Walk after every meal for 15 minutes to blunt glucose spikes by 30-50%. Do strength training 2-3x per week, focusing on compound movements (squats, deadlifts, presses). Add one VO2 max session per week: 4x4 minute intervals at 85-95% max heart rate. Aim for 7,000+ steps daily as your baseline. Grip strength is a powerful longevity biomarker, so train it directly." },
    ],
  },
  nutrition: {
    title: "Nutrition Deep Dive",
    color: "#2E8B6A",
    sections: [
      { heading: "What Happens in Your Body", body: "Every meal is a hormonal event. Refined carbohydrates spike insulin, which over decades drives insulin resistance, visceral fat accumulation, and chronic inflammation (the root of most age-related disease). Polyphenols from colorful plants activate sirtuins and AMPK pathways, the same pathways triggered by caloric restriction. Fiber feeds gut bacteria that produce butyrate, strengthening your intestinal barrier and reducing systemic inflammation. Omega-3 fatty acids integrate into every cell membrane, making them more fluid and responsive." },
      { heading: "The Foods That Add Years", body: "Legumes are the #1 food of every Blue Zone centenarian population. Eating 1 cup daily is linked to the biggest lifespan gain of any single food. Nuts (especially walnuts) reduce cardiovascular mortality by 39% at 5+ servings per week. Cruciferous vegetables (broccoli, cauliflower, cabbage) activate Nrf2, your master antioxidant switch. Extra virgin olive oil at 1+ tablespoon daily reduces all-cause mortality by 19%. Fermented foods (kimchi, sauerkraut, kefir) dramatically increase gut microbiome diversity." },
      { heading: "What to Reduce", body: "Ultra-processed foods are the single biggest dietary threat. Each 10% increase in ultra-processed food consumption raises mortality by 14%. Red and processed meat: the evidence is strong that processed meat (bacon, sausage, deli meats) increases colorectal cancer risk by 18% per 50g daily serving. Excess sugar causes glycation of proteins (AGEs), literally caramelizing your tissues and accelerating aging. Alcohol: even moderate drinking is now understood to increase cancer risk; the supposed heart benefits have been debunked by Mendelian randomization studies." },
    ],
  },
  social: {
    title: "Social Connection Deep Dive",
    color: T.mid,
    sections: [
      { heading: "What Happens in Your Body", body: "Loneliness activates the same brain regions as physical pain (the anterior cingulate cortex). Chronic loneliness elevates cortisol by 20-30%, keeps the sympathetic nervous system in fight-or-flight, suppresses immune function (reducing lymphocyte and natural killer cell counts), and increases inflammatory markers like IL-6 and CRP. Positive social interaction triggers oxytocin release, which lowers blood pressure, reduces cortisol, and promotes cellular repair. The vagus nerve, which connects your brain to your gut and heart, is strengthened by face-to-face social engagement." },
      { heading: "The Science of Belonging", body: "The Harvard Study of Adult Development (running since 1938, the longest study of human happiness) found that the quality of relationships at age 50 was the single best predictor of health at age 80, beating cholesterol, income, and even genetics. People with 3+ close confidants have 22% lower mortality risk. Marriage (a happy one) adds 2-3 years on average. Regular volunteering reduces mortality by 22-44%. Even pet ownership lowers cardiovascular mortality by 36%." },
      { heading: "Practical Tips", body: "Schedule at least 2 in-person social interactions per week that are not work-related. Join a group with shared purpose (sports team, choir, book club, religious community). Practice active listening: put your phone away during conversations. Maintain at least 3 close relationships where you can be vulnerable. Call someone instead of texting. Eat meals with others whenever possible. Reduce social media to under 30 minutes per day, as excessive use correlates with increased loneliness." },
    ],
  },
  sleep: {
    title: "Sleep Deep Dive",
    color: "#6BA3C7",
    sections: [
      { heading: "What Happens in Your Body", body: "Sleep is when your brain literally washes itself. The glymphatic system (discovered in 2012) opens channels between brain cells during deep sleep, flushing out beta-amyloid (the Alzheimer's protein) and tau at 10-20x the daytime rate. Growth hormone peaks during the first deep sleep cycle, repairing muscle and tissue. Your immune system produces cytokines and T-cells during sleep. Even one night of 4 hours of sleep reduces natural killer cell activity by 70%, which is your first-line cancer defense. REM sleep processes emotions and consolidates procedural memory. Deep (NREM) sleep consolidates factual memory and regulates insulin sensitivity." },
      { heading: "What Destroys Your Sleep (from Why We Sleep)", body: "Caffeine has a half-life of 5-7 hours. A coffee at 2pm means 25% of that caffeine is still circulating at midnight. It blocks adenosine receptors, preventing your brain from registering sleepiness. Alcohol is the most misunderstood sleep aid. It sedates you (sedation is not sleep) and fragments sleep architecture. It suppresses REM sleep by 20-50%, destroying emotional processing and memory consolidation. Blue light from screens after sunset suppresses melatonin onset by up to 3 hours. Even dim room light in the evening reduces melatonin by 50%. Irregular sleep timing confuses the suprachiasmatic nucleus (your master clock), making every system in your body run on a different schedule." },
      { heading: "What Optimizes Sleep", body: "Morning sunlight within 30 minutes of waking (10+ minutes, no sunglasses) anchors your circadian rhythm and starts your cortisol-melatonin timer. This is the #1 most impactful sleep hack. Keep your bedroom at 65-68F (18-20C). Your core temperature needs to drop 2-3 degrees to initiate sleep. A warm bath 90 minutes before bed works by drawing blood to the surface, causing a compensatory core temperature drop. Stop eating 3 hours before bed. Late meals raise core temperature and blood sugar, blocking deep sleep. Consistent wake time (even on weekends) is more important than consistent bedtime. Magnesium glycinate (200-400mg before bed) supports GABA activity and muscle relaxation." },
    ],
  },
  sauna: {
    title: "Sauna Deep Dive",
    color: T.auroraLight,
    sections: [
      { heading: "What Happens in Your Body", body: "Sauna bathing mimics moderate cardiovascular exercise. Your heart rate increases to 100-150 bpm, cardiac output rises by 60-70%, and blood vessels dilate, improving endothelial function. Core body temperature rises 1-2 degrees, triggering heat shock proteins (HSPs), particularly HSP70 and HSP90. These act as molecular chaperones, refolding damaged proteins and preventing the protein aggregation that drives Alzheimer's and Parkinson's. Sauna triggers a massive release of dynorphin (the discomfort molecule), which upregulates mu-opioid receptors, making your body more sensitive to endorphins afterward. Growth hormone can surge 200-300% after a single sauna session." },
      { heading: "The Finnish Evidence", body: "The landmark Kuopio Ischemic Heart Disease study followed 2,315 Finnish men for 20 years. Those using sauna 4-7 times per week had 50% lower cardiovascular mortality, 40% lower all-cause mortality, and 65% lower Alzheimer's risk compared to once-a-week users. The dose-response was clear and linear: more frequent use equals greater benefit. Optimal protocol from the research: 15-20 minutes per session at 174-212F (79-100C). The cardiovascular benefits appear comparable to moderate-intensity exercise." },
      { heading: "Practical Tips", body: "Start with 2-3 sessions per week at 15 minutes, building to 4+ sessions over time. Target 174-212F (80-100C) for traditional dry sauna. Infrared saunas work at lower temperatures (120-150F) but the cardiovascular research was done on traditional Finnish saunas. Hydrate well before and after. Combining sauna with cold exposure (contrast therapy) amplifies the hormetic stress response. Avoid alcohol before sauna. Post-exercise sauna may enhance recovery by increasing blood flow to muscles." },
    ],
  },
  cold: {
    title: "Cold Exposure Deep Dive",
    color: "#8AC4D0",
    sections: [
      { heading: "What Happens in Your Body", body: "Cold exposure triggers a powerful sympathetic nervous system response. Norepinephrine surges 200-300% (this is the alert, focused neurotransmitter). Brown adipose tissue (brown fat) activates, burning white fat to generate heat through a process called non-shivering thermogenesis. Over weeks of regular cold exposure, you actually grow more brown fat. Cold activates cold shock proteins, particularly RBM3, which has been shown to regenerate lost synapses in the brain (demonstrated in hibernating animal models). Inflammation markers (TNF-alpha, IL-6) drop significantly with regular cold practice. Dopamine rises 250% and stays elevated for hours, unlike the spike-and-crash pattern of stimulants." },
      { heading: "The Protocols That Work", body: "The Huberman protocol: 11 minutes total cold exposure per week, split across 2-4 sessions. Water temperature 40-60F (4-15C). The key is that it should feel uncomfortably cold but safe. Cold showers are the easiest entry point: end every shower with 30-60 seconds of the coldest setting, building to 2-3 minutes. Ice baths at 40-50F for 1-3 minutes. Winter swimming (Nordic tradition) shows the strongest epidemiological data. The hormetic curve matters: some stress is beneficial, too much is harmful. Shivering is okay and actually beneficial." },
      { heading: "Practical Tips", body: "Start your cold exposure practice with face immersion in cold water (triggers the dive reflex and vagal tone). Do cold exposure in the morning, not evening, as the norepinephrine spike can disrupt sleep. Breathe slowly and calmly during exposure (cyclic sighing: double inhale through nose, long exhale through mouth). Do not use cold immersion immediately after strength training if hypertrophy is your goal, as it may blunt the inflammatory signaling needed for muscle growth. Wait 4+ hours, or do cold on separate days. Pair with sauna for maximum hormetic benefit." },
    ],
  },
  supplements: {
    title: "Supplements Deep Dive",
    color: "#89CFF0",
    sections: [
      { heading: "What Works (Strong Evidence)", body: "Vitamin D3: 40-60% of adults are deficient. Optimal blood levels are 40-60 ng/mL. At 2,000-5,000 IU daily, it supports immune function, bone density, and reduces cancer mortality by 12% (VITAL trial). Always take with fat for absorption. Omega-3 (EPA/DHA): 2-3g daily from fish oil reduced heart attacks by 28% in the VITAL trial. EPA specifically reduces inflammation (measured by hs-CRP). Look for triglyceride form over ethyl ester. Magnesium: 50-70% of adults are deficient. Glycinate form for sleep (200-400mg), citrate for general supplementation. Critical for 300+ enzymatic reactions. Creatine monohydrate (3-5g daily) is now recognized for cognitive benefits beyond muscle, with emerging neuroprotective evidence." },
      { heading: "Promising but Emerging", body: "Collagen peptides (15g daily) show modest benefits for skin elasticity and joint health in randomized trials. NMN/NR (nicotinamide mononucleotide/riboside) are NAD+ precursors. Animal data is compelling for reversing age-related decline, but large human RCTs are still lacking. Typical dose: 500-1000mg NMN. Ashwagandha (KSM-66 at 600mg) reduces cortisol by 30% in clinical trials, with meaningful improvements in sleep quality and stress resilience. Berberine (500mg 2-3x daily) mimics some effects of metformin on blood sugar regulation, activating AMPK." },
      { heading: "Skip These (Weak or No Evidence)", body: "Most multivitamins show no mortality benefit in well-nourished populations. Antioxidant mega-doses (vitamin C, E at high doses) can actually be harmful by blunting the beneficial stress response from exercise (hormesis). Testosterone boosters (tribulus, fenugreek) have no meaningful impact on testosterone levels. Colloidal silver, alkaline water, detox supplements are all marketing without science. The golden rule: test, do not guess. Get blood work done before supplementing. Target measured deficiencies. The most expensive supplement is the one you do not need." },
    ],
  },
};

/* ══════════════ PILLAR CARD DATA ══════════════ */
var PILLARS = [
  { id: "exercise", icon: "\u{1F3CB}\uFE0F", title: "Exercise", dose: "150+ min/wk moderate or 75 min vigorous", minY: 3.4, maxY: 4.5, study: "Moore et al., PLOS Medicine 2012", desc: "The single most powerful longevity intervention. A brisk 22-minute daily walk adds 3+ years.", insight: "Even 15 min/day beats sedentary by 3 years" },
  { id: "nutrition", icon: "\u{1F96C}", title: "Nutrition", dose: "Plant-rich, Mediterranean-style", minY: 10, maxY: 13, study: "Fadnes et al., PLOS Medicine 2022", desc: "Switching from a Western diet to an optimised diet at age 20 adds 10.7 years.", insight: "Largest single factor \u2014 diet shapes destiny" },
  { id: "social", icon: "\u{1F91D}", title: "Social Connection", dose: "Strong relationships and community", minY: 3, maxY: 7, study: "Holt-Lunstad et al., PLOS Medicine 2010", desc: "Loneliness is as deadly as smoking 15 cigarettes a day. Strong social bonds increase survival by 50%.", insight: "Loneliness matches smoking in mortality risk" },
  { id: "sleep", icon: "\u{1F319}", title: "Sleep Regularity", dose: "7\u20138 hrs with consistent timing", minY: 2, maxY: 5, study: "Windred et al., SLEEP 2024", desc: "Sleep irregularity increases all-cause mortality by 20\u201348%. Consistency matters as much as total hours.", insight: "Consistency matters more than duration" },
  { id: "sauna", icon: "\u{1F9D6}", title: "Sauna Bathing", dose: "4\u20137 sessions per week, 15\u201320 min", minY: 2, maxY: 3, study: "Laukkanen et al., JAMA Internal Med 2015", desc: "4\u20137 sauna sessions per week cut cardiovascular mortality by 50% and all-cause mortality by 40%.", insight: "50% lower CVD death at 4\u20137x per week" },
  { id: "cold", icon: "\u2744\uFE0F", title: "Cold Exposure", dose: "Cold showers, ice baths, winter swimming", minY: 1, maxY: 2, study: "\u0160r\u00e1mek et al., Eur J Appl Physiol 2000", desc: "Cold exposure activates brown fat, reduces inflammation, boosts norepinephrine 200-300%.", insight: "Activates brown fat and cuts inflammation" },
  { id: "supplements", icon: "\u{1F48A}", title: "Supplements", dose: "D3, Omega-3, Magnesium (evidence-based)", minY: 0.5, maxY: 2, study: "Manson et al., VITAL Trial, NEJM 2019", desc: "Omega-3 reduced heart attacks by 28%. Target real deficiencies, skip the hype.", insight: "Target real deficiencies, skip the hype" },
];

/* ══════════════ CALCULATOR ══════════════ */
var BASE_LIFE = { male: 76, female: 81 };
var DEFAULT_INPUTS = { age: 30, sex: "male", exerciseDays: 3, exerciseIntensity: 5, saunaSessions: 1, dietScore: 5, sleepScore: 5, supplementScore: 3, socialScore: 5, coldExposure: 2, smokingStatus: 0, alcoholScore: 5 };

function r1(n) { return Math.round(n * 10) / 10; }

function calcLifespan(inp) {
  var base = BASE_LIFE[inp.sex];
  var raw = [
    { key: "exercise", label: "Exercise", years: (inp.exerciseDays / 7) * (inp.exerciseIntensity / 10) * 4.5, color: T.accent },
    { key: "nutrition", label: "Nutrition", years: (inp.dietScore / 10) * 13, color: "#2E8B6A" },
    { key: "social", label: "Social", years: (inp.socialScore / 10) * 7, color: T.mid },
    { key: "sleep", label: "Sleep", years: (inp.sleepScore / 10) * 5, color: "#6BA3C7" },
    { key: "sauna", label: "Sauna", years: Math.min(inp.saunaSessions / 4, 1) * 3, color: T.auroraLight },
    { key: "cold", label: "Cold", years: (inp.coldExposure / 10) * 2, color: "#8AC4D0" },
    { key: "supplements", label: "Supplements", years: (inp.supplementScore / 10) * 2, color: "#89CFF0" },
    { key: "smoking", label: "Smoking", years: inp.smokingStatus === 0 ? 0 : inp.smokingStatus === 1 ? -5 : -10, color: T.warm },
    { key: "alcohol", label: "Alcohol", years: (inp.alcoholScore >= 4 && inp.alcoholScore <= 6) ? 1 : inp.alcoholScore > 7 ? -3 : 0, color: T.warmLight },
  ];
  var factors = raw.map(function (f) { return { key: f.key, label: f.label, years: r1(f.years), color: f.color }; });
  var total = base + factors.reduce(function (s, f) { return s + f.years; }, 0);
  return { base: base, total: r1(total), factors: factors };
}

/* ══════════════ HOOKS ══════════════ */
function useReveal(threshold) {
  if (threshold === undefined) threshold = 0.15;
  var ref = useRef(null);
  var _s = useState(false), vis = _s[0], setVis = _s[1];
  useEffect(function () {
    var el = ref.current; if (!el) return;
    var obs = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: threshold });
    obs.observe(el); return function () { obs.disconnect(); };
  }, [threshold]);
  return [ref, vis];
}

function useAnim(value, dec, dur) {
  if (dec === undefined) dec = 1; if (dur === undefined) dur = 700;
  var _s = useState(value), d = _s[0], setD = _s[1];
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

/* ══════════════ ANIMATED CHARACTER (SVG) ══════════════ */
function HabitCharacter({ inputs }) {
  /* ── derived metrics ── */
  var ex = inputs.exerciseDays * inputs.exerciseIntensity / 10;
  var muscle = Math.min(ex / 5, 1);                        /* 0-1  */
  var fatness = Math.max(1.15 - (inputs.dietScore / 10) * 0.25, 0.82);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;
  var smoking = inputs.smokingStatus === 2;
  var lightSmoker = inputs.smokingStatus === 1;
  var drinkLvl = inputs.alcoholScore;                      /* 0-10 */
  var isSleepy = inputs.sleepScore < 4;
  var isRested = inputs.sleepScore >= 7;
  var isHappy = inputs.socialScore > 5 && health > 0.5;
  var isSad = inputs.socialScore < 3;
  var coldLvl = inputs.coldExposure;
  var saunaLvl = inputs.saunaSessions;
  var suppLvl = inputs.supplementScore;
  var age = inputs.age;

  /* ── skin color: shifts with health, smoking, cold ── */
  var sr = smoking ? 210 : lightSmoker ? 225 : Math.round(235 + health * 20);
  var sg = smoking ? 180 : lightSmoker ? 195 : Math.round(195 + health * 35);
  var sb = smoking ? 145 : lightSmoker ? 160 : Math.round(155 + health * 25);
  if (coldLvl > 6) { sr = Math.round(sr * 0.92); sg = Math.round(sg * 0.95); sb = Math.round(sb * 1.06); }
  var skin = "rgb(" + sr + "," + sg + "," + sb + ")";
  var skinDark = "rgb(" + Math.round(sr * 0.88) + "," + Math.round(sg * 0.88) + "," + Math.round(sb * 0.88) + ")";

  /* ── body dimensions ── */
  var torsoW = 42 * fatness;
  var torsoH = 70;
  var shoulderW = torsoW + 6 + muscle * 14;
  var armW = 11 + muscle * 5;
  var legW = 13 + (fatness - 0.82) * 10;

  /* ── cheek flush from exercise/health ── */
  var cheekOpacity = health > 0.5 ? (health - 0.5) * 0.35 : 0;

  /* ── helper: transition style ── */
  var tr = { transition: "all 0.45s cubic-bezier(.4,0,.2,1)" };

  /* ── glow color ── */
  var glowColor = health > 0.6 ? "rgba(43,168,125," + (0.06 + health * 0.1) + ")" : health > 0.35 ? "rgba(59,140,196,0.06)" : "rgba(217,88,67,0.06)";

  return (
    <svg viewBox="0 0 240 340" style={{ width: 220, height: 310, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="cGlow"><stop offset="0%" stopColor={glowColor} /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <linearGradient id="shirtG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={health > 0.5 ? T.accent : "#8EAABB"} />
          <stop offset="100%" stopColor={health > 0.5 ? T.accentSoft : "#B0C4D1"} />
        </linearGradient>
        <linearGradient id="pantsG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ex > 3 ? "#2D5F8A" : "#5C7A94"} />
          <stop offset="100%" stopColor={ex > 3 ? "#1B4965" : "#4A6577"} />
        </linearGradient>
        <linearGradient id="hairG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={age > 55 ? "#9CA3AF" : "#2C1810"} />
          <stop offset="100%" stopColor={age > 55 ? "#B0B7C0" : "#4A3228"} />
        </linearGradient>
        <filter id="softShadow"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(12,45,72,0.12)" /></filter>
      </defs>

      {/* ── platform shadow ── */}
      <ellipse cx="120" cy="318" rx="55" ry="10" fill="url(#cGlow)" style={tr} />

      {/* ── LEGS ── */}
      <rect x={120 - legW / 2 - 10} y="248" width={legW} height="58" rx={legW / 2} fill="url(#pantsG)" style={tr} />
      <rect x={120 + 10 - legW / 2} y="248" width={legW} height="58" rx={legW / 2} fill="url(#pantsG)" style={tr} />

      {/* ── SHOES ── */}
      <ellipse cx={120 - 10} cy="310" rx={legW / 2 + 4} ry="7" fill={ex > 3 ? T.accent : ex > 1 ? "#7BACC4" : "#999"} style={tr} />
      <ellipse cx={120 + 10} cy="310" rx={legW / 2 + 4} ry="7" fill={ex > 3 ? T.accent : ex > 1 ? "#7BACC4" : "#999"} style={tr} />
      {ex > 3 && <>
        <line x1={120 - 14} y1="308" x2={120 - 6} y2="308" stroke="white" strokeWidth="1" opacity="0.5" />
        <line x1={120 + 6} y1="308" x2={120 + 14} y2="308" stroke="white" strokeWidth="1" opacity="0.5" />
      </>}

      {/* ── TORSO (shirt) ── */}
      <path d={"M" + (120 - shoulderW / 2) + ",170 Q" + (120 - shoulderW / 2 - 2) + ",175 " + (120 - torsoW / 2) + ",245 L" + (120 + torsoW / 2) + ",245 Q" + (120 + shoulderW / 2 + 2) + ",175 " + (120 + shoulderW / 2) + ",170 Q120,160 " + (120 - shoulderW / 2) + ",170Z"} fill="url(#shirtG)" style={tr} filter="url(#softShadow)" />

      {/* shirt neckline */}
      <path d={"M" + (120 - 12) + ",168 Q120,178 " + (120 + 12) + ",168"} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

      {/* ── MUSCLE DEFINITION on shirt ── */}
      {muscle > 0.4 && <>
        <path d={"M" + (120 - shoulderW / 2 + 3) + ",180 Q" + (120 - shoulderW / 2 + 6) + ",200 " + (120 - torsoW / 2 + 5) + ",230"} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1 + muscle * 2} style={tr} />
        <path d={"M" + (120 + shoulderW / 2 - 3) + ",180 Q" + (120 + shoulderW / 2 - 6) + ",200 " + (120 + torsoW / 2 - 5) + ",230"} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1 + muscle * 2} style={tr} />
      </>}
      {muscle > 0.7 && <line x1="114" y1="195" x2="126" y2="195" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />}

      {/* ── ARMS ── */}
      <rect x={120 - shoulderW / 2 - armW + 2} y="170" width={armW} height={52 + muscle * 5} rx={armW / 2} fill={skin} style={tr} />
      <rect x={120 + shoulderW / 2 - 2} y="170" width={armW} height={52 + muscle * 5} rx={armW / 2} fill={skin} style={tr} />

      {/* bicep curves when muscular */}
      {muscle > 0.5 && <>
        <ellipse cx={120 - shoulderW / 2 - armW / 2 + 2} cy="188" rx={2 + muscle * 3} ry={5 + muscle * 4} fill="rgba(0,0,0,0.04)" style={tr} />
        <ellipse cx={120 + shoulderW / 2 + armW / 2 - 2} cy="188" rx={2 + muscle * 3} ry={5 + muscle * 4} fill="rgba(0,0,0,0.04)" style={tr} />
      </>}

      {/* ── HANDS ── */}
      <circle cx={120 - shoulderW / 2 - armW / 2 + 2} cy={224 + muscle * 5} r={5 + muscle} fill={skin} style={tr} />
      <circle cx={120 + shoulderW / 2 + armW / 2 - 2} cy={224 + muscle * 5} r={5 + muscle} fill={skin} style={tr} />

      {/* ── NECK ── */}
      <rect x="111" y="132" width="18" height="40" rx="9" fill={skin} style={tr} />

      {/* ── HEAD ── */}
      <ellipse cx="120" cy="108" rx="34" ry="38" fill={skin} style={tr} filter="url(#softShadow)" />

      {/* ── HAIR ── */}
      <path d={"M82,100 Q84," + (age > 65 ? "72" : "62") + " 120,58 Q156," + (age > 65 ? "72" : "62") + " 158,100 Q155,78 120,72 Q85,78 82,100Z"} fill="url(#hairG)" style={tr} />
      {age > 45 && age <= 65 && <>
        <line x1="96" y1="68" x2="98" y2="80" stroke="#9CA3AF" strokeWidth="1" opacity="0.3" />
        <line x1="140" y1="69" x2="138" y2="81" stroke="#9CA3AF" strokeWidth="1" opacity="0.3" />
      </>}

      {/* ── EYEBROWS ── */}
      <path d={"M98,90 Q105," + (isSad ? "92" : isHappy ? "86" : "89") + " 112,90"} fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" style={tr} />
      <path d={"M128,90 Q135," + (isSad ? "92" : isHappy ? "86" : "89") + " 142,90"} fill="none" stroke={skinDark} strokeWidth="2" strokeLinecap="round" style={tr} />

      {/* ── EYES ── */}
      {isSleepy ? <>
        <path d="M100,98 Q106,96 112,98" fill="none" stroke={T.deep} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M128,98 Q134,96 140,98" fill="none" stroke={T.deep} strokeWidth="2.2" strokeLinecap="round" />
      </> : <>
        {/* eye whites */}
        <ellipse cx="106" cy="97" rx="7" ry={isRested ? 6 : 5} fill={T.white} style={tr} />
        <ellipse cx="134" cy="97" rx="7" ry={isRested ? 6 : 5} fill={T.white} style={tr} />
        {/* iris */}
        <circle cx="106" cy="97" r="3.8" fill={health > 0.6 ? "#3B7CC4" : "#5A7A8A"} style={tr} />
        <circle cx="134" cy="97" r="3.8" fill={health > 0.6 ? "#3B7CC4" : "#5A7A8A"} style={tr} />
        {/* pupil */}
        <circle cx="106" cy="97" r="2" fill={T.deep} />
        <circle cx="134" cy="97" r="2" fill={T.deep} />
        {/* sparkle */}
        <circle cx="108" cy="95" r="1.3" fill={T.white} opacity={isRested ? "0.9" : "0.5"} />
        <circle cx="136" cy="95" r="1.3" fill={T.white} opacity={isRested ? "0.9" : "0.5"} />
        {/* under-eye circles when tired */}
        {inputs.sleepScore < 5 && <>
          <path d="M99,102 Q106,105 113,102" fill="none" stroke="rgba(120,100,140,0.15)" strokeWidth={2 + (5 - inputs.sleepScore) * 0.4} style={tr} />
          <path d="M127,102 Q134,105 141,102" fill="none" stroke="rgba(120,100,140,0.15)" strokeWidth={2 + (5 - inputs.sleepScore) * 0.4} style={tr} />
        </>}
      </>}

      {/* ── NOSE ── */}
      <path d="M118,104 Q120,110 122,104" fill="none" stroke={skinDark} strokeWidth="1.5" strokeLinecap="round" />

      {/* ── CHEEK FLUSH ── */}
      <ellipse cx="94" cy="108" rx="8" ry="5" fill={"rgba(220,110,100," + cheekOpacity + ")"} style={tr} />
      <ellipse cx="146" cy="108" rx="8" ry="5" fill={"rgba(220,110,100," + cheekOpacity + ")"} style={tr} />

      {/* ── MOUTH ── multiple states */}
      {isHappy ?
        <path d="M108,116 Q120,128 132,116" fill="rgba(180,60,60,0.15)" stroke={T.deep} strokeWidth="2" strokeLinecap="round" style={tr} /> :
       isSad ?
        <path d="M108,122 Q120,115 132,122" fill="none" stroke={T.deep} strokeWidth="2" strokeLinecap="round" style={tr} /> :
       smoking ?
        <line x1="110" y1="118" x2="130" y2="118" stroke={T.deep} strokeWidth="2" strokeLinecap="round" /> :
        <path d="M110,118 Q120,121 130,118" fill="none" stroke={T.deep} strokeWidth="1.8" strokeLinecap="round" style={tr} />
      }

      {/* ── AGE: wrinkles ── */}
      {age > 50 && <>
        <path d="M92,105 Q94,107 96,105" fill="none" stroke={skinDark} strokeWidth="0.8" opacity="0.3" />
        <path d="M144,105 Q146,107 148,105" fill="none" stroke={skinDark} strokeWidth="0.8" opacity="0.3" />
      </>}
      {age > 60 && <>
        <line x1="100" y1="82" x2="104" y2="84" stroke={skinDark} strokeWidth="0.7" opacity="0.25" />
        <line x1="136" y1="84" x2="140" y2="82" stroke={skinDark} strokeWidth="0.7" opacity="0.25" />
      </>}

      {/* ══════ ACCESSORIES & EFFECTS ══════ */}

      {/* ── CIGARETTE ── */}
      {smoking && <>
        <rect x="130" y="115" width="24" height="4" rx="1.5" fill="#F5E6D0" />
        <rect x="150" y="115" width="4" height="4" rx="1" fill="#E85D3A" />
        <circle cx="152" cy="115" r="2" fill="#FF6B35" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
        <path d="M155,113 Q158,103 154,95 Q157,87 155,80" fill="none" stroke="#C0C0C0" strokeWidth="2" opacity="0.35">
          <animate attributeName="d" values="M155,113 Q158,103 154,95 Q157,87 155,80;M155,113 Q160,101 153,93 Q158,85 154,77;M155,113 Q158,103 154,95 Q157,87 155,80" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M156,110 Q161,98 155,89" fill="none" stroke="#D0D0D0" strokeWidth="1.2" opacity="0.2">
          <animate attributeName="d" values="M156,110 Q161,98 155,89;M156,110 Q163,96 154,87;M156,110 Q161,98 155,89" dur="3s" repeatCount="indefinite" />
        </path>
      </>}
      {/* light smoker: no cigarette but yellowed teeth hint */}
      {lightSmoker && <ellipse cx="120" cy="119" rx="5" ry="1" fill="rgba(200,180,100,0.15)" />}

      {/* ── BEER / WINE ── gradual */}
      {drinkLvl > 4 && <>
        <g transform={"translate(" + (120 - shoulderW / 2 - armW - 8) + "," + (200 + muscle * 3) + ")"}>
          {drinkLvl > 7 ? <>
            {/* full pint glass */}
            <path d="M0,0 L2,28 L14,28 L16,0Z" fill="rgba(35,55,80,0.15)" />
            <path d="M1,4 L3,26 L13,26 L15,4Z" fill="#F5C542" opacity="0.85" />
            <rect x="0" y="-2" width="16" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="15" y="6" width="5" height="14" rx="2.5" fill="rgba(35,55,80,0.12)" />
          </> : <>
            {/* wine glass */}
            <ellipse cx="7" cy="8" rx="7" ry="8" fill="rgba(35,55,80,0.08)" />
            <ellipse cx="7" cy="8" rx="5.5" ry="6" fill={"rgba(160,40,50," + (0.2 + (drinkLvl - 4) * 0.1) + ")"} />
            <rect x="5.5" y="16" width="3" height="10" rx="1" fill="rgba(35,55,80,0.12)" />
            <rect x="1" y="26" width="12" height="2" rx="1" fill="rgba(35,55,80,0.1)" />
          </>}
        </g>
      </>}
      {/* tipsy red nose at very high alcohol */}
      {drinkLvl > 8 && <circle cx="120" cy="107" r="4" fill="rgba(210,80,80,0.2)" style={tr} />}

      {/* ── SAUNA STEAM ── gradual */}
      {saunaLvl >= 2 && <g opacity={0.15 + saunaLvl * 0.05}>
        <path d="M82,155 Q79,140 83,128" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round">
          <animate attributeName="d" values="M82,155 Q79,140 83,128;M80,153 Q84,138 78,125;M82,155 Q79,140 83,128" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M158,152 Q161,137 157,126" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round">
          <animate attributeName="d" values="M158,152 Q161,137 157,126;M160,150 Q156,136 162,124;M158,152 Q161,137 157,126" dur="3.2s" repeatCount="indefinite" />
        </path>
        {saunaLvl >= 4 && <path d="M120,155 Q118,142 122,130" fill="none" stroke={T.dim} strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="d" values="M120,155 Q118,142 122,130;M122,153 Q116,140 120,128;M120,155 Q118,142 122,130" dur="2.2s" repeatCount="indefinite" />
        </path>}
        {saunaLvl >= 5 && <>
          <circle cx="78" cy="120" r="2" fill={T.dim} opacity="0.15">
            <animate attributeName="cy" values="120;112;120" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="162" cy="118" r="1.5" fill={T.dim} opacity="0.12">
            <animate attributeName="cy" values="118;110;118" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </>}
      </g>}

      {/* ── COLD EXPOSURE: snowflakes + goosebumps ── gradual */}
      {coldLvl > 2 && <g opacity={0.2 + coldLvl * 0.06}>
        <text x="55" y="168" fontSize={8 + coldLvl * 0.5} fill={T.accent}>{"\u2744"}</text>
        {coldLvl > 4 && <text x="168" y="155" fontSize={7 + coldLvl * 0.4} fill={T.accent}>{"\u2744"}</text>}
        {coldLvl > 6 && <>
          <text x="48" y="135" fontSize="8" fill={T.accentSoft}>{"\u2744"}</text>
          <text x="175" y="180" fontSize="7" fill={T.accentSoft}>{"\u2744"}</text>
        </>}
        {coldLvl > 8 && <>
          <text x="60" y="200" fontSize="9" fill={T.accent} opacity="0.4">{"\u2744"}</text>
          <text x="165" y="210" fontSize="7" fill={T.accent} opacity="0.3">{"\u2744"}</text>
          {/* frost on shoulders */}
          <line x1={120 - shoulderW / 2} y1="170" x2={120 - shoulderW / 2 + 8} y2="170" stroke={T.ice} strokeWidth="1.5" opacity="0.4" />
          <line x1={120 + shoulderW / 2 - 8} y1="170" x2={120 + shoulderW / 2} y2="170" stroke={T.ice} strokeWidth="1.5" opacity="0.4" />
        </>}
      </g>}

      {/* ── SUPPLEMENTS: pill bottle ── */}
      {suppLvl > 3 && <g transform={"translate(" + (120 + shoulderW / 2 + armW + 3) + "," + (202 + muscle * 3) + ")"} opacity={0.5 + suppLvl * 0.05}>
        <rect x="0" y="0" width="10" height="16" rx="2" fill={T.aurora} />
        <rect x="-1" y="-2" width="12" height="5" rx="2" fill={T.auroraLight} />
        <text x="5" y="12" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">+</text>
        {suppLvl > 6 && <>
          <circle cx="3" cy="-6" r="2.5" fill={T.warmLight} opacity="0.7" />
          <circle cx="10" cy="-4" r="2" fill={T.aurora} opacity="0.6" />
        </>}
      </g>}

      {/* ── SLEEP ZZZ ── gradual */}
      {isSleepy && <g>
        <text x="150" y="80" fontFamily={T.mono} fontSize="10" fill={T.dim} opacity="0.4">z</text>
        <text x="160" y="70" fontFamily={T.mono} fontSize="13" fill={T.dim} opacity="0.35">z</text>
        <text x="168" y="58" fontFamily={T.mono} fontSize="16" fill={T.dim} opacity="0.3">z</text>
      </g>}

      {/* ── SOCIAL: heart ── gradual */}
      {inputs.socialScore > 4 && <g opacity={0.15 + (inputs.socialScore - 4) * 0.1}>
        <text x="66" y="90" fontSize={10 + inputs.socialScore * 0.5} fill="#E85D7A">{"\u2665"}</text>
        {inputs.socialScore > 7 && <text x="160" y="95" fontSize="10" fill="#E85D7A">{"\u2665"}</text>}
        {inputs.socialScore > 9 && <text x="74" y="160" fontSize="8" fill="#E85D7A">{"\u2665"}</text>}
      </g>}

      {/* ── EXERCISE: headband + sweat ── */}
      {ex > 4 && <>
        <path d={"M84,84 Q120,76 156,84"} fill="none" stroke={T.accent} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        {ex > 6 && <>
          <circle cx="88" cy="90" r="1.5" fill={T.accentSoft} opacity="0.5">
            <animate attributeName="cy" values="90;98;90" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="152" cy="89" r="1.3" fill={T.accentSoft} opacity="0.4">
            <animate attributeName="cy" values="89;96;89" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </>}
      </>}

      {/* ── OVERALL HEALTH AURA ── */}
      {health > 0.7 && <ellipse cx="120" cy="180" rx={50 + health * 20} ry={100 + health * 20} fill="none" stroke={T.aurora} strokeWidth="1" opacity={0.04 + health * 0.06} style={tr} />}
    </svg>
  );
}

/* ══════════════ GAUGE ══════════════ */
function Gauge({ value, max }) {
  if (max === undefined) max = 120;
  var dv = useAnim(value); var pct = Math.min(value / max, 1);
  var r = 86, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 200" style={{ width: 200, height: 200, display: "block", margin: "0 auto" }}>
      <defs><linearGradient id="gG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.accent} /><stop offset="100%" stopColor={T.aurora} /></linearGradient></defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.glassBorder} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#gG)" strokeWidth={8} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" transform={"rotate(-90 " + cx + " " + cy + ")"} style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={T.deep} fontFamily={T.mono} fontWeight="700" fontSize="34">{dv}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={T.sub} fontFamily={T.sans} fontSize="11" fontWeight="500">estimated years</text>
    </svg>
  );
}

/* ══════════════ BARS ══════════════ */
function Bars({ factors }) {
  var mx = Math.max.apply(null, factors.map(function (f) { return Math.abs(f.years); }).concat([0.1]));
  return (<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{factors.map(function (f) { return (
    <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 76, textAlign: "right", fontSize: 11, color: T.sub, fontFamily: T.sans, fontWeight: 500 }}>{f.label}</span>
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
    <input type="range" min={min} max={max} step={step} value={value} onChange={function (e) { onChange(Number(e.target.value)); }} style={{ width: "100%", height: 5, appearance: "none", WebkitAppearance: "none", borderRadius: 99, outline: "none", cursor: "pointer", background: "linear-gradient(to right," + T.accent + " 0%," + T.accent + " " + pct + "%," + T.faint + " " + pct + "%," + T.faint + " 100%)" }} />
  </div>);
}

/* ══════════════ PILLAR CARD ══════════════ */
function PillarCard({ p, index, onOpen }) {
  var _r = useReveal(0.1), ref = _r[0], vis = _r[1];
  return (
    <div ref={ref} onClick={function () { onOpen(p.id); }} style={{ padding: "24px 22px", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, cursor: "pointer", transition: "all 0.4s cubic-bezier(.4,0,.2,1) " + (index * 0.05) + "s, transform 0.2s ease", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", position: "relative", overflow: "hidden" }}
      onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = T.shadowLg; e.currentTarget.style.borderColor = T.glassBorderHover; }}
      onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderColor = T.glassBorder; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{p.icon}</span>
        <div style={{ fontFamily: T.mono, fontSize: 17, fontWeight: 700, color: T.aurora }}>+{p.minY}&ndash;{p.maxY}<span style={{ fontSize: 10, fontWeight: 500, color: T.sub, marginLeft: 2 }}>yrs</span></div>
      </div>
      <h3 style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, color: T.deep, marginBottom: 2, letterSpacing: -0.3 }}>{p.title}</h3>
      <div style={{ fontSize: 11, color: T.accent, fontFamily: T.mono, marginBottom: 10, letterSpacing: -0.2 }}>{p.dose}</div>
      <p style={{ fontSize: 12.5, lineHeight: 1.7, color: T.sub, marginBottom: 14 }}>{p.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "rgba(43,168,125,0.06)", border: "1px solid rgba(43,168,125,0.12)" }}>
        <span style={{ fontSize: 12 }}>{"\u{1F4A1}"}</span>
        <span style={{ fontSize: 11, color: T.aurora, fontWeight: 600 }}>{p.insight}</span>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9.5, color: T.dim, fontFamily: T.mono }}>{p.study}</span>
        <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Learn more &rarr;</span>
      </div>
    </div>
  );
}

/* ══════════════ DETAIL MODAL ══════════════ */
function DetailModal({ pillarId, onClose }) {
  var data = PILLAR_DETAILS[pillarId];
  if (!data) return null;
  useEffect(function () { document.body.style.overflow = "hidden"; return function () { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,45,72,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />
      <div onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", background: T.white, borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 32px 80px rgba(12,45,72,0.2)", padding: 0 }}>
        {/* header */}
        <div style={{ padding: "32px 36px 24px", borderBottom: "1px solid " + T.glassBorder, position: "sticky", top: 0, background: T.white, borderRadius: "20px 20px 0 0", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 700, color: T.deep, letterSpacing: -0.5 }}>{data.title}</h2>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + T.glassBorder, background: T.faint, cursor: "pointer", fontSize: 18, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>&times;</button>
          </div>
        </div>
        {/* sections */}
        <div style={{ padding: "24px 36px 36px" }}>
          {data.sections.map(function (sec, i) {
            return (
              <div key={i} style={{ marginBottom: i < data.sections.length - 1 ? 32 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: data.color }} />
                  <h3 style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.deep }}>{sec.heading}</h3>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: T.sub, paddingLeft: 14 }}>{sec.body}</p>
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
  { year: "2022", title: "Estimating impact of food choices on life expectancy", a: "Fadnes et al.", j: "PLOS Medicine", f: "+10.7 yrs from optimal diet at age 20" },
  { year: "2015", title: "Sauna bathing and fatal cardiovascular events", a: "Laukkanen et al.", j: "JAMA Internal Medicine", f: "4\u20137x/wk: 50% lower CVD mortality" },
  { year: "2012", title: "Leisure time physical activity and mortality", a: "Moore et al.", j: "PLOS Medicine", f: "+4.5 yrs from 150 min/wk exercise" },
  { year: "2024", title: "Sleep regularity and all-cause mortality", a: "Windred et al.", j: "SLEEP", f: "Irregular sleep: 20\u201348% higher death risk" },
  { year: "2010", title: "Social relationships and mortality risk", a: "Holt-Lunstad et al.", j: "PLOS Medicine", f: "Strong ties: 50% survival increase" },
  { year: "2019", title: "Vitamin D and Omega-3 supplementation", a: "Manson et al.", j: "New England J of Medicine", f: "Omega-3: 28% fewer heart attacks" },
];

var LBL = { intensity: ["", "Light walk", "", "", "Moderate", "", "", "Vigorous", "", "", "Elite"], cold: ["None", "", "Occasional", "", "", "Regular", "", "", "", "", "Daily"], diet: ["Fast food", "", "", "", "Average", "", "", "", "Plant-rich", "", "Optimal"], sleep: ["Chaotic", "", "", "", "Irregular", "", "", "", "Consistent", "", "Perfect"], supps: ["None", "", "", "Basics", "", "", "", "Targeted", "", "", "Optimised"], social: ["Isolated", "", "", "", "Some", "", "", "", "Strong", "", "Thriving"], smoking: ["Never", "Former", "Current"], alcohol: ["None", "", "", "Light", "", "Moderate", "", "", "Heavy", "", "Excessive"] };
function lb(a, v) { return a[v] || String(v); }

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function App() {
  var _s = useState(DEFAULT_INPUTS), inputs = _s[0], setInputs = _s[1];
  var _e = useState(false), emailSent = _e[0], setEmailSent = _e[1];
  var _m = useState(null), modal = _m[0], setModal = _m[1];
  var calcRef = useRef(null);
  var set = useCallback(function (k, v) { setInputs(function (p) { var n = {}; for (var x in p) n[x] = p[x]; n[k] = v; return n; }); }, []);
  var result = useMemo(function () { return calcLifespan(inputs); }, [inputs]);
  var top3 = useMemo(function () { return result.factors.slice().sort(function (a, b) { return b.years - a.years; }).slice(0, 3); }, [result]);
  var gained = r1(result.total - result.base);
  var gainedD = useAnim(gained);
  var scrollCalc = function () { calcRef.current && calcRef.current.scrollIntoView({ behavior: "smooth" }); };
  var _r1 = useReveal(0.08), pRef = _r1[0], pVis = _r1[1];
  var _r2 = useReveal(0.1), cRef = _r2[0], cVis = _r2[1];
  var _r3 = useReveal(0.1), eRef = _r3[0], eVis = _r3[1];
  function Div() { return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + T.glassBorder + ", transparent)", margin: "0 auto", maxWidth: 600 }} />; }
  var gc = function (s) { return { background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, padding: s }; };

  return (
    <>
      <style>{"\\n@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');\\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\\nhtml{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\\nbody{background:" + T.bg + ";color:" + T.text + ";font-family:" + T.sans + ";overflow-x:hidden}\\n::selection{background:" + T.ice + ";color:" + T.deep + "}\\ninput[type=range]{-webkit-appearance:none;appearance:none}\\ninput[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer;box-shadow:0 2px 8px rgba(12,45,72,0.15);transition:transform 0.15s}\\ninput[type=range]::-webkit-slider-thumb:hover{transform:scale(1.15)}\\ninput[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer}\\ninput[type=range]:focus{outline:none}\\n.mx{max-width:1120px;margin:0 auto;padding:0 28px}\\n@media(max-width:840px){.cg{grid-template-columns:1fr!important}.er{grid-template-columns:1fr!important}.hs{flex-direction:column;gap:4px!important}.pg{grid-template-columns:1fr!important}}\\n@keyframes gp{0%,100%{box-shadow:0 0 0 0 rgba(59,140,196,0.12)}50%{box-shadow:0 0 0 14px rgba(59,140,196,0)}}\\n      "}</style>

      {modal && <DetailModal pillarId={modal} onClose={function () { setModal(null); }} />}

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(175deg," + T.faint + " 0%," + T.bg + " 40%,rgba(43,168,125,0.03) 100%)" }}>
        <FrostParticles />
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15, color: T.deep }}><span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</div>
          <button onClick={scrollCalc} style={{ ...gc("8px 22px"), cursor: "pointer", fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.deep }}>Calculate Now</button>
        </nav>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 760, padding: "0 28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: T.glass, border: "1px solid " + T.glassBorder, marginBottom: 28, backdropFilter: T.blurLight }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.aurora, display: "inline-block" }} />
            <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.sub, letterSpacing: 1.2, textTransform: "uppercase" }}>Based on 6 peer-reviewed meta-analyses</span>
          </div>
          <h1 style={{ fontFamily: T.sans, fontSize: "clamp(34px,5.5vw,58px)", fontWeight: 700, color: T.deep, lineHeight: 1.08, marginBottom: 20, letterSpacing: -1.5 }}>Your Habits Decide<br />How Long You Live</h1>
          <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: T.sub, lineHeight: 1.78, maxWidth: 540, margin: "0 auto 36px" }}>Genetics account for only 20&ndash;30% of longevity. The rest is shaped by what you eat, how you move, and when you sleep. Click any pillar below to learn exactly why.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={scrollCalc} style={{ background: T.accent, color: T.white, border: "none", padding: "14px 34px", borderRadius: 12, fontFamily: T.sans, fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(59,140,196,0.25)", animation: "gp 3s ease-in-out infinite" }}>Calculate My Lifespan</button>
            <button onClick={function () { document.getElementById("pillars").scrollIntoView({ behavior: "smooth" }); }} style={{ ...gc("14px 28px"), color: T.mid, cursor: "pointer", fontFamily: T.sans, fontSize: 15, fontWeight: 600 }}>Explore the Science</button>
          </div>
        </div>
        <div className="hs" style={{ position: "relative", zIndex: 1, display: "flex", gap: 48, justifyContent: "center", marginTop: 48, ...gc("24px 36px") }}>
          {[{ n: "+36.5", l: "max years gainable" }, { n: "308K+", l: "study participants" }, { n: "7", l: "evidence-backed pillars" }].map(function (s, i) { return (<div key={i} style={{ textAlign: "center" }}><div style={{ fontFamily: T.mono, fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: T.aurora }}>{s.n}</div><div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{s.l}</div></div>); })}
        </div>
        <div style={{ position: "absolute", top: "-12%", right: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,140,196,0.06),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-8%", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle,rgba(43,168,125,0.04),transparent 70%)", pointerEvents: "none" }} />
      </section>

      <div style={{ padding: "18px 0", borderBottom: "1px solid " + T.glassBorder, background: T.white }}>
        <div className="mx" style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
          {["JAMA Internal Medicine", "PLOS Medicine", "New England Journal of Medicine", "SLEEP Journal"].map(function (j) { return <span key={j} style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, letterSpacing: 1.5, textTransform: "uppercase" }}>{j}</span>; })}
        </div>
      </div>

      {/* PILLARS (clickable) */}
      <section id="pillars" style={{ padding: "96px 0 80px" }}>
        <div className="mx">
          <div ref={pRef} style={{ textAlign: "center", marginBottom: 52, opacity: pVis ? 1 : 0, transform: pVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>The Science</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: T.deep, letterSpacing: -0.8 }}>7 Pillars That Move the Needle</h2>
            <p style={{ color: T.sub, marginTop: 10, fontSize: 14, maxWidth: 480, margin: "10px auto 0" }}>Click any card to deep-dive into the biology, research, and practical tips.</p>
          </div>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
            {PILLARS.map(function (p, i) { return <PillarCard key={p.id} p={p} index={i} onOpen={setModal} />; })}
          </div>
        </div>
      </section>

      <Div />

      {/* CALCULATOR */}
      <section ref={calcRef} style={{ padding: "88px 0 100px" }}>
        <div className="mx">
          <div ref={cRef} style={{ textAlign: "center", marginBottom: 48, opacity: cVis ? 1 : 0, transform: cVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Interactive Calculator</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: T.deep, letterSpacing: -0.8 }}>How Long Will <em style={{ fontStyle: "italic", color: T.accent }}>You</em> Live?</h2>
          </div>

          <div className="cg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
            {/* INPUTS */}
            <div style={gc(32)}>
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>BASICS</div>
              <Sl label="Your Age" value={inputs.age} onChange={function (v) { set("age", v); }} min={18} max={90} />
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["male", "female"].map(function (s) { return (<button key={s} onClick={function () { set("sex", s); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontFamily: T.sans, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: inputs.sex === s ? T.accent : T.glass, color: inputs.sex === s ? T.white : T.sub, border: "1.5px solid " + (inputs.sex === s ? T.accent : T.glassBorder), boxShadow: inputs.sex === s ? "0 2px 8px rgba(59,140,196,0.2)" : "none" }}>{s === "male" ? "Male" : "Female"}</button>); })}
              </div>
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>ACTIVITY</div>
              <Sl label="Exercise (days/week)" value={inputs.exerciseDays} onChange={function (v) { set("exerciseDays", v); }} min={0} max={7} />
              <Sl label="Exercise Intensity" value={inputs.exerciseIntensity} onChange={function (v) { set("exerciseIntensity", v); }} min={1} max={10} dv={lb(LBL.intensity, inputs.exerciseIntensity)} />
              <Sl label="Sauna (sessions/week)" value={inputs.saunaSessions} onChange={function (v) { set("saunaSessions", v); }} min={0} max={7} />
              <Sl label="Cold Exposure" value={inputs.coldExposure} onChange={function (v) { set("coldExposure", v); }} min={0} max={10} dv={lb(LBL.cold, inputs.coldExposure)} />
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>LIFESTYLE</div>
              <Sl label="Diet Quality" value={inputs.dietScore} onChange={function (v) { set("dietScore", v); }} dv={lb(LBL.diet, inputs.dietScore)} />
              <Sl label="Sleep Regularity" value={inputs.sleepScore} onChange={function (v) { set("sleepScore", v); }} dv={lb(LBL.sleep, inputs.sleepScore)} />
              <Sl label="Supplements" value={inputs.supplementScore} onChange={function (v) { set("supplementScore", v); }} dv={lb(LBL.supps, inputs.supplementScore)} />
              <Sl label="Social Connection" value={inputs.socialScore} onChange={function (v) { set("socialScore", v); }} dv={lb(LBL.social, inputs.socialScore)} />
              <div style={{ height: 1, background: T.glassBorder, margin: "4px 0 20px" }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>RISK FACTORS</div>
              <Sl label="Smoking" value={inputs.smokingStatus} onChange={function (v) { set("smokingStatus", v); }} min={0} max={2} dv={lb(LBL.smoking, inputs.smokingStatus)} />
              <Sl label="Alcohol" value={inputs.alcoholScore} onChange={function (v) { set("alcoholScore", v); }} dv={lb(LBL.alcohol, inputs.alcoholScore)} />
            </div>

            {/* RESULTS */}
            <div style={{ position: "sticky", top: 20 }}>
              {/* character */}
              <div style={{ ...gc("20px 20px 12px"), textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 8 }}>YOUR AVATAR</div>
                <HabitCharacter inputs={inputs} />
                <div style={{ fontSize: 11, color: T.dim, marginTop: 4, fontStyle: "italic" }}>Changes with your habits</div>
              </div>

              {/* gauge */}
              <div style={{ ...gc("28px 24px"), textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>ESTIMATED LIFESPAN</div>
                <Gauge value={result.total} />
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 24 }}>
                  <div><div style={{ fontSize: 10, color: T.dim }}>Baseline</div><div style={{ fontFamily: T.mono, fontWeight: 700, color: T.deep, fontSize: 17 }}>{result.base}</div></div>
                  <div style={{ width: 1, background: T.glassBorder }} />
                  <div><div style={{ fontSize: 10, color: T.dim }}>Your Gain</div><div style={{ fontFamily: T.mono, fontWeight: 700, color: gained >= 0 ? T.aurora : T.warm, fontSize: 17 }}>{gained >= 0 ? "+" : ""}{gainedD}</div></div>
                </div>
              </div>

              {/* top 3 */}
              <div style={{ ...gc("20px 22px"), marginBottom: 14 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>TOP 3 GAINS</div>
                {top3.map(function (f, i) { return (<div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 8 : 0 }}><div style={{ width: 24, height: 24, borderRadius: 7, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontFamily: T.mono, fontWeight: 700, fontSize: 11 }}>{i + 1}</div><span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.deep }}>{f.label}</span><span style={{ fontFamily: T.mono, fontWeight: 700, color: T.aurora, fontSize: 13 }}>+{f.years.toFixed(1)}y</span></div>); })}
              </div>

              {/* breakdown */}
              <div style={gc("20px 22px")}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, marginBottom: 10 }}>FULL BREAKDOWN</div>
                <Bars factors={result.factors} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Div />

      {/* EVIDENCE */}
      <section style={{ padding: "76px 0", background: T.bgAlt }}>
        <div className="mx">
          <div ref={eRef} style={{ textAlign: "center", marginBottom: 40, opacity: eVis ? 1 : 0, transform: eVis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Peer-Reviewed Research</div>
            <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, color: T.deep }}>The Evidence Wall</h2>
          </div>
          <div style={{ display: "grid", gap: 2 }}>
            {EVIDENCE.map(function (s, i) { return (<div key={i} className="er" style={{ padding: "16px 22px", display: "grid", gridTemplateColumns: "50px 1fr 200px", gap: 14, alignItems: "center", background: T.white, border: "1px solid " + T.glassBorder, borderRadius: i === 0 ? "12px 12px 0 0" : i === EVIDENCE.length - 1 ? "0 0 12px 12px" : "0" }}><div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.accent }}>{s.year}</div><div><div style={{ fontSize: 13, fontWeight: 600, color: T.deep, lineHeight: 1.4 }}>{s.title}</div><div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>{s.a} &middot; {s.j}</div></div><div style={{ fontSize: 11.5, color: T.aurora, fontFamily: T.mono, fontWeight: 600, textAlign: "right" }}>{s.f}</div></div>); })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "76px 0" }}>
        <div className="mx" style={{ maxWidth: 560, textAlign: "center" }}>
          <h2 style={{ fontFamily: T.sans, fontSize: "clamp(22px,3.5vw,28px)", fontWeight: 700, color: T.deep, marginBottom: 10 }}>Stay on the Cutting Edge</h2>
          <p style={{ color: T.sub, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>New longevity research every month, distilled into actionable insights.</p>
          {!emailSent ? (<form onSubmit={function (e) { e.preventDefault(); setEmailSent(true); }} style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}><input type="email" required placeholder="you@email.com" style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1.5px solid " + T.glassBorder, fontFamily: T.sans, fontSize: 14, outline: "none", background: T.white, color: T.deep }} /><button type="submit" style={{ background: T.accent, color: T.white, border: "none", padding: "12px 22px", borderRadius: 12, fontFamily: T.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Subscribe</button></form>) : (<div style={{ padding: "14px 24px", borderRadius: 12, background: "rgba(43,168,125,0.06)", border: "1px solid rgba(43,168,125,0.18)", fontFamily: T.mono, fontSize: 13, color: T.aurora }}>{"\u2713"} You are in.</div>)}
        </div>
      </section>

      <footer style={{ padding: "32px 0", borderTop: "1px solid " + T.glassBorder }}>
        <div className="mx" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div><div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.deep }}><span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</div><div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Educational &middot; Not medical advice</div></div>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: T.mono }}>Peer-reviewed science &middot; {new Date().getFullYear()}</div>
        </div>
      </footer>
    </>
  );
}
