import { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { UI, CS, BIOUI } from "./content-cs.js";

var LangCtx = createContext("cs");
function useUI() { var l = useContext(LangCtx); return { lang: l, U: UI[l], cs: l === "cs" }; }
import Avatar2D from "./Avatar2D.jsx";

/* ═══════════════════════════════════════════════════════════════
   LONGEVITY LAB v5 — Lifelike Avatar + A4 Deep-Dives
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
    color: "#3B8CC4",
    sections: [
      {
        heading: "Molecular Biology: Mitochondria, Telomeres, and BDNF",
        body: "Exercise triggers profound molecular adaptations that extend healthspan and lifespan through multiple interconnected pathways. At the mitochondrial level, resistance and aerobic training upregulate PGC-1α, a master regulator of mitochondrial biogenesis that increases mitochondrial density and oxidative capacity. Each muscle contraction generates AMPK activation, an energy sensor that acts as a cellular alarm clock, stimulating autophagy and mitochondrial renewal. This process is particularly important for aging, as mitochondrial dysfunction is a hallmark of senescence. Telomere biology provides another critical mechanism: studies show that high aerobic fitness is associated with longer telomeres, with each year of regular exercise correlating with approximately 9 additional years of telomere length protection relative to sedentary controls. BDNF (brain-derived neurotrophic factor), often called \"Miracle-Gro for the brain,\" increases dramatically with exercise, particularly during high-intensity intervals. BDNF supports neuroplasticity, neurogenesis in the hippocampus, and cognitive function across the lifespan. Research from the University of Pittsburgh demonstrates that individuals engaging in regular aerobic exercise show BDNF levels 2-3 fold higher than sedentary counterparts, with direct correlation to improved memory consolidation and reduced cognitive decline risk. These molecular cascades work synergistically: improved mitochondrial function provides greater ATP for sustained neural activity, while increased BDNF supports the structural changes necessary for long-term memory and executive function, creating a biological feedback loop that compounds benefits over years and decades."
      },
      {
        heading: "VO2 Max: A Powerful Mortality Predictor",
        body: "VO2 max—the maximum amount of oxygen your body can utilize during intense exercise—is one of the strongest predictors of mortality risk, rivaling or exceeding traditional risk factors like blood pressure and cholesterol. The landmark prospective study by Kodama et al. (2009) analyzing data from 33 studies with over 102,000 participants found that a 3.5 mL/kg/min increase in VO2 max was associated with 13% reduction in mortality risk and 15% reduction in cardiovascular disease incidence. More remarkably, this risk reduction persisted even after adjusting for other risk factors, suggesting VO2 max captures something fundamental about physiological reserve and resilience. The Cardiovascular Health in Ambulatory Care Research Teamwork (CHART) study demonstrated that middle-aged men in the lowest quartile of VO2 max had 4-fold higher risk of cardiovascular death compared to those in the highest quartile. Women show similarly robust associations: the Nurses' Health Study found that improved cardiorespiratory fitness was the single most modifiable factor for reducing mortality in women over 40. VO2 max reflects integrated system health—cardiovascular efficiency, mitochondrial capacity, muscular extraction of oxygen, and cardiac output coordination. Age-related decline in VO2 max (~10% per decade after 30 in sedentary individuals) is reversible: sustained aerobic training can maintain or even improve VO2 max into the 7th and 8th decades. Testing VO2 max provides actionable feedback: baseline testing establishes individual mortality risk stratification, allowing personalized exercise prescription intensity to maximize protective benefits."
      },
      {
        heading: "Zone 2 vs HIIT: Different Adaptations, Complementary Benefits",
        body: "Zone 2 aerobic training (60-70% max heart rate) and high-intensity interval training (HIIT) induce distinct but complementary physiological adaptations, and optimal longevity strategies incorporate both systematically. Zone 2 training, emphasized by researchers like Iñigo San Millán, drives capillarization—the growth of new blood capillaries within muscle tissue—which increases oxygen delivery and substrate utilization efficiency. Zone 2 specifically enhances fat oxidation capacity, enabling the body to efficiently use lipids as fuel while sparing glucose for high-intensity efforts. This training zone stimulates mitochondrial biogenesis through sustained metabolic demand and AMPK activation without the acute stress of maximal efforts. Studies using muscle biopsy and metabolic testing show that 8-12 weeks of Zone 2 training increases mitochondrial density 20-30% and improves fat oxidation capacity by 40-50%. HIIT, by contrast, generates acute stress signals that maximize BDNF, promote fast-twitch muscle fiber recruitment and development, and create greater growth hormone and testosterone responses acutely. The acute metabolic stress of HIIT (typically 30-second maximal or near-maximal efforts with recovery periods) triggers rapid protein synthesis and represents a potent stimulus for VO2 max improvement—1-2 sessions of HIIT per week improves VO2 max faster than equivalent volume of Zone 2 work. However, HIIT creates greater systemic fatigue and requires longer recovery windows. The evidence-based approach recommended by exercise scientists combines 80% zone 2 training volume with 1-2 weekly HIIT sessions, creating simultaneous improvement in aerobic base, mitochondrial function, and maximal oxygen utilization."
      },
      {
        heading: "Strength Training: Mechanisms and Muscle-Bone Integration",
        body: "Resistance training activates mechanotransduction pathways that build muscle mass, increase bone mineral density, improve metabolic health, and extend lifespan through mechanisms distinct from aerobic exercise. Progressive overload against external resistance activates the PI3K/Akt/mTOR pathway, which signals muscle protein synthesis and initiates satellite cell activation for myonuclei accretion. Each repetition creates microtrauma and inflammatory signaling (TNF-α, IL-6) that triggers adaptive hypertrophy when adequate recovery and nutrition are provided. The Framingham Osteoporosis Study demonstrated that individuals performing resistance training 2+ times weekly maintained 1-3% greater bone mineral density per decade compared to non-exercisers, directly reducing fracture risk in aging. At the systemic level, muscle serves as an endocrine organ, secreting myokines (IL-6, BDNF, irisin, FGF21) that improve insulin sensitivity, reduce inflammation, and enhance cognitive function. Resistance training also preferentially activates type II muscle fibers, which are most prone to age-related atrophy (sarcopenia); studies show progressive resistance exercise is the only intervention that effectively halts and reverses sarcopenia-related strength loss. Eccentric resistance training (lowering phase emphasis) generates greatest mechanical tension and induces greatest hypertrophic response with minimal volume. Strength standards provide useful guidance: men achieving back squat 1.25x bodyweight, deadlift 1.75x bodyweight, and bench press 0.75x bodyweight demonstrate superior cardiometabolic health markers and reduced mortality risk. Training frequency of 2-3 sessions weekly targeting major muscle groups (lower body, upper body push, upper body pull) with 6-12 repetition ranges and progressive overload provides optimal stimulus for strength, hypertrophy, and metabolic health."
      },
      {
        heading: "Weekly Programming: Integrating Multiple Modalities",
        body: "Evidence-based weekly exercise programming balances aerobic development, strength stimulus, intensity, recovery, and behavioral consistency—the latter being the most predictive of long-term adherence and health outcomes. The standard framework recommended by the American College of Sports Medicine and endorsed by longevity researchers involves 150-300 minutes weekly of moderate-intensity aerobic activity or 75-150 minutes of vigorous activity, combined with 2+ resistance training sessions targeting major muscle groups. A practical weekly structure might include: Monday (lower body strength: 45 minutes compound movements like squats, lunges, deadlifts; Tuesday (60-80 minutes Zone 2 aerobic work at conversational intensity: running, cycling, rowing); Wednesday (active recovery: yoga, walking, or mobility); Thursday (upper body strength: 45 minutes focusing on pressing and pulling patterns); Friday (Zone 2 aerobic or mixed modality like recreational sports); Saturday (1 high-intensity interval session: 6-10 near-maximal efforts of 30-90 seconds with recovery periods, or sustained hard efforts at 85-95% max HR for 20-30 minutes); Sunday (complete rest or very light activity). This framework provides adequate stimulus frequency for strength adaptation (48-72 hours between muscle group training), sufficient Zone 2 volume for mitochondrial and capillary development, appropriate intensity distribution (80% easy, 10% tempo, 10% hard), and integrated recovery days for autonomic nervous system restoration. Individual variation based on age, training history, and recovery capacity is critical: older individuals may require longer recovery windows, while younger athletes can tolerate higher frequency. The progressive overload principle demands systematic increase in either volume (repetitions, distance, duration) or intensity (weight, speed, effort) every 2-4 weeks to continue adaptation. Compliance with structure exceeding perfection in any single session determines 10-year health outcomes."
      },
      {
        heading: "Practical Implementation: Measuring Progress and Adjusting",
        body: "Translating exercise science into sustainable practice requires establishing baseline metrics, setting progressive targets, and implementing feedback systems that maintain motivation across years. Initial assessment should include: resting heart rate (lower is better; improvements of 1-2 beats/minute per month indicate cardiovascular adaptation), VO2 max estimation (submaximal exercise tests or field tests like the 1.5-mile run), strength baseline (1-rep max or estimated max for major lifts), body composition (DEXA preferred over BMI for fat vs muscle distinction), and HRV (heart rate variability, which reflects autonomic nervous system recovery). Monthly tracking of training volume (total weekly minutes), intensity distribution (percentage at each zone), and performance metrics (distances at set efforts, weight lifted, repetitions achieved) creates objective accountability. Periodization—planned variation in volume and intensity over 4-12 week blocks—prevents adaptation plateaus and overtraining: a typical macrocycle might emphasize strength the first block (lower volume, higher intensity), hypertrophy the second block (moderate volume/intensity), and aerobic power the third block (high volume Zone 2 with 1-2 intensity sessions) before deloading 40-50% volume for recovery. Sleep quality and HRV provide biological feedback on recovery status: declining HRV despite maintained training signals need for deloading. Wearable devices (Garmin, Whoop, Apple Watch) provide continuous HR, HRV, and activity tracking, though expensive. Free tools like Strava or simple spreadsheets track essential metrics adequately. Behavioral approaches maximizing adherence include: training with partners for accountability, selecting exercises genuinely enjoyable (consistency outweighs optimality), scheduling training at fixed times (habit formation), and celebrating process goals (\"completed 12 weekly sessions\") alongside outcome goals (\"improved VO2 max 10%\"). Reassessment every 12 weeks adjusts targets upward, maintaining progressive challenge and engagement across years."
      }
    ]
  },
  nutrition: {
    title: "Nutrition Deep Dive",
    color: "#2E8B6A",
    sections: [
      {
        heading: "Insulin Sensitivity and Metabolic Pathways",
        body: "Insulin signaling represents the master metabolic switch determining whether nutrients are stored as fat or utilized for energy and anabolism, making insulin sensitivity a fundamental lever for longevity and healthspan. When blood glucose rises, pancreatic beta cells release insulin, which binds to insulin receptors on muscle, liver, and fat cells, activating IRS-1 and PI3K/Akt signaling cascades that promote glucose uptake, glycogen synthesis, and protein synthesis while suppressing fat oxidation. In insulin-resistant states—common in sedentary, overfed populations—cells downregulate insulin receptors and reduce intracellular signaling efficiency, forcing pancreatic compensation with higher insulin levels (hyperinsulinemia). This chronic hyperinsulinemia drives multiple pathology pathways: increased hepatic triglyceride production, systemic inflammation via NF-κB activation, RAGE axis activation promoting atherosclerosis, and suppression of autophagy and lipolysis. The Endocrine Society position statement identifies insulin resistance as central mechanism in metabolic syndrome, affecting 32% of US adults and increasing cardiovascular disease risk 3-5 fold. Fasting insulin levels above 10-12 mIU/L indicate significant resistance; optimal values below 5 mIU/L. HOMA-IR (Homeostatic Model Assessment for Insulin Resistance) calculated from fasting glucose and insulin provides clinical assessment, with values above 2.5 suggesting resistance. Dietary and lifestyle modifications directly improve insulin sensitivity: resistance training increases GLUT4 translocation and glucose uptake independent of insulin, reducing required insulin concentration; aerobic training improves mitochondrial oxidative capacity and glucose oxidation efficiency; weight loss reduces hepatic and adipose tissue insulin resistance; and specific dietary patterns (discussed further in Blue Zone section) minimize postprandial glucose spikes that drive insulin demand. Continuous glucose monitoring (CGM) reveals individual responses to specific foods: identical meals produce varying glucose trajectories in different individuals based on insulin sensitivity, gut microbiota composition, and circadian timing, emphasizing personalization importance."
      },
      {
        heading: "Gut Microbiome Science: Bacteria as Metabolic Organs",
        body: "The human microbiota—comprising trillions of bacterial cells with combined genetic capacity exceeding host genes 100-fold—functions as a distributed metabolic organ controlling nutrient absorption, immune development, neurotransmitter synthesis, and metabolic health. Microbial diversity (richness of different species and evenness of distribution) predicts health status: the Human Microbiome Project and subsequent studies demonstrate that individuals with >1000 bacterial species show superior metabolic health, reduced cardiovascular disease risk, and improved cognitive function compared to those with <500 species. Specific bacterial taxa produce critical metabolites: Faecalibacterium prausnitzii and other Firmicutes produce short-chain fatty acids (butyrate, acetate, propionate) through fermentation of insoluble fiber, with butyrate providing 60-90% of colonocyte energy and maintaining intestinal barrier integrity via tight junction protein ZO-1 upregulation. Low butyrate-producing bacteria correlate with increased intestinal permeability, endotoxemia (LPS translocation), and chronic inflammation. Akkermansia muciniphila positively correlates with metabolic health: interventional studies show probiotics containing Akkermansia reduce insulin resistance and improve glucose control in humans. Conversely, pathogenic bacteria like Proteobacteria expansion (dysbiosis marker) increases LPS production and promotes metabolic dysfunction. Diet fundamentally shapes microbiota composition: soluble fiber (oats, barley, legumes) feeds beneficial fermenters, while ultra-processed foods (high omega-6 oils, refined carbohydrates, food additives) promote pathogenic taxa. The Mediterranean diet increases Firmicutes and Faecalibacterium abundance, explaining partial mechanism for cardiovascular benefits in PREDIMED trial. Intermittent fasting shifts microbiota composition, increasing metagenomic functional capability for short-chain fatty acid production. Fermented foods (kimchi, sauerkraut, kefir) directly introduce beneficial bacteria but provide minimal CFUs (typically <1 billion) compared to gut endogenous populations (>100 trillion); their value derives from prebiotic compounds and favorable shifts in existing populations. Personalized assessment via stool metagenomics (Viome, Thorne, Ombre) identifies specific dysbiosis patterns, enabling targeted fiber, fermented food, or probiotic interventions."
      },
      {
        heading: "Blue Zone Dietary Patterns: Evidence from World's Longest-Living Populations",
        body: "Five geographic regions consistently produce exceptional longevity (>100-year lifespans 10-fold more common than Western populations): Okinawa Japan, Sardinia Italy, Nicoya Peninsula Costa Rica, Ikaria Greece, and Loma Linda California (Seventh-day Adventists). Anthropological and epidemiological analysis by Buettner and Poulain identifies consistent dietary patterns explaining longevity: emphasis on whole plant foods (vegetables, legumes, whole grains, nuts, fruits), minimal processed foods, and moderate caloric density. Okinawans traditionally consumed 96% plant-based calories with sweet potato as staple (>60% caloric intake), providing resistant starch, fiber, and minimal glycemic load despite caloric density. Adventist Health Study-2 (70,000+ participants, 21-year follow-up) found vegans showed 10% lower all-cause mortality than omnivores; semi-vegetarians (legume emphasis) showed 8% reduction; importantly, the healthiest group combined plant-emphasis with occasional fish consumption, suggesting 90%+ plant-based diet with micronutrient-dense animal products represents optimal pattern. Mediterranean diet (olive oil, fish, vegetables, legumes, moderate wine) from PREDIMED study (11,000+ participants) reduced cardiovascular events 30% compared to control, with primary mechanism appearing metabolic (improved insulin sensitivity, reduced inflammation markers TNF-α and IL-6) rather than cholesterol reduction. The Costa Rican Nicoya Peninsula diet emphasizes beans (primary legume), corn (traditional preparation nixtamalized for bioavailable calcium and niacin), and seasonal vegetables with minimal meat consumption. Sardiniam shepherds consuming traditional diet (legume/grain/vegetable emphasis, aged goat cheese, daily moderate wine) show exceptional cardiovascular health and low dementia rates despite modest incomes. Meta-analyses across Blue Zones identify non-negotiable dietary components: (1) legume consumption 1+ cup daily (providing 5-8g soluble fiber, complete amino acid profiles when combined with grains, polyphenol micronutrients); (2) whole grain emphasis (minimal white rice/bread); (3) abundant vegetables (7-10 servings daily in Okinawa); (4) minimal meat, typically consumed as seasoning rather than centerpiece; (5) whole food fat sources (nuts, seeds, olive oil, occasionally fish) rather than refined oils; (6) minimal refined sugar and processed foods. The cumulative effect produces sustained insulin sensitivity, optimal lipid profiles, low systemic inflammation, and maintained cognitive function into advanced age."
      },
      {
        heading: "Evidence-Based Foods and Mechanisms: From Berries to Leafy Greens",
        body: "Specific whole foods demonstrate robust epidemiological and mechanistic evidence for health optimization, enabling evidence-based food selection beyond trendy superfoods. Berries (blueberries, raspberries, strawberries, blackberries) contain anthocyanins and other polyphenols: the Nurses' Health Study found women consuming 3+ servings weekly of berries showed 34% reduction in heart attack risk compared to minimal consumers, with mechanism involving anthocyanin-driven endothelial NO production and atherosclerotic lesion stabilization. Blueberries specifically show cognitive benefits in randomized trials: Krikorian et al. found 12-week blueberry supplementation (equivalent to 1-2 cup fresh daily) improved memory consolidation in older adults. Leafy greens (kale, spinach, Swiss chard) provide lutein, zeaxanthin, and folate: prospective cohort studies demonstrate 10-20% reduction in cardiovascular disease risk per daily serving increase of dark leafy greens. The proposed mechanism involves improved endothelial function via dietary nitrate content (300-400 mg per serving of kale), which increases bioavailable NO and reduces blood pressure 3-5 mmHg. Cruciferous vegetables (broccoli, Brussels sprouts, cabbage) contain sulforaphane, an isothiocyanate activating Nrf2 antioxidant response element: mouse models show sulforaphane-rich diets reduce age-related neurodegeneration and improve cognitive performance, with emerging human data suggesting similar benefits. Legumes (lentils, chickpeas, black beans) provide resistant starch, soluble fiber, and polyphenol compounds: the PURE study (135,000 participants, 10-year follow-up) found legume consumption associated with 22% reduction in all-cause mortality and 28% reduction in cardiovascular mortality, with highest benefits in lower-income regions. Fatty fish (salmon, sardines, mackerel) provide EPA and DHA (discussed in Supplements section): PREDIMED subgroup analysis found fish consumption 3+ times weekly associated with additional cardiovascular protection beyond Mediterranean diet baseline. Extra-virgin olive oil contains oleocanthal, a polyphenol with NSAID-like anti-inflammatory properties: mechanistic studies show oleocanthal inhibits NF-κB signaling at 150+ mg daily intake, with cognitive benefits demonstrated in observational studies. Nuts (walnuts, almonds) contain alpha-linolenic acid and polyphenols: pooled analysis of 29 randomized trials found nut consumption (1 ounce daily) reduced LDL cholesterol 3-4% and systemic inflammation markers, with prospective studies showing 20-30% reduction in cardiovascular disease mortality."
      },
      {
        heading: "What to Eliminate: Ultra-Processing, Sugar Glycation, and Inflammatory Oils",
        body: "Identifying foods to minimize or eliminate provides greater health impact than optimizing consumption of beneficial foods, as harm reduction prevents disease pathways more efficiently than nutrient supplementation repairs damage. Ultra-processed foods (UPFs)—defined operationally as >5-10% calories from additives (emulsifiers, thickeners, colorants, flavorings) and >25% calories from added sugars or refined carbohydrates—show robust association with mortality and morbidity: meta-analysis of 43 prospective studies found each additional serving of UPF daily associated with 18% increase in all-cause mortality, with mechanisms involving: (1) refined carbohydrate-driven hyperglycemia and insulin resistance; (2) seed oil omega-6 excess promoting systemic inflammation; (3) food additives (emulsifiers like polysorbate-80, titanium dioxide) disrupting intestinal barrier and microbiota; (4) hyperpalatable flavor combinations overriding satiety signals, promoting overconsumption and obesity. Added sugar consumption beyond 5% daily calories (roughly 25g or 6 teaspoons) shows dose-dependent metabolic damage: excessive fructose (high-fructose corn syrup, added sugar) bypasses normal satiety signaling, directly enters hepatic lipogenic pathways, and promotes non-alcoholic fatty liver disease (NAFLD). Sugar-protein glycation (formation of advanced glycation end products or AGEs) creates cross-linked protein aggregates that promote inflammation, vascular stiffness, and neurodegeneration: AGE accumulation drives atherosclerotic lesion progression, contributes to diabetic complications, and correlates with cognitive decline in aging. AGE formation accelerates with refined carbohydrate consumption, high-heat cooking (grilling, frying), and elevated blood glucose. Refined seed oils (soybean, corn, sunflower oils) represent 7-10% of daily calories in Western diet compared to <1% traditionally: these oils provide excessive omega-6 polyunsaturated fat (linoleic acid), which oxidizes easily during extraction and storage, producing lipid peroxides and oxysterols promoting arterial inflammation and endothelial dysfunction. The omega-6 to omega-3 ratio in Western diets reaches 15-20:1 compared to ancestral ~1:1, driving pro-inflammatory prostanoid and leukotriene production. Replacement of seed oils with olive oil or avocado oil (higher in monounsaturated fat, resistant to oxidation) and reduction of omega-6 intake below 5% calories represents fundamental anti-inflammatory intervention. Trans fats (partially hydrogenated oils, some ruminant fats) increase cardiovascular disease risk proportionally to consumption: each 2% caloric increase from trans fats increases MI risk 23%, via mechanisms including LDL oxidation, endothelial dysfunction, and systemic inflammation. Food additives including emulsifiers, artificial sweeteners, and colorants accumulate evidence for dysbiotic and inflammatory effects in animal models and emerging human data, suggesting additive minimization prudent despite some disagreement on severity."
      },
      {
        heading: "Practical Meal Frameworks: Shopping Lists and Macro Templates",
        body: "Translation of nutritional science into daily practice requires meal frameworks reducing decision fatigue while ensuring nutritional completeness and satiety. The foundational framework emphasizes: (1) each meal contains adequate protein (25-40g) for satiety, amino acid provision, and muscle protein synthesis; (2) each meal contains 8-12g fiber from vegetables and whole grains; (3) meals emphasize whole foods with minimal processing; (4) caloric intake matches activity level and body composition goals. A practical protein template for omnivores combines animal and plant sources: breakfast options include 3-4 whole eggs with vegetables and 1 slice whole grain toast; Greek yogurt (20g protein per 150g serving) with berries and almonds; or legume-based options (lentil breakfast soufflé, chickpea pancakes). Lunch emphasizes vegetables as bulk with complete protein: grilled fish (palm-sized portion, ~25g protein) with 2-3 cups mixed vegetables, 1/2 cup whole grains (brown rice, quinoa, barley); or plant-dominant with legume emphasis: 1.5 cups cooked legumes (~15g protein) with vegetable sides and whole grain. Dinner maintains structure: lean protein (poultry 3-4 oz, grass-fed beef 3-4 oz, or legumes), 3-4 cups vegetables (prioritize cruciferous, leafy greens, nightshades for micronutrient density), and minimized starch (1/2 cup potatoes or rice, or emphasize fibrous vegetables for satiety). Snacking emphasizes protein and fiber: almonds (23g protein per ounce), hummus with vegetables, whole fruit with nuts, or hard cheese. Daily macronutrient targets vary individually: protein 1.6-2.2g per kilogram body weight supports muscle maintenance, lipids 20-30% calories from whole food sources (nuts, seeds, olive oil, fish) support hormone synthesis and nutrient absorption, and carbohydrates adjusted for activity level (higher in exercisers, lower in sedentary individuals). Shopping list minimization focuses on seasonal whole foods: proteins (eggs, canned fish, legumes, poultry, grass-fed beef in quantities affordable), vegetables (cost-effective frozen or seasonal fresh—broccoli, carrots, spinach, tomatoes), whole grains (bulk oats, brown rice, lentils), nuts/seeds (bulk almonds, walnuts), fruit (frozen berries, apples, bananas), and healthy fats (olive oil, butter, avocados). Meal preparation focusing on batch-cooking vegetables, grains, and proteins at week's beginning reduces decision fatigue. Intermittent fasting (16:8 time-restricted eating or occasional 24-hour fasts) offers potential metabolic benefits (improved insulin sensitivity, autophagy activation) for some individuals but shows no superiority to caloric restriction in prospective trials; individual adaptation matters more than specific protocol."
      }
    ]
  },
  social: {
    title: "Social Connection Deep Dive",
    color: "#1B4965",
    sections: [
      {
        heading: "Neuroscience of Connection: Oxytocin, Vagus Nerve, and Cortisol Regulation",
        body: "Social connection operates through fundamental neurobiological mechanisms involving neuropeptides, autonomic nervous system regulation, and neuroendocrine signaling that directly impact physiological health, immune function, and longevity. Oxytocin, synthesized in the hypothalamus and released during social bonding, skin-to-skin contact, and intimate connection, activates the parasympathetic nervous system via OXTr receptors in the nucleus ambiguus—the vagal motor nucleus controlling heart rate, facial expressivity, and vocal communication. This activation shifts autonomic balance toward parasympathetic dominance: heart rate variability (HRV) increases, blood pressure decreases, and inflammatory markers (TNF-α, IL-6, CRP) decline. Functional MRI studies demonstrate that oxytocin reduces amygdala activation in response to threatening stimuli, decreasing fear-based reactivity and improving social appraisal of ambiguous social information. The vagus nerve, the 10th cranial nerve providing parasympathetic innervation to heart, lungs, and digestive organs, represents the primary anatomical pathway for social signaling: increased vagal tone (measured via HRV) correlates with oxytocin responsiveness, empathic accuracy, and emotional regulation capacity. Vagal tone is trainable through vagal maneuvers (Valsalva, cold water immersion), vagus nerve stimulation, and importantly through social engagement: Porges' polyvagal theory proposes the vagus nerve integrates safe social cues (facial recognition, prosody, vocal tone) with autonomic state, enabling the \"social engagement system.\" Cortisol, released from the adrenal cortex during psychological stress, creates a physiological profile (elevated heart rate, suppressed immune function, increased blood glucose, reduced digestive activity) adaptive for acute threats but pathological when chronically elevated. Social connection reduces cortisol: held hands with partners, perceived social support, and secure attachment show marked cortisol suppression compared to social isolation or conflict conditions. The effect is bidirectional: secure social relationships facilitate vagal tone maintenance and oxytocin release, which further enables parasympathetic dominance and cortisol regulation. Longitudinal studies in rodents (prairie voles vs monogamous species) demonstrate that early adverse social environments produce lifelong elevation in baseline cortisol, anxiety-like behavior, and reduced social preference, with effects mediated through decreased oxytocin receptor density in reward regions and amygdala. Human adoption studies similarly show that children raised in severe institutional deprivation (Romanian orphanages) demonstrate reduced oxytocin responsiveness and elevated cortisol even 10+ years after placement in nurturing families, suggesting critical periods for social neurobiology development."
      },
      {
        heading: "The Harvard Study of Adult Development: Longitudinal Evidence for Social Impact",
        body: "The Harvard Study of Adult Development, initiated in 1938 by Arlie Russell and continuously followed by Robert Waldinger since 2003, represents the longest-running prospective study of human longevity and happiness, tracking 724 participants (initially 268 Harvard students, 456 Boston inner-city boys) across 85+ years of life. The study's central finding, replicated across cohorts and updated through 2020 data, demonstrates unequivocally that social relationship quality and quantity represent the strongest predictors of longevity, even exceeding traditional biomedical risk factors: participants with strong social relationships showed average 50% higher survival probability to age 80 compared to socially isolated participants, with magnitude of effect equivalent to or exceeding smoking cessation, weight loss, exercise, and alcohol moderation combined. Loneliness in midlife (age 50) independently predicted earlier mortality in late life, with hazard ratio of 1.35 after adjusting for marital status, health behaviors, and baseline health conditions—meaning lonely individuals age faster biologically than socially connected counterparts. The mechanism operates through multiple pathways: socially connected individuals show lower baseline inflammatory markers (CRP, IL-6), better maintained immune function (higher NK cell counts, better antibody responses to vaccination), more consistent health behaviors (exercise, nutrition, sleep), and superior mental health (lower depression and anxiety). The study identified specific relationship characteristics predicting longevity: relationship quality matters more than quantity (one high-quality close relationship more protective than multiple superficial relationships); consistency of social engagement (frequency of contact, not intensity, predicted outcomes); perceived support (subjective sense of having someone to rely on) trumped objective support received; and both romantic partnership and friendships contributed independently. Interestingly, married couples remained healthier through marriage quality rather than mere cohabitation: high-conflict couples showed accelerated aging of immune markers and higher mortality risk than divorced individuals in healthy relationships. The study followed participants through life transitions: marriage (protective of health), parenthood (complex effects depending on relationship quality), career stress (partially buffered by social support), and aging. Waldinger's updated analysis emphasizing longitudinal trajectories found that stable, high-quality relationships across decades showed exponential protective effects: individuals maintaining strong relationships at ages 50, 60, and 70 demonstrated superior health, cognition, and survival compared to those with declining social connectedness over time. The study's design (prospective, longitudinal, objective health measurement) overcomes major limitations of cross-sectional research showing mere correlation; the magnitude of effect, consistency across diverse cohorts (wealthy students, poor urban youth, both tracked identically), and biological plausibility make social connection causality compelling for healthy aging."
      },
      {
        heading: "Loneliness and Mortality: Comparing to Smoking",
        body: "Loneliness—the subjective perception of social disconnection despite objective relationship presence or absence—represents an independent and underappreciated risk factor for premature mortality, with epidemiological evidence suggesting equivalent or greater risk elevation compared to established factors like smoking, obesity, and physical inactivity. The landmark meta-analysis by Holt-Lunstad et al. (2010), synthesizing data from 148 prospective studies encompassing 300,000+ participants with average 7.5-year follow-up, found loneliness associated with 26% increased mortality risk (hazard ratio 1.26), with effect maintained across age groups and adjusted for baseline health status. Social isolation (objective lack of contact) showed 29% increased mortality, while perceived isolation (loneliness sentiment) showed slightly higher 32% increase, suggesting subjective experience matters most. In direct comparison with established risk factors in US population samples, loneliness shows mortality risk elevation equivalent to smoking 15+ cigarettes daily (30% increased mortality), exceeds obesity (20% increased mortality), and approaches or matches excessive alcohol consumption. The \"social pain\" of loneliness activates identical brain regions (anterior cingulate cortex, anterior insula) as physical pain, indicating evolutionary hardwiring of social need. Mechanism studies reveal multiple pathways: (1) Biological—lonely individuals show elevated cortisol, inflammatory markers (CRP, IL-6, TNF-α at 30-50% higher levels), and impaired immune function (reduced T-cell response, NK cell count, and antibody production); lonely older adults show 20-30% greater age-related decline in immune competence. (2) Behavioral—lonely individuals demonstrate worse health behaviors (less exercise, poorer sleep, worse nutrition, higher smoking/drinking rates). (3) Psychological—chronic stress from perceived social threat activates threat-surveillance systems, depleting cognitive resources and promoting depression/anxiety. Loneliness shows bidirectional relationship with health: loneliness promotes poor health through mechanisms above; poor health (disability, chronic disease, hearing/vision loss) promotes social withdrawal and increased loneliness. The effect operates across lifespan: lonely adolescents show elevated inflammation in adulthood (10-20 year follow-up); lonely older adults show accelerated cognitive decline and dementia risk; and chronically lonely individuals show biological aging acceleration (reduced telomere length at rates exceeding 1-2 years of aging per loneliness unit severity). Importantly, interventions addressing loneliness show promise: cognitive-behavioral therapy targeting social anxiety, social skills training, peer mentoring programs, and community engagement activities reduce loneliness and show biomarker improvements (reduced inflammation, improved immune function) in controlled trials. Internet-based and face-to-face interventions show comparable efficacy, though in-person contact produces larger effect sizes."
      },
      {
        heading: "Quantified Benefits: Different Social Activities and Health Outcomes",
        body: "Meta-analyses and prospective studies quantify differential health benefits across specific social activities, enabling evidence-based recommendations for relationship building and social engagement strategies. Romantic partnership and marriage show robust cardiovascular benefits: married individuals demonstrate 5-year longer life expectancy than never-married counterparts (Framingham Heart Study); marriage reduces myocardial infarction risk 35-50% in prospective studies; and married patients surviving MI show 50% lower 5-year mortality compared to unmarried counterparts. The benefit depends on relationship quality (high-conflict couples show cardiovascular disease risk equal to or exceeding unmarried status) and relationship stability (divorce increases cardiovascular disease risk 20-30% compared to maintained marriage). Parenthood shows complex effects: presence of children (particularly daughters in some studies) associated with lower mortality in some cohorts but higher stress in others; benefits appear mediated by relationship quality (securely attached parent-child relationships protective; conflicted or distant relationships neutral or harmful). Friendships independently predict longevity: a meta-analysis found each additional close friend reduced mortality risk by 8-10%; friendships appear particularly protective in women and for emotional support provision. Religious/spiritual community involvement shows 15-25% reduced mortality in prospective studies, partially independent of faith-specific effects, with mechanism attributed to regular social contact, shared values, and structure. The PRECISE Prospective Cohort Study following 15,000+ UK participants found religious service attendance 1+ times monthly associated with 33% reduced all-cause mortality and 50% reduced suicide risk compared to non-attendees, with magnitude exceeding that from exercise or diet alone. Volunteer work, even modest commitment (2-4 hours monthly), shows 15-20% reduced mortality and better self-rated health in prospective studies. Activity type matters: active volunteering (direct contact-based) shows greater benefits than administrative volunteering; cardiovascular disease patients performing volunteer work show better clinical outcomes than non-volunteers controlling for baseline severity. Social engagement through club membership, hobby groups, class attendance, and community activity shows dose-dependent mortality benefits: each additional social engagement type (beyond maintaining romantic partnership) associated with 5% cumulative mortality reduction. Social network size predicts outcomes: individuals with 6+ social relationships show 50% reduced mortality compared to 0-2 relationships. Importantly, solitary hobbies and entertainment (media consumption, solo exercise) provide minimal social health benefits compared to group-based activities. Internet-based relationships show weaker associations with health outcomes compared to in-person contact, though longitudinal evidence remains limited; the most robust health benefits consistently derive from regular, face-to-face interaction with consistent relationship partners."
      },
      {
        heading: "Practical Relationship Building: Intentional Strategies for Modern Life",
        body: "Modern life (geographic mobility, remote work, digital communication, nuclear families) fragments traditional social structures, requiring intentional relationship building replacing previous informal social cohesion. Evidence-based strategies for sustainable social connection include: (1) Prioritization through time allocation: research shows that protective relationships require consistent contact; the \"Dunbar number\" (approximately 150 sustainable relationships) constrains social capacity, necessitating deliberate focus on high-value relationships rather than diffuse weak ties. Most people require weekly contact with close relationships and monthly contact with broader social circles; intentional scheduling of regular gatherings (weekly dinner, monthly outing) ensures consistency through volitional commitment. (2) Community embedding: relocation to neighborhoods with community amenities (parks, community centers, walkable commercial areas), joining community organizations, and developing familiarity with local establishments (coffee shops, gyms, parks) increases incidental social contact and friendship formation opportunities. Population studies show that walkable neighborhoods predict higher social capital and lower depression prevalence compared to car-dependent sprawl. (3) Vulnerability and reciprocity: research on relationship formation shows that moderate self-disclosure (sharing concerns, struggles, authentic feelings) accelerates relationship deepening compared to surface-level conversation; vulnerability paradoxically increases likability. Reciprocal support exchange (mutual help-giving and help-receiving) strengthens bonds more than unidirectional support. (4) Group-based activities providing shared identity: joining activity-based groups (book clubs, running groups, skill-learning classes, volunteer organizations) that meet regularly provides structure, repeated contact, and shared identity, facilitating relationship development. Meta-analysis of group-based interventions for loneliness shows highest efficacy when groups meet consistently (weekly or more) with activities providing natural conversation and cooperation. (5) Technology use calibration: video calls sustain long-distance relationships but show weaker health associations than in-person contact; text-based communication provides minimal social benefit; optimal strategy combines video/calls for distant relationships with in-person priority for local relationships. Social media engagement correlates with increased loneliness in longitudinal studies when used passively (scrolling, consumption); active engagement (messaging, group communication for real-world coordination) shows more positive associations. (6) Professional support when needed: individuals with severe social anxiety, attachment trauma, or chronic loneliness benefit from therapy targeting social skills deficits, anxiety reduction, and attachment patterns. Interpersonal therapy specifically shows efficacy for depression-linked loneliness. Most critically, relationship building requires patience and persistence: friendships deepen through repeated interaction across months and years; early-stage relationships show fragility and need regular contact (weekly) to solidify. The \"36 questions to fall in love\" study demonstrates that vulnerability-inducing conversation accelerates intimacy, suggesting intentional relationship-deepening conversation, active listening, and authentic sharing provide leverage for friendship acceleration within consistent contact structures."
      }
    ]
  },
  sleep: {
    title: "Sleep Deep Dive",
    color: "#6BA3C7",
    sections: [
      {
        heading: "The Glymphatic System: Nighttime Brain Detoxification",
        body: "Sleep serves a critical housekeeping function through the glymphatic system, a cerebrospinal fluid (CSF)-interstitial fluid exchange system unique to the brain that clears metabolic waste during sleep with 60% greater efficiency than waking hours. During wakefulness, the brain consumes 20% of body's ATP production in the 1.4 kg neural tissue; this metabolic activity generates beta-amyloid (Aβ), tau protein, and other neurotoxic metabolites that accumulate in extracellular space. During sleep, especially slow-wave sleep (deep NREM), the brain enters a state of reduced sensory input and motor output, facilitating aquaporin-4 water channel activation and CSF pumping through glial (astrocytic) networks, which increases interstitial space volume by 60% and allows CSF to flush neurotoxic accumulations. The Nedergaard laboratory (2013 Science paper) demonstrated in rodents that sleep-deprived animals show dramatic Aβ accumulation in hippocampus and cortex compared to rested controls; a single night of sleep deprivation increases Aβ accumulation 25-30%. Longitudinal studies in humans show that individuals sleeping <6 hours nightly for 5+ years show increased PET-imaging evidence of brain amyloid accumulation compared to 7-8 hour sleepers. This mechanism directly connects sleep duration to neurodegeneration risk: reduced glymphatic clearance allows Aβ and tau to form oligomeric aggregates initiating Alzheimer's pathology. CSF-ISF exchange efficiency depends critically on sleep stage: stage 3 NREM (slow-wave sleep with delta waves) shows greatest glymphatic activity, explaining why sleep depth matters as much as duration. Fragmented sleep with frequent arousals (common in sleep apnea or frequent nighttime awakenings) reduces time in stage 3 NREM and impairs glymphatic clearance proportionally. Sleep apnea patients show 2-3 fold increased amyloid accumulation despite normal sleep duration. The glymphatic system also clears pro-inflammatory cytokines (TNF-α, IL-1β, IL-6) produced during wakefulness; sleep deprivation maintains elevated brain inflammation, contributing to mood disturbance and cognitive dysfunction during wakefulness. Short-term sleep deprivation (24 hours) increases cerebrospinal fluid IL-1β levels 200% above baseline, with associated cognitive slowing and increased error rates in attention tasks. The mechanism provides molecular explanation for why sleep is non-negotiable: the brain cannot function optimally if constrained to continuous wakefulness without metabolic waste clearance. No amount of antioxidants, drugs, or supplements substitutes for sleep's unique waste-clearance function."
      },
      {
        heading: "Sleep Architecture: NREM Cycles, REM Consolidation, and Ultradian Rhythms",
        body: "Sleep comprises distinct architectural stages—non-rapid eye movement (NREM) stages 1-3 and rapid eye movement (REM) sleep—cycling in 90-minute ultradian rhythms throughout the night, with each stage serving specific neurobiological and psychological functions. NREM stage 1 represents the transition between wakefulness and sleep, lasting 1-7 minutes per cycle; this stage shows theta waves and reduced muscle tone. Stage 2 NREM comprises 45-55% of sleep and shows distinctive sleep spindles (brief 12-16 Hz bursts) and K-complexes (negative-positive waveform deflections); this stage appears critical for memory consolidation of procedural skills and emotional regulation. Stage 3 NREM (slow-wave sleep or deep sleep), characterized by high-amplitude delta waves (0.5-4 Hz), comprises 15-25% of early-night sleep and progressively decreases through the night. Delta power (amplitude of slow-wave activity) declines 10-15% per decade in healthy aging, contributing to decreased sleep efficiency and nighttime fragmentation in older adults. Slow-wave sleep demonstrates critical functions: memory consolidation of declarative facts (episodic memory), glymphatic waste clearance, growth hormone secretion (10-15 fold increase over daytime levels during SWS), and recovery from cognitive fatigue. Experimentally induced SWS deprivation while maintaining total sleep duration produces next-day impairments in working memory and attention equivalent to mild intoxication. REM sleep comprises 20-25% of total sleep and occurs in longer bouts later in the night (first REM period 5-10 minutes; final REM period 30-60 minutes); it shows low muscle tone (atonia), rapid eye movements, high-frequency EEG activity similar to wakefulness, and vivid dreaming. REM sleep consolidates emotional memories and procedural skills requiring complex motor sequences; REM deprivation produces emotional reactivity, anxiety, and impaired motor learning. The brain regions active during REM differ markedly from wakefulness: the prefrontal cortex (executive function, impulse control) shows markedly reduced activity while limbic system (emotional processing), visual cortex, and motor areas show heightened activation—a neurochemical state facilitating emotional memory consolidation and creative reorganization of memories. Sleep across the night follows a homeostatic pattern: early sleep cycles emphasize NREM stages 2-3 (meeting sleep debt from prior wakefulness), while late-night cycles emphasize REM (supporting memory consolidation and mood regulation). This architecture explains why sleep fragmentation or early morning awakening disrupts REM consolidation, even if total sleep duration appears adequate. Individuals averaging 6 hours nightly for weeks show marked REM deficit, manifesting as irritability, anxiety, and emotional lability despite normal NREM preservation. The ultradian 90-minute basic rest-activity cycle extends beyond sleep, with optimal cognitive performance requiring 90-120 minute focused work periods followed by 15-20 minute recovery breaks. Chronic violation of this ultradian rhythm (constant stimulation, marathon work sessions, attention fragmentation through multitasking) produces cumulative cognitive fatigue and autonomic dysregulation."
      },
      {
        heading: "Caffeine Pharmacology: Half-Life, Adenosine, and Sleep Pressure",
        body: "Caffeine, the world's most consumed psychoactive substance, blocks adenosine receptors throughout the central and peripheral nervous system, effectively masking sleep pressure and creating stimulation that persists far longer than conscious perception, fundamentally disrupting sleep architecture and accumulating sleep debt across days. Adenosine, produced continuously during wakefulness through ATP hydrolysis during neuronal activity, accumulates in CSF and extracellular space, binding to adenosine receptors (particularly A1 receptors in anterior cortex and basal forebrain) and triggering the homeostatic sleep drive—the biological pressure to fall asleep increasing with time awake. Caffeine, with high lipophilicity, crosses the blood-brain barrier and competitively antagonizes adenosine binding, effectively disconnecting the brain's assessment of accumulated sleep debt. A typical 200mg caffeine dose (one 8oz cup of coffee) occupies approximately 50-80% of brain adenosine receptors, with occupation percentage determining perceived stimulation. Critically, caffeine shows half-life of 5-6 hours in most individuals (with genetic variation: fast metabolizers clear it in 2-3 hours, slow metabolizers require 8-10 hours): a 200mg caffeine dose at 2pm leaves 100mg CNS-active caffeine at 8pm, 50mg at 2am, and residual amounts at 6am—sufficient to impair adenosine receptor signaling and prevent sleep-pressure sensation. Circadian timing matters: caffeine consumed early (before 10am) for individuals with daytime activity produces minimal sleep disruption; consumed after 2pm, it commonly delays sleep onset 30-60 minutes and reduces stage 3 NREM (slow-wave sleep) 30-50%, even if sleep duration appears adequate. Study subjects reporting they \"sleep fine after afternoon coffee\" demonstrate objective sleep-stage reduction on polysomnography—suggesting dissociation between subjective feeling and actual sleep architecture. The pharmacological effect extends beyond sleep timing: residual caffeine produces lighter sleep (more stage 1-2 NREM, less stage 3), increased microarousals (brief awakenings without conscious recall), and reduced REM consolidation when occurring during peak adenosine blockade periods. Caffeine also blocks adenosine receptors in the adenosine receptors in the peripheral cardiovascular system, increasing heart rate, cardiac output, and blood pressure; this sympathetic activation persists across sleep, elevating nighttime blood pressure 5-10 mmHg on average and increasing cardiovascular stress during vulnerable sleep periods. Withdrawal from chronic caffeine use produces adenosine receptor upregulation and increased receptor sensitivity, causing headaches, fatigue, and dysphoria lasting 2-9 days depending on consumption quantity and metabolic rate. The gradual metabolism throughout the day creates sleep-pressure accumulation patterns: individuals consuming caffeine after 2pm daily experience chronically reduced adenosine signaling, leading to insufficient sleep drive and either delayed sleep onset or lighter, more fragmented sleep. Evidence-based guidance recommends caffeine consumption cutoff no later than 2pm (earlier for slow metabolizers), with maximal dose 200mg daily and consideration of genetic testing for CYP1A2 polymorphisms determining metabolic clearance rate, particularly in individuals with reported sleep issues or anxiety."
      },
      {
        heading: "Alcohol Destruction of REM Sleep and Sleep Architecture",
        body: "Alcohol (ethanol) produces deceptively normal sleep onset and increased total sleep duration initially, but systematically degrades sleep quality through REM suppression, fragmentation, and circadian desynchronization—effects progressing from acute (single dose) to chronic (nightly consumption), with cumulative damage to cognitive, emotional, and physical health. Acute alcohol (consumed 2-3 hours before sleep) enhances GABA (inhibitory neurotransmitter) signaling and suppresses glutamate (excitatory), facilitating sleep onset 10-15 minutes faster and increasing deep sleep (stage 3 NREM) in first half of night. However, this initial benefit masks profound subsequent disruption: alcohol inhibits adenosine deaminase, increasing adenosine levels—yet simultaneously blocks adenosine receptor signaling, preventing adenosine-mediated sleep-pressure sensation. As alcohol metabolizes (first-pass liver metabolism eliminates roughly 15-20 mL alcohol per hour), the brain transitions abruptly from GABA/adenosine enhancement to relative GABA depletion and adenosine receptor over-activation, causing rebound wakefulness, nocturnal awakenings, and severe REM suppression in second sleep half. A typical evening alcoholic drink (14g ethanol, roughly one standard drink) reduces REM sleep 25-50% in most individuals; two drinks reduce REM 50-70%. This REM suppression occurs every night for alcohol consumers, creating chronic REM debt: prospective studies following alcohol-consuming individuals show 30-50% increased rates of vivid dreams and nightmares upon alcohol cessation (REM rebound), indicating sustained REM deficit during drinking. The cognitive and emotional consequences are substantial: chronic REM deficit impairs emotional memory consolidation and emotional regulation capacity, contributing to increased depression, anxiety, and emotional reactivity documented in longitudinal studies of heavy drinkers. Nightly alcohol consumption produces fragmented sleep with increased micro-awakenings and stage-shift instability; sleep architecture monitoring via polysomnography shows individuals drinking nightly demonstrate 2-3 fold increased brief arousal frequency (arousals of 3-15 seconds insufficient for conscious recall). These microarousals prevent progression to deep sleep and fragment REM episodes, creating surface-level sleep despite apparently adequate total duration. The circadian desynchronization from alcohol reflects reduced melatonin secretion (ethanol suppresses melatonin production via inhibition of serotonin N-acetyltransferase) and phase delay of the circadian rhythm: nightly drinkers experience progressively earlier sleep offset (earlier morning wakefulness) despite delayed initial sleep onset, resulting in net sleep duration compression. Alcohol metabolites (acetaldehyde from first-pass hepatic metabolism) produce oxidative stress and inflammatory cytokine upregulation during sleep, opposite of sleep's normal anti-inflammatory function; this explains why frequent drinkers show elevated CRP and IL-6 despite apparently sleeping similarly to non-drinkers. Withdrawal from chronic alcohol use produces severe insomnia for 1-3 weeks: reduced GABA signaling creates hyperarousal, while adenosine rebound and melatonin recovery occur gradually, requiring patience. Sleep deprivation from alcohol withdrawal paradoxically continues until the brain's GABAergic and adenosinergic systems rebalance. Evidence-based guidance: alcohol should be eliminated 3+ hours before sleep (longer in slow metabolizers); regular nightly consumption is incompatible with healthy sleep architecture and should be avoided; occasional consumption (once weekly or less) produces minimally detectable effects on next-morning cognition."
      },
      {
        heading: "Light Exposure and Melatonin Suppression: Blue Light, Circadian Alignment",
        body: "Circadian rhythm—the 24-hour biological cycle regulating sleep-wake timing, hormone secretion, core body temperature, and metabolic processes—is entrained primarily through light exposure detected by intrinsically photosensitive retinal ganglion cells (ipRGCs) containing melanopsin, which show peak sensitivity to blue light (460-480 nm wavelength). This neurobiological light detection system, distinct from color vision, projects to the suprachiasmatic nucleus (SCN)—the brain's master circadian pacemaker—and directly controls melatonin production in the pineal gland through a multisynaptic retinohypothalamic tract. Bright light exposure (>1000 lux) in the morning (6am-9am) advances circadian phase, making subsequent evening earlier and deepening sleep-wake consolidation—an effect mediated through ipRGC melanopsin stimulation and SCN shifting. Evening light exposure (after 9pm) delays circadian phase, postponing subsequent sleep onset and morning wakefulness, with blue light (460-480 nm) producing greatest suppression. Melatonin secretion follows a circadian pattern largely independent of sleep status: in darkness, the pineal gland (under SCN control) begins melatonin synthesis around 2-3 hours before habitual sleep time, with peak levels 2-3 hours into sleep, maintaining elevated levels until approximately 1 hour before habitual wake time. This melatonin rhythm serves dual functions: high melatonin levels promote sleep propensity and consolidate sleep architecture; melatonin's antioxidant and anti-inflammatory properties support immune function and reduce systemic oxidative stress during sleep. Evening light exposure, particularly blue light from screens, suppresses melatonin production dose-dependently: bright screen light (typical smartphone: 200-300 lux at typical reading distance) suppresses melatonin 30-50% acutely; sustained evening screen exposure delays melatonin onset 1-2 hours compared to screen-free evenings. The effect is independent of conscious alertness: individuals feel sleepy normally but neurobiologically remain in circadian night despite subjective tiredness, resulting in sleep onset delay followed by insufficient sleep duration before circadian morning signals cause wake. Meta-analysis of screen exposure and sleep shows that evening screen use (1+ hour within 2 hours of sleep) associated with 30-50 minute sleep delay, 30-50% increased insomnia prevalence, and 10-15% reduction in REM sleep percentage. The blue light mechanism explains differential screen effects: amber/red-light filtered screens (blue-light blocking glasses, f.lux software, phone night mode) reduce melatonin suppression 50-70% but don't eliminate it completely. The absolute gold standard for evening melatonin preservation is light darkness (0 lux) beginning 2-3 hours before habitual bedtime; dimmed lighting (<50 lux) preserves most melatonin production, while typical household lighting (200-500 lux) produces partial suppression. Individual circadian sensitivity varies genetically: \"morning larks\" (chronotype advance) show greater melatonin suppression from evening light and earlier natural melatonin onset; \"night owls\" (chronotype delay) show greater resilience to evening light and later melatonin peak. Critically, environmental circadian misalignment (chronic late-night light exposure, shift work, frequent travel across time zones) produces social jet lag—persistent desynchronization between environmental light/social schedules and endogenous circadian rhythm—associated with metabolic dysfunction (insulin resistance, obesity), mood disorders (depression, bipolar instability), and accelerated aging. Intervention studies show that controlled light exposure (bright light 8-10am daily, darkness 10pm onward) realigns circadian rhythm within 3-7 days, improving sleep consolidation, daytime alertness, and mood."
      },
      {
        heading: "Temperature Regulation and Sleep Protocol: From Cooling to Circadian Timing",
        body: "Core body temperature shows a circadian oscillation fundamental to sleep regulation: temperature begins falling 2-3 hours before habitual sleep onset (from 37.0°C to nadir ~36.2°C during sleep), maintains lowest temperature during early NREM sleep (particularly stage 3), and begins rising 1-2 hours before habitual wake time. This thermogenic cycle directly facilitates sleep through multiple mechanisms: reduced core temperature decreases metabolic rate, reduces sympathetic nervous system activity, increases parasympathetic dominance, and enhances adenosine-mediated sleep pressure. The distal-proximal temperature gradient (warm skin periphery relative to cool core) represents the most powerful physiological signal promoting sleep onset: the anterior hypothalamus contains warm-sensitive neurons detecting core-peripheral temperature difference; when gradient reaches threshold (typically core ~0.8°C cooler than skin), sleep onset pressure becomes maximal. This explains why warm baths 2-3 hours before sleep enhance sleep onset: the acute peripheral vasodilation and heat loss cools core temperature below baseline, creating exaggerated distal-proximal gradient. Sleep environment temperature of 65-68°F (18-20°C) optimizes sleep architecture by facilitating distal-proximal gradient; warmer environments (>72°F/22°C) impair sleep consolidation and reduce REM sleep percentage 10-15%. Ambient temperature shifts affect circadian timing: gradual temperature increases in late evening suppress melatonin and delay sleep onset; abrupt temperature decreases facilitate melatonin secretion and advance sleep onset. High ambient temperature impairs sleep through multiple mechanisms: prevents core cooling, reduces distal-proximal gradient, increases nocturnal awakenings (particularly in stage 2 NREM), and disproportionately reduces REM sleep. Individual thermoregulation is modulated by reproductive hormones: women experience 0.3-0.5°C lower distal-proximal temperature gradient during luteal menstrual cycle phase and show increased wakefulness and reduced REM sleep in that phase compared to follicular phase—explaining why some women report worse sleep in menstrual cycle's second half. Aging reduces thermoregulatory capacity: older adults show reduced ability to dissipate heat peripherally and reduced core temperature amplitude, contributing to lighter sleep, increased nocturnal awakenings, and earlier morning wakefulness. Practical sleep temperature protocols combine environmental cooling with physiological manipulation: maintain bedroom at 65-68°F using air conditioning or opening windows; use breathable bedding (cotton or technical fabrics reducing heat trapping); take a warm shower 2-3 hours before sleep (cold water rinsing final 30 seconds enhances distal-proximal gradient); and avoid exercise within 3 hours of bedtime (exercise produces heat lasting hours post-completion). For individuals with heat intolerance, cooling mattress pads or water-cooled systems provide targeted core temperature reduction; controlled trials show such interventions improve sleep consolidation 15-25% and increase REM percentage 10-15% compared to standard bedding. Conversely, for those with natural cold sensitivity, warm core (through moderate heating clothing during initial sleep onset, then gradual warming reduction as sleep consolidates) can facilitate sleep initiation; the critical variable is the distal-proximal gradient optimization rather than absolute temperature."
      },
      {
        heading: "Morning Sunlight and Sleep Hygiene: Practical Daily Protocol",
        body: "Sleep quality derives from integrated circadian alignment achieved through specific daily behavioral practices building on light exposure, temperature, and movement that synchronize the endogenous circadian oscillator with external time cues. The foundational intervention—bright light exposure within 30-120 minutes of habitual wake time—activates melanopsin-containing ipRGCs maximally (natural sunlight 8000-15,000 lux vs artificial light 200-500 lux) and delivers the strongest circadian phase-advance signal: individuals exposed to 10,000 lux light for 30 minutes at 7am show sleep onset 1-2 hours earlier and improved sleep consolidation compared to baseline, with benefits accumulating over weeks into maximal phase advance. Outdoor exposure in morning provides dual benefits: intense light and blue wavelengths combine for maximum ipRGC stimulation; the dynamic light environment (changing intensity, wavelength, and direction as sun moves) provides superior circadian entrainment compared to static indoor light. Meta-analysis of morning light interventions shows 30-minute morning sunlight exposure reduces evening sleep latency 20-30 minutes and improves sleep efficiency (percentage of time in bed actually sleeping) by 10-15%. The effect operates bidirectionally: absence of bright morning light (shift workers, seasonal darkness in high latitudes) produces circadian delay with sleep-onset difficulties and delayed wake times; supplementation with 10,000 lux light therapy morning restores normal sleep timing even in populations with naturally delayed chronotypes. Physical activity timing synchronizes circadian rhythm: morning exercise (30-60 minutes moderate intensity) combines light exposure and movement cues to advance circadian phase; evening exercise produces minimal circadian effect but temporarily increases core temperature, which delays subsequent sleep onset and should be avoided within 3 hours of bedtime. The practical daily sleep-optimization protocol integrates circadian, thermogenic, and homeostatic factors: (1) Immediate upon waking (~6-7am): 10-15 minute outdoor bright light exposure (sunlight preferable; 10,000 lux light therapy acceptable in cloudy regions or seasonal darkness); (2) Morning: moderate exercise (30-60 minutes) including cardiovascular and resistance components within 3 hours of wake; (3) Daytime: maintain bright light exposure (windows near work area, outdoor time during breaks); avoid afternoon naps >20 minutes (disrupts sleep pressure accumulation); (4) Early evening: warm bath/shower 2-3 hours before intended sleep (facilitates core temperature drop); (5) Evening (2 hours before sleep): light-based sleep preparation including blue-light filtering (blue-light glasses, phone/computer blue-light reduction), dimmed lighting (<50 lux), and progression toward complete darkness approaching sleep time; (6) Pre-sleep (30-60 minutes): establish wind-down routine (reading, gentle stretching, meditation) signaling transitions toward sleep; (7) Sleep environment: cool bedroom (65-68°F), darkness (0 lux), silence or white noise masking environmental sounds, comfortable mattress/pillow; (8) Sleep schedule: consistent sleep-wake times (within ±30 minutes) seven days weekly, maintaining circadian stability superior to weekend sleep extension. Additional evidence-based sleep hygiene includes: avoid caffeine after 2pm, eliminate alcohol 3+ hours before sleep, avoid long daytime naps (fragments nighttime sleep), manage pre-sleep anxiety through meditation or journaling, and practice stimulus control (reserve bed for sleep/intimacy exclusively, removing work/devices from sleep environment). For individuals with severe sleep disturbance unresponsive to behavioral interventions, cognitive-behavioral therapy for insomnia (CBT-I) shows 60-70% efficacy compared to pharmaceutical sleep aids (30-40% efficacy), providing durable improvements persisting months after intervention cessation. Pharmacological interventions (benzodiazepines, nonbenzodiazepine hypnotics, melatonin) should be considered only when behavioral approaches fail, given significant adverse effects (next-day cognitive impairment, dependence, complex sleep behaviors) and paradoxical long-term efficacy decline."
      }
    ]
  },
  sauna: {
    title: "Sauna Deep Dive",
    color: "#5CC9A0",
    sections: [
      {
        heading: "Heat Shock Proteins: Cellular Adaptation and Hormetic Stress",
        body: "Sauna-induced hyperthermia triggers a sophisticated cellular stress-response cascade centered on heat shock proteins (HSPs)—molecular chaperones that refold damaged proteins, prevent misfolding, and maintain cellular proteostasis—creating adaptive benefits extending far beyond the acute exposure. Heat shock protein families (HSP60, HSP70, HSP90, and small HSPs like HSP27) are constitutively expressed at baseline levels but increase 10-50 fold within 30-60 minutes of sauna exposure as core temperature elevates 1.5-2°C above baseline. The mechanism involves activation of heat shock factor 1 (HSF1) through phosphorylation when misfolded protein accumulation reaches threshold; HSF1 translocates to the nucleus and binds heat shock elements (HSEs) in gene promoter regions, initiating rapid transcription of multiple HSP isoforms. This transcriptional response begins within 15-20 minutes of sauna onset (when core temperature reaches 38.5-39°C) and peaks 30-60 minutes post-sauna, persisting at elevated baseline for 24-48 hours post-exposure. The biological significance relates to aging and neurodegeneration: age-related reduction in HSP expression and HSF1 responsiveness contributes to protein aggregation and cellular senescence; upregulation of HSPs delays onset and progression of protein misfolding diseases (Parkinson's, Alzheimer's, amyloid accumulation). Cross-species studies show that HSP overexpression extends lifespan 10-20% in Caenorhabditis elegans and Drosophila models; conversely, HSP70 knockdown accelerates age-related phenotypes. The concept of hormetic stress explains sauna benefits: acute cellular stress (hyperthermia, oxidative stress during heat exposure) triggers adaptive responses (HSP upregulation, mitochondrial biogenesis, increased antioxidant capacity) that exceed the adaptive demand, creating net improvement in cellular resilience beyond pre-stress baseline. This phenomenon, documented across exercise, fasting, and cold exposure as well, suggests regular sauna use represents a biological stimulus maintaining cellular defenses despite advancing age. Heat exposure specifically upregulates HSP70, which binds misfolded Aβ and tau (Alzheimer's pathogenic proteins) in the brain, preventing oligomerization and amyloid fibril formation; animal models of AD show that chronic heat exposure (equivalent to 4 weekly sauna sessions) reduces brain amyloid accumulation 30-40% and improves cognitive performance on maze tasks. The HSP response is independent of cardiovascular benefit and persists in individuals with contraindications to high exercise intensity, making sauna particularly valuable for frail or severely deconditioned populations. However, habituation occurs: individuals showing 10-fold HSP70 increase at baseline sauna initiation show 3-5 fold increase only after 2-3 weeks of repeated use, suggesting need for periodized sauna protocols with planned breaks to prevent tolerance development."
      },
      {
        heading: "The Kuopio Study: Prospective Evidence for Sauna and Mortality",
        body: "The Kuopio Ischemic Heart Disease Risk Factor Study (KIHD), a prospective cohort investigation initiated in 1984 following 2,315 middle-aged Finnish men with detailed sauna exposure documentation and comprehensive health outcomes across 20+ years, provides the highest-quality human evidence for sauna's health impact, with findings of 40-65% reduced cardiovascular and all-cause mortality in frequent sauna users compared to minimal users. The study population's unique advantage derives from Finland's normative sauna use (90% of population uses sauna 1-7 times weekly, with detailed frequency documentation), enabling comparison across wide exposure ranges absent in most populations. Laukkanen et al.'s landmark 2015 paper analyzing primary outcomes found that men using sauna 4-7 times weekly showed 48% reduction in sudden cardiac death compared to infrequent users (1 time weekly); cardiovascular disease mortality reduction reached 40% in the highest exposure group; and all-cause mortality reduction reached 37-40%. Most strikingly, the effect showed dose-response linearity: each additional sauna session weekly associated with 8-10% incremental mortality reduction, suggesting biological mechanism rather than confounding. The mechanism involves multiple pathways demonstrated through substudy analyses: sauna exposure reduced systolic blood pressure 3-4 mmHg and diastolic pressure 2-3 mmHg acutely and chroni­cally; improved arterial stiffness (pulse wave velocity reduction of 0.5 m/s for frequent users); improved endothelial function (brachial artery flow-mediated dilation increased 15-20%); and reduced systemic inflammation markers (CRP reduction 20-30%, IL-6 reduction 15-25%) with effects accumulating over months. The study stratified analysis by atherosclerotic burden: even in men with substantial atherosclerosis at baseline (elevated Lp(a), multiple risk factors), frequent sauna use reduced progression and event rates, suggesting sauna benefits extend beyond prevention to also stabilizing existing disease. Notably, sauna benefit persisted even in men with antecedent myocardial infarction (previous heart attack): post-MI patients using sauna 4+ times weekly showed 50% reduction in subsequent cardiac events compared to minimal users, indicating potential cardiac rehabilitation value. The mechanism likely involves improved autonomic nervous system function: acute sauna causes sympathetic activation (elevated heart rate 100-150 bpm, increased cardiac output and blood flow) followed by pronounced parasympathetic rebound during recovery, creating a cardiovascular training stimulus without skeletal muscle mechanical load—valuable for patients unable to exercise. Long-term sauna use appeared to normalize post-sauna heart rate recovery and improve heart rate variability metrics, suggesting enhanced parasympathetic tone. Importantly, baseline cardiovascular health status didn't negate benefit: even men with existing hypertension, previous MI, or diabetes showed mortality benefit from frequent sauna, with effect sizes equivalent to those in healthier subgroups. The study's prospective design (sauna frequency documented at baseline, health outcomes followed prospectively), objective outcome assessment (hospitalization records, death certificates), and large size (sufficient to adjust for extensive confounders and detect meaningful subgroup interactions) provide stronger causal inference than cross-sectional data. Subsequent smaller prospective studies and randomized trials have confirmed sauna's cardiovascular benefits and extended findings to endothelial function, inflammatory markers, and blood pressure reduction, making the KIHD study's findings broadly replicable."
      },
      {
        heading: "Cardiovascular Mimicry: Hemodynamic Effects and Training Response",
        body: "Sauna exposure produces hemodynamic changes nearly equivalent to moderate cardiovascular exercise, creating a training stimulus that improves cardiovascular function despite absence of skeletal muscle mechanical work, explaining sauna's value for deconditioned and elderly populations unable to perform sustained aerobic exercise. Acute sauna exposure increases heart rate 50-100% (from baseline ~70 bpm to 120-170 bpm), with magnitude dependent on initial fitness, age, water immersion component (hot water immersion shows greater heart rate response than dry sauna), and core temperature rise magnitude. This heart rate elevation provides cardiovascular training stimulus: sustained elevation over 15-30 minutes at 60-80% max HR matches intensity of Zone 2 aerobic training. Cardiac output increases proportionally to heart rate elevation (stroke volume shows modest 10-15% increase while heart rate provides primary cardiac output augmentation), reaching 4-6 L/min comparable to moderate-intensity cycling. Peripheral vascular response involves dual mechanisms: acute phase shows immediate peripheral vasodilation (skin blood flow increases 10-15 fold, from ~0.5 L/min to 5-8 L/min) to dissipate heat, with resulting hypotension (systolic pressure drops 10-20 mmHg acutely) compensated by sympathetic activation increasing heart rate and cardiac output. Post-sauna recovery involves parasympathetic rebound: heart rate normalizes within 30-60 minutes, blood pressure may drop further below baseline during this recovery period, and heart rate variability shows increased parasympathetic tone. This oscillation between sympathetic activation (during sauna) and parasympathetic rebound (during recovery) represents the cardiovascular training stimulus; repeated cycling improves autonomic regulation and parasympathetic tone recovery—mechanisms identical to interval training benefits but achieved without mechanical loading. Studies examining cardiovascular adaptations to repeated sauna sessions (4+ weekly for 4-12 weeks) document improvements in: left ventricular ejection fraction (2-5% increase in some studies), arterial stiffness indices (pulse wave velocity decreased 5-10%), endothelial function (flow-mediated dilation increased 10-15%), and baroreflex sensitivity (improved blood pressure regulation). The mechanism appears partly independent of temperature elevation: contrast immersion (hot sauna alternating with cold plunge) produces greater blood pressure and endothelial improvements than sauna alone, suggesting the oscillating hemodynamic stimulus provides potent training signal. For elderly and deconditioned populations unable to tolerate continuous moderate-intensity exercise due to orthopedic limitations, cardiorespiratory disease, or deconditioning severity, sauna provides cardiovascular benefit with minimal mechanical stress on joints and lower absolute intensity. However, sauna is not metabolically equivalent to exercise: without skeletal muscle contraction, sauna produces minimal glucose disposal, no muscle fiber recruitment, and limited mitochondrial biogenesis compared to exercise; sauna serves as supplement to rather than replacement for regular physical activity."
      },
      {
        heading: "Growth Hormone and Anabolic Response to Heat Stress",
        body: "Sauna-induced hyperthermia triggers growth hormone (GH) secretion reaching 16-fold elevation above baseline within 15-20 minutes of sauna exposure and persisting 30-60 minutes post-sauna, creating an anabolic hormonal environment supporting muscle protein synthesis, fat oxidation, and tissue repair. The mechanism involves direct hypothalamic stimulation of GH-releasing hormone (GHRH) neurons through thermoreceptor signals and indirect suppression of somatostatin (which inhibits GH). GH serves multiple anabolic functions: stimulates hepatic and local tissue insulin-like growth factor-1 (IGF-1) production; increases lipolysis (fat breakdown) through hormone-sensitive lipase activation; enhances protein synthesis rates in muscle; and promotes myogenesis through satellite cell activation. The timing of GH elevation relative to muscle damage or protein intake determines anabolic efficiency: sauna GH elevation lasting 30-90 minutes post-exposure creates favorable hormonal milieu for anabolic signaling if protein intake (20-40g complete protein) is consumed immediately post-sauna. Prospective studies examining sauna combined with resistance training found superior hypertrophic gains compared to resistance training alone: a 4-week study of recreational lifters following resistance training with post-session sauna (20 minutes) showed 8-10% greater muscle thickness gains (measured via ultrasound) compared to resistance training without sauna, suggesting GH-driven enhancement of muscle protein synthesis. The GH elevation also enhances fat oxidation: acute sauna increases fat oxidation rate by 30-50% during recovery period, with cumulative effect of repeated sessions potentially improving metabolic rate slightly; however, the effect is modest and insufficient to create meaningful weight loss absent energy deficit. Critically, the anabolic effect of sauna GH shows significant individual variation: responders show 10-20 fold GH elevation, non-responders show minimal (<3 fold) elevation, with variation determined by genetic polymorphisms in GHRH receptor genes and baseline fitness status (fit individuals show blunted GH response). Additionally, GH elevation from sauna shows rapid adaptation: GH response declines 50% after 2-3 weeks of repeated sauna sessions (similar adaptation seen with acute exercise intensity), necessitating periodic variation in sauna exposure (timing, temperature, duration, contrast exposure) to maintain GH stimulus. The anabolic benefit combines with elevated cortisol levels (sauna acute stressor produces 20-30% cortisol elevation, particularly in untrained individuals), making recovery optimization critical: adequate sleep (glymphatic clearance), protein intake (30-40g within 4 hours post-sauna), and carbohydrate replenishment (for glycogen resynthesis) determine whether GH elevation translates to net anabolism or net catabolism."
      },
      {
        heading: "Brain Health: Cognitive Benefits and Dementia Risk Reduction",
        body: "Accumulating evidence demonstrates that regular sauna use reduces cognitive decline and dementia incidence through multiple mechanisms involving cerebral blood flow augmentation, neural growth factor upregulation, and protein aggregation prevention, with Kuopio study analysis showing 65% reduced dementia risk in frequent sauna users. Acute sauna exposure increases cerebral blood flow 10-20% during heat exposure through multiple mechanisms: systemic vasodilation (lower total peripheral resistance) increases cardiac output directed toward brain; heat-induced catecholamine release (norepinephrine, epinephrine) peripherally enhances brain-protective responses; and direct cerebral vasodilation occurs through reduced vascular tone in cerebral resistance vessels. This increased perfusion delivers greater oxygen and glucose delivery to neurons and is proposed to support cognitive plasticity and resilience during aging. More importantly, sauna upregulates growth factors supporting neurogenesis and neuroprotection: acute sauna increases BDNF (brain-derived neurotrophic factor, discussed in Exercise section) levels 2-3 fold, lasting several hours post-exposure; chronic weekly sauna use maintains elevated baseline BDNF. BDNF supports hippocampal neurogenesis, neuronal survival, and synaptic plasticity—mechanisms underlying memory consolidation and cognitive reserve against neurodegeneration. Sauna also indirectly benefits brain through improved cardiovascular physiology: reduced arterial stiffness, improved endothelial function, and lower blood pressure reduce vascular dementia risk (dementia from cerebrovascular disease and small vessel ischemia). Additionally, sauna-induced HSP70 upregulation specifically prevents Alzheimer's pathology: HSP70 binds misfolded Aβ, preventing aggregation and fibril formation; animal models of Alzheimer's disease exposed to chronic heat show reduced brain amyloid accumulation, reduced tau pathology, and improved cognitive task performance. Human epidemiological evidence comes from Kuopio substudy analysis: at baseline cognitive testing, no sauna group differences existed; over 20+ year follow-up, dementia incidence was 65% lower in men using sauna 4+ times weekly (HR 0.35, 95% CI 0.16-0.75) compared to rare users, with effect independent of cardiovascular disease risk factors and APOE4 status (genetic dementia risk marker). The mechanism appears partly through improved sleep quality (discussed in Sleep section): frequent sauna users showed better objective sleep consolidation and greater stage 3 NREM percentage, which itself prevents cognitive decline through glymphatic waste clearance. Vascular contributions were significant but not entirely explanatory: adjustment for vascular risk factors (blood pressure, cholesterol, smoking, atherosclerosis presence) only reduced effect size 20-30%, suggesting direct neuroprotective mechanisms additionally contribute. The cognitive protection extends to all dementia types (Alzheimer's disease, vascular dementia, frontotemporal dementia) rather than selective benefit, indicating broad-spectrum neuroprotection. For aging individuals, regular sauna appears complementary to other dementia prevention strategies (cognitive engagement, physical exercise, Mediterranean diet, social connection, sleep optimization), with combined multimodal approach showing greatest dementia prevention effect."
      },
      {
        heading: "Practical Sauna Protocols: Frequency, Duration, Temperature, and Adaptations",
        body: "Evidence-based sauna protocols balancing maximal health benefits with safety and sustainability require specification of frequency, duration, temperature, type, and progression for different baseline fitness levels and health statuses. The KIHD study's epidemiological benefits reached plateau at 4-7 times weekly; more frequent use showed marginal additional benefit and theoretical increased risk from excessive electrolyte loss and sympathetic stress, suggesting an optimal range of 3-5 sessions weekly for most individuals. Acute session parameters for experienced sauna users include: dry sauna (80-100°C) for 15-25 minutes achieving core temperature elevation 1.5-2°C, or hot water immersion (39-42°C) for 10-15 minutes producing similar thermal stress; beginning sauna users should start with shorter duration (10-15 minutes) at moderate temperature (70-80°C) allowing physiological adaptation. Each session should include recovery period: immediate post-sauna cool-down (room temperature, cool shower, or cold water immersion) lasting 5-15 minutes allows parasympathetic rebound and cardiovascular training stimulus. Cold water immersion post-sauna (5-15°C water, 1-5 minutes duration) amplifies hormetic stimulus and produces greater cardiovascular and endothelial benefits than sauna alone but requires careful progression and medical clearance for cardiac disease patients. Contrast exposure (alternating hot-cold) involves 3-5 repetitive cycles (hot sauna 5-10 minutes, cold immersion 30 seconds-2 minutes) producing pronounced hemodynamic oscillation (heart rate variations 40-60 bpm within each cycle) and superior parasympathetic training compared to sauna alone. Infra-red saunas (infrared radiant heat, penetrating deeper into tissue) show similar thermal stress and health outcomes to traditional saunas when core temperature elevation equivalent, though direct comparisons show slightly lower absolute heat intensity for given room temperature; infrared saunas may be preferable for individuals with heat intolerance or cardiovascular disease limiting sympathetic activation tolerance. Beginners should follow progressive protocol: week 1-2, two 10-minute sessions weekly at 70-75°C, emphasizing comfort acclimation; week 3-4, three sessions weekly, increasing duration to 12-15 minutes at 75-80°C; week 5-8, three-four sessions weekly, duration 15-20 minutes at 80-90°C introducing post-session cool-down; and after initial 8-week adaptation, progressing to 4-5 weekly sessions as tolerated. Hydration is essential: sauna induces 0.5-1.5 L sweat loss; adequate fluid replacement (500-750 mL water/electrolyte solution immediately post-sauna, additional intake during following 2-4 hours) prevents dehydration, electrolyte depletion, and syncope (fainting). Some evidence suggests salt supplementation (sodium chloride 500-1000 mg pre-sauna) may enhance cardiovascular benefits by improving electrolyte-osmoregulation efficiency, though careful monitoring necessary in hypertensive individuals. Dietary timing: light meal 2-3 hours pre-sauna allows exercise/thermal stress without gastric compromise; post-sauna protein intake (20-40g complete protein within 30-60 minutes) optimizes anabolic hormone utilization. Contraindications include: severe hypertension (>180/110 mmHg), active coronary ischemia or recent myocardial infarction (<3 months), severe arrhythmias, and acute infections (fever >38.5°C); individuals with mild-moderate hypertension may use sauna with medical supervision and blood pressure monitoring. Medication interactions require consideration: diuretics and blood pressure lowering medications may compound sauna-induced hypotension; antihistamines impair heat dissipation; and antidepressants may alter thermoregulation. Pregnant women may use sauna with medical clearance, as animal studies show fetal tolerance to brief moderate heat exposure, though extreme temperatures and prolonged exposure warrant avoidance."
      }
    ]
  },
  cold: {
    title: "Cold Exposure Deep Dive",
    color: "#8AC4D0",
    sections: [
      {
        heading: "Sympathetic Nervous System Activation and Cold Shock Response",
        body: "Cold exposure triggers rapid sympathetic nervous system activation and catecholamine surge—acute stress response mediated through thermoreceptor signaling, providing mobilization benefits and chronic resilience through hormetic adaptation. Immersion in cold water (5-15°C) for 1-5 minutes produces immediate sympathetic discharge: heart rate increases 20-50 bpm within seconds, blood pressure elevates 20-30 mmHg acutely through peripheral vasoconstriction, cardiac output increases, and epinephrine and norepinephrine surge 2-5 fold above baseline—creating systemic alertness state comparable to psychological stressor intensity. The thermoreceptor pathway involves peripheral cold receptors (TRPM8, TRPA1 ion channels in skin) signaling through dorsal root ganglia to the brainstem, particularly the nucleus raphe pontis, which integrates thermal information and drives sympathetic outflow through rostral ventromedial medulla and dorsal motor nucleus nuclei. This sympathetic activation represents stress inoculation: brief, tolerable cold stress triggers adaptations that improve stress resilience capacity—a phenomenon termed hormetic stress. Critically, habituation is rapid: the initial heart rate and blood pressure elevation to a given cold stimulus decreases 30-50% after 2-4 weeks of repeated daily cold exposures, indicating sympathetic desensitization and upregulation of parasympathetic brake tone. This desensitization doesn't impair the hormetic benefit but rather represents physiological adaptation: individuals who are chronically cold-exposed show lower baseline sympathetic tone and faster parasympathetic recovery, suggesting improved autonomic nervous system regulation and stress resilience. Catecholamine elevation during cold exposure provides acute cognitive and performance benefits: norepinephrine (released from locus coeruleus in the brain) enhances attentional focus, working memory, and executive function; epinephrine peripherally mobilizes glucose and fat for energy; and elevated alertness persists for 2-4 hours post-exposure. However, excessive or uncontrolled cold exposure creates harmful overactivation: core temperature dropping below 35°C (hypothermia) produces paradoxical heat loss (severe peripheral vasodilation), confusion, and life-threatening dysrhythmias; unaccustomed individuals immersed in very cold water may experience cold-shock response (gasping, aspiration risk, cardiac arrhythmias). The technique requires progression: beginning with brief, warmer exposures (15-20°C water, 30-60 seconds) allows upregulation of protective mechanisms and parasympathetic tone before advancing to colder or longer exposures. The goal of repeated cold exposure training is to maintain stress-response benefits (mobilization, hormetic stimulus) while achieving habituation that prevents excessive parasympathetic withdrawal and maintains baseline parasympathetic tone—a form of stress inoculation building physiological resilience."
      },
      {
        heading: "Brown Adipose Tissue: Cold-Induced Thermogenesis and Metabolic Health",
        body: "Cold exposure activates brown adipose tissue (BAT), a specialized thermogenic organ containing densely packed mitochondria with uncoupling protein-1 (UCP1) that dissipates metabolic energy as heat through uncoupling of oxidative phosphorylation—a process termed non-shivering thermogenesis that improves metabolic health and glucose homeostasis. Brown adipose tissue, abundant in newborns for thermal regulation but previously thought essentially absent in adults, was rediscovered via PET imaging in metabolically healthy lean adults (5-10% of body weight) and found depleted in obese individuals, suggesting metabolic importance. The mechanism: cold stimulation activates sympathetic nerve fibers innervating BAT, releasing norepinephrine that binds beta-3 adrenergic receptors, activating lipolysis and releasing free fatty acids that serve dual roles (fuel oxidation and UCP1 coactivator). Fatty acids enter mitochondria and activate UCP1, which allows protons to pass through the inner mitochondrial membrane without synthesizing ATP, dissipating energy gradient as heat. This uncoupled respiration releases chemical energy as thermal energy at exceptionally high rates (BAT produces 200-300 watts per kilogram tissue—orders of magnitude higher metabolic rate than white adipose tissue). The metabolic consequence of cold-induced BAT activation includes improved glucose tolerance: a 30-minute cold exposure (14°C water immersion or other cold stimulus) increases glucose utilization 2-5 fold during and post-exposure; repeated cold exposures (daily for 2-4 weeks) improve fasting glucose and insulin sensitivity, with HbA1c improvements documented in some studies. BAT activation also requires mobilization of white adipose tissue (WAT) lipolysis: epinephrine released during cold stimulation activates hormone-sensitive lipase throughout WAT depots, mobilizing triglycerides and releasing free fatty acids that serve dual roles as BAT fuel and circulating substrate for non-BAT tissues. The net metabolic effect of regular cold exposure includes modest energy expenditure increase (15-30% above baseline for duration of cold exposure and brief post-exposure period), improved insulin sensitivity, and reduced white adipose tissue depot size in prospective studies—though weight loss magnitude requires consistent caloric deficit. Cold exposure also induces browning of white adipose tissue: repeated cold stimulation (or exercise, or sympathetic agonist administration) causes white adipocytes to acquire brown adipocyte characteristics (increased mitochondrial content, UCP1 expression, multilocular lipid droplets), with transformed tissue showing BAT-like thermogenic capacity. Human studies of chronic cold exposure (winter swimmers, individuals using cold immersion protocols) document improved metabolic markers: reduced fasting insulin levels, improved HOMA-IR (insulin sensitivity), and modest weight maintenance or fat loss despite equivalent caloric intake compared to non-exposed controls. The effect size is modest (average 2-4 kg weight loss over 8-12 weeks with daily cold exposure) and insufficient alone for obesity management but contributes to comprehensive metabolic improvement when combined with diet and exercise. Clinical implications extend to metabolic disease: diabetic and prediabetic individuals showing improved glucose control with cold exposure protocols suggest potential therapeutic application, though systematic clinical trials remain limited."
      },
      {
        heading: "Cold Shock Proteins and Cellular Protection: RBM3 and Neuroprotection",
        body: "Cold exposure induces cold shock proteins—particularly RNA-binding motif protein 3 (RBM3)—distinct from heat shock proteins, that protect against cellular stresses including oxidative damage, apoptosis, and neurodegeneration through RNA stabilization and translational control mechanisms. Cold stress (4-10°C temperature reduction or immersion in cold water) activates cold-responsive transcription factors that increase expression of cold shock proteins within 30 minutes; RBM3 shows 10-50 fold upregulation in cold-exposed tissues, particularly in neural tissue where it demonstrates critical neuroprotective functions. RBM3 operates through RNA-stabilizing activity: it binds to AU-rich elements in 3' untranslated regions (3'UTRs) of mRNA targets, protecting them from deadenylation and degradation—preserving translation of critical proteins including anti-apoptotic factors (Bcl-2, Bcl-xL), antioxidant enzymes (SOD2, catalase), and neurotrophic factors (BDNF). This mechanism particularly protects against hypothermic neuroprotection: cooling the brain to 30-34°C (a technique used in cardiac surgery and stroke treatment) reduces metabolic rate and ATP consumption 40-50%, extending the brain's tolerance to ischemia from minutes to hours; RBM3 upregulation during cooling preserves protein synthesis capacity during reoxygenation and reduces post-ischemic apoptosis. Mouse models show that RBM3 overexpression before stroke reduces infarct volume 30-50% and improves recovery; conversely, RBM3 knockdown eliminates cold-induced neuroprotection. Beyond hypothermia models, moderate cold exposure (not requiring system-wide cooling but triggering cold-activated signaling) induces RBM3 upregulation and demonstrates neuroprotective benefit: animal models of neurodegeneration (Parkinson's, Alzheimer's-relevant pathology) exposed to repeated moderate cold show improved motor and cognitive function and reduced neuronal loss. The mechanism extends to oxidative stress protection: RBM3 stabilizes mRNAs encoding antioxidant defense enzymes, preventing their degradation and maintaining elevated antioxidant capacity. Cold-exposed tissues show 20-30% higher SOD and catalase activity compared to non-exposed controls, with improved resistance to subsequent oxidative insults. Additionally, RBM3 regulates alternative splicing of anti-apoptotic factors through binding nascent transcripts, promoting inclusion of exons encoding full-length anti-apoptotic proteins and reducing pro-apoptotic isoform expression. Human evidence for cold-induced neuroprotection remains limited but emerging: chronic cold swimmers (regularly immersed in cold water) show improved cognitive function in some studies and may demonstrate reduced neurodegenerative disease incidence (though prospective human epidemiological data remain sparse). The clinical potential extends to neuroprotective strategies: individuals at high dementia risk (genetic predisposition, midlife hypertension, metabolic syndrome) might benefit from cold exposure protocols including built-up cold tolerance as potentially neuroprotective intervention, though controlled trials in human populations are needed. The safety consideration involves balancing protective cold exposure (repeated, graduated, tolerable exposure of 1-5 minutes) against excessive cooling producing hypothermia-associated risks."
      },
      {
        heading: "Dopamine and Norepinephrine: Sustained Elevation and Motivation",
        body: "Cold exposure produces sustained catecholamine elevation extending hours beyond the acute cold stimulus, with particular dopamine elevation that improves mood, motivation, and cognitive focus through mechanisms relevant to depression and anhedonia (loss of pleasure). A 5-minute cold water immersion (14°C) produces immediate norepinephrine surge (peak 2-5 fold above baseline within 5-10 minutes), followed by dopamine elevation (peak 2-3 fold above baseline within 15-30 minutes post-immersion) that declines more gradually than norepinephrine, remaining 50-100% elevated for 2-4 hours post-exposure. This dopamine elevation operates through central mechanisms: cold-sensitive sensory neurons signal through brainstem nuclei (parabrachial nucleus, locus coeruleus) to the ventral tegmental area (VTA), triggering dopamine release in reward-processing regions (nucleus accumbens, prefrontal cortex, amygdala). The sustained dopamine elevation explains mood improvement and motivational enhancement reported by cold-exposure practitioners. Neurobiological studies show that dopamine elevation in prefrontal cortex specifically improves executive function (working memory, cognitive flexibility, impulse inhibition) and motivation for cognitively demanding tasks; dopamine in nucleus accumbens drives reward-seeking and persistence in goal-directed behavior. Clinical relevance extends to mood disorders: depression is characterized by dopamine hypofunction, particularly in reward circuits; individuals with depression show blunted dopaminergic response to normally rewarding stimuli and reduced motivation. Cold exposure protocols produce sustained dopamine elevation—an endogenous mechanism providing mood benefits without pharmaceutical dopamine agonists and their associated side effects. Prospective observational studies in cold-exposure enthusiasts report improved mood, reduced depression and anxiety symptom severity, and increased life satisfaction compared to baseline; however, controlled randomized trials remain limited. The motivational enhancement from cold-induced dopamine elevation provides additional benefit for individuals pursuing challenging goals: sustained dopamine availability improves persistence during difficult tasks, reduces procrastination, and enhances reward from goal achievement—mechanisms particularly valuable for individuals with attention deficit, motivation deficits, or depression-related apathy. The dopamine elevation appears relatively selective compared to other stressors: acute exercise similarly elevates dopamine but shows less sustained elevation; psychological stress elevates catecholamines but often produces subsequent dopamine decline with emotional aftermath; cold exposure produces uniquely sustained dopamine with less negative rebound. However, tolerance develops: dopamine response to repeated cold exposures shows habitual decline (30-50% reduction after 2-4 weeks of daily exposure), necessitating periodization. Optimal protocols involve 2-3 cold exposures weekly with variation (temperature, duration, immersion type) to prevent tolerance; seasonal variation naturally accomplishes this for individuals in temperate climates. The dopamine benefit appears independent of physical fitness: untrained and highly trained individuals show similar dopamine response magnitudes, suggesting cold exposure represents accessible dopaminergic enhancement strategy for diverse populations."
      },
      {
        heading: "Inflammation Reduction: Systemic and Neural Anti-inflammatory Effects",
        body: "Repeated cold exposure reduces systemic inflammation markers and specifically reduces neural inflammation, with mechanisms involving reduced neutrophil extravasation, upregulation of anti-inflammatory pathways, and reduced microglial activation—effects complementary to exercise and diet-based anti-inflammatory strategies. Acute cold exposure (5-minute 14°C immersion) transiently elevates systemic inflammation markers (TNF-α, IL-6, CRP acute phase elevation within minutes) representing acute stress response; however, 24-48 hours post-exposure, inflammatory markers decline below baseline (15-30% reduction), with effect accumulating over repeated exposures. Chronic cold-exposed individuals (regular cold swimmers, or those following consistent cold exposure protocols) show 20-40% reduced baseline inflammatory markers compared to non-exposed controls, even when adjusting for fitness level and BMI. The mechanism involves multiple pathways: (1) Autonomic immune regulation—cold exposure enhances parasympathetic nervous system tone (measured via increased HRV, lower resting heart rate) during recovery, activating vagal signaling to immune cells; the vagus nerve releases acetylcholine, which binds α7 nicotinic acetylcholine receptors on immune cells, suppressing NF-κB transcription factor and reducing pro-inflammatory cytokine production (TNF-α, IL-6, IL-1β). (2) Lymphatic system enhancement—repeated cold exposure improves lymphatic fluid propulsion through muscular contraction and sympathetic-driven smooth muscle tone in lymphatic vessels, enhancing immune cell trafficking and pathogen clearance. (3) Improved peripheral blood flow—cold exposure triggers vasodilation during recovery phase, improving circulation and potentially improving clearance of inflammatory mediators. (4) Shift from pro- to anti-inflammatory immune state—cold exposure enhances response of anti-inflammatory immune regulatory cells (T regulatory cells producing IL-10 and TGF-β), reducing Th1 pro-inflammatory differentiation. Specific benefit extends to brain inflammation: cold exposure reduces CNS microglia activation, the primary brain immune cell that produces pro-inflammatory cytokines (TNF-α, IL-1β, IL-6) implicated in neuroinflammatory diseases (depression, neurodegeneration, cognitive decline). Animal studies show that chronic cold exposure reduces brain TNF-α and IL-1β expression 20-40% and reduces activated microglial density, with associated improved cognition and mood. The mechanism involves improved BBB (blood-brain barrier) integrity: cold exposure enhances endothelial tight junction protein expression (ZO-1, claudin-5, occludin), reducing pathogenic neuroinflammatory molecule transits from periphery to brain. Clinical applications extend to neuroinflammatory conditions: depression with elevated inflammatory markers (CRP, IL-6 >30% above population median) shows particularly robust improvement from combination anti-inflammatory interventions including cold exposure; rheumatoid arthritis and systemic inflammatory conditions show modest reduction in disease activity markers with cold therapy (though structured cold-immersion protocols differ from therapeutic ice application for acute joint inflammation). The anti-inflammatory benefit appears to require consistent exposure: single cold exposure produces temporary transient inflammation followed by suppression; intermittent exposure (2-3 weekly) maintains suppressed baseline; consistent daily exposure produces greatest effect that declines upon cessation. Combined with exercise-induced anti-inflammatory effects (discussed in Exercise section) and diet-based inflammation reduction (Mediterranean diet, fiber), cold exposure provides additional anti-inflammatory stimulus through distinct mechanisms, making multimodal approach potentially superior to single intervention."
      },
      {
        heading: "Huberman Protocol and Practical Progression: Safety and Personalization",
        body: "Neuroscientist Andrew Huberman's cold exposure protocol, derived from mechanistic understanding of cold adaptation, recommends specific parameters balancing maximal physiological benefits with safety, particularly important for untrained individuals prone to excessive sympathetic activation and cardiovascular strain. The Huberman protocol emphasizes graduated exposure: initial protocol for beginners recommends starting with 11-15°C water immersion for 10-15 seconds, once or twice weekly, preceded by 30 minutes of learning the immersion technique in warmer water (20°C) to establish comfort and controlled breathing. After 2 weeks of this minimum-exposure protocol, individuals demonstrate 50% reduction in involuntary breath-holding response and begin developing tolerance for longer durations or colder temperatures. Progression advances incrementally: Week 3-4, increasing to 20-30 second exposures at 10-12°C; Week 5-8, advancing to 1-2 minute exposures at 10-12°C or 2-3 minute exposures at 12-15°C. The key progression principle involves managing the cold-shock response and building parasympathetic recovery capacity—avoiding excessive sympathetic activation that would create unnecessary discomfort and potential cardiac strain. The protocol includes specific breathing patterns optimizing both acute catecholamine response and post-exposure recovery: during immersion, slow deep breathing (nasal inhale, extended exhale) maintains parasympathetic engagement despite cold stress, preventing panic response and excessive breath-holding. Post-immersion, 10-20 minutes of gradually warming (showering in progressively warmer water, wrapped in warm clothing, moving to warmer environment) allows parasympathetic rebound and HRV recovery. Temperature selection requires careful consideration of individual baseline: individuals with cardiac disease history, hypertension, or anxiety should advance more gradually and consider warmer initial temperatures (15-18°C); young, healthy individuals tolerate progression to 5-10°C more readily. The protocol recommends avoiding extreme temperatures (<5°C) and extreme durations (>5 minutes for untrained individuals) to prevent hypothermia risk and excessive sympathetic overload. The Huberman protocol specifies frequency optimization as 2-3 exposures weekly, with evidence suggesting greater frequency produces tolerance without additional benefit and increases injury risk. Timing considerations: morning cold exposure (immediately upon waking) amplifies circadian-phase advance and provides dopamine elevation for daytime motivation; evening exposure may interfere with sleep if producing sustained sympathetic activation. Safe cold exposure involves medical pre-screening: individuals with arrhythmia, recent myocardial infarction, severe hypertension (>180/110), or Raynaud's phenomenon should obtain medical clearance and potentially avoid cold immersion. Safer alternatives to full-body immersion include: face immersion only (activates diving reflex without systemic stress), cold shower (progressively cooler temperatures, less acute shock), or localized cold exposure (hands/face, or cooling gloves/vests). Practical implementation uses accessible tools: cold water from taps (typically 10-15°C depending on climate and season), ice baths (filling bathtub with cold water and ice to achieve 5-10°C), or specialized cold plunge devices. Measurement of adaptation involves tracking: resting heart rate (should decline gradually over weeks), heart rate recovery post-immersion (faster recovery indicates improved parasympathetic tone), blood pressure stability (reduced post-immersion hypertension), and subjective anxiety/comfort during exposure (progressive habituation expected). Habituation typically develops over 4-8 weeks, with individuals reporting initial extreme discomfort transforming to tolerable and eventually enjoyable sensation; however, if extreme discomfort persists beyond 4-6 weeks, individuals should reduce frequency or temperature and reassess approach. The protocol integrates with other longevity practices: morning cold exposure before exercise enhances sympathetic mobilization; cold exposure after sauna (contrast therapy) produces greater cardiovascular stimulus than either alone; cold exposure after strength training may reduce DOMS (delayed-onset muscle soreness) through anti-inflammatory effects, though may slightly impair hypertrophic adaptation if prioritizing muscle gain."
      }
    ]
  },
  supplements: {
    title: "Supplements Deep Dive",
    color: "#89CFF0",
    sections: [
      {
        heading: "Vitamin D3: VITAL Trial Evidence and Optimal Dosing",
        body: "Vitamin D3 (cholecalciferol), synthesized in skin from UVB exposure or obtained through dietary supplementation, functions as both a nutrient and neuroendocrine hormone regulating calcium homeostasis, immune function, and cell proliferation—with serum 25-hydroxyvitamin D [25(OH)D] as the primary marker of systemic status. The landmark Vitamin D Assessment (VITAL) trial, a NIH-funded randomized placebo-controlled trial of 25,874 US adults (age 50+ for men, 55+ for women) followed for 5+ years with cancer and cardiovascular event outcomes tracked prospectively, demonstrated that vitamin D3 supplementation (2000 IU daily, approximately 50 mcg) reduced cancer mortality 21% specifically in individuals achieving 25(OH)D >30 ng/mL (75 nmol/L), with particular benefit for melanoma and colorectal cancers. Paradoxically, overall cancer incidence reduction was modest and non-significant, suggesting vitamin D primarily benefits prognosis rather than prevention. The cardiovascular outcomes showed no significant reduction in cardiovascular disease incidence, contrary to observational study predictions, though the supplementation dose (2000 IU daily) achieves modest serum elevation (typically 20-25 ng/mL increase from baseline 15-20 ng/mL), and observational studies suggesting cardiovascular benefit typically examined higher serum levels (>40 ng/mL). The immunological mechanism of vitamin D involves nuclear vitamin D receptor (VDR) expression in immune cells (T cells, B cells, macrophages, dendritic cells) and direct VDR-mediated transcription of immune-regulatory genes: calcitriol (active 1,25-dihydroxyvitamin D) upregulates IL-10 production and antimicrobial peptides (cathelicidin, beta-defensin), supporting innate immune function and infection resistance. Observational epidemiology demonstrates that individuals with 25(OH)D >40 ng/mL show 30-50% reduced respiratory infection risk, superior vaccine response (antibody titers 20-30% higher), and reduced autoimmune disease risk. Prospective analysis suggests both U-shaped and threshold relationships between serum vitamin D and health outcomes: values <20 ng/mL clearly associate with increased infections and bone loss; values 20-40 ng/mL show dose-dependent improvements in most health markers; values >50 ng/mL show diminishing additional benefits and potential hypercalcemia risk. The optimal serum target range appears 40-50 ng/mL for most individuals, achievable through supplementation of 2000-4000 IU daily in northern latitudes with limited sun exposure; southern latitudes with year-round UVB availability may require supplementation only during winter months. Genetic polymorphisms in VDR (FokI genotypes) affect vitamin D metabolism and required dose: ff genotype individuals (approximately 35% of population) may require 30-40% higher doses to achieve equivalent serum elevations compared to Ff genotype. Measurement via 25(OH)D serum levels should occur at baseline and 8-12 weeks after dose initiation to assess absorption and adjust supplementation. Individual risk factors guide supplementation: individuals with malabsorption syndromes (Crohn's, celiac disease, post-bariatric surgery) require 50-100% higher doses; darker skin individuals in northern latitudes require higher doses (genetic factors reduce vitamin D synthesis from equivalent UV exposure); and elderly individuals show reduced cutaneous synthesis and should supplement more aggressively. Toxicity is rare: hypercalcemia develops with chronic supplementation exceeding 4000-10,000 IU daily (individual variation substantial), and routine monitoring for hypercalcemia is recommended only in individuals taking >4000 IU daily chronically. Vitamin D3 (animal-source cholecalciferol) shows superior bioavailability and efficacy compared to vitamin D2 (plant-source ergocalciferol) and should be preferred. Synergistic nutrients include vitamin K2 (activates osteocalcin for bone mineralization) and magnesium (required cofactor for 25-hydroxylase enzyme converting vitamin D to active form); individuals with low magnesium (<2.0 mEq/L) may show vitamin D-resistant conditions."
      },
      {
        heading: "Omega-3 Fatty Acids: EPA and DHA Mechanisms and Trial Evidence",
        body: "Omega-3 polyunsaturated fatty acids (eicosapentaenoic acid EPA and docosahexaenoic acid DHA), obtained through fatty fish, algal supplements, or flaxseed precursors (alpha-linolenic acid ALA), serve as precursors for specialized pro-resolving mediators (SPMs) that terminate inflammation and promote tissue repair—mechanisms underlying cardiovascular and neurological benefits documented in prospective studies. The REDUCE-IT trial (2018), examining high-dose EPA supplementation (4g daily) in statin-treated patients with elevated triglycerides, demonstrated 25% reduction in cardiovascular events (myocardial infarction, cardiovascular death, coronary revascularization) over 5-year follow-up, with mechanism involving: improved lipoprotein particle size (elevation of large HDL particles, reduction of small dense LDL), reduced triglyceride levels (33% reduction), and reduced systemic inflammation. The STRENGTH trial (2020), examining combination EPA+DHA supplementation, showed neutral cardiovascular outcomes in similar populations, raising mechanistic questions about differential EPA vs. DHA effects. Mechanistic research explains these divergent findings: EPA preferentially generates SPM precursors (18-HEPE converted to protectins and resolvins) that activate G-protein coupled receptors (ALX/FPR2) on immune cells, promoting macrophage polarization toward M2 (anti-inflammatory) phenotype, upregulating IL-10 production, and actively resolving inflammation. DHA, while providing structural benefits to neuronal membranes, shows weaker SPM-generating capacity and primarily benefits neurological rather than systemic inflammation. The EPA-dominant recommendation derives from REDUCE-IT evidence and mechanistic prioritization of inflammation resolution. High-dose EPA (2-3g daily) achieves clinical endpoints in cardiovascular disease prevention and management, while lower doses (500-1000mg EPA) show modest benefits in large observational studies but require combination with other anti-inflammatory measures. DHA similarly shows neurological benefit: 1-2g daily DHA supplementation improves cognitive function in aging and shows benefit in depression-linked cognitive impairment in some trials; the mechanism involves DHA's role as major structural component of neuronal membranes (comprising 40% of fatty acids in retinal photoreceptors and 30% in gray matter), supporting synaptic plasticity and dendritic growth. Fish oil source selection matters: high-quality supplements tested by third parties (ConsumerLabs, NSF International standards) for oxidation levels are essential, as oxidized oils produce lipid peroxides and oxysterols exacerbating inflammation despite theoretical EPA/DHA benefits. Sustainable fish sources (wild-caught fatty fish consumed 2-3 times weekly) provide 1-2g combined EPA+DHA; individuals limiting fish consumption use algal-based supplements (2-3g daily provides equivalent EPA/DHA). The conversion efficiency of ALA (plant source) to EPA and DHA is poor (<10% conversion efficiency in most individuals), making direct supplementation preferable. Individual response varies: the APOE4 genetic variant shows heterogeneous omega-3 responsiveness; approximately 30% of population shows minimal cardiovascular benefit from omega-3 supplementation despite adequate EPA/DHA intake, suggesting individual variation in SPM production efficiency. Assessment via plasma phospholipid omega-3 index (target >8%) provides personalization; individuals with index <4% should increase supplementation or dietary intake. Timing and food combination enhance absorption: omega-3 supplementation with fat-containing meals (≥5g fat) improves bioavailability 2-3 fold compared to fasting state. Side effects (fishy aftertaste, GI upset, possible increased bleeding at very high doses) can be mitigated through enteric-coated supplements and divided dosing."
      },
      {
        heading: "Magnesium: Enzymatic Roles and Deficiency Prevalence",
        body: "Magnesium, functioning as essential cofactor in over 300 enzymatic reactions including ATP synthesis, protein synthesis, neurotransmitter synthesis, and bone mineralization, shows population-wide insufficiency (approximately 50% of US population consumes <RDA recommendation of 310-420 mg daily) with profound metabolic consequences. Magnesium's critical roles include: (1) ATP-magnesium complex formation—all energy-dependent cellular processes from muscle contraction to protein synthesis require free magnesium in sufficient cellular concentration (100-150 mM in cytoplasm); deficiency impairs ATP availability and cellular energetics. (2) NMDA receptor modulation—magnesium blocks NMDA channels, preventing excessive calcium influx and excitotoxicity; low magnesium reduces this neuroprotective block, increasing neuronal damage and depression/anxiety risk. (3) Glycolytic enzyme cofactor—multiple glycolytic enzymes (hexokinase, phosphofructokinase, enolase) require magnesium for activity; deficiency impairs glucose utilization and metabolic efficiency. (4) Ion ATPase function—Na-K-ATPase, Ca-ATPase, and other pumps maintaining cellular ion gradients require magnesium; deficiency produces ion imbalance, cellular stress, and sympathetic overactivation. (5) Bone mineralization—alkaline phosphatase and other bone-remodeling enzymes require magnesium; deficiency contributes to osteoporosis and impaired bone quality. Population studies show that magnesium intake correlates inversely with cardiovascular disease risk, all-cause mortality, metabolic syndrome prevalence, and depression prevalence independent of other nutrients. The CARDIA study (3,723 young adults followed 20 years) found that dietary magnesium in highest quartile (>400mg daily) reduced cardiovascular event risk 50% compared to lowest quartile, with effect persisting after adjusting for blood pressure, lipids, and lifestyle factors. Magnesium supplementation (500-700mg daily) improves multiple health markers: blood pressure reduction 3-5 mmHg systolic/diastolic; improved insulin sensitivity and reduced diabetes risk 10-20%; improved exercise performance and faster recovery (magnesium participates in metabolic recovery and lactate clearance); and improved sleep quality (magnesium facilitates parasympathetic tone and melatonin signaling). Depression and anxiety show particular magnesium responsiveness: individuals with depression show magnesium levels 10-20% lower than controls; supplementation trials show 25-50% symptom improvement in depression and anxiety (similar magnitude to SSRI antidepressants in some studies). The mechanism involves both NMDA receptor modulation reducing excitotoxicity and dopaminergic system enhancement (magnesium required for dopamine synthesis). Serum magnesium measurement (normal 1.7-2.2 mEq/L) reflects <1% total body magnesium and poorly predicts cellular deficiency; intracellular magnesium assessment (RBC magnesium, ionized magnesium) more accurately reflects total body status but is less commonly available. Clinical assessment relies on symptom evaluation: muscle cramps, tremor, fatigue, irritability, anxiety, and headaches commonly indicate magnesium insufficiency. Supplementation forms vary in bioavailability: magnesium glycinate, malate, and threonate show superior absorption (40-50%) compared to magnesium oxide (3-5%), which produces laxative effects limiting tolerability; magnesium threonate specifically crosses BBB and may provide superior CNS benefits for cognition and mood. Optimal dose is individual-dependent and often titrated based on GI tolerance: starting 200-300mg daily, increasing by 100-200mg weekly until loose stool develops (magnesium oxide intentionally produces loose stool as bowel tolerance), then reducing dose by 100mg to establish optimal tolerance. The RDA (310-420mg depending on age/sex) may be insufficiently high for health optimization; research suggests 400-500mg daily optimal for most adults. Synergistic minerals include calcium (ratio 2:1 calcium:magnesium optimal) and potassium (magnesium facilitates potassium cellular uptake); vitamin B6 required for magnesium absorption."
      },
      {
        heading: "Creatine: Cognitive Benefits and Mechanistic Evidence",
        body: "Creatine monohydrate, a naturally occurring compound synthesized in kidneys and liver and stored at high concentrations in skeletal muscle (supporting ATP regeneration during intense exertion), demonstrates robust benefits for muscle protein synthesis, physical performance, and cognitive function through mechanisms extending beyond its energetic role in muscle. Athletic benefits are well-established: creatine supplementation (5g daily or 20g daily loading then 5g maintenance) increases intramuscular creatine phosphate, enabling faster ATP regeneration during high-intensity exercise, supporting 5-15% performance improvements in power and strength-dominant activities. Less recognized are cognitive benefits: the brain requires constant ATP availability for synaptic transmission and memory consolidation; creatine supplementation increases brain creatine content (approximately 10% per month of supplementation for brain), improving ATP regeneration in neurons and supporting cognitive performance particularly during mentally fatiguing tasks. Randomized controlled trials demonstrate cognitive benefits: a meta-analysis of 6 trials found creatine supplementation (5-20g daily) improved working memory, processing speed, and long-term memory by approximately 5-10% compared to placebo in healthy young adults, with largest effects in cognitively-demanding tasks (mental arithmetic, working memory capacity testing). Vegetarians and vegans show largest cognition benefits (since dietary creatine comes primarily from meat, vegetarians show lower baseline creatine stores), suggesting dose-response relationship with baseline status. The mechanism involves improved energetic supply: creatine kinase-catalyzed phosphocreatine resynthesis occurs within 10-15 seconds of ATP depletion, providing bridging energetic support during increased ATP demand; neurons during heightened activity (sustained attention, learning, memory encoding) show increased ATP demand; creatine supplementation increases the energetic buffering capacity, improving sustained cognitive performance. Neuroprotective effects extend to aging: older adults supplemented with creatine show improved cognitive performance and potentially slowed cognitive decline, though long-term prospective studies remain limited. Depression and mood show potential benefit: preliminary trials suggest creatine supplementation (5g daily) improves depressive symptoms, with proposed mechanism involving improved mitochondrial energy status and increased dopamine synthesis (dopamine synthesis requires ATP). Dosing is straightforward: 5g daily creatine monohydrate provides reliable 5-10% increases in muscle creatine phosphate and brain creatine over 4-8 weeks, with saturation plateau thereafter. Loading protocols (20g daily for 5-7 days, then 5g maintenance) reach plateau faster but produce GI upset; gradual loading is better tolerated. Safety is exceptional: creatine monohydrate supplementation shows no reported serious adverse effects in 20+ years of research involving thousands of individuals; minor effects include modest weight gain (1-2 kg from water retention) and occasional GI upset (managed by dose reduction and taking with food). Serum creatinine elevation is apparent (not indicative of kidney damage, but reflects increased creatinine production from increased creatine metabolism); individuals with preexisting renal disease should consult healthcare provider but general consensus supports safety even in mild renal disease. Creatine particularly benefits vegetarians/vegans, athletes (improving strength and power), cognitively-demanding occupations (supporting sustained mental effort), and older adults (supporting energy production and potentially slowing cognitive decline). The most cost-effective longevity supplement (cost $0.05-0.10 daily), creatine merits near-universal consideration with few contraindications."
      },
      {
        heading: "Promising Compounds: NMN, Berberine, Ashwagandha, and Emerging Evidence",
        body: "Several emerging compounds show promising animal and early human evidence for longevity and healthspan benefits, though remain insufficient for strong recommendations without larger controlled trials. Nicotinamide mononucleotide (NMN), a NAD+ (nicotinamide adenine dinucleotide) precursor, improves mitochondrial function and cellular energetics in animal models and early human studies; NAD+ decline with aging contributes to mitochondrial dysfunction and metabolic syndrome. NMN supplementation (250-1000mg daily) improves insulin sensitivity and glucose tolerance in prediabetic humans and mouse models; a small randomized trial found 10-week NMN supplementation improved insulin sensitivity 10-15% and reduced fasting glucose modestly in prediabetic adults. The mechanism involves NAD+-dependent sirtuins (especially SIRT1 and SIRT3) activation, promoting mitochondrial biogenesis, autophagy, and metabolic adaptation. However, bioavailability concerns exist: oral NMN absorption appears poor with potentially rapid degradation in GI tract; pharmacokinetic studies suggest peak plasma elevation 30-60 minutes post-dose with rapid decline, limiting efficacy. The cost ($20-30 monthly) exceeds evidence quality. Berberine, an alkaloid from Berberis plants, demonstrates AMPK activation (cellular energy sensor) and improved metabolic health in observational and clinical trials; a meta-analysis of 14 berberine trials found equivalent metabolic improvements to metformin (diabetes drug) in prediabetics and type 2 diabetics: 10-15% HbA1c reduction, 20-30% triglyceride reduction, improved lipid profiles. Dosing (500mg three times daily) achieves GI side effects (diarrhea in 50%+ users), limiting tolerability; cost ($10-15 monthly) remains reasonable relative to metformin. The evidence base, while respectable (human trials in 50-100 participants per study), remains inferior to established pharmacological interventions. Ashwagandha (Withania somnifera root extract), used in Ayurvedic medicine, shows adaptogenic properties reducing cortisol and improving stress resilience in clinical trials; a meta-analysis of 8 trials found ashwagandha supplementation (300-600mg daily standardized to 2.5-5% withanolides) reduced cortisol 14-30% and improved anxiety/stress symptom scores 25-40% compared to placebo, with effects comparable to low-dose benzodiazepines. Benefits extend to cognitive function and sleep: supplementation improves attention, processing speed, and sleep quality in some trials. The mechanism involves GABA-like activity and anti-inflammatory signaling (NF-κB inhibition); cost ($5-10 monthly) and safety profile (well-tolerated in clinical trials) make it reasonable consideration for stress management, though effects are modest and require regular use. Other emerging compounds with preliminary evidence include: α-ketoglutarate (AKG), a TCA cycle intermediate proposed to improve metabolic health and lifespan in animal models (human evidence absent); pterostilbene, a resveratrol analog with improved bioavailability (cognitive and cardiovascular benefits in preliminary human studies); and urolithin A, a gut microbiota metabolite of pomegranate polyphenols showing mitochondrial benefits in animal studies (human bioavailability and efficacy uncertain). The challenge with emerging compounds involves the large gap between animal mechanistic evidence and human clinical utility: compounds showing 10-30% lifespan extension in mice frequently show minimal (5% or less) measurable benefit in human trials, suggesting species-specific effects, dose-scaling issues, or fundamental mechanistic differences. The recommendation for emerging compounds emphasizes cautious skepticism: reasonable consideration (given low risk profiles) for those interested in biohacking at acceptable cost-risk ratios, but should not displace evidence-based interventions (established diet, exercise, sleep, stress management, sleep, established supplements)."
      },
      {
        heading: "What to Avoid: Unproven and Harmful Supplements",
        body: "The supplement landscape includes numerous compounds with weak, absent, or contradictory evidence, or demonstrable harm, warranting explicit avoidance to prevent wasted resources and potential adverse effects. Colloidal silver, marketed for immune support, has zero credible evidence of benefit and documented toxicity: chronic consumption produces argyria (permanent blue-gray skin discoloration) and potential silver accumulation in organs; regulatory agencies (FDA) prohibit immune claims for silver products. Glucosamine and chondroitin for joint health, heavily marketed for osteoarthritis, show minimal efficacy in large randomized trials: meta-analysis (14 large trials, 2500+ participants) found no significant pain reduction compared to placebo and no slowing of cartilage loss; cost ($10-20 monthly) and evidence absence make continuation unjustifiable. Multivitamins lacking specific deficiency targeting show no mortality benefit and possible harm: the Physicians' Health Study II (15,000 male physicians followed 12 years) found daily multivitamin supplementation showed no cardiovascular disease reduction, slight increase in cancer incidence (non-significant), and $15-20 monthly cost; individuals consuming adequate diet do not benefit from universal multivitamins. However, targeted supplementation of documented deficiencies (specific vitamins, minerals identified through testing) remains warranted. Beta-carotene supplementation, particularly in smokers and former smokers, increases lung cancer risk: the Alpha-Tocopherol, Beta-Carotene Cancer Prevention Study found that beta-carotene supplementation (20mg daily) increased lung cancer incidence 18-28% in smokers, with proposed mechanism involving pro-oxidant effects and induction of CYP1A1 carcinogen-metabolizing enzymes. Whole-food sources of carotenoids show no such risk, suggesting supplement-specific effects. CoQ10 supplementation, while theoretically supporting mitochondrial function, shows inconsistent trial evidence: some studies show benefit for heart failure and statin side effects (myalgias), while others show null results; cost ($10-15 monthly) and modest effect sizes make it reasonable consideration for statin users with myalgia but not universal recommendation. Vitamin E supplementation above RDA (15 mg) shows possible increased mortality risk in some meta-analyses: very high-dose supplementation (400+ IU daily) increases hemorrhagic stroke risk and all-cause mortality slightly in prospective studies. The mechanism may involve disruption of prooxidant/antioxidant balance and interference with normal cell death processes. Individual micronutrient supplementation (especially A, C, E) above RDA often reflects biological misunderstanding: excessive antioxidants may impair training adaptations (ROS-induced AMPK signaling requires some oxidative stress), produce pro-oxidant effects at high doses, and offer no mortality benefit. The principle of targeted supplementation based on identified deficiencies, mechanistic plausibility, and clinical trial evidence provides rational framework: supplement documented deficiencies (vitamin D insufficiency, iron/B12 in vegans, magnesium insufficiency); supplement evidence-based compounds at evidence-supported doses (creatine 5g, omega-3 1-3g EPA, magnesium 400-500mg); avoid universal supplements lacking mechanism (multivitamins in adequately-nourished individuals); avoid high-dose micronutrient supplementation (vitamin E >15mg, vitamin A >3000mcg, vitamin C >1000mg daily) absent specific indication; and allocate supplement budget toward lifestyle factors (structured exercise, quality sleep, Mediterranean diet) providing superior evidence."
      },
      {
        heading: "Personalization and Testing: Biomarker-Guided Supplement Strategy",
        body: "Optimal supplementation derives from individual assessment of nutritional status, metabolic function, and disease-specific needs rather than universal protocols, reducing wasted supplement consumption and improving targeted intervention efficacy. Baseline testing should include: serum 25-hydroxyvitamin D (target 40-50 ng/mL, guiding vitamin D supplementation); serum magnesium (though limited by reflection of total body status, still useful baseline); fasting glucose and HbA1c (identifying insulin resistance/diabetes, guiding berberine, metformin, or intensified lifestyle); lipid panel (identifying dyslipidemia, guiding omega-3 or plant stanol supplementation); complete blood count (identifying anemia, guiding iron supplementation if appropriate); serum B12 and folate (particularly important in vegans/vegetarians, older adults with reduced intrinsic factor); homocysteine (marker of B-vitamin insufficiency and cardiovascular risk independent of lipids); high-sensitivity CRP (marker of systemic inflammation, guiding anti-inflammatory supplement strategy and lifestyle intensity). Advanced testing includes: intracellular magnesium (RBC magnesium, ionized magnesium), omega-3 index (plasma phospholipid percentage EPA+DHA, target >8%), interleukin-6 and TNF-alpha (systemic inflammation markers guiding anti-inflammatory supplement intensity), and genetic testing (APOE status predicting omega-3 responsiveness, CYP1A2 polymorphisms predicting caffeine metabolism). The testing-guided approach enables stepwise supplementation: initiate documented deficiency repletion (vitamin D if 25(OH)D <30 ng/mL; B12 if <400 pmol/L; magnesium if <1.8 mEq/L); add evidence-based compounds at physiologic doses (creatine 5g daily, omega-3 to achieve index >8%, magnesium to achieve 400-500mg daily); retest at 8-12 weeks assessing biomarker response (vitamin D levels, omega-3 index improvement, magnesium tolerance assessment, inflammation markers, lipid improvement); and adjust supplementation based on response. Individual responder status assessment requires acknowledgement of substantial variation: perhaps 60-70% of individuals show robust metabolic or symptom improvements with targeted supplementation; 20-30% show modest improvements; and 10-20% show minimal response despite documented deficiency correction, suggesting individual variation in supplement metabolism or non-supplement-responsive pathways. Cost-benefit analysis guides prioritization: inexpensive, evidence-supported supplements (magnesium $0.10 daily, creatine $0.05-10 daily, vitamin D $0.05 daily) merit universal consideration in populations at risk; moderate-cost compounds with respectable evidence (omega-3 $0.30-50 daily, berberine $0.15-30 daily) warrant individualized consideration; expensive compounds with limited evidence (NMN $20-30 monthly, pterostilbene $15-25 monthly, CoQ10 $10-15 monthly) should be considered lower-priority unless specific indication (CoQ10 for statin myalgia) or high individual interest exists. Supplementation sustainability emphasizes adherence: simpler protocols (fewer pills, less frequent dosing) show 50-60% higher 12-month adherence than complex protocols; integration with meals (vitamins with breakfast, minerals with dinner) improves compliance; and rotating supplement vendors quarterly (to avoid price creep and maintain quality assessment) provides cost control. The supplement industry's profit incentive produces exaggeration of benefits and evidence misrepresentation; skepticism toward marketing claims and reliance on independent systematic reviews (Cochrane Library, major medical journals) protects against overpriced ineffective compounds. Ultimately, supplementation represents an adjunctive optimization supporting lifestyle foundations (adequate sleep, structured exercise, Mediterranean diet, stress management, social connection), not replacement for these fundamental health determinants. Individuals prioritizing supplement consumption while neglecting exercise, sleep, and dietary quality misallocate limited health resources; conversely, optimally-living individuals may benefit from targeted micronutrient supplementation achieving an additional 5-15% health optimization."
      }
    ]
  }
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

function calcLifespan(inp, bio) {
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
    { key: "alcohol", label: "Alcohol", years: -Math.pow(Math.min(Math.max(inp.alcoholScore - 2, 0), 8) / 8, 1.3) * 5, color: T.warmLight },
  ];
  // ── metodika ──
  // 1) zisky klesaji s vekem (Fadnes 2022: +10,7 roku ve 20 letech, vyrazne min v 60)
  var ageF = Math.min(Math.max(1 - (inp.age - 20) * 0.0135, 0.22), 1);
  // 2) pilire se prekryvaji (spolecne mechanismy) -> klesajici vynosy, ne proste secteni
  var posRaw = 0, negRaw = 0;
  raw.forEach(function (f) { if (f.years >= 0) posRaw += f.years; else negRaw += f.years; });
  var CAP = 24;
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
  var muscle = Math.min(ex / 5, 1);
  var fatness = Math.max(1.18 - (inputs.dietScore / 10) * 0.28, 0.8);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;
  var smoking = inputs.smokingStatus === 2;
  var lightSmoker = inputs.smokingStatus === 1;
  var drinkLvl = inputs.alcoholScore;
  var isSleepy = inputs.sleepScore < 4;
  var isRested = inputs.sleepScore >= 7;
  var isHappy = inputs.socialScore > 5 && health > 0.5;
  var isSad = inputs.socialScore < 3;
  var coldLvl = inputs.coldExposure;
  var saunaLvl = inputs.saunaSessions;
  var suppLvl = inputs.supplementScore;
  var age = inputs.age;
  var sr = smoking ? 200 : lightSmoker ? 218 : Math.round(240 + health * 15);
  var sg = smoking ? 170 : lightSmoker ? 190 : Math.round(200 + health * 30);
  var sb = smoking ? 140 : lightSmoker ? 158 : Math.round(165 + health * 20);
  if (coldLvl > 5) { sr = Math.round(sr * 0.93); sg = Math.round(sg * 0.96); sb = Math.round(sb * 1.05); }
  var skin = "rgb(" + sr + "," + sg + "," + sb + ")";
  var skinL = "rgb(" + Math.min(sr + 12, 255) + "," + Math.min(sg + 10, 255) + "," + Math.min(sb + 8, 255) + ")";
  var skinD = "rgb(" + Math.round(sr * 0.82) + "," + Math.round(sg * 0.82) + "," + Math.round(sb * 0.82) + ")";
  var torsoW = 52 * fatness;
  var shoulderW = torsoW + 10 + muscle * 18;
  var hipW = torsoW - 2;
  var armT = 9 + muscle * 7;
  var legT = 11 + (fatness - 0.8) * 10;
  var neckW = 12 + (fatness - 0.8) * 6 + muscle * 3;
  var cheekFlush = health > 0.45 ? (health - 0.45) * 0.4 : 0;
  var tr = { transition: "all 0.5s cubic-bezier(.4,0,.2,1)" };
  var uid = useMemo(function () { return "av" + Math.random().toString(36).slice(2, 6); }, []);

  return (
    <svg viewBox="0 0 260 380" style={{ width: 240, height: 350, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id={uid + "skin"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={skinL} /><stop offset="100%" stopColor={skin} /></linearGradient>
        <linearGradient id={uid + "shirt"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={health > 0.5 ? "#4A9ED6" : "#8EA8BB"} /><stop offset="100%" stopColor={health > 0.5 ? "#2D7BB8" : "#6D8A9E"} /></linearGradient>
        <linearGradient id={uid + "pants"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ex > 3 ? "#2C5A7F" : "#52708A"} /><stop offset="100%" stopColor={ex > 3 ? "#1A3F5E" : "#3E5A6E"} /></linearGradient>
        <linearGradient id={uid + "hair"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={age > 58 ? "#A0A8B0" : "#3A2518"} /><stop offset="100%" stopColor={age > 58 ? "#BCC2C8" : "#5A3D2E"} /></linearGradient>
        <radialGradient id={uid + "glow"}><stop offset="0%" stopColor={health > 0.6 ? "rgba(43,168,125,0.12)" : "rgba(180,180,180,0.06)"} /><stop offset="100%" stopColor="transparent" /></radialGradient>
        <filter id={uid + "shd"}><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(12,45,72,0.10)" /></filter>
        <filter id={uid + "glo"}><feGaussianBlur stdDeviation="8" /><feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.66  0 0 0 0 0.49  0 0 0 0.15 0" /></filter>
      </defs>

      {/* health aura */}
      {health > 0.65 && <ellipse cx="130" cy="220" rx={70 + health * 30} ry={130 + health * 30} fill="none" stroke="#2BA87D" strokeWidth="1.5" opacity={0.03 + health * 0.06} filter={"url(#" + uid + "glo)"} style={tr} />}

      {/* ground shadow */}
      <ellipse cx="130" cy="356" rx={50 + fatness * 10} ry={8} fill={"url(#" + uid + "glow)"} style={tr} />

      {/* ─── LEFT LEG ─── */}
      <path d={"M" + (130 - hipW / 2 + 4) + ",280 Q" + (130 - 14) + ",310 " + (130 - 14 - legT / 2 + 2) + ",348"} fill="none" stroke={"url(#" + uid + "pants)"} strokeWidth={legT} strokeLinecap="round" style={tr} />
      {/* RIGHT LEG */}
      <path d={"M" + (130 + hipW / 2 - 4) + ",280 Q" + (130 + 14) + ",310 " + (130 + 14 + legT / 2 - 2) + ",348"} fill="none" stroke={"url(#" + uid + "pants)"} strokeWidth={legT} strokeLinecap="round" style={tr} />

      {/* shoes */}
      <ellipse cx={130 - 14 - legT / 2 + 2} cy="352" rx={legT / 2 + 5} ry="7" fill={ex > 4 ? "#3B8CC4" : ex > 2 ? "#6A9BB8" : "#8A8A8A"} style={tr} />
      <ellipse cx={130 + 14 + legT / 2 - 2} cy="352" rx={legT / 2 + 5} ry="7" fill={ex > 4 ? "#3B8CC4" : ex > 2 ? "#6A9BB8" : "#8A8A8A"} style={tr} />
      {ex > 4 && <>
        <path d={"M" + (130 - 14 - legT / 2 - 2) + ",350 L" + (130 - 14 - legT / 2 + 6) + ",350"} stroke="white" strokeWidth="0.8" opacity="0.4" />
        <path d={"M" + (130 + 14 + legT / 2 - 6) + ",350 L" + (130 + 14 + legT / 2 + 2) + ",350"} stroke="white" strokeWidth="0.8" opacity="0.4" />
      </>}

      {/* ─── TORSO ─── */}
      <path d={"M" + (130 - shoulderW / 2) + ",198 C" + (130 - shoulderW / 2 - 3) + ",230 " + (130 - hipW / 2 - 1) + ",265 " + (130 - hipW / 2) + ",285 L" + (130 + hipW / 2) + ",285 C" + (130 + hipW / 2 + 1) + ",265 " + (130 + shoulderW / 2 + 3) + ",230 " + (130 + shoulderW / 2) + ",198 Q130,186 " + (130 - shoulderW / 2) + ",198Z"} fill={"url(#" + uid + "shirt)"} style={tr} filter={"url(#" + uid + "shd)"} />

      {/* shirt collar V */}
      <path d={"M" + (130 - 10) + ",196 L130,212 L" + (130 + 10) + ",196"} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

      {/* muscle definition lines on shirt */}
      {muscle > 0.35 && <>
        <path d={"M" + (130 - shoulderW / 2 + 6) + ",210 Q" + (130 - shoulderW / 3) + ",240 " + (130 - hipW / 2 + 6) + ",270"} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5 + muscle * 2.5} style={tr} />
        <path d={"M" + (130 + shoulderW / 2 - 6) + ",210 Q" + (130 + shoulderW / 3) + ",240 " + (130 + hipW / 2 - 6) + ",270"} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5 + muscle * 2.5} style={tr} />
      </>}
      {muscle > 0.6 && <>
        <path d="M122,230 Q130,235 138,230" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1 + muscle} />
        <line x1="125" y1="218" x2="135" y2="218" stroke="rgba(255,255,255,0.06)" strokeWidth={0.8 + muscle} />
      </>}

      {/* ─── LEFT ARM ─── */}
      <path d={"M" + (130 - shoulderW / 2) + ",200 Q" + (130 - shoulderW / 2 - armT / 2 - 4) + ",230 " + (130 - shoulderW / 2 - armT / 2 - 2) + ",262"} fill="none" stroke={"url(#" + uid + "skin)"} strokeWidth={armT} strokeLinecap="round" style={tr} />
      {/* RIGHT ARM */}
      <path d={"M" + (130 + shoulderW / 2) + ",200 Q" + (130 + shoulderW / 2 + armT / 2 + 4) + ",230 " + (130 + shoulderW / 2 + armT / 2 + 2) + ",262"} fill="none" stroke={"url(#" + uid + "skin)"} strokeWidth={armT} strokeLinecap="round" style={tr} />

      {/* bicep definition */}
      {muscle > 0.4 && <>
        <ellipse cx={130 - shoulderW / 2 - armT / 2 - 3} cy="225" rx={1.5 + muscle * 3.5} ry={4 + muscle * 6} fill="rgba(0,0,0,0.04)" style={tr} />
        <ellipse cx={130 + shoulderW / 2 + armT / 2 + 3} cy="225" rx={1.5 + muscle * 3.5} ry={4 + muscle * 6} fill="rgba(0,0,0,0.04)" style={tr} />
      </>}

      {/* hands */}
      <ellipse cx={130 - shoulderW / 2 - armT / 2 - 2} cy={266} rx={5 + muscle * 1.5} ry={6 + muscle * 1.5} fill={skin} style={tr} />
      <ellipse cx={130 + shoulderW / 2 + armT / 2 + 2} cy={266} rx={5 + muscle * 1.5} ry={6 + muscle * 1.5} fill={skin} style={tr} />

      {/* ─── NECK ─── */}
      <rect x={130 - neckW / 2} y="156" width={neckW} height="46" rx={neckW / 2} fill={"url(#" + uid + "skin)"} style={tr} />

      {/* ─── HEAD ─── */}
      <ellipse cx="130" cy="124" rx="38" ry="42" fill={"url(#" + uid + "skin)"} style={tr} filter={"url(#" + uid + "shd)"} />

      {/* ─── EARS ─── */}
      <ellipse cx="91" cy="126" rx="6" ry="9" fill={skin} stroke={skinD} strokeWidth="0.5" style={tr} />
      <ellipse cx="169" cy="126" rx="6" ry="9" fill={skin} stroke={skinD} strokeWidth="0.5" style={tr} />

      {/* ─── HAIR ─── */}
      <path d={"M90,118 C90," + (age > 68 ? "86" : "74") + " 108,62 130,60 C152,62 170," + (age > 68 ? "86" : "74") + " 170,118 Q168,95 155,88 Q130,78 105,88 Q92,95 90,118Z"} fill={"url(#" + uid + "hair)"} style={tr} />
      {/* side hair volume */}
      <path d="M91,118 Q88,108 90,98" fill="none" stroke={"url(#" + uid + "hair)"} strokeWidth="5" strokeLinecap="round" style={tr} />
      <path d="M169,118 Q172,108 170,98" fill="none" stroke={"url(#" + uid + "hair)"} strokeWidth="5" strokeLinecap="round" style={tr} />
      {/* grey streaks */}
      {age > 42 && age <= 58 && <>
        <path d="M108,66 Q110,78 106,90" fill="none" stroke="#AAA" strokeWidth="1" opacity="0.25" />
        <path d="M150,67 Q148,79 152,91" fill="none" stroke="#AAA" strokeWidth="1" opacity="0.25" />
      </>}

      {/* ─── EYEBROWS ─── */}
      <path d={"M109,107 Q117," + (isSad ? "110" : isHappy ? "103" : "106") + " 125,107"} fill="none" stroke={skinD} strokeWidth="2.5" strokeLinecap="round" style={tr} />
      <path d={"M135,107 Q143," + (isSad ? "110" : isHappy ? "103" : "106") + " 151,107"} fill="none" stroke={skinD} strokeWidth="2.5" strokeLinecap="round" style={tr} />

      {/* ─── EYES ─── */}
      {isSleepy ? <>
        <path d="M110,115 Q117,112 124,115" fill="none" stroke="#0C2D48" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M136,115 Q143,112 150,115" fill="none" stroke="#0C2D48" strokeWidth="2.5" strokeLinecap="round" />
        {/* heavy lids */}
        <path d="M110,113 Q117,116 124,113" fill={skin} stroke="none" opacity="0.5" />
        <path d="M136,113 Q143,116 150,113" fill={skin} stroke="none" opacity="0.5" />
      </> : <>
        {/* sclera */}
        <ellipse cx="117" cy="115" rx="8.5" ry={isRested ? 7 : 5.5} fill="white" style={tr} />
        <ellipse cx="143" cy="115" rx="8.5" ry={isRested ? 7 : 5.5} fill="white" style={tr} />
        {/* iris */}
        <circle cx="117" cy="115" r={isRested ? 5 : 4.2} fill={health > 0.6 ? "#4A8FCA" : "#6A8494"} style={tr} />
        <circle cx="143" cy="115" r={isRested ? 5 : 4.2} fill={health > 0.6 ? "#4A8FCA" : "#6A8494"} style={tr} />
        {/* pupil */}
        <circle cx="117" cy="115" r="2.5" fill="#0C2D48" />
        <circle cx="143" cy="115" r="2.5" fill="#0C2D48" />
        {/* sparkle */}
        <circle cx="119.5" cy="112.5" r="1.8" fill="white" opacity={isRested ? 0.95 : 0.5} />
        <circle cx="145.5" cy="112.5" r="1.8" fill="white" opacity={isRested ? 0.95 : 0.5} />
        <circle cx="115" cy="117" r="0.9" fill="white" opacity={isRested ? 0.6 : 0.25} />
        <circle cx="141" cy="117" r="0.9" fill="white" opacity={isRested ? 0.6 : 0.25} />
        {/* eyelashes */}
        <path d={"M109," + (isRested ? "110" : "111") + " Q117," + (isRested ? "106" : "108") + " 125," + (isRested ? "110" : "111")} fill="none" stroke="#0C2D48" strokeWidth="1.2" strokeLinecap="round" />
        <path d={"M135," + (isRested ? "110" : "111") + " Q143," + (isRested ? "106" : "108") + " 151," + (isRested ? "110" : "111")} fill="none" stroke="#0C2D48" strokeWidth="1.2" strokeLinecap="round" />
        {/* under-eye circles */}
        {inputs.sleepScore < 5 && <>
          <ellipse cx="117" cy={121 + (isRested ? 0 : 1)} rx="7" ry="3" fill={"rgba(110,85,130," + (0.04 + (5 - inputs.sleepScore) * 0.04) + ")"} style={tr} />
          <ellipse cx="143" cy={121 + (isRested ? 0 : 1)} rx="7" ry="3" fill={"rgba(110,85,130," + (0.04 + (5 - inputs.sleepScore) * 0.04) + ")"} style={tr} />
        </>}
      </>}

      {/* ─── NOSE ─── */}
      <path d="M127,122 Q130,132 133,122" fill="none" stroke={skinD} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="126" cy="124" r="1.5" fill={skinD} opacity="0.15" />
      <circle cx="134" cy="124" r="1.5" fill={skinD} opacity="0.15" />
      {drinkLvl > 8 && <circle cx="130" cy="124" r="5" fill="rgba(210,70,70,0.18)" style={tr} />}

      {/* ─── CHEEKS ─── */}
      <ellipse cx="104" cy="128" rx="10" ry="6" fill={"rgba(220,105,95," + cheekFlush + ")"} style={tr} />
      <ellipse cx="156" cy="128" rx="10" ry="6" fill={"rgba(220,105,95," + cheekFlush + ")"} style={tr} />

      {/* ─── MOUTH ─── */}
      {isHappy ?
        <g style={tr}>
          <path d="M118,136 Q130,150 142,136" fill="rgba(190,60,60,0.12)" stroke="#0C2D48" strokeWidth="2" strokeLinecap="round" />
          <path d="M122,136 Q130,140 138,136" fill="white" opacity="0.6" />
        </g> :
       isSad ?
        <path d="M120,142 Q130,134 140,142" fill="none" stroke="#0C2D48" strokeWidth="2" strokeLinecap="round" style={tr} /> :
       smoking ?
        <line x1="122" y1="138" x2="138" y2="138" stroke="#0C2D48" strokeWidth="2" strokeLinecap="round" /> :
        <path d="M122,137 Q130,141 138,137" fill="none" stroke="#0C2D48" strokeWidth="1.8" strokeLinecap="round" style={tr} />
      }

      {/* ─── AGE DETAILS ─── */}
      {age > 48 && <>
        <path d="M104,125 Q106,128 108,125" fill="none" stroke={skinD} strokeWidth="0.6" opacity="0.3" />
        <path d="M152,125 Q154,128 156,125" fill="none" stroke={skinD} strokeWidth="0.6" opacity="0.3" />
      </>}
      {age > 55 && <>
        <path d="M120,143 Q125,145 130,143" fill="none" stroke={skinD} strokeWidth="0.5" opacity="0.2" />
        <line x1="109" y1="99" x2="113" y2="102" stroke={skinD} strokeWidth="0.5" opacity="0.2" />
        <line x1="147" y1="102" x2="151" y2="99" stroke={skinD} strokeWidth="0.5" opacity="0.2" />
      </>}
      {age > 65 && <>
        <path d="M107,132 Q109,134 111,132" fill="none" stroke={skinD} strokeWidth="0.5" opacity="0.2" />
        <path d="M149,132 Q151,134 153,132" fill="none" stroke={skinD} strokeWidth="0.5" opacity="0.2" />
      </>}

      {/* ══════ ACCESSORIES ══════ */}

      {/* CIGARETTE */}
      {smoking && <>
        <rect x="138" y="134" width="26" height="4.5" rx="2" fill="#F5E4CE" />
        <rect x="138" y="134" width="4" height="4.5" rx="1" fill="#E5D5BA" />
        <rect x="160" y="134" width="4" height="4.5" rx="1" fill="#E06030" />
        <circle cx="163" cy="133" r="2.5" fill="#FF6B35" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.85;0.5" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <g opacity="0.3">
          <path d="M165,131 Q169,118 164,108 Q168,98 165,88" fill="none" stroke="#B8B8B8" strokeWidth="2.2">
            <animate attributeName="d" values="M165,131 Q169,118 164,108 Q168,98 165,88;M165,131 Q172,116 163,106 Q170,96 164,85;M165,131 Q169,118 164,108 Q168,98 165,88" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M167,128 Q173,114 166,102" fill="none" stroke="#CCCCCC" strokeWidth="1.5">
            <animate attributeName="d" values="M167,128 Q173,114 166,102;M167,128 Q176,112 165,100;M167,128 Q173,114 166,102" dur="3.5s" repeatCount="indefinite" />
          </path>
        </g>
      </>}
      {lightSmoker && <ellipse cx="130" cy="139" rx="6" ry="1.5" fill="rgba(190,170,100,0.12)" />}

      {/* ALCOHOL: wine glass at moderate, pint at heavy */}
      {drinkLvl > 3 && <g transform={"translate(" + (130 - shoulderW / 2 - armT - 12) + "," + (242) + ")"} style={tr}>
        {drinkLvl > 7 ? <>
          <path d="M0,0 L2,30 L16,30 L18,0Z" fill="rgba(30,50,70,0.12)" />
          <path d="M1,5 L3,28 L15,28 L17,5Z" fill="#F0C040" opacity="0.8" />
          <rect x="0" y="-2" width="18" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="17" y="8" width="6" height="14" rx="3" fill="rgba(30,50,70,0.1)" />
        </> : <>
          <ellipse cx="8" cy="8" rx="8" ry="9" fill="rgba(30,50,70,0.06)" />
          <ellipse cx="8" cy="8" rx="6" ry="7" fill={"rgba(140,30,40," + (0.15 + (drinkLvl - 3) * 0.08) + ")"} />
          <rect x="6.5" y="17" width="3" height="12" rx="1.5" fill="rgba(30,50,70,0.1)" />
          <ellipse cx="8" cy="30" rx="6" ry="1.5" fill="rgba(30,50,70,0.08)" />
        </>}
      </g>}
      {drinkLvl > 6 && <ellipse cx="130" cy="128" rx="5" ry="3" fill={"rgba(200,70,70," + ((drinkLvl - 6) * 0.03) + ")"} style={tr} />}

      {/* SAUNA STEAM */}
      {saunaLvl >= 1 && <g opacity={0.08 + saunaLvl * 0.05}>
        <path d="M90,190 Q87,172 92,158" fill="none" stroke="#8EAABB" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="d" values="M90,190 Q87,172 92,158;M88,188 Q93,170 87,155;M90,190 Q87,172 92,158" dur="3s" repeatCount="indefinite" />
        </path>
        {saunaLvl >= 2 && <path d="M170,188 Q173,170 168,156" fill="none" stroke="#8EAABB" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="d" values="M170,188 Q173,170 168,156;M172,186 Q167,168 173,154;M170,188 Q173,170 168,156" dur="3.4s" repeatCount="indefinite" />
        </path>}
        {saunaLvl >= 4 && <>
          <path d="M130,188 Q128,172 132,158" fill="none" stroke="#8EAABB" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="d" values="M130,188 Q128,172 132,158;M132,186 Q126,170 130,156;M130,188 Q128,172 132,158" dur="2.6s" repeatCount="indefinite" />
          </path>
          <circle cx="86" cy="150" r="2" fill="#8EAABB" opacity="0.12">
            <animate attributeName="cy" values="150;140;150" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </>}
        {saunaLvl >= 6 && <>
          <circle cx="174" cy="148" r="1.5" fill="#8EAABB" opacity="0.1">
            <animate attributeName="cy" values="148;138;148" dur="4s" repeatCount="indefinite" />
          </circle>
          <path d="M100,185 Q97,170 102,158" fill="none" stroke="#8EAABB" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
            <animate attributeName="d" values="M100,185 Q97,170 102,158;M98,183 Q103,168 97,155;M100,185 Q97,170 102,158" dur="2.8s" repeatCount="indefinite" />
          </path>
        </>}
      </g>}

      {/* COLD SNOWFLAKES */}
      {coldLvl > 1 && <g opacity={0.15 + coldLvl * 0.07} style={tr}>
        <text x="60" y="200" fontSize={7 + coldLvl * 0.5} fill="#5FA8D3">{"\u2744"}</text>
        {coldLvl > 3 && <text x="180" y="185" fontSize={6 + coldLvl * 0.4} fill="#5FA8D3">{"\u2744"}</text>}
        {coldLvl > 5 && <>
          <text x="52" y="155" fontSize="9" fill="#5FA8D3">{"\u2744"}</text>
          <text x="190" y="220" fontSize="7" fill="#5FA8D3">{"\u2744"}</text>
        </>}
        {coldLvl > 7 && <>
          <text x="68" y="248" fontSize="8" fill="#3B8CC4" opacity="0.5">{"\u2744"}</text>
          <text x="185" y="252" fontSize="7" fill="#3B8CC4" opacity="0.4">{"\u2744"}</text>
          <text x="45" y="130" fontSize="10" fill="#5FA8D3" opacity="0.3">{"\u2744"}</text>
          <line x1={130 - shoulderW / 2} y1="198" x2={130 - shoulderW / 2 + 10} y2="198" stroke="#C5DFF0" strokeWidth="1.5" opacity="0.35" />
          <line x1={130 + shoulderW / 2 - 10} y1="198" x2={130 + shoulderW / 2} y2="198" stroke="#C5DFF0" strokeWidth="1.5" opacity="0.35" />
        </>}
      </g>}

      {/* SUPPLEMENTS pill bottle */}
      {suppLvl > 2 && <g transform={"translate(" + (130 + shoulderW / 2 + armT + 6) + ",244)"} opacity={0.4 + suppLvl * 0.06} style={tr}>
        <rect x="0" y="0" width="12" height="18" rx="3" fill="#2BA87D" />
        <rect x="-1" y="-3" width="14" height="6" rx="3" fill="#5CC9A0" />
        <text x="6" y="14" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">+</text>
        {suppLvl > 5 && <>
          <circle cx="4" cy="-8" r="3" fill="#E89B4C" opacity="0.7" />
          <circle cx="12" cy="-6" r="2.5" fill="#2BA87D" opacity="0.6" />
        </>}
        {suppLvl > 8 && <circle cx="0" cy="-5" r="2" fill="#5FA8D3" opacity="0.5" />}
      </g>}

      {/* SLEEP ZZZ */}
      {isSleepy && <g>
        <text x="158" y="98" fontFamily="monospace" fontSize="11" fill="#8EAABB" opacity="0.35">z</text>
        <text x="168" y="86" fontFamily="monospace" fontSize="14" fill="#8EAABB" opacity="0.3">z</text>
        <text x="176" y="72" fontFamily="monospace" fontSize="18" fill="#8EAABB" opacity="0.25">z</text>
      </g>}

      {/* SOCIAL HEARTS */}
      {inputs.socialScore > 3 && <g opacity={0.1 + (inputs.socialScore - 3) * 0.1} style={tr}>
        <text x="72" y="108" fontSize={9 + inputs.socialScore * 0.4} fill="#E85D7A">{"\u2665"}</text>
        {inputs.socialScore > 6 && <text x="172" y="112" fontSize="10" fill="#E85D7A">{"\u2665"}</text>}
        {inputs.socialScore > 8 && <>
          <text x="78" y="185" fontSize="8" fill="#E85D7A">{"\u2665"}</text>
          <text x="180" y="178" fontSize="7" fill="#E85D7A">{"\u2665"}</text>
        </>}
      </g>}

      {/* EXERCISE headband + sweat */}
      {ex > 3 && <>
        <path d={"M92,98 Q130,88 168,98"} fill="none" stroke="#3B8CC4" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" style={tr} />
        {ex > 5 && <>
          <ellipse cx="95" cy="105" rx="1.5" ry="2" fill="#5FA8D3" opacity="0.45">
            <animate attributeName="cy" values="105;115;105" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0.1;0.45" dur="2.2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="165" cy="104" rx="1.3" ry="1.8" fill="#5FA8D3" opacity="0.35">
            <animate attributeName="cy" values="104;113;104" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.08;0.35" dur="2.8s" repeatCount="indefinite" />
          </ellipse>
        </>}
      </>}

      {/* DIET: green leaf or fast food icon floating */}
      {inputs.dietScore > 7 && <g opacity={0.15 + (inputs.dietScore - 7) * 0.1}>
        <text x="182" y="150" fontSize="12" fill="#2BA87D">{"\u{1F33F}"}</text>
        {inputs.dietScore > 9 && <text x="64" y="148" fontSize="10" fill="#2BA87D">{"\u{1F33F}"}</text>}
      </g>}
      {inputs.dietScore < 3 && <g opacity={0.2 + (3 - inputs.dietScore) * 0.1}>
        <text x="178" y="152" fontSize="11" fill="#D95843">{"\u{1F354}"}</text>
      </g>}
    </svg>
  );
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
    <input type="range" min={min} max={max} step={step} value={value} onChange={function (e) { onChange(Number(e.target.value)); }} style={{ width: "100%", height: 5, appearance: "none", WebkitAppearance: "none", borderRadius: 99, outline: "none", cursor: "pointer", background: "linear-gradient(to right," + T.accent + " 0%," + T.accent + " " + pct + "%," + T.faint + " " + pct + "%," + T.faint + " 100%)" }} />
  </div>);
}

/* ══════════════ PILLAR CARD ══════════════ */
function PillarCard({ p, index, onOpen }) {
  var u = useUI();
  var o = (u.cs && CS.pillars[p.id]) || {};
  var _r = useReveal(0.1), ref = _r[0], vis = _r[1];
  return (
    <div ref={ref} onClick={function () { onOpen(p.id); }} style={{ padding: "24px 22px", background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, border: "1px solid " + T.glassBorder, borderRadius: T.radius, boxShadow: T.shadow, cursor: "pointer", transition: "all 0.4s cubic-bezier(.4,0,.2,1) " + (index * 0.05) + "s, transform 0.2s ease", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", position: "relative", overflow: "hidden" }}
      onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = T.shadowLg; e.currentTarget.style.borderColor = T.glassBorderHover; }}
      onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderColor = T.glassBorder; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{p.icon}</span>
        <div style={{ fontFamily: T.mono, fontSize: 17, fontWeight: 700, color: T.aurora }}>+{p.minY}&ndash;{p.maxY}<span style={{ fontSize: 10, fontWeight: 500, color: T.sub, marginLeft: 2 }}>{u.U.yrs}</span></div>
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
function DetailModal({ pillarId, onClose }) {
  var u = useUI();
  var data = PILLAR_DETAILS[pillarId];
  var csd = (u.cs && CS.pillarDetails[pillarId]) || null;
  var secs = (csd && csd.sections) ? csd.sections : (data ? data.sections : []);
  if (!data) return null;
  useEffect(function () { document.body.style.overflow = "hidden"; return function () { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,45,72,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <div onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", background: T.white, borderRadius: 22, maxWidth: 720, width: "100%", maxHeight: "88vh", overflow: "auto", boxShadow: "0 40px 100px rgba(12,45,72,0.25), 0 0 0 1px rgba(140,170,200,0.15)", padding: 0 }}>
        {/* header */}
        <div style={{ padding: "28px 36px 20px", borderBottom: "1px solid " + T.glassBorder, position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "22px 22px 0 0", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: data.color, marginBottom: 4 }}>{u.U.modal.deepDive}</div>
              <h2 style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 700, color: T.deep, letterSpacing: -0.5 }}>{(csd && csd.title) || data.title}</h2>
            </div>
            <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid " + T.glassBorder, background: T.faint, cursor: "pointer", fontSize: 20, color: T.sub, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 }}>&times;</button>
          </div>
        </div>
        {/* sections */}
        <div style={{ padding: "28px 36px 40px" }}>
          {secs.map(function (sec, i) {
            return (
              <div key={i} style={{ marginBottom: i < secs.length - 1 ? 36 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 32, borderRadius: 3, background: data.color, flexShrink: 0 }} />
                  <h3 style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.deep, letterSpacing: -0.3 }}>{sec.heading}</h3>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: T.sub, paddingLeft: 17 }}>{sec.body}</p>
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
  { year: "2022", title: "Estimating impact of food choices on life expectancy", a: "Fadnes et al.", j: "PLOS Medicine", f: "+10.7 yrs from optimal diet at age 20", url: "https://doi.org/10.1371/journal.pmed.1003889" },
  { year: "2015", title: "Sauna bathing and fatal cardiovascular events", a: "Laukkanen et al.", j: "JAMA Internal Medicine", f: "4\u20137x/wk: 50% lower CVD mortality", url: "https://doi.org/10.1001/jamainternmed.2014.8187" },
  { year: "2012", title: "Leisure time physical activity and mortality", a: "Moore et al.", j: "PLOS Medicine", f: "+4.5 yrs from 150 min/wk exercise", url: "https://doi.org/10.1371/journal.pmed.1001335" },
  { year: "2024", title: "Sleep regularity and all-cause mortality", a: "Windred et al.", j: "SLEEP", f: "Irregular sleep: 20\u201348% higher death risk", url: "https://doi.org/10.1093/sleep/zsad253" },
  { year: "2010", title: "Social relationships and mortality risk", a: "Holt-Lunstad et al.", j: "PLOS Medicine", f: "Strong ties: 50% survival increase", url: "https://doi.org/10.1371/journal.pmed.1000316" },
  { year: "2019", title: "Vitamin D and Omega-3 supplementation", a: "Manson et al.", j: "New England J of Medicine", f: "Omega-3: 28% fewer heart attacks", url: "https://doi.org/10.1056/NEJMoa1811403" },
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
  { icon: "\u{1F52C}", title: "Learn the science", body: "Seven pillars, each backed by peer-reviewed meta-analyses covering 308,000+ participants. Click any pillar for a molecular-level deep dive — no hype, no anecdotes.", link: "#pillars", cta: "Explore the pillars →" },
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
  var _r = useReveal(0.08), ref = _r[0], vis = _r[1];
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(26px)", transition: "opacity 0.7s ease " + (delay || 0) + "s, transform 0.7s cubic-bezier(.4,0,.2,1) " + (delay || 0) + "s", ...style }}>{children}</div>;
}

function CountUp({ to, pre, suf, dec, dur }) {
  if (dur === undefined) dur = 1400;
  var _r = useReveal(0.4), ref = _r[0], vis = _r[1];
  var _s = useState(0), v = _s[0], setV = _s[1];
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
  var _r = useReveal(0.1), ref = _r[0], vis = _r[1];
  return (
    <div ref={ref} style={{ textAlign: "center", marginBottom: 48, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all 0.7s ease" }}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: T.sans, fontSize: "clamp(28px,4.4vw,44px)", fontWeight: 700, color: light ? T.white : T.deep, letterSpacing: -1.2, lineHeight: 1.12 }}>{title}</h2>
      {sub && <p style={{ color: light ? "rgba(214,232,243,0.75)" : T.sub, marginTop: 12, fontSize: 15, maxWidth: 560, margin: "12px auto 0", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

function Faq({ q, a, light }) {
  var _s = useState(false), open = _s[0], setOpen = _s[1];
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
  if (!marker) return null;
  var c = (u.cs && CS.biomarkers[marker.name]) || {};
  var m = { name: c.name || marker.name, optimal: marker.optimal, freq: c.freq || marker.freq, what: c.what || marker.what, improve: c.improve || marker.improve, test: c.test || marker.test };
  useEffect(function () { document.body.style.overflow = "hidden"; return function () { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(12,45,72,0.45)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <div onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", background: T.white, borderRadius: 22, maxWidth: 620, width: "100%", maxHeight: "86vh", overflow: "auto", boxShadow: "0 40px 100px rgba(12,45,72,0.25)", padding: "32px 36px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.accent, marginBottom: 4 }}>{u.U.bio.mTitle}</div>
            <h2 style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.deep, letterSpacing: -0.6 }}>{m.name}</h2>
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 99, border: "1px solid " + T.glassBorder, background: T.faint, cursor: "pointer", fontSize: 20, color: T.sub, lineHeight: 1, flexShrink: 0 }}>&times;</button>
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
  var _s = useState(""), q = _s[0], setQ = _s[1];
  var items = GLOSSARY.map(function (g) { var c = u.cs && CS.glossary[g.term]; return { key: g.term, term: c ? c.t : g.term, def: c ? c.d : g.def }; });
  var filtered = items.filter(function (g) { return (g.term + " " + g.def).toLowerCase().indexOf(q.toLowerCase()) !== -1; });
  return (
    <section id="glossary" style={{ padding: "96px 0", background: T.bgAlt }}>
      <div className="mx" style={{ maxWidth: 920 }}>
        <SectionHead eyebrow={u.U.glos.eyebrow} title={u.U.glos.title} sub={u.U.glos.sub} />
        <div style={{ maxWidth: 420, margin: "0 auto 32px", position: "relative" }}>
          <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", color: T.dim, fontSize: 14 }}>{"\u{1F50D}"}</span>
          <input value={q} onChange={function (e) { setQ(e.target.value); }} placeholder={u.U.glos.search.replace("{n}", GLOSSARY.length)} style={{ width: "100%", padding: "13px 20px 13px 46px", borderRadius: 999, border: "1.5px solid " + T.glassBorder, fontFamily: T.sans, fontSize: 14, outline: "none", background: T.white, color: T.deep }} />
        </div>
        <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {filtered.map(function (g, i) { return (
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
  var _s = useState(DEFAULT_INPUTS), inputs = _s[0], setInputs = _s[1];
  var _e = useState(false), emailSent = _e[0], setEmailSent = _e[1];
  var _m = useState(null), modal = _m[0], setModal = _m[1];
  var _bm = useState(null), bioModal = _bm[0], setBioModal = _bm[1];
  var _lg = useState(function () { try { return localStorage.getItem("ll-lang") || "cs"; } catch (e) { return "cs"; } }), lang = _lg[0], setLang = _lg[1];
  useEffect(function () { try { localStorage.setItem("ll-lang", lang); } catch (e) {} }, [lang]);
  var U = UI[lang], cs = lang === "cs";
  var calcRef = useRef(null);
  var set = useCallback(function (k, v) { setInputs(function (p) { var n = {}; for (var x in p) n[x] = p[x]; n[k] = v; return n; }); }, []);
  var LB = cs ? CS.lbl : LBL;
  var BU = BIOUI[lang];
  var _bio = useState({ apob: "", hba1c: "", crp: "", bp: "", vo2: "" }), bio = _bio[0], setBio = _bio[1];
  var _bo = useState(false), bioOpen = _bo[0], setBioOpen = _bo[1];
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
      <style>{"\n@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\nhtml{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\nbody{background:" + T.bg + ";color:" + T.text + ";font-family:" + T.sans + ";overflow-x:hidden}\n::selection{background:" + T.ice + ";color:" + T.deep + "}\ninput[type=range]{-webkit-appearance:none;appearance:none}\ninput[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer;box-shadow:0 2px 8px rgba(12,45,72,0.15);transition:transform 0.15s}\ninput[type=range]::-webkit-slider-thumb:hover{transform:scale(1.15)}\ninput[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:" + T.white + ";border:2px solid " + T.accent + ";cursor:pointer}\ninput[type=range]:focus{outline:none}\n.mx{max-width:1120px;margin:0 auto;padding:0 28px}\n@media(max-width:840px){.cg{grid-template-columns:1fr!important}.er{grid-template-columns:1fr!important}.hs{flex-direction:column;gap:4px!important}.pg{grid-template-columns:1fr!important}.navlinks{display:none!important}}\n@media(max-width:560px){.hs>div{border-left:none!important;border-top:1px solid rgba(140,170,200,0.22)}.hs>div:first-child{border-top:none}}\n@keyframes gp{0%,100%{box-shadow:0 0 0 0 rgba(59,140,196,0.12)}50%{box-shadow:0 0 0 14px rgba(59,140,196,0)}}\n@keyframes floaty{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,14px) scale(1.06)}100%{transform:translate(12px,-10px) scale(0.98)}}\n@keyframes marq{to{transform:translateX(-50%)}}\n.marq{display:flex;gap:56px;width:max-content;animation:marq 26s linear infinite;align-items:center}\n.marq:hover{animation-play-state:paused}\n.gradtxt{background:linear-gradient(95deg,#3B8CC4 10%,#2BA87D 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}\n.navlink{position:relative}\n.navlink::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;border-radius:2px;background:#3B8CC4;transition:width 0.25s ease}\n.navlink:hover::after{width:100%}\n.liftcard{transition:transform 0.3s cubic-bezier(.4,0,.2,1),box-shadow 0.3s ease,border-color 0.3s ease}\n.liftcard:hover{transform:translateY(-5px);box-shadow:0 20px 60px rgba(12,45,72,0.12),0 2px 8px rgba(12,45,72,0.06)!important;border-color:rgba(100,150,200,0.4)!important}\n      "}</style>

      {modal && <DetailModal pillarId={modal} onClose={function () { setModal(null); }} />}
      {bioModal && <BiomarkerModal marker={bioModal} onClose={function () { setBioModal(null); }} />}

      {/* NAV — fixed glass bar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(245,248,250,0.82)", backdropFilter: T.blur, WebkitBackdropFilter: T.blur, borderBottom: "1px solid " + T.glassBorder }}>
        <div className="mx" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px" }}>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 15.5, color: T.deep, cursor: "pointer" }} onClick={function () { window.scrollTo({ top: 0, behavior: "smooth" }); }}><span style={{ color: T.aurora, fontFamily: T.mono }}>{"// "}</span>Longevity Lab</div>
          <div className="navlinks" style={{ display: "flex", gap: 26, alignItems: "center" }}>
            {[[U.nav.science, "pillars"], [U.nav.protocol, "protocol"], [U.nav.biomarkers, "biomarkers"], [U.nav.glossary, "glossary"], [U.nav.faq, "faq"]].map(function (l) { return <span key={l[1]} className="navlink" onClick={function () { goTo(l[1]); }} style={{ fontSize: 13.5, fontWeight: 600, color: T.mid, cursor: "pointer" }}>{l[0]}</span>; })}
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

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 80, background: "linear-gradient(175deg," + T.faint + " 0%," + T.bg + " 40%,rgba(43,168,125,0.03) 100%)" }}>
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
        <div className="marq">
          {[0, 1].map(function (rep) { return ["JAMA Internal Medicine", "PLOS Medicine", "New England Journal of Medicine", "SLEEP Journal", "The Lancet Public Health", "Circulation", "Nature Aging", "BMJ"].map(function (j) { return <span key={rep + j} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: "#B9C9D6", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{j}</span>; }); })}
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
                  <span onClick={function () { goTo(c.link.slice(1)); }} style={{ fontSize: 13, color: T.accent, fontWeight: 600, cursor: "pointer" }}>{cs && CS.solution[i] ? CS.solution[i].cta : c.cta}</span>
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
              <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.dim, marginBottom: 16, letterSpacing: 2 }}>{U.calc.basics}</div>
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
                        <input type="number" step="any" value={bio[f[0]]} placeholder={f[3]} onChange={function (e) { setB(f[0], e.target.value); }}
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
                <div onClick={function () { setBioModal(b); }} style={{ padding: "22px 24px", borderRadius: T.radius, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(140,170,200,0.2)", cursor: "pointer", transition: "all 0.3s ease", height: "100%" }}
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
              {!emailSent ? (
                <form onSubmit={function (e) { e.preventDefault(); setEmailSent(true); }} style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                  <input type="email" required placeholder={U.cta.placeholder} style={{ flex: "1 1 220px", padding: "14px 22px", borderRadius: 999, border: "1.5px solid rgba(197,223,240,0.3)", fontFamily: T.sans, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.08)", color: T.white }} />
                  <button type="submit" style={{ background: T.aurora, color: T.white, border: "none", padding: "14px 30px", borderRadius: 999, fontFamily: T.sans, fontWeight: 600, fontSize: 14.5, cursor: "pointer", boxShadow: "0 6px 20px rgba(43,168,125,0.35)" }}>{U.cta.subscribe}</button>
                </form>
              ) : (
                <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 999, background: "rgba(43,168,125,0.15)", border: "1px solid rgba(92,201,160,0.35)", fontFamily: T.mono, fontSize: 13, color: T.auroraLight }}>{U.cta.done}</div>
              )}
              <div style={{ marginTop: 26 }}>
                <PillBtn primary big onClick={scrollCalc} style={{ background: T.white, color: T.deep, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>{U.cta.btn}</PillBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              {[[U.footer.lPillars, "pillars"], [U.footer.lCalc, "calculator"], [U.footer.lProtocol, "protocol"], [U.footer.lBio, "biomarkers"]].map(function (l) { return <div key={l[1]} onClick={function () { goTo(l[1]); }} style={{ fontSize: 13, color: T.sub, marginBottom: 9, cursor: "pointer", fontWeight: 500 }}>{l[0]}</div>; })}
            </div>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.dim, textTransform: "uppercase", marginBottom: 14 }}>{U.footer.knowledge}</div>
              {[[U.footer.lMyths, "faq"], [U.footer.lEvid, "faq"], [U.footer.lFaq, "faq"]].map(function (l, i) { return <div key={i} onClick={function () { goTo(l[1]); }} style={{ fontSize: 13, color: T.sub, marginBottom: 9, cursor: "pointer", fontWeight: 500 }}>{l[0]}</div>; })}
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
    </>
    </LangCtx.Provider>
  );
}
