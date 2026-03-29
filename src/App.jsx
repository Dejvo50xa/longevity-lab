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
  var ex = inputs.exerciseDays * inputs.exerciseIntensity / 10;
  var muscleScale = 0.8 + Math.min(ex, 5) * 0.08;
  var fatScale = Math.max(1.1 - (inputs.dietScore / 10) * 0.2, 0.85);
  var bodyWidth = 38 * fatScale;
  var smoking = inputs.smokingStatus === 2;
  var drinking = inputs.alcoholScore > 7;
  var healthyGlow = (inputs.dietScore + inputs.sleepScore + inputs.socialScore) / 30;
  var skinColor = smoking ? "#E8C9A0" : ("rgb(" + Math.round(230 + healthyGlow * 25) + "," + Math.round(190 + healthyGlow * 30) + "," + Math.round(150 + healthyGlow * 20) + ")");
  var isSleepy = inputs.sleepScore < 3;
  var isHappy = inputs.socialScore > 6 && inputs.dietScore > 6;

  return (
    <svg viewBox="0 0 200 280" style={{ width: 180, height: 250, display: "block", margin: "0 auto", transition: "all 0.5s ease" }}>
      {/* glow behind character */}
      <defs>
        <radialGradient id="charGlow"><stop offset="0%" stopColor={healthyGlow > 0.5 ? "rgba(43,168,125,0.12)" : "rgba(217,88,67,0.08)"} /><stop offset="100%" stopColor="transparent" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="250" rx="60" ry="12" fill={healthyGlow > 0.5 ? "rgba(43,168,125,0.08)" : "rgba(200,200,200,0.1)"} />

      {/* legs */}
      <rect x="80" y="195" width="14" height="55" rx="7" fill={skinColor} style={{ transition: "all 0.4s" }} />
      <rect x="106" y="195" width="14" height="55" rx="7" fill={skinColor} style={{ transition: "all 0.4s" }} />

      {/* shoes */}
      <ellipse cx="87" cy="252" rx="12" ry="6" fill={ex > 3 ? T.accent : "#888"} style={{ transition: "all 0.4s" }} />
      <ellipse cx="113" cy="252" rx="12" ry="6" fill={ex > 3 ? T.accent : "#888"} style={{ transition: "all 0.4s" }} />

      {/* body / torso */}
      <rect x={100 - bodyWidth / 2} y="120" width={bodyWidth} height="80" rx="16" fill={skinColor} style={{ transition: "all 0.4s" }} />

      {/* muscle indicator */}
      {ex > 2 && <>
        <ellipse cx={100 - bodyWidth / 2 - 4} cy="148" rx={4 * muscleScale} ry={8 * muscleScale} fill="rgba(0,0,0,0.06)" style={{ transition: "all 0.4s" }} />
        <ellipse cx={100 + bodyWidth / 2 + 4} cy="148" rx={4 * muscleScale} ry={8 * muscleScale} fill="rgba(0,0,0,0.06)" style={{ transition: "all 0.4s" }} />
      </>}

      {/* arms */}
      <rect x={100 - bodyWidth / 2 - 12} y="125" width="12" height="50" rx="6" fill={skinColor} style={{ transition: "all 0.4s" }} />
      <rect x={100 + bodyWidth / 2} y="125" width="12" height="50" rx="6" fill={skinColor} style={{ transition: "all 0.4s" }} />

      {/* head */}
      <circle cx="100" cy="90" r="32" fill={skinColor} style={{ transition: "all 0.4s" }} />

      {/* eyes */}
      {isSleepy ? <>
        <line x1="87" y1="88" x2="95" y2="88" stroke={T.deep} strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="88" x2="113" y2="88" stroke={T.deep} strokeWidth="2" strokeLinecap="round" />
      </> : <>
        <circle cx="90" cy="86" r="3.5" fill={T.deep} />
        <circle cx="110" cy="86" r="3.5" fill={T.deep} />
        <circle cx="91" cy="85" r="1.2" fill={T.white} />
        <circle cx="111" cy="85" r="1.2" fill={T.white} />
      </>}

      {/* mouth */}
      {isHappy ?
        <path d="M90,98 Q100,108 110,98" fill="none" stroke={T.deep} strokeWidth="2" strokeLinecap="round" /> :
        smoking ?
        <line x1="92" y1="100" x2="108" y2="100" stroke={T.deep} strokeWidth="2" strokeLinecap="round" /> :
        <path d="M92,102 Q100,96 108,102" fill="none" stroke={T.deep} strokeWidth="1.5" strokeLinecap="round" />
      }

      {/* hair */}
      <path d="M68,78 Q72,50 100,48 Q128,50 132,78" fill={T.deep} opacity="0.8" />

      {/* cigarette */}
      {smoking && <>
        <rect x="108" y="96" width="22" height="4" rx="1" fill="#F5E6D0" />
        <rect x="126" y="96" width="4" height="4" rx="1" fill="#E85D3A" />
        <path d="M132,94 Q134,86 130,80 Q133,74 131,68" fill="none" stroke="#BBBBBB" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="d" values="M132,94 Q134,86 130,80 Q133,74 131,68;M132,94 Q136,84 129,78 Q134,72 130,66;M132,94 Q134,86 130,80 Q133,74 131,68" dur="2s" repeatCount="indefinite" />
        </path>
      </>}

      {/* beer/wine */}
      {drinking && <>
        <rect x={100 - bodyWidth / 2 - 22} y="148" width="10" height="18" rx="2" fill="#F5C542" opacity="0.9" />
        <rect x={100 - bodyWidth / 2 - 23} y="145" width="12" height="5" rx="2" fill="#E8B530" />
        <rect x={100 - bodyWidth / 2 - 19} y="166" width="4" height="8" rx="1" fill="#CCC" />
      </>}

      {/* sauna steam */}
      {inputs.saunaSessions >= 3 && <>
        <path d="M70,110 Q68,100 72,92" fill="none" stroke="#DDD" strokeWidth="1.5" opacity="0.3">
          <animate attributeName="d" values="M70,110 Q68,100 72,92;M68,108 Q72,98 68,90;M70,110 Q68,100 72,92" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M130,112 Q132,102 128,94" fill="none" stroke="#DDD" strokeWidth="1.5" opacity="0.3">
          <animate attributeName="d" values="M130,112 Q132,102 128,94;M132,110 Q128,100 132,92;M130,112 Q132,102 128,94" dur="3s" repeatCount="indefinite" />
        </path>
      </>}

      {/* zzz if sleepy */}
      {isSleepy && <text x="135" y="72" fontFamily={T.mono} fontSize="14" fill={T.dim} opacity="0.5">zzz</text>}

      {/* heart if social */}
      {inputs.socialScore > 7 && <text x="60" y="82" fontSize="16" opacity="0.6">{"\u2764\uFE0F"}</text>}

      {/* cold snowflakes */}
      {inputs.coldExposure > 5 && <>
        <text x="45" y="140" fontSize="10" opacity="0.4">{"\u2744\uFE0F"}</text>
        <text x="148" y="130" fontSize="8" opacity="0.3">{"\u2744\uFE0F"}</text>
      </>}
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
