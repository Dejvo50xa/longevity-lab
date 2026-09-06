/* ═══════════════════════════════════════════════════════════════
   PŘEKLADY / TRANSLATIONS
   UI  = rozhraní v obou jazycích (en + cs)
   CS  = český obsah, klíčovaný podle ID/názvů z App.jsx
         (co v CS chybí, spadne zpět na anglický originál)
   ═══════════════════════════════════════════════════════════════ */

export var UI = {
  en: {
    brand: "Longevity Lab",
    nav: { science: "Science", protocol: "Protocol", biomarkers: "Biomarkers", glossary: "Glossary", faq: "FAQ", calcNow: "Calculate now" },
    hero: {
      badge: "Evidence-based healthspan, no hype",
      h1a: "Your wealth is", h1b: "measured in years",
      lead: "From your first habit to a lifelong protocol, Longevity Lab gives you simple, research-backed tools to build, manage, and preserve your healthspan over time.",
      ctaCalc: "Calculate my lifespan", ctaScience: "Explore the science",
      trust: [
        { t: "Peer-reviewed", s: "6 meta-analyses. 308K+ participants." },
        { t: "+36.5 years", s: "Maximum gainable across 7 pillars." },
        { t: "Personalized", s: "An avatar that mirrors your habits." },
        { t: "Actionable", s: "30-day protocol. Zero guesswork." },
      ],
    },
    strip: "Research from",
    why: {
      eyebrow: "Why healthspan?",
      title: "Because lifespan without health is the wrong goal",
      p1: "The average person spends their final decade managing disease — a quiet erosion of the years they worked hardest to reach. That gap between how long we live and how long we live well is the real problem.",
      p2: "Healthspan was built differently. It compounds like capital: every workout, every consistent night of sleep, every shared meal is a deposit. The science below shows exactly where the interest rates are highest.",
    },
    solution: { eyebrow: "The approach", title: "Science is the answer. This is how you get there", sub: "A focused platform for people who want to build long-term health — not chase trends, not biohack blindly, not guess." },
    pillars: { eyebrow: "The science", title: "Every pillar, covered", sub: "Seven habits with the strongest mortality evidence in the literature. Click any card to deep-dive into the biology, research, and practical protocols." },
    calc: {
      eyebrow: "Interactive calculator", titleA: "How long will ", titleEm: "you", titleB: " live?",
      sub: "Move the sliders. Your avatar, your biological age, and your estimate update in real time.",
      basics: "BASICS", activity: "ACTIVITY", lifestyle: "LIFESTYLE", risk: "RISK FACTORS",
      age: "Your Age", male: "Male", female: "Female",
      exDays: "Exercise (days/week)", exInt: "Exercise Intensity", sauna: "Sauna (sessions/week)", cold: "Cold Exposure",
      diet: "Diet Quality", sleep: "Sleep Regularity", supps: "Supplements", social: "Social Connection",
      smoking: "Smoking", alcohol: "Alcohol",
      avatar: "YOUR AVATAR", avatarNote: "Reacts to every slider",
      estLifespan: "ESTIMATED LIFESPAN", gaugeUnit: "estimated years",
      baseline: "Baseline", yourGain: "Your Gain", top3: "TOP 3 GAINS", breakdown: "FULL BREAKDOWN",
    },
    protocol: { eyebrow: "Getting started", title: "Set up in 30 days, built for 30 years", sub: "One theme per week, a few small actions per day. Compliance beats perfection — this is the on-ramp, not the destination." },
    bio: {
      eyebrow: "Measure what matters", title: "Nine numbers worth knowing",
      sub: "Feelings lie; bloodwork doesn't. These markers catch problems a decade before symptoms — most are available in one standard panel.",
      note: "Optimal ranges reflect longevity-medicine targets, which are stricter than standard lab reference ranges. Discuss results with your physician.",
      deepDive: "Deep dive →", mTitle: "Biomarker deep dive", mOptimal: "Optimal", mTest: "Test",
      mWhat: "What it tells you", mHow: "How to improve it", mNotes: "Testing notes",
    },
    myths: { eyebrow: "Clear thinking", title: "Myths, debunked", sub: "The longevity space is loud. Here's what the evidence actually supports." },
    hall: { eyebrow: "The mechanism map", title: "The 12 hallmarks of aging", sub: "Why we age, according to the canonical framework of modern geroscience (López-Otín et al., Cell 2023) — and which pillars push back on each one." },
    evid: { eyebrow: "Peer-reviewed research", title: "The evidence wall", sub: "The primary studies behind every number on this site.", read: "Read study ↗" },
    glos: { eyebrow: "Speak the language", title: "Longevity glossary", sub: "Every term you'll meet in the research — and in the deep dives above — in plain words.", search: "Search {n} terms…", none: "No terms match" },
    faq: { eyebrow: "FAQ", title: "Frequently asked questions" },
    cta: {
      titleA: "Start, build, and preserve", titleB: "your healthspan",
      sub: "New longevity research every month, distilled into actionable insights. No hype, no price calls — frameworks and clear thinking.",
      placeholder: "you@email.com", subscribe: "Subscribe", done: "✓ You are in. Welcome to the long game.", btn: "Calculate my lifespan",
    },
    footer: {
      desc: "Research-backed tools to build, manage, and preserve your healthspan. Educational content only — not medical advice.",
      explore: "Explore", knowledge: "Knowledge", sources: "Sources",
      lPillars: "The 7 pillars", lCalc: "Calculator", lProtocol: "30-day protocol", lBio: "Biomarkers",
      lMyths: "Myths debunked", lEvid: "Evidence wall", lFaq: "FAQ",
      disclaimer: "The information on this site is for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.",
      science: "Peer-reviewed science",
    },
    modal: { deepDive: "DEEP DIVE" },
    learnMore: "Learn more →", yrs: "yrs",
  },

  cs: {
    brand: "Longevity Lab",
    nav: { science: "Věda", protocol: "Protokol", biomarkers: "Biomarkery", glossary: "Slovník", faq: "FAQ", calcNow: "Spočítat" },
    hero: {
      badge: "Postaveno na důkazech, bez humbuku",
      h1a: "Tvoje bohatství", h1b: "se měří v letech",
      lead: "Od prvního návyku po celoživotní protokol — Longevity Lab ti dává jednoduché nástroje podložené výzkumem, jak si budovat a udržet roky ve zdraví.",
      ctaCalc: "Spočítat mou délku života", ctaScience: "Prozkoumat vědu",
      trust: [
        { t: "Recenzované studie", s: "6 metaanalýz. Přes 308 tisíc účastníků." },
        { t: "+36,5 roku", s: "Maximum k získání ze 7 pilířů." },
        { t: "Osobní", s: "Avatar, který zrcadlí tvoje návyky." },
        { t: "Prakticky", s: "30denní protokol. Žádné hádání." },
      ],
    },
    strip: "Výzkum z",
    why: {
      eyebrow: "Proč roky ve zdraví?",
      title: "Protože dlouhý život bez zdraví je špatný cíl",
      p1: "Průměrný člověk stráví poslední dekádu života řešením nemocí — tichým rozpadem let, ke kterým se nejvíc nadřel. Ten rozdíl mezi tím, jak dlouho žijeme a jak dlouho žijeme dobře, je ten skutečný problém.",
      p2: "Roky ve zdraví se ale budují jinak. Nabalují se jako úroky: každý trénink, každá pravidelná noc spánku, každé společné jídlo je vklad. Věda níže ukazuje, kde je úrok nejvyšší.",
    },
    solution: { eyebrow: "Přístup", title: "Odpovědí je věda. Tudy se k ní dostaneš", sub: "Web pro lidi, kteří chtějí budovat dlouhodobé zdraví — ne honit trendy, biohackovat naslepo nebo hádat." },
    pillars: { eyebrow: "Věda", title: "Všech sedm pilířů", sub: "Sedm návyků s nejsilnějšími důkazy o vlivu na úmrtnost. Klikni na kartu a ponoř se do biologie, výzkumu a praktických postupů." },
    calc: {
      eyebrow: "Interaktivní kalkulačka", titleA: "Jak dlouho budeš ", titleEm: "ty", titleB: " žít?",
      sub: "Hýbej posuvníky. Avatar, biologický věk i odhad se přepočítávají v reálném čase.",
      basics: "ZÁKLADY", activity: "AKTIVITA", lifestyle: "ŽIVOTNÍ STYL", risk: "RIZIKOVÉ FAKTORY",
      age: "Tvůj věk", male: "Muž", female: "Žena",
      exDays: "Pohyb (dní v týdnu)", exInt: "Intenzita pohybu", sauna: "Sauna (× týdně)", cold: "Otužování",
      diet: "Kvalita stravy", sleep: "Pravidelnost spánku", supps: "Doplňky stravy", social: "Sociální vazby",
      smoking: "Kouření", alcohol: "Alkohol",
      avatar: "TVŮJ AVATAR", avatarNote: "Reaguje na každý posuvník",
      estLifespan: "ODHADOVANÁ DÉLKA ŽIVOTA", gaugeUnit: "odhadovaných let",
      baseline: "Základ", yourGain: "Tvůj zisk", top3: "TOP 3 ZISKY", breakdown: "CELÝ ROZPAD",
    },
    protocol: { eyebrow: "Jak začít", title: "Nastartuj za 30 dní, vydrž 30 let", sub: "Jedno téma na týden, pár malých kroků denně. Vytrvalost poráží dokonalost — tohle je nájezdová rampa, ne cíl." },
    bio: {
      eyebrow: "Měř to, na čem záleží", title: "Devět čísel, která stojí za to znát",
      sub: "Pocity lžou, krevní testy ne. Tyhle markery zachytí problém deset let před příznaky — většinu z nich dostaneš v jednom běžném odběru.",
      note: "Optimální rozmezí odpovídají cílům longevity medicíny, které jsou přísnější než běžné laboratorní referenční meze. Výsledky prober se svým lékařem.",
      deepDive: "Rozbor →", mTitle: "Rozbor biomarkeru", mOptimal: "Optimum", mTest: "Měřit",
      mWhat: "Co ti řekne", mHow: "Jak ho zlepšit", mNotes: "Poznámky k měření",
    },
    myths: { eyebrow: "Jasné uvažování", title: "Mýty vyvráceny", sub: "Kolem dlouhověkosti je hodně hluku. Tohle důkazy skutečně podporují." },
    hall: { eyebrow: "Mapa mechanismů", title: "12 znaků stárnutí", sub: "Proč stárneme podle základního rámce moderní gerontologie (López-Otín a kol., Cell 2023) — a které pilíře na každý z nich tlačí zpět." },
    evid: { eyebrow: "Recenzovaný výzkum", title: "Zeď důkazů", sub: "Primární studie za každým číslem na tomhle webu.", read: "Otevřít studii ↗" },
    glos: { eyebrow: "Mluv jejich řečí", title: "Slovník dlouhověkosti", sub: "Každý pojem, na který ve výzkumu i v rozborech výše narazíš — vysvětlený lidsky.", search: "Hledej mezi {n} pojmy…", none: "Nic neodpovídá" },
    faq: { eyebrow: "FAQ", title: "Časté otázky" },
    cta: {
      titleA: "Začni budovat a chraň si", titleB: "roky ve zdraví",
      sub: "Každý měsíc nový výzkum dlouhověkosti, přeložený do použitelných kroků. Žádný humbuk — jen rámce a jasné myšlení.",
      placeholder: "ty@email.cz", subscribe: "Odebírat", done: "✓ Jsi v tom. Vítej v dlouhé hře.", btn: "Spočítat mou délku života",
    },
    footer: {
      desc: "Nástroje podložené výzkumem, jak si budovat a udržet roky ve zdraví. Pouze vzdělávací obsah — nejde o lékařskou radu.",
      explore: "Prozkoumat", knowledge: "Znalosti", sources: "Zdroje",
      lPillars: "7 pilířů", lCalc: "Kalkulačka", lProtocol: "30denní protokol", lBio: "Biomarkery",
      lMyths: "Vyvrácené mýty", lEvid: "Zeď důkazů", lFaq: "FAQ",
      disclaimer: "Informace na tomto webu slouží ke vzdělávacím účelům a nenahrazují odbornou lékařskou péči, diagnózu ani léčbu.",
      science: "Recenzovaná věda",
    },
    modal: { deepDive: "ROZBOR" },
    learnMore: "Více →", yrs: "let",
  },
};

/* ─────────── ČESKÝ OBSAH (klíčováno podle App.jsx) ─────────── */
export var CS = {
  factors: { exercise: "Pohyb", nutrition: "Strava", social: "Vztahy", sleep: "Spánek", sauna: "Sauna", cold: "Chlad", supplements: "Doplňky", smoking: "Kouření", alcohol: "Alkohol" },

  lbl: {
    intensity: ["", "Lehká chůze", "", "", "Střední", "", "", "Svižná", "", "", "Elitní"],
    cold: ["Žádné", "", "Občas", "", "", "Pravidelně", "", "", "", "", "Denně"],
    diet: ["Fast food", "", "", "", "Průměrná", "", "", "", "Rostlinná", "", "Optimální"],
    sleep: ["Chaos", "", "", "", "Nepravidelný", "", "", "", "Pravidelný", "", "Perfektní"],
    supps: ["Žádné", "", "", "Základ", "", "", "", "Cílené", "", "", "Vyladěné"],
    social: ["Izolace", "", "", "", "Nějaké", "", "", "", "Silné", "", "Skvělé"],
    smoking: ["Nikdy", "Bývalý", "Současný"],
    alcohol: ["Nic", "", "", "Lehce", "", "Střídmě", "", "", "Hodně", "", "Nadměrně"],
  },

  why: [
    "průměrný rozdíl mezi délkou života a životem ve zdraví — roky prožité v nemoci",
    "předčasných onemocnění srdce a cukrovky 2. typu lze předejít (WHO)",
    "dlouhověkosti je dané geny — zbytek stavíš každodenními návyky",
  ],

  solution: [
    { title: "Pochop vědu", body: "Sedm pilířů, každý podložený recenzovanými metaanalýzami s více než 308 tisíci účastníky. Klikni na pilíř a dostaneš rozbor až na molekulární úroveň — bez humbuku a historek.", cta: "Prozkoumat pilíře →" },
    { title: "Uvidíš sám sebe", body: "Tvůj osobní avatar reaguje na každý návyk v reálném čase — postava, držení těla, vitalita — a odhaduje tvůj biologický věk proti kalendářnímu.", cta: "Ukázat avatara →" },
    { title: "Jednej podle protokolu", body: "30denní startovací protokol převádí výzkum na jeden malý krok denně. Stavěný na vytrvalost, ne na dokonalost — jediná proměnná, která na desetiletém horizontu rozhoduje.", cta: "Spustit protokol →" },
  ],

  pillars: {
    exercise: { title: "Pohyb", dose: "150+ min/týden střední nebo 75 min svižné", desc: "Nejsilnější jednotlivá intervence pro dlouhověkost. Svižná dvacetiminutová procházka denně přidá přes 3 roky.", insight: "I 15 minut denně poráží sezení o 3 roky", study: "Moore a kol., PLOS Medicine 2012" },
    nutrition: { title: "Strava", dose: "Rostlinná, středomořského typu", desc: "Přechod ze západní stravy na optimální ve dvaceti letech přidá 10,7 roku.", insight: "Největší jednotlivý faktor — strava určuje osud", study: "Fadnes a kol., PLOS Medicine 2022" },
    social: { title: "Sociální vazby", dose: "Pevné vztahy a komunita", desc: "Osamělost zabíjí jako 15 cigaret denně. Silné vazby zvyšují šanci na přežití o 50 %.", insight: "Osamělost se rizikem vyrovná kouření", study: "Holt-Lunstad a kol., PLOS Medicine 2010" },
    sleep: { title: "Pravidelnost spánku", dose: "7–8 hodin ve stejný čas", desc: "Nepravidelný spánek zvyšuje celkovou úmrtnost o 20–48 %. Pravidelnost hraje roli stejně jako délka.", insight: "Pravidelnost je důležitější než délka", study: "Windred a kol., SLEEP 2024" },
    sauna: { title: "Saunování", dose: "4–7× týdně, 15–20 minut", desc: "4–7 saun týdně snižuje kardiovaskulární úmrtnost o 50 % a celkovou o 40 %.", insight: "O 50 % nižší úmrtnost na srdce při 4–7× týdně", study: "Laukkanen a kol., JAMA Internal Med 2015" },
    cold: { title: "Otužování", dose: "Studené sprchy, ledové koupele, zimní plavání", desc: "Chlad aktivuje hnědý tuk, tlumí zánět a zvedá noradrenalin o 200–300 %.", insight: "Aktivuje hnědý tuk a tlumí zánět", study: "Šrámek a kol., Eur J Appl Physiol 2000" },
    supplements: { title: "Doplňky stravy", dose: "D3, omega-3, hořčík (podložené důkazy)", desc: "Omega-3 snížily počet infarktů o 28 %. Řeš skutečné deficity, humbuk vynech.", insight: "Doplň skutečné deficity, humbuk vynech", study: "Manson a kol., VITAL Trial, NEJM 2019" },
  },

  protocol: [
    { week: "Týden 1", theme: "Základ", items: [
      "Nastav si pevné spánkové okno (stejné usínání i vstávání, ±30 minut — pravidelnost poráží délku)",
      "Choď 10 minut denně po jednom z jídel (tady začíná kontrola glykémie po jídle)",
      "Vyřaď tekutý cukr: limonády, džusy, slazenou kávu",
      "Objednej se na odběry: ApoB, HbA1c, hs-CRP, lačný inzulin, vitamin D, Lp(a) — tvoje výchozí čísla",
    ]},
    { week: "Týden 2", theme: "Pohyb", items: [
      "3× 30 minut v zóně 2 (udržíš u toho konverzaci; nejdřív se staví aerobní základ)",
      "2× 20 minut základní síly: dřepy, kliky, přítahy — na začátek stačí vlastní váha",
      "Nastav si denní cíl bílkovin ~1,6 g na kilogram váhy",
      "Kofein naposledy ve 14:00 (poločas 5–6 hodin chrání hluboký spánek)",
    ]},
    { week: "Týden 3", theme: "Talíř a lidi", items: [
      "Přidej denně hrnek luštěnin — nejkonzistentnější potravina napříč všemi modrými zónami",
      "Vyměň rafinované oleje za olivový; omez ultrazpracované potraviny",
      "Naplánuj dva opravdové sociální kontakty týdně (telefonát se počítá, osobní setkání dvojnásob)",
      "Rozlož 7–10 porcí zeleniny do dne, navěš je na jídla, která už jíš",
    ]},
    { week: "Týden 4", theme: "Upevnění", items: [
      "Přidej jeden intervalový trénink týdně: 4–6 tvrdých úseků po 30–90 sekundách",
      "Zkus teplo nebo chlad: 2–3 sauny týdně nebo zakonči sprchu 30–60 sekundami studené",
      "Porovnej své odběry s optimálními rozmezími níže — vyber si dvě největší mezery",
      "Nastav si 90denní cíle a objednej kontrolní odběr. Odsud už se to nabaluje.",
    ]},
  ],

  biomarkers: {
    "ApoB": { name: "ApoB", why: "Počítá všechny aterogenní částice — lepší prediktor kardiovaskulárního rizika než samotný LDL cholesterol.", freq: "Ročně",
      what: "Každá částice schopná uložit cholesterol do stěny tepny — LDL, VLDL, IDL i Lp(a) — nese přesně jednu bílkovinu ApoB. Měření ApoB tedy počítá skutečný počet částic poškozujících tepny, zatímco běžný LDL cholesterol váží jen jejich náklad. Dva lidé se stejným LDL se můžou v počtu částic lišit dvojnásobně — a aterosklerózu žene právě ten počet.",
      improve: ["Nahraď nasycený tuk olivovým olejem, ořechy a tučnou rybou", "Přidej 10+ g rozpustné vlákniny denně (oves, luštěniny, psyllium)", "Sniž viscerální tuk — i 5 % váhy s ApoB znatelně pohne", "Když životospráva nestačí, moderní léčba lipidů je levná a dobře prozkoumaná — probér ji s lékařem"],
      test: "Levný doplněk k běžnému lipidovému panelu — většinou si o něj musíš explicitně říct." },
    "HbA1c": { name: "HbA1c", why: "Tříměsíční průměr glykémie. Sleduje glykaci — cukerné poškození bílkovin, které urychluje stárnutí.", freq: "Ročně",
      what: "Červené krvinky žijí zhruba 120 dní a glukóza se na jejich hemoglobin postupně nalepuje úměrně průměrné hladině cukru. HbA1c je procento takto „ocukrovaných“ — tříměsíční klouzavý průměr a přímý pohled na glykaci, tedy tentýž proces, který s věkem ztužuje tepny i kůži.",
      improve: ["Jdi se po jídle projít na 10–15 minut — průměr táhnou špičky po jídle", "Začni jídlo bílkovinou a zeleninou, rafinované sacharidy nech nakonec", "Buduj svaly: jsou tvým největším místem pro uložení glukózy", "Chraň si spánek — jediná špatná noc měřitelně zhorší glykémii druhý den"],
      test: "Standardní položka odběru. Pozor: anémie a pobyt ve vysoké nadmořské výšce výsledek zkreslují; lačný inzulin dodá kontext." },
    "hs-CRP": { name: "hs-CRP", why: "Vysoce citlivý ukazatel zánětu. Chronický nízkoúrovňový zánět žene většinu nemocí spojených s věkem.", freq: "Ročně",
      what: "C-reaktivní protein tvoří játra jako odpověď na zánětlivé signály (hlavně IL-6). Vysoce citlivé stanovení zachytí ten chronický skrytý doutnák — „inflammaging“ — který urychluje aterosklerózu, demenci i křehkost. Hodnoty nad 3 mg/l zhruba zdvojnásobují kardiovaskulární riziko oproti hodnotám pod 1.",
      improve: ["Pravidelný pohyb v zóně 2 je nejspolehlivější způsob, jak CRP srazit", "Zbav se viscerálního tuku — tuková tkáň je továrna na zánět", "Vyřeš ústní zdraví: paradentóza tiše zvedá CRP", "Dbej na omega-3 (tučná ryba 2–3× týdně)"],
      test: "Neměř do 2–3 týdnů po infekci, úrazu nebo tvrdém závodě — akutní špička signál úplně přebije." },
    "Fasting insulin": { name: "Lačný inzulin", why: "Stoupá roky předtím než glykémie — nejčasnější praktické varování před inzulinovou rezistencí.", freq: "Ročně",
      what: "Když buňky otupí vůči inzulinu, slinivka to kompenzuje vyšší produkcí — glykémie zůstává normální, zatímco inzulin tiše šplhá. Tahle kompenzační fáze může trvat přes deset let, než glukóza vůbec začne vypadat špatně. Proto je lačný inzulin nejčasnějším praktickým alarmem metabolického onemocnění. Spolu s lačnou glykémií dá index HOMA-IR.",
      improve: ["Silový trénink — víc svalu znamená víc příjmu glukózy nezávisle na inzulinu", "Zóna 2 zlepšuje citlivost na inzulin na 24–48 hodin po tréninku", "Sniž rafinované sacharidy a tekutý cukr na nulu", "12hodinová noční pauza v jídle je šetrný a udržitelný začátek"],
      test: "Levné, ale málokdy automaticky v panelu — vyžádej si ho k roční prohlídce." },
    "VO2 max": { name: "VO2 max", why: "Nejsilnější jednotlivý prediktor celkové úmrtnosti. Rozdíl mezi nízkou a vysokou kondicí znamená až čtyřnásobek rizika.", freq: "1–2× ročně",
      what: "Maximální objem kyslíku, který tělo dokáže za minutu dopravit a využít — jedno číslo, které spojuje srdce, plíce, krev a mitochondrie. V kohortě 122 tisíc pacientů (JAMA) znamenal posun z nejnižší do nejvyšší čtvrtiny kondice zhruba čtyřnásobný rozdíl v úmrtnosti — větší efekt než kouření, cukrovka nebo hypertenze.",
      improve: ["Základ: 3–4 tréninky v zóně 2 týdně po 45–60 minutách", "Vybroušení: 1–2 intervalové jednotky týdně (klasika je 4×4 minuty tvrdě / 3 minuty lehce)", "Z nízkého základu čekej zlepšení o 10–25 % během 4–6 měsíců", "Bez tréninku klesá ~10 % za dekádu — ale trénovat jde v každém věku"],
      test: "Zlatým standardem je zátěžový test s maskou; slušný odhad dá i Cooperův 12minutový běh nebo sportovní hodinky." },
    "Vitamin D": { name: "Vitamin D", why: "Hormonu podobný regulátor imunity a kostí. Většina lidí pracujících uvnitř je nízko.", freq: "Ročně",
      what: "Technicky vzato steroidní hormon, ne vitamin: reguluje přes 200 genů zapojených do imunity, hospodaření s vápníkem a funkce svalů. Vzniká v kůži působením UVB — proto život uvnitř a severské zimy nechávají velkou část dospělých pod 30 ng/ml.",
      improve: ["Polední slunce na ruce a nohy, 10–20 minut několikrát týdně (bez spálení)", "Při nízké hladině doplňuj D3 1000–2000 IU denně, vždy s jídlem obsahujícím tuk", "Tučné ryby a žloutky přispívají mírně", "Po 3 měsících změř znovu — odpověď se mezi lidmi liší i několikanásobně"],
      test: "Žádej 25-hydroxyvitamin D. Pozor na jednotky: ng/ml × 2,5 = nmol/l." },
    "Blood pressure": { name: "Krevní tlak", why: "Každých 20/10 mmHg nad 115/75 zhruba zdvojnásobuje kardiovaskulární úmrtnost. Měř doma a v klidu.", freq: "Měsíčně",
      what: "Síla, kterou krev tlačí na stěny tepen — a nejvíc podceňované číslo, které si můžeš změřit zdarma. Riziko roste plynule: neexistuje bezpečné „vyšší normální“. Měření v ordinaci klame v obou směrech (efekt bílého pláště i maskovaná hypertenze), proto je domácí měření dnes standardem péče.",
      improve: ["Míň sodíku, víc draslíku (zelenina, luštěniny, mléčné výrobky)", "Aerobní pohyb sníží systolický tlak o 5–8 mmHg — srovnatelně s lékem první volby", "Omezení alkoholu má efekt úměrný dávce", "Chrápeš a máš vysoký tlak? Nech se vyšetřit na spánkovou apnoe — je to velký skrytý viník"],
      test: "Validovaný pažní tonometr, vsedě, po 5 minutách klidu, nohy na zemi, průměr ze 2–3 měření ráno i večer po dobu týdne." },
    "Lp(a)": { name: "Lp(a)", why: "Geneticky daná cholesterolová částice, zvýšená asi u 20 % lidí. Vysoká hodnota vyžaduje agresivní kontrolu ApoB.", freq: "Jednou za život",
      what: "Částice podobná LDL s navíc bílkovinným ocasem, který ji dělá zároveň agresivnější vůči tepnám a náchylnější ke tvorbě sraženin. Hladina je z ~90 % daná geneticky a na životosprávu skoro nereaguje — právě proto by si ji měl každý změřit alespoň jednou: každý pátý člověk má zvýšenou, většinou aniž by o tom věděl.",
      improve: ["Životospráva se samotnou Lp(a) skoro nehne — proto sniž všechno okolo", "Dostaň ApoB výrazně pod běžné cíle, ať to vykompenzuješ", "Buď důsledný u krevního tlaku a nikdy nekuř", "Cílená léčba (např. pelacarsen) je v pozdních fázích testování — když máš zvýšenou, sleduj to"],
      test: "Jednou za život stačí, pokud se nezmění léčba. Když vyjde vysoká, měli by se otestovat i sourozenci a děti." },
    "Grip strength": { name: "Síla stisku", why: "Jednoduchý ukazatel celkové svalové hmoty a nervosvalového zdraví — spolehlivě předpovídá soběstačnost ve stáří.", freq: "Čtvrtletně",
      what: "Desetisekundový stisk dynamometru překvapivě dobře předpovídá celkovou úmrtnost, kardiovaskulární příhody i budoucí ztrátu soběstačnosti — ne proto, že by na rukou tolik záleželo, ale protože stisk je poctivým sčítáním celkové svalové hmoty, zdraví motorických neuronů a stavu bílkovin.",
      improve: ["Silový trénink 2–3× týdně — hlavně tahové cviky (přítahy, mrtvý tah)", "Visy na hrazdě a farmářská chůze trénují stisk přímo", "Bílkoviny ~1,6 g/kg denně, rozložené do jídel", "Reaguje během týdnů v jakémkoli věku — včetně devadesátky"],
      test: "Dynamometr stojí kolem 600 Kč. Měř obě ruce, nejlepší ze tří. Muži do 40 cíl 45+ kg, ženy 27+ kg; s věkem se hranice mírně snižuje." },
  },

  myths: [
    { myth: "Dlouhověkost je hlavně o genech", truth: "Studie dvojčat a adopcí dávají genům 20–30 % rozptylu délky života. Až do devadesátky dominují návyky — geny hlavně rozhodují, kdo si zahraje prodloužení." },
    { myth: "Sklenka červeného denně chrání srdce", truth: "Slavná J-křivka se z velké části rozpadne, jakmile z dat vyřadíš „nemocné abstinenty“. Dávky resveratrolu ve víně jsou biologicky zanedbatelné. Míň alkoholu je prostě lepší; nula je v pohodě." },
    { myth: "Běhání ničí kolena", truth: "Rekreační běžci mají nižší výskyt artrózy kolene (~3,5 %) než lidé bez pohybu (~10 %). Chrupavka se zátěži přizpůsobuje — bez ní naopak slábne." },
    { myth: "Po šedesátce už svaly nenarosteš", truth: "Studie silového tréninku u sedmdesátníků i devadesátníků ukazují během měsíců nárůst síly o 30–170 %. Sarkopenie je výchozí stav, ne osud." },
    { myth: "Doplňky nahradí dobrou stravu", truth: "Studie VITAL i většina velkých pokusů ukazují, že izolované živiny jen zřídka zopakují efekt celých potravin. Doplňky řeší deficity, ne špatné stravovací vzorce." },
    { myth: "Stačí spát 8 hodin", truth: "Pravidelnost spánku předpovídá úmrtnost lépe než délka (Windred 2024). Stabilních 7 hodin poráží chaotických 8 — načasování je samostatná páka dlouhověkosti." },
  ],

  hallmarks: {
    "Genomic instability": { name: "Nestabilita genomu", desc: "Poškození DNA se hromadí rychleji, než ho stíhají opravy. Pohyb a spánek opravné dráhy posilují, kouření a nadbytek UV je zahltí.", pillars: "Pohyb · Spánek" },
    "Telomere attrition": { name: "Zkracování telomer", desc: "Ochranné čepičky chromozomů se s každým dělením zkracují. Chronický stres ztrátu urychluje, kondice koreluje s delšími telomerami.", pillars: "Pohyb · Vztahy" },
    "Epigenetic alterations": { name: "Epigenetické změny", desc: "Softwarová vrstva nad DNA se s věkem rozlaďuje — geny se zapínají a vypínají špatně. Strava, pohyb a spánek metylační vzorce měřitelně přenastavují.", pillars: "Strava · Spánek" },
    "Loss of proteostasis": { name: "Ztráta proteostázy", desc: "Špatně složené bílkoviny se shlukují (třeba amyloid). Proteiny tepelného šoku ze sauny a pohybu pomáhají je znovu složit nebo odklidit.", pillars: "Sauna · Pohyb" },
    "Disabled macroautophagy": { name: "Vypnutá autofagie", desc: "Buněčná recyklace se zpomaluje a odpad se hromadí. Pauzy v jídle, pohyb a hluboký spánek jsou nejsilnější známé spouštěče autofagie.", pillars: "Strava · Spánek" },
    "Deregulated nutrient sensing": { name: "Rozladěné vnímání živin", desc: "Dráhy inzulin/mTOR/AMPK ztrácejí kalibraci při trvalém přebytku kalorií. Odstup mezi jídly a svalová hmota citlivost vracejí.", pillars: "Strava · Pohyb" },
    "Mitochondrial dysfunction": { name: "Porucha mitochondrií", desc: "Buněčné elektrárny ubývají na počtu i výkonu. Trénink v zóně 2 je nejlepší známý podnět pro tvorbu nových mitochondrií.", pillars: "Pohyb · Chlad" },
    "Cellular senescence": { name: "Buněčná senescence", desc: "Poškozené „zombie buňky“ odmítají zemřít a vypouštějí zánětlivé signály. Pohyb u lidí prokazatelně snižuje jejich množství.", pillars: "Pohyb · Strava" },
    "Stem cell exhaustion": { name: "Vyčerpání kmenových buněk", desc: "Schopnost tkání se opravovat slábne. Spánek je doba, kdy se zásoby kmenových buněk obnovují; chronický zánět je vyčerpává.", pillars: "Spánek · Strava" },
    "Altered communication": { name: "Narušená komunikace", desc: "Hormonální a nervová signalizace mezi orgány degraduje. Sociální kontakt a pohyb neuroendokrinní signalizaci udržují.", pillars: "Vztahy · Pohyb" },
    "Chronic inflammation": { name: "Chronický zánět", desc: "„Inflammaging“ — trvalý nízkoúrovňový zánět, který žene téměř každou nemoc spojenou s věkem. Sleduje se přes hs-CRP; snižují ho všechny pilíře.", pillars: "Všechny pilíře" },
    "Dysbiosis": { name: "Dysbióza", desc: "Rozmanitost střevního mikrobiomu se špatnou stravou a věkem hroutí a slábne střevní bariéra. Vláknina a fermentované potraviny ji obnovují.", pillars: "Strava" },
  },

  glossary: {
    "Autophagy": { t: "Autofagie", d: "Recyklační program buňky — poškozené součástky se rozloží a použijí znovu. Spouští ji půst, pohyb a hluboký spánek." },
    "AMPK": { t: "AMPK", d: "Enzym vnímající energii, který přepíná buňky do režimu „oprav a recykluj“. Aktivuje ho pohyb a kalorický deficit." },
    "mTOR": { t: "mTOR", d: "Přepínač růstu — při stimulaci staví svaly, ale trvalá aktivace tlumí buněčný úklid. Umění je ho cyklovat, ne umlčet." },
    "NAD+": { t: "NAD+", d: "Koenzym nezbytný pro tvorbu energie a opravy DNA, jehož hladina do poloviny života klesne asi o 50 %. Pohyb ho zvedá přirozeně, doplňky zůstávají neprokázané." },
    "Telomeres": { t: "Telomery", d: "Ochranné čepičky na koncích chromozomů, které se s každým dělením buňky zkracují — jedny z několika biologických hodin." },
    "Senescent cells": { t: "Senescentní buňky", d: "Staré poškozené buňky, které se přestaly dělit, ale odmítají zemřít a vypouštějí zánětlivé signály. Přezdívá se jim zombie buňky." },
    "VO2 max": { t: "VO2 max", d: "Maximum kyslíku, které tělo dokáže využít za minutu — nejsilnější kondiční prediktor délky života." },
    "Zone 2": { t: "Zóna 2", d: "Lehká konverzační intenzita vytrvalostního pohybu (~60–70 % max. tepu). Základní vrstva, která staví mitochondrie a schopnost pálit tuky." },
    "HRV": { t: "HRV", d: "Variabilita srdečního rytmu — rozdíly v načasování mezi údery, které odrážejí zotavení nervové soustavy. Vyšší obvykle znamená lépe zotavený." },
    "ApoB": { t: "ApoB", d: "Bílkovinná visačka na každé částici ucpávající tepny. Počítat částice (ApoB) je lepší než vážit náklad (LDL cholesterol)." },
    "Glycation / AGEs": { t: "Glykace / AGEs", d: "Nalepování cukru na bílkoviny za vzniku konečných produktů glykace, které ztužují tkáně a urychlují stárnutí." },
    "BDNF": { t: "BDNF", d: "Neurotrofní faktor mozku — „hnojivo pro neurony“. Vystřeluje při intenzivním pohybu, podporuje paměť a náladu." },
    "Sarcopenia": { t: "Sarkopenie", d: "Věkem podmíněná ztráta svalu, zhruba 3–8 % za dekádu po třicítce. Hlavní vratná příčina křehkosti ve stáří." },
    "Epigenetic clock": { t: "Epigenetické hodiny", d: "Odhad věku vyčtený z metylačních vzorců DNA. Zatím spíš výzkumný nástroj — zajímavý, ale ne použitelný k rozhodování." },
    "Hormesis": { t: "Hormeze", d: "Prospěšný stres: dávka tepla, chladu nebo námahy, která spustí adaptaci a nechá tě silnějším. Mechanismus za saunou i ledovou koupelí." },
    "Mitochondrial biogenesis": { t: "Biogeneze mitochondrií", d: "Tvorba nových buněčných elektráren — klíčová adaptace na trénink v zóně 2, řízená hlavním regulátorem PGC-1α." },
    "Insulin resistance": { t: "Inzulinová rezistence", d: "Buňky přestávají reagovat na inzulin a slinivka ho musí tvořit víc. Tichý kořen většiny metabolických onemocnění." },
    "Blue Zones": { t: "Modré zóny", d: "Pět oblastí (Okinawa, Sardinie, Nicoya, Ikaria, Loma Linda), kde je dožití přes sto let asi 10× častější než na Západě." },
    "Inflammaging": { t: "Inflammaging", d: "Chronický nízkoúrovňový zánět, který s věkem roste a žene kardiovaskulární nemoci, demenci a křehkost. Sleduje se přes hs-CRP." },
    "Polarized training": { t: "Polarizovaný trénink", d: "Rozdělení 80/20: většina vytrvalosti lehce, malá část velmi tvrdě, nic uprostřed. Tak trénují vytrvalostní elity i rozumní amatéři." },
  },

  faqs: [
    { q: "Která jediná změna má největší dopad?", a: "Pokud se nehýbeš vůbec: pohyb — přechod z nuly na 150 minut týdně je nejstrmější část celé křivky přínosu a zlepší skoro každý další pilíř (spánek, náladu, citlivost na inzulin). Pokud už trénuješ, největší nevyužitý potenciál nese kvalita stravy, a to až kolem 13 let." },
    { q: "Mají smysl testy biologického věku (epigenetické hodiny)?", a: "Vědecky jsou fascinující, ale zatím ne v klinické kvalitě: stejný vzorek poslaný dvakrát se může lišit o několik let. Zatím ti víc řeknou funkční ukazatele — VO2 max, síla stisku, ApoB, lačný inzulin — jsou levnější a přímo použitelné. Odhad biologického věku u našeho avatara je aproximace podle návyků, ne diagnóza." },
    { q: "Potřebuju doplňky, když jím dobře?", a: "Měř, nehádej. Obhajitelný základ je vitamin D3 při nízké hladině v krvi, omega-3 (EPA/DHA) pokud málokdy jíš tučné ryby, a B12 při převážně rostlinné stravě. Hořčík pomáhá mnohým se spánkem. Dál už důkazy rychle řídnou — doplň deficity a humbuk vynech." },
    { q: "Je přerušovaný půst pro dlouhověkost nutný?", a: "Ne. Kontrolované studie ukazují, že časově omezené jedení dopadá zhruba stejně jako běžná kontrola kalorií, když se kalorie vyrovnají. Pro někoho je to užitečný nástroj na dodržování, ne zázračný mechanismus. Vyber si režim, který udržíš desítky let." },
    { q: "Kolik alkoholu je vlastně bezpečných?", a: "Upřímná odpověď: ochranný efekt lehkého pití je silně zkreslený a novější mendelovské randomizační studie u některých onemocnění nenacházejí žádný bezpečný práh. Prakticky — míň je lepší, nula je v pohodě a držet to lehké a společenské zachytí cokoli, co z benefitu zbývá." },
    { q: "A co léky na dlouhověkost jako rapamycin nebo metformin?", a: "Rapamycin je nejrobustnější látka prodlužující život ve zvířecích studiích a studie TAME testuje metformin u lidí — ale ani jeden zatím nemá data o dlouhověkosti u lidí a oba mají reálné vedlejší účinky. Jsou to experimenty, ne protokoly. Všechno na tomhle webu je na současných lidských důkazech lepší volbou." },
    { q: "Když nám rodina umírá mladá, jsem odsouzený? (A když se dožívají vysokého věku, mám vyhráno?)", a: "Ani jedno. Geny vysvětlují 20–30 % rozptylu délky života. Špatná rodinná anamnéza dělá sedm pilířů cennějšími, ne zbytečnými — kompenzuješ jimi horší výchozí pozici. Dobrá anamnéza je vítr do plachet, který se pořád dá promarnit." },
    { q: "Kdy už je pozdě začít?", a: "Nikdy, a je to jeden z nejlépe potvrzených nálezů v oboru. Skončit s kouřením v šedesáti pořád přidá zhruba 3 roky. Začít se hýbat po sedmdesátce pořád snižuje úmrtnost. Sval reaguje na trénink i v devadesáti. Nejlepší doba byla před dvaceti lety; druhá nejlepší je opravdu dnes." },
    { q: "Vytrvalost, nebo síla — na čem záleží víc?", a: "Na obojím, každé z jiného důvodu. VO2 max je nejsilnější prediktor úmrtnosti; svalová hmota a síla chrání soběstačnost, kosti a metabolické zdraví ve stáří. Rozdělení podle důkazů: ~80 % objemu lehce v zóně 2, 1–2 intervalové jednotky a 2–3 silové tréninky týdně." },
    { q: "Jak přesná je ta kalkulačka?", a: "Aplikuje velikosti efektů z publikovaných metaanalýz na populační základ — je užitečná na porovnání návyků a na to, kde máš největší páku, ne na předpověď tvého data. Roli hraje individuální biologie, prostředí i náhoda. Ber výsledek jako kompas, ne jako hodiny." },
  ],

  evidence: {
    "2022": { title: "Odhad vlivu volby potravin na očekávanou délku života", f: "+10,7 roku z optimální stravy ve 20 letech" },
    "2015": { title: "Saunování a fatální kardiovaskulární příhody", f: "4–7× týdně: o 50 % nižší kardiovaskulární úmrtnost" },
    "2012": { title: "Pohybová aktivita ve volném čase a úmrtnost", f: "+4,5 roku ze 150 min pohybu týdně" },
    "2024": { title: "Pravidelnost spánku a celková úmrtnost", f: "Nepravidelný spánek: o 20–48 % vyšší riziko úmrtí" },
    "2010": { title: "Sociální vztahy a riziko úmrtí", f: "Silné vazby: o 50 % vyšší šance na přežití" },
    "2019": { title: "Suplementace vitaminem D a omega-3", f: "Omega-3: o 28 % méně infarktů" },
  },

  /* Etapa B — dlouhé rozbory pilířů se doplní sem */
  pillarDetails: {},
};

/* ─────────── Etapa C+D: volitelné biomarkery a metodika ─────────── */
export var BIOUI = {
  en: {
    title: "ADVANCED — YOUR ACTUAL NUMBERS",
    hint: "Optional. If you know these from bloodwork or testing, the estimate gets sharper. Leave blank to skip.",
    apob: "ApoB", hba1c: "HbA1c", crp: "hs-CRP", bp: "Systolic blood pressure", vo2: "VO2 max",
    uApob: "mg/dL", uHba1c: "%", uCrp: "mg/L", uBp: "mmHg", uVo2: "ml/kg/min",
    clear: "Clear numbers",
    adj: "Biomarker adjustment",
    range: "Likely range",
    rangeNote: "Range reflects real uncertainty — individual biology, environment and luck all matter.",
    method: "Gains shrink with age and overlapping pillars are not simply added — the model applies diminishing returns.",
    show: "Add my numbers", hide: "Hide numbers",
  },
  cs: {
    title: "POKROČILÉ — TVOJE SKUTEČNÁ ČÍSLA",
    hint: "Nepovinné. Když tyhle hodnoty znáš z odběrů nebo testů, odhad se zpřesní. Nevyplněné se ignoruje.",
    apob: "ApoB", hba1c: "HbA1c", crp: "hs-CRP", bp: "Systolický krevní tlak", vo2: "VO2 max",
    uApob: "mg/dl", uHba1c: "%", uCrp: "mg/l", uBp: "mmHg", uVo2: "ml/kg/min",
    clear: "Vymazat čísla",
    adj: "Úprava podle biomarkerů",
    range: "Pravděpodobné rozmezí",
    rangeNote: "Rozmezí odráží skutečnou nejistotu — roli hraje individuální biologie, prostředí i náhoda.",
    method: "Zisky s věkem klesají a překrývající se pilíře se prostě nesčítají — model počítá s klesajícími výnosy.",
    show: "Zadat moje čísla", hide: "Skrýt čísla",
  },
};

/* ─────────── Etapa B: české rozbory pilířů ─────────── */

CS.pillarDetails.exercise = {
  title: "Pohyb — hloubkový rozbor",
  sections: [
    {
      heading: "Molekulární biologie: mitochondrie, telomery a BDNF",
      body: "Pohyb spouští hluboké molekulární adaptace, které prodlužují roky ve zdraví i celkovou délku života, a to hned několika propojenými cestami. Na úrovni mitochondrií zvyšuje silový i vytrvalostní trénink expresi PGC-1α, hlavního regulátoru mitochondriální biogeneze, který zvyšuje hustotu mitochondrií i oxidační kapacitu. Každá svalová kontrakce aktivuje AMPK — energetický senzor fungující jako buněčný budík, který stimuluje autofagii a obnovu mitochondrií. Pro stárnutí je to obzvlášť důležité, protože porucha mitochondrií patří mezi znaky senescence. Další zásadní mechanismus nabízí biologie telomer: studie ukazují, že vysoká aerobní kondice je spojena s delšími telomerami, přičemž každý rok pravidelného pohybu odpovídá zhruba 9 letům ochrany délky telomer oproti lidem bez pohybu. BDNF (neurotrofní faktor odvozený od mozku), kterému se přezdívá „hnojivo pro mozek“, s pohybem výrazně stoupá, nejvíc při intenzivních intervalech. Podporuje neuroplasticitu, tvorbu nových neuronů v hipokampu a kognitivní funkce po celý život. Výzkum z University of Pittsburgh ukazuje, že lidé s pravidelným aerobním pohybem mají hladiny BDNF 2–3× vyšší než ti bez pohybu, s přímou vazbou na lepší upevňování paměti a nižší riziko kognitivního úpadku. Tyhle molekulární kaskády se navzájem posilují: lepší funkce mitochondrií dodává víc ATP pro trvalou nervovou aktivitu, zatímco vyšší BDNF podporuje strukturální změny nutné pro dlouhodobou paměť a výkonné funkce. Vzniká biologická zpětná vazba, která se v průběhu let a desetiletí nabaluje.",
    },
    {
      heading: "VO2 max: silný prediktor úmrtnosti",
      body: "VO2 max — maximální množství kyslíku, které tělo dokáže využít při intenzivní zátěži — patří k nejsilnějším prediktorům rizika úmrtí a vyrovná se tradičním rizikovým faktorům, jako je krevní tlak nebo cholesterol, nebo je i překonává. Zásadní prospektivní studie Kodamy a kolektivu (2009), která analyzovala data z 33 studií s více než 102 000 účastníky, zjistila, že zvýšení VO2 max o 3,5 ml/kg/min je spojeno s 13% snížením rizika úmrtí a 15% snížením výskytu kardiovaskulárních onemocnění. Ještě pozoruhodnější je, že tohle snížení rizika přetrvalo i po zohlednění ostatních rizikových faktorů — VO2 max tedy zjevně zachycuje něco podstatného o fyziologické rezervě a odolnosti. Studie CHART ukázala, že muži středního věku v nejnižší čtvrtině VO2 max měli čtyřnásobně vyšší riziko kardiovaskulárního úmrtí než muži v nejvyšší čtvrtině. U žen jsou souvislosti stejně robustní: Nurses’ Health Study označila zlepšení kardiorespirační zdatnosti za nejvíce ovlivnitelný faktor snižující úmrtnost u žen nad 40 let. VO2 max odráží zdraví celého propojeného systému — účinnost oběhu, kapacitu mitochondrií, schopnost svalů extrahovat kyslík i koordinaci srdečního výdeje. Věkem podmíněný pokles VO2 max (bez tréninku zhruba 10 % za dekádu po třicítce) je vratný: soustavný aerobní trénink dokáže VO2 max udržet nebo dokonce zlepšit i v sedmé a osmé dekádě života. Změření VO2 max dává použitelnou zpětnou vazbu: výchozí test zařadí člověka do rizikové kategorie a umožní nastavit intenzitu tréninku tak, aby byl ochranný efekt co největší.",
    },
    {
      heading: "Zóna 2 vs. HIIT: různé adaptace, doplňující se přínosy",
      body: "Aerobní trénink v zóně 2 (60–70 % maximální tepové frekvence) a vysoce intenzivní intervalový trénink (HIIT) vyvolávají odlišné, ale vzájemně se doplňující fyziologické adaptace — a optimální strategie pro dlouhověkost systematicky zahrnuje obojí. Trénink v zóně 2, který zdůrazňují výzkumníci jako Iñigo San Millán, žene kapilarizaci, tedy růst nových vlásečnic ve svalové tkáni, což zvyšuje dodávku kyslíku i efektivitu využití paliv. Zóna 2 konkrétně zlepšuje schopnost oxidovat tuky, takže tělo umí efektivně používat jako palivo lipidy a šetřit glukózu na intenzivní úseky. Tahle zóna stimuluje mitochondriální biogenezi trvalým metabolickým nárokem a aktivací AMPK, aniž by přinesla akutní stres maximálních výkonů. Studie využívající svalové biopsie a metabolické testy ukazují, že 8–12 týdnů tréninku v zóně 2 zvýší hustotu mitochondrií o 20–30 % a schopnost oxidace tuků o 40–50 %. HIIT naproti tomu generuje akutní stresové signály, které maximalizují BDNF, zapojují a rozvíjejí rychlá svalová vlákna a akutně vyvolávají větší odpověď růstového hormonu a testosteronu. Akutní metabolický stres z HIIT (typicky třicetisekundové maximální nebo téměř maximální úseky s pauzami na zotavení) spouští rychlou syntézu bílkovin a je silným podnětem pro zlepšení VO2 max — 1–2 jednotky HIIT týdně zvyšují VO2 max rychleji než stejný objem práce v zóně 2. HIIT ale způsobuje větší celkovou únavu a vyžaduje delší zotavení. Přístup podložený důkazy, který doporučují sportovní vědci, kombinuje 80 % objemu v zóně 2 s 1–2 jednotkami HIIT týdně — tím se současně zlepšuje aerobní základ, funkce mitochondrií i maximální využití kyslíku.",
    },
    {
      heading: "Silový trénink: mechanismy a propojení svalů s kostmi",
      body: "Silový trénink aktivuje mechanotransdukční dráhy, které budují svalovou hmotu, zvyšují hustotu kostních minerálů, zlepšují metabolické zdraví a prodlužují život mechanismy odlišnými od aerobního pohybu. Progresivní zatěžování proti vnějšímu odporu aktivuje dráhu PI3K/Akt/mTOR, která signalizuje syntézu svalových bílkovin a spouští aktivaci satelitních buněk pro přírůstek myonukleí. Každé opakování vytváří mikrotrauma a zánětlivou signalizaci (TNF-α, IL-6), která při dostatečném zotavení a výživě spustí adaptační hypertrofii. Framinghamská studie osteoporózy ukázala, že lidé cvičící silově dvakrát a vícekrát týdně si udrželi o 1–3 % vyšší hustotu kostních minerálů za dekádu než necvičící, což přímo snižuje riziko zlomenin ve stáří. Na systémové úrovni funguje sval jako endokrinní orgán a vylučuje myokiny (IL-6, BDNF, irisin, FGF21), které zlepšují citlivost na inzulin, tlumí zánět a podporují kognitivní funkce. Silový trénink navíc přednostně zapojuje vlákna typu II, která nejvíc podléhají věkové atrofii (sarkopenii); studie ukazují, že progresivní silový trénink je jedinou intervencí, která ztrátu síly při sarkopenii účinně zastaví a zvrátí. Excentrický trénink (s důrazem na spouštěcí fázi) vytváří největší mechanické napětí a vyvolá největší hypertrofickou odpověď při minimálním objemu. Užitečné vodítko dávají silové standardy: muži, kteří zvládnou dřep s 1,25násobkem, mrtvý tah s 1,75násobkem a bench press s 0,75násobkem vlastní váhy, vykazují lepší kardiometabolické ukazatele a nižší riziko úmrtí. Frekvence 2–3 jednotky týdně zaměřené na hlavní svalové skupiny (dolní tělo, tlaky, tahy) v rozsahu 6–12 opakování s progresivním zatěžováním dává optimální podnět pro sílu, hypertrofii i metabolické zdraví.",
    },
    {
      heading: "Týdenní plánování: propojení více modalit",
      body: "Týdenní plán postavený na důkazech vyvažuje aerobní rozvoj, silový podnět, intenzitu, zotavení a hlavně konzistenci chování — právě ta nejlépe předpovídá dlouhodobé dodržování i zdravotní výsledky. Standardní rámec doporučovaný American College of Sports Medicine a podporovaný výzkumníky dlouhověkosti počítá se 150–300 minutami středně intenzivní aerobní aktivity týdně nebo 75–150 minutami intenzivní aktivity, doplněnými o 2 a více silových jednotek na hlavní svalové skupiny. Praktická týdenní struktura může vypadat takto: pondělí (síla dolního těla: 45 minut komplexních cviků jako dřepy, výpady, mrtvé tahy); úterý (60–80 minut aerobně v zóně 2 na konverzační intenzitě: běh, kolo, veslování); středa (aktivní regenerace: jóga, chůze nebo mobilita); čtvrtek (síla horního těla: 45 minut se zaměřením na tlaky a tahy); pátek (zóna 2 nebo smíšená aktivita typu rekreačního sportu); sobota (jedna vysoce intenzivní intervalová jednotka: 6–10 téměř maximálních úseků po 30–90 sekundách s pauzami, nebo souvislé tvrdé úsilí na 85–95 % maximální tepové frekvence po 20–30 minut); neděle (úplný odpočinek nebo velmi lehká aktivita). Tenhle rámec dává dostatečnou frekvenci podnětů pro silovou adaptaci (48–72 hodin mezi zatížením téže svalové skupiny), dostatečný objem v zóně 2 pro rozvoj mitochondrií a kapilár, správné rozložení intenzit (80 % lehce, 10 % tempo, 10 % tvrdě) i zabudované dny na obnovu autonomního nervového systému. Zásadní je individuální variabilita podle věku, tréninkové historie a schopnosti se zotavit: starší lidé mohou potřebovat delší okna na zotavení, mladší sportovci snesou vyšší frekvenci. Princip progresivního zatěžování vyžaduje systematické zvyšování buď objemu (opakování, vzdálenost, doba), nebo intenzity (váha, rychlost, úsilí) každé 2–4 týdny, aby adaptace pokračovala. O desetiletých zdravotních výsledcích rozhoduje dodržování struktury, ne dokonalost jednotlivého tréninku.",
    },
    {
      heading: "Praktické zavedení: měření pokroku a ladění",
      body: "Převést sportovní vědu do udržitelné praxe znamená stanovit si výchozí hodnoty, nastavit postupné cíle a zavést zpětnou vazbu, která udrží motivaci na roky. Vstupní zhodnocení by mělo zahrnovat: klidovou tepovou frekvenci (nižší je lepší; zlepšení o 1–2 tepy za minutu měsíčně značí kardiovaskulární adaptaci), odhad VO2 max (submaximální testy nebo terénní testy typu běhu na 2,4 km), výchozí sílu (jednorepetiční maximum nebo jeho odhad u hlavních cviků), tělesnou kompozici (DEXA je pro odlišení tuku a svalu lepší než BMI) a HRV (variabilitu srdečního rytmu, která odráží zotavení autonomního nervového systému). Měsíční sledování tréninkového objemu (celkové minuty za týden), rozložení intenzit (procenta v jednotlivých zónách) a výkonnostních ukazatelů (vzdálenosti při daném úsilí, zvednutá váha, počet opakování) vytváří objektivní zodpovědnost. Periodizace — plánované střídání objemu a intenzity v blocích po 4–12 týdnech — brání stagnaci a přetrénování: typický makrocyklus může v prvním bloku zdůraznit sílu (nižší objem, vyšší intenzita), ve druhém hypertrofii (střední objem i intenzita) a ve třetím aerobní výkon (vysoký objem v zóně 2 s 1–2 intenzivními jednotkami), načež následuje vyložení se snížením objemu o 40–50 %. Kvalita spánku a HRV dávají biologickou zpětnou vazbu o stavu zotavení: klesající HRV při zachovaném tréninku signalizuje potřebu vyložení. Nositelná elektronika (Garmin, Whoop, Apple Watch) měří tep, HRV i aktivitu průběžně, je ale drahá. Bezplatné nástroje typu Stravy nebo obyčejná tabulka zvládnou sledovat to podstatné také. Chování, které maximalizuje dodržování, zahrnuje: trénink s parťákem kvůli zodpovědnosti, výběr aktivit, které člověka opravdu baví (vytrvalost přebíjí optimálnost), pevně naplánované časy tréninku (tvorba návyku) a slavení procesních cílů („absolvoval jsem 12 tréninků“) vedle výsledkových („zvýšil jsem VO2 max o 10 %“). Přehodnocení každých 12 týdnů posune cíle výš a udrží progresivní výzvu i zájem na dlouhé roky.",
    },
  ],
};

CS.pillarDetails.nutrition = {
  title: "Výživa — hloubkový rozbor",
  sections: [
    {
      heading: "Citlivost na inzulin a metabolické dráhy",
      body: "Inzulinová signalizace je hlavním metabolickým přepínačem, který rozhoduje, jestli se živiny uloží jako tuk, nebo se využijí na energii a stavbu tkání — citlivost na inzulin je proto zásadní pákou pro dlouhověkost i roky ve zdraví. Když stoupne hladina glukózy, beta buňky slinivky vyloučí inzulin, ten se naváže na receptory ve svalech, játrech a tukových buňkách a spustí kaskády IRS-1 a PI3K/Akt, které podporují příjem glukózy, tvorbu glykogenu a syntézu bílkovin, zatímco tlumí spalování tuků. Ve stavu inzulinové rezistence — běžném u lidí bez pohybu a s nadbytkem jídla — buňky sníží počet receptorů a účinnost nitrobuněčné signalizace, což slinivku donutí kompenzovat vyššími hladinami inzulinu (hyperinzulinémie). Tahle chronická hyperinzulinémie žene hned několik patologických drah: zvýšenou tvorbu jaterních triglyceridů, systémový zánět přes aktivaci NF-κB, aktivaci osy RAGE podporující aterosklerózu a útlum autofagie i odbourávání tuků. Stanovisko Endocrine Society označuje inzulinovou rezistenci za ústřední mechanismus metabolického syndromu, který postihuje 32 % dospělých v USA a zvyšuje riziko kardiovaskulárních onemocnění 3–5×. Lačný inzulin nad 10–12 mIU/l značí výraznou rezistenci; optimum je pod 5 mIU/l. Index HOMA-IR, vypočtený z lačné glukózy a inzulinu, umožňuje klinické hodnocení — hodnoty nad 2,5 na rezistenci ukazují. Citlivost na inzulin přímo zlepšují úpravy stravy a životosprávy: silový trénink zvyšuje přesun GLUT4 a příjem glukózy nezávisle na inzulinu, takže je ho potřeba méně; aerobní trénink zlepšuje oxidační kapacitu mitochondrií a efektivitu spalování glukózy; hubnutí snižuje rezistenci v játrech i tukové tkáni; a konkrétní stravovací vzorce (podrobněji v sekci o modrých zónách) minimalizují poobědové špičky glukózy, které pohánějí poptávku po inzulinu. Kontinuální monitorace glukózy (CGM) odhaluje individuální reakce na konkrétní potraviny: totožné jídlo vyvolá u různých lidí odlišné křivky glykémie podle citlivosti na inzulin, složení střevního mikrobiomu a načasování v rámci dne — což zdůrazňuje, jak důležitá je personalizace.",
    },
    {
      heading: "Věda o střevním mikrobiomu: bakterie jako metabolický orgán",
      body: "Lidská mikrobiota — biliony bakteriálních buněk, jejichž souhrnná genetická kapacita stonásobně převyšuje geny hostitele — funguje jako rozprostřený metabolický orgán, který řídí vstřebávání živin, vývoj imunity, tvorbu neurotransmiterů i metabolické zdraví. Mikrobiální rozmanitost (bohatost druhů a rovnoměrnost jejich zastoupení) předpovídá zdravotní stav: Human Microbiome Project a navazující studie ukazují, že lidé s více než 1000 bakteriálními druhy mají lepší metabolické zdraví, nižší riziko kardiovaskulárních onemocnění a lepší kognitivní funkce než lidé s méně než 500 druhy. Konkrétní bakteriální skupiny tvoří klíčové metabolity: Faecalibacterium prausnitzii a další Firmicutes produkují fermentací nerozpustné vlákniny mastné kyseliny s krátkým řetězcem (butyrát, acetát, propionát), přičemž butyrát dodává 60–90 % energie buňkám tlustého střeva a udržuje celistvost střevní bariéry zvýšením exprese bílkoviny těsných spojů ZO-1. Nízký počet bakterií tvořících butyrát koreluje se zvýšenou propustností střeva, endotoxémií (průnikem LPS) a chronickým zánětem. Akkermansia muciniphila pozitivně koreluje s metabolickým zdravím: intervenční studie ukazují, že probiotika s Akkermansií u lidí snižují inzulinovou rezistenci a zlepšují kontrolu glykémie. Naopak rozšíření patogenních bakterií, jako jsou Proteobacteria (marker dysbiózy), zvyšuje tvorbu LPS a podporuje metabolickou dysfunkci. Složení mikrobioty zásadně utváří strava: rozpustná vláknina (oves, ječmen, luštěniny) živí prospěšné fermentující bakterie, zatímco ultrazpracované potraviny (hodně omega-6 olejů, rafinované sacharidy, aditiva) podporují patogenní skupiny. Středomořská strava zvyšuje zastoupení Firmicutes a Faecalibacteria, což částečně vysvětluje kardiovaskulární přínosy pozorované ve studii PREDIMED. Přerušovaný půst posouvá složení mikrobioty a zvyšuje funkční kapacitu pro tvorbu mastných kyselin s krátkým řetězcem. Fermentované potraviny (kimchi, kysané zelí, kefír) přímo dodávají prospěšné bakterie, ale v zanedbatelném množství (typicky pod miliardu CFU) oproti vlastní střevní populaci (přes 100 bilionů); jejich hodnota tkví spíš v prebiotických látkách a v příznivém posunu stávajících populací. Personalizované vyšetření metagenomikou stolice (Viome, Thorne, Ombre) odhalí konkrétní vzorce dysbiózy a umožní cílené zásahy vlákninou, fermentovanými potravinami nebo probiotiky.",
    },
    {
      heading: "Stravovací vzorce modrých zón: důkazy od nejdéle žijících populací světa",
      body: "Pět zeměpisných oblastí opakovaně produkuje výjimečnou dlouhověkost (dožití přes sto let je tam 10× častější než v západních populacích): japonská Okinawa, italská Sardinie, poloostrov Nicoya v Kostarice, řecká Ikaria a kalifornská Loma Linda (adventisté sedmého dne). Antropologická a epidemiologická analýza Buettnera a Poulaina identifikuje konzistentní stravovací vzorce, které dlouhověkost vysvětlují: důraz na celistvé rostlinné potraviny (zelenina, luštěniny, celozrnné obiloviny, ořechy, ovoce), minimum zpracovaných potravin a mírnou energetickou hustotu. Obyvatelé Okinawy tradičně přijímali 96 % kalorií z rostlin, přičemž základem byly batáty (přes 60 % energetického příjmu), které dodávají rezistentní škrob, vlákninu a navzdory energetické hustotě jen malou glykemickou zátěž. Adventist Health Study-2 (přes 70 000 účastníků, 21 let sledování) zjistila, že vegani měli o 10 % nižší celkovou úmrtnost než všežravci a semivegetariáni (s důrazem na luštěniny) o 8 %; podstatné je, že nejzdravější skupina kombinovala rostlinný základ s občasnou konzumací ryb — optimálním vzorcem se tedy jeví strava z více než 90 % rostlinná doplněná živinami bohatými živočišnými produkty. Středomořská strava (olivový olej, ryby, zelenina, luštěniny, mírně vína) snížila ve studii PREDIMED (přes 11 000 účastníků) počet kardiovaskulárních příhod o 30 % oproti kontrolní skupině, přičemž hlavní mechanismus se jeví jako metabolický (lepší citlivost na inzulin, nižší zánětlivé markery TNF-α a IL-6), nikoli jako snížení cholesterolu. Strava na kostarickém poloostrově Nicoya staví na fazolích (hlavní luštěnina), kukuřici (tradičně upravované nixtamalizací kvůli dostupnosti vápníku a niacinu) a sezónní zelenině s minimem masa. Sardinští pastevci na tradiční stravě (důraz na luštěniny, obiloviny a zeleninu, zrající kozí sýr, denně sklenka vína) vykazují navzdory skromným příjmům výjimečné kardiovaskulární zdraví a nízkou míru demence. Metaanalýzy napříč modrými zónami identifikují nepominutelné složky: (1) denně alespoň hrnek luštěnin (5–8 g rozpustné vlákniny, v kombinaci s obilovinami plný profil aminokyselin, polyfenolové mikroživiny); (2) důraz na celozrnné obiloviny (minimum bílé rýže a pečiva); (3) hodně zeleniny (na Okinawě 7–10 porcí denně); (4) minimum masa, typicky spíš jako ochucení než jako hlavní chod; (5) tuky z celistvých potravin (ořechy, semínka, olivový olej, občas ryby) místo rafinovaných olejů; (6) minimum rafinovaného cukru a zpracovaných potravin. Souhrnným efektem je trvale zachovaná citlivost na inzulin, optimální lipidový profil, nízký systémový zánět a udržené kognitivní funkce do vysokého věku.",
    },
    {
      heading: "Potraviny podložené důkazy: od bobulovin po listovou zeleninu",
      body: "Některé celistvé potraviny mají robustní epidemiologické i mechanistické důkazy pro optimalizaci zdraví, takže výběr lze opřít o data místo o módní superpotraviny. Bobuloviny (borůvky, maliny, jahody, ostružiny) obsahují antokyany a další polyfenoly: Nurses’ Health Study zjistila, že ženy konzumující tři a více porcí bobulovin týdně měly o 34 % nižší riziko infarktu než ženy s minimální konzumací, přičemž mechanismus zahrnuje tvorbu endotelového NO řízenou antokyany a stabilizaci aterosklerotických plátů. U borůvek konkrétně ukazují randomizované studie kognitivní přínos: Krikorian a kolektiv zjistili, že dvanáctitýdenní suplementace borůvkami (odpovídající 1–2 hrnkům čerstvých denně) zlepšila upevňování paměti u starších dospělých. Listová zelenina (kadeřávek, špenát, mangold) dodává lutein, zeaxantin a folát: prospektivní kohortové studie ukazují snížení rizika kardiovaskulárních onemocnění o 10–20 % na každou další denní porci tmavé listové zeleniny. Navrhovaný mechanismus zahrnuje lepší funkci endotelu díky obsahu dusičnanů (300–400 mg na porci kadeřávku), které zvyšují dostupnost NO a snižují krevní tlak o 3–5 mmHg. Košťálová zelenina (brokolice, růžičková kapusta, zelí) obsahuje sulforafan, izothiokyanát aktivující antioxidační element Nrf2: myší modely ukazují, že strava bohatá na sulforafan snižuje věkem podmíněnou neurodegeneraci a zlepšuje kognitivní výkon, a nová lidská data naznačují podobné přínosy. Luštěniny (čočka, cizrna, černé fazole) dodávají rezistentní škrob, rozpustnou vlákninu a polyfenoly: studie PURE (135 000 účastníků, 10 let sledování) zjistila, že konzumace luštěnin je spojena s 22% snížením celkové úmrtnosti a 28% snížením kardiovaskulární úmrtnosti, přičemž největší přínos byl v regionech s nižšími příjmy. Tučné ryby (losos, sardinky, makrela) dodávají EPA a DHA (viz sekce o doplňcích): podskupinová analýza PREDIMED zjistila, že konzumace ryb třikrát a vícekrát týdně je spojena s kardiovaskulární ochranou nad rámec samotné středomořské stravy. Extra panenský olivový olej obsahuje oleokanthal, polyfenol s protizánětlivým účinkem podobným nesteroidním antirevmatikům: mechanistické studie ukazují, že oleokanthal tlumí signalizaci NF-κB při denním příjmu od 150 mg, a observační studie doložily i kognitivní přínosy. Ořechy (vlašské, mandle) obsahují kyselinu alfa-linolenovou a polyfenoly: souhrnná analýza 29 randomizovaných studií zjistila, že konzumace ořechů (28 g denně) snížila LDL cholesterol o 3–4 % i markery systémového zánětu, a prospektivní studie ukazují snížení kardiovaskulární úmrtnosti o 20–30 %.",
    },
    {
      heading: "Co vyřadit: ultrazpracované potraviny, glykace cukrem a zánětlivé oleje",
      body: "Určit, co ze stravy omezit nebo vyřadit, má na zdraví větší dopad než optimalizovat příjem prospěšných potravin — omezení škody totiž brání rozvoji nemoci účinněji, než doplňování živin napravuje už vzniklé poškození. Ultrazpracované potraviny — definované prakticky jako potraviny s více než 5–10 % kalorií z aditiv (emulgátory, zahušťovadla, barviva, aromata) a více než 25 % kalorií z přidaných cukrů nebo rafinovaných sacharidů — mají robustní souvislost s úmrtností i nemocností: metaanalýza 43 prospektivních studií zjistila, že každá další denní porce takové potraviny je spojena s 18% nárůstem celkové úmrtnosti. Mechanismy zahrnují: (1) hyperglykémii a inzulinovou rezistenci hnanou rafinovanými sacharidy; (2) nadbytek omega-6 ze semenných olejů podporující systémový zánět; (3) aditiva (emulgátory jako polysorbát-80, oxid titaničitý), která narušují střevní bariéru a mikrobiotu; (4) hyperchutné kombinace, které přebíjejí signály sytosti a vedou k přejídání a obezitě. Příjem přidaného cukru nad 5 % denních kalorií (zhruba 25 g neboli 6 čajových lžiček) působí metabolické poškození úměrné dávce: nadbytek fruktózy (glukózo-fruktózový sirup, přidaný cukr) obchází běžnou signalizaci sytosti, vstupuje přímo do jaterních lipogenních drah a podporuje nealkoholové ztukovatění jater. Glykace bílkovin cukrem (vznik konečných produktů pokročilé glykace, AGEs) tvoří zesíťované bílkovinné agregáty, které podporují zánět, tuhnutí cév a neurodegeneraci: hromadění AGEs žene progresi aterosklerotických plátů, přispívá ke komplikacím cukrovky a koreluje s kognitivním úpadkem ve stáří. Tvorbu AGEs urychluje konzumace rafinovaných sacharidů, tepelná úprava za vysokých teplot (grilování, smažení) a zvýšená glykémie. Rafinované semenné oleje (sójový, kukuřičný, slunečnicový) tvoří v západní stravě 7–10 % denních kalorií oproti tradičnímu méně než 1 %: dodávají nadbytek polynenasycených omega-6 tuků (kyseliny linolové), která během extrakce a skladování snadno oxiduje a tvoří lipidové peroxidy a oxysteroly podporující zánět tepen a dysfunkci endotelu. Poměr omega-6 k omega-3 dosahuje v západní stravě 15–20 : 1 oproti předkovskému zhruba 1 : 1, což žene tvorbu prozánětlivých prostanoidů a leukotrienů. Nahrazení semenných olejů olivovým nebo avokádovým (s vyšším podílem mononenasycených tuků, odolnějších vůči oxidaci) a snížení příjmu omega-6 pod 5 % kalorií je zásadní protizánětlivou intervencí. Transmastné kyseliny (částečně ztužené oleje, část tuků přežvýkavců) zvyšují kardiovaskulární riziko úměrně příjmu: každá 2 % kalorií z transmastných kyselin zvyšují riziko infarktu o 23 %, a to mechanismy včetně oxidace LDL, dysfunkce endotelu a systémového zánětu. U aditiv, jako jsou emulgátory, umělá sladidla a barviva, přibývají důkazy o dysbiotických a zánětlivých účincích ze zvířecích modelů i nová lidská data — jejich omezení je proto rozumné, i když se odborníci na míře rizika zcela neshodnou.",
    },
    {
      heading: "Praktické rámce jídla: nákupní seznamy a šablony makroživin",
      body: "Převod nutriční vědy do každodenní praxe vyžaduje jídelní rámce, které sníží únavu z rozhodování a zároveň zajistí nutriční úplnost a sytost. Základní rámec zdůrazňuje: (1) každé jídlo obsahuje dost bílkovin (25–40 g) kvůli sytosti, dodávce aminokyselin a syntéze svalových bílkovin; (2) každé jídlo obsahuje 8–12 g vlákniny ze zeleniny a celozrnných obilovin; (3) jídla staví na celistvých, minimálně zpracovaných potravinách; (4) energetický příjem odpovídá úrovni aktivity a cílům v tělesné kompozici. Praktická bílkovinná šablona pro všežravce kombinuje živočišné i rostlinné zdroje: k snídani 3–4 celá vejce se zeleninou a plátek celozrnného chleba; řecký jogurt (20 g bílkovin na 150g porci) s bobulovinami a mandlemi; nebo varianty na bázi luštěnin (čočkové suflé, cizrnové lívance). Oběd staví na zelenině jako objemu doplněné plnohodnotnou bílkovinou: grilovaná ryba (porce velikosti dlaně, ~25 g bílkovin) se 2–3 hrnky míchané zeleniny a půl hrnkem celozrnné přílohy (natural rýže, quinoa, kroupy); nebo převážně rostlinná varianta s důrazem na luštěniny: 1,5 hrnku vařených luštěnin (~15 g bílkovin) se zeleninovými přílohami a celozrnnou obilovinou. Večeře drží stejnou strukturu: libová bílkovina (drůbež 100–120 g, hovězí z pastvy 100–120 g nebo luštěniny), 3–4 hrnky zeleniny (přednostně košťálová, listová a lilkovitá kvůli hustotě mikroživin) a omezený škrob (půl hrnku brambor nebo rýže, případně důraz na vlákninatou zeleninu kvůli sytosti). Svačiny stojí na bílkovině a vláknině: mandle, hummus se zeleninou, celé ovoce s ořechy nebo tvrdý sýr. Denní cíle makroživin se liší individuálně: bílkoviny 1,6–2,2 g na kilogram tělesné hmotnosti podporují udržení svalu, tuky 20–30 % kalorií z celistvých zdrojů (ořechy, semínka, olivový olej, ryby) podporují tvorbu hormonů a vstřebávání živin, sacharidy se upravují podle aktivity (více u sportujících, méně u sedavých). Zjednodušení nákupního seznamu staví na sezónních celistvých potravinách: bílkoviny (vejce, ryby v konzervě, luštěniny, drůbež, hovězí z pastvy podle rozpočtu), zelenina (cenově dostupná mražená nebo sezónní čerstvá — brokolice, mrkev, špenát, rajčata), celozrnné obiloviny (oves, natural rýže, čočka ve větším balení), ořechy a semínka (mandle, vlašské ořechy), ovoce (mražené bobuloviny, jablka, banány) a kvalitní tuky (olivový olej, máslo, avokádo). Příprava jídla formou hromadného vaření zeleniny, obilovin a bílkovin na začátku týdne snižuje únavu z rozhodování. Přerušovaný půst (časově omezené jedení 16 : 8 nebo občasný 24hodinový půst) nabízí některým lidem potenciální metabolické přínosy (lepší citlivost na inzulin, aktivace autofagie), ale v prospektivních studiích není lepší než prosté omezení kalorií; víc než konkrétní protokol rozhoduje, jak dobře člověku sedne.",
    },
  ],
};
