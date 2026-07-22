import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 3D v2 — realističtější procedurální člověk (Three.js),
   který reaguje na VŠECHNY metriky kalkulačky.

   Mapování metrik → vzhled:
     age            → šedivění vlasů, mírné shrbení
     sex            → proporce (ramena/boky), vlasy, oblečení
     exerciseDays×intensity → svaly (ramena, paže, hrudník, nohy), vzpřímenost
     dietScore      → tělesná kompozice (pas, břicho)
     sleepScore     → přivřená víčka, kruhy pod očima, shrbení
     socialScore    → úsměv / zamračení, hlava nahoru–dolů
     supplementScore→ jemné jiskřičky vitality kolem těla
     saunaSessions  → teplé nasvícení + prokrvená pleť
     coldExposure   → studené modré nasvícení + chladnější pleť
     smokingStatus  → 2 = CIGARETA v ruce + kouř + šedá pleť, 1 = bývalý (našedlá pleť)
     alcoholScore   → 8+ = SKLENICE PIVA v ruce + zarudlý nos/tváře + houpání
     gained (roky)  → jádro vitality v hrudi + aura + biologický věk
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };

function deriveParams(inputs, gained) {
  var ex = (inputs.exerciseDays * inputs.exerciseIntensity) / 10;
  var muscle = clamp(ex / 5, 0, 1);
  var fat = clamp(1.16 - (inputs.dietScore / 10) * 0.30, 0.82, 1.16);
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;

  var smoke = inputs.smokingStatus === 2 ? 1 : inputs.smokingStatus === 1 ? 0.5 : 0;
  var alcohol = clamp((inputs.alcoholScore - 5) / 5, 0, 1);      // 0 do 5, roste nad 5
  var heavyDrink = inputs.alcoholScore >= 8;                      // sklenice v ruce
  var supp = clamp(inputs.supplementScore / 10, 0, 1);
  var female = inputs.sex === "female";

  var sleepy = clamp((5 - inputs.sleepScore) / 5, 0, 1);
  var sad = clamp((4 - inputs.socialScore) / 4, 0, 1);
  var happy = clamp((inputs.socialScore - 5) / 5, 0, 1) * clamp(health * 1.4, 0, 1);
  var bioAge = clamp(inputs.age - gained * 0.45, 18, 100);

  /* pleť: základ dle zdraví → kuřák sežloutlý/šedý, chlad chladí, sauna+alkohol prokrvují */
  var r = 236 + health * 16, g = 196 + health * 30, b = 168 + health * 18;
  if (smoke > 0) { var s = smoke; r = r * (1 - 0.12 * s); g = g * (1 - 0.20 * s); b = b * (1 - 0.24 * s); }
  var coldN = inputs.coldExposure / 10, saunaN = Math.min(inputs.saunaSessions / 5, 1);
  if (coldN > 0.5) { r *= 0.95; g *= 0.97; b *= 1.05; }
  r += saunaN * 10 + alcohol * 16; g -= alcohol * 6; b -= alcohol * 8;

  var vit = clamp(0.5 + gained / 30, 0, 1);

  return {
    muscle: muscle, fat: fat, health: health,
    smoke: smoke, alcohol: alcohol, heavyDrink: heavyDrink, supp: supp, female: female,
    sleepy: sleepy, sad: sad, happy: happy, bioAge: bioAge, vit: vit,
    age: inputs.age,
    skin: new THREE.Color(clamp(r / 255, 0, 1), clamp(g / 255, 0, 1), clamp(b / 255, 0, 1)),
    core: new THREE.Color().setHSL(0.03 + vit * 0.36, 0.85, 0.55),
    hairGray: clamp((inputs.age - 36) / 32, 0, 1),
    cold: coldN, sauna: saunaN,
    /* shrbení: nevyspalost + samota + věk, vzpřímí svaly */
    slump: sleepy * 0.13 + sad * 0.12 + clamp((inputs.age - 55) / 45, 0, 1) * 0.12 - muscle * 0.07,
  };
}

export default function Avatar3D({ inputs, gained, height }) {
  var mountRef = useRef(null);
  var paramsRef = useRef(deriveParams(inputs, gained || 0));
  paramsRef.current = deriveParams(inputs, gained || 0);

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var W = mount.clientWidth, H = mount.clientHeight || 380;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 60);
    camera.position.set(0, 1.95, 7.4);
    camera.lookAt(0, 1.62, 0);

    /* ── světla ── */
    scene.add(new THREE.HemisphereLight(0xeaf4fb, 0xb0c4d2, 0.75));
    var key = new THREE.DirectionalLight(0xfff4e8, 1.55);
    key.position.set(3.2, 6, 4.4); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.top = 4; key.shadow.camera.bottom = -1.2;
    key.shadow.camera.left = -3; key.shadow.camera.right = 3;
    key.shadow.bias = -0.0012;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xdfeaff, 0.45); fill.position.set(-3.5, 2.6, 2.4); scene.add(fill);
    var rimCold = new THREE.DirectionalLight(0x74baff, 0); rimCold.position.set(-4, 2.6, -3.4); scene.add(rimCold);
    var rimWarm = new THREE.DirectionalLight(0xffa04d, 0); rimWarm.position.set(4, 1.8, -3.2); scene.add(rimWarm);

    /* ── materiály ── */
    var skinMat = new THREE.MeshPhysicalMaterial({ color: 0xf0d0a8, roughness: 0.62, clearcoat: 0.22, clearcoatRoughness: 0.7, sheen: 0.45, sheenColor: new THREE.Color(0xffdcc4) });
    var blushMat = new THREE.MeshPhysicalMaterial({ color: 0xe08a72, roughness: 0.7, transparent: true, opacity: 0 });
    var shirtMat = new THREE.MeshPhysicalMaterial({ color: 0x3b8cc4, roughness: 0.78 });
    var pantsMat = new THREE.MeshPhysicalMaterial({ color: 0x1b4965, roughness: 0.82 });
    var hairMat = new THREE.MeshPhysicalMaterial({ color: 0x3a2518, roughness: 0.5 });
    var shoeMat = new THREE.MeshPhysicalMaterial({ color: 0xf2f2f4, roughness: 0.5 });
    var eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f8, roughness: 0.35 });
    var irisMat = new THREE.MeshStandardMaterial({ color: 0x3c6076, roughness: 0.3 });
    var pupilMat = new THREE.MeshBasicMaterial({ color: 0x10161c });
    var browMat = new THREE.MeshStandardMaterial({ color: 0x3a2518, roughness: 0.7 });
    var mouthMat = new THREE.MeshStandardMaterial({ color: 0xa85c50, roughness: 0.55 });
    var coreMat = new THREE.MeshBasicMaterial({ color: 0x2ba87d, transparent: true, opacity: 0.95 });

    var root = new THREE.Group(); scene.add(root);
    var body = new THREE.Group(); root.add(body);

    function mesh(geo, mat, cast) { var m = new THREE.Mesh(geo, mat); if (cast !== false) m.castShadow = true; return m; }

    /* ── NOHY (stehno + lýtko + bota) ── */
    function makeLeg(side) {
      var g = new THREE.Group();
      g.position.set(side * 0.19, 1.02, 0);
      var thigh = mesh(new THREE.CapsuleGeometry(0.125, 0.40, 6, 18), pantsMat);
      thigh.position.y = -0.26; g.add(thigh);
      var knee = mesh(new THREE.SphereGeometry(0.115, 16, 12), pantsMat);
      knee.position.y = -0.52; g.add(knee);
      var shin = mesh(new THREE.CapsuleGeometry(0.098, 0.38, 6, 18), skinMat);
      shin.position.y = -0.76; g.add(shin);
      var shoe = mesh(new THREE.SphereGeometry(0.15, 18, 12), shoeMat);
      shoe.scale.set(1, 0.55, 1.7); shoe.position.set(0, -1.0, 0.07); g.add(shoe);
      g.userData = { thigh: thigh, shin: shin, knee: knee };
      return g;
    }
    var legL = makeLeg(-1), legR = makeLeg(1);
    body.add(legL); body.add(legR);

    /* ── TRUP ── */
    var upper = new THREE.Group(); upper.position.y = 1.02; body.add(upper);

    var hips = mesh(new THREE.CapsuleGeometry(0.235, 0.14, 6, 20), pantsMat);
    hips.position.y = 0.07; upper.add(hips);

    // hrudník: kužel (širší nahoře) = realističtější V-tvar
    var chest = mesh(new THREE.CylinderGeometry(0.30, 0.235, 0.52, 24, 1), shirtMat);
    chest.position.y = 0.46; upper.add(chest);
    var chestTop = mesh(new THREE.SphereGeometry(0.30, 22, 16), shirtMat);
    chestTop.scale.set(1, 0.62, 0.82); chestTop.position.y = 0.71; upper.add(chestTop);
    var belly = mesh(new THREE.SphereGeometry(0.24, 20, 16), shirtMat);
    belly.scale.set(1, 0.9, 0.85); belly.position.y = 0.24; upper.add(belly);

    // ramena
    var deltL = mesh(new THREE.SphereGeometry(0.135, 20, 16), shirtMat); deltL.position.set(-0.34, 0.74, 0); upper.add(deltL);
    var deltR = mesh(new THREE.SphereGeometry(0.135, 20, 16), shirtMat); deltR.position.set(0.34, 0.74, 0); upper.add(deltR);

    /* ── PAŽE (nadloktí + loket + předloktí + ruka) ── */
    function makeArm(side) {
      var g = new THREE.Group();
      g.position.set(side * 0.36, 0.74, 0);
      var up = mesh(new THREE.CapsuleGeometry(0.082, 0.28, 6, 16), shirtMat);
      up.position.y = -0.19; g.add(up);
      var elbow = mesh(new THREE.SphereGeometry(0.075, 14, 12), skinMat);
      elbow.position.y = -0.36; g.add(elbow);
      var fore = new THREE.Group(); fore.position.y = -0.36; g.add(fore);
      var lo = mesh(new THREE.CapsuleGeometry(0.07, 0.26, 6, 16), skinMat);
      lo.position.y = -0.17; fore.add(lo);
      var hand = mesh(new THREE.SphereGeometry(0.078, 16, 12), skinMat);
      hand.scale.set(0.85, 1.1, 0.6); hand.position.y = -0.35; fore.add(hand);
      g.userData = { up: up, lo: lo, fore: fore, hand: hand, elbow: elbow };
      return g;
    }
    var armL = makeArm(-1), armR = makeArm(1);
    upper.add(armL); upper.add(armR);

    /* ── KRK + HLAVA ── */
    var neck = mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.16, 16), skinMat);
    neck.position.y = 0.94; upper.add(neck);

    var headG = new THREE.Group(); headG.position.y = 1.13; upper.add(headG);
    var head = mesh(new THREE.SphereGeometry(0.235, 32, 24), skinMat);
    head.scale.set(0.93, 1.12, 0.98); headG.add(head);
    var jaw = mesh(new THREE.SphereGeometry(0.17, 20, 16), skinMat);
    jaw.scale.set(0.98, 0.72, 0.92); jaw.position.set(0, -0.11, 0.022); headG.add(jaw);

    // uši
    var earL = mesh(new THREE.SphereGeometry(0.045, 12, 10), skinMat); earL.scale.set(0.42, 1, 0.75); earL.position.set(-0.218, 0.01, 0); headG.add(earL);
    var earR = earL.clone(); earR.position.x = 0.218; headG.add(earR);

    // nos
    var nose = mesh(new THREE.ConeGeometry(0.042, 0.11, 12), skinMat);
    nose.rotation.x = Math.PI * 0.5; nose.position.set(0, -0.015, 0.215); headG.add(nose);
    var noseTip = mesh(new THREE.SphereGeometry(0.032, 12, 10), blushMat);
    noseTip.position.set(0, -0.035, 0.245); headG.add(noseTip);

    // oči
    function makeEye(side) {
      var g = new THREE.Group(); g.position.set(side * 0.085, 0.045, 0.185);
      var w = mesh(new THREE.SphereGeometry(0.042, 16, 14), eyeWhiteMat, false); w.scale.set(1, 0.72, 0.6); g.add(w);
      var iris = mesh(new THREE.SphereGeometry(0.021, 14, 12), irisMat, false); iris.position.z = 0.028; iris.scale.set(1, 1, 0.5); g.add(iris);
      var pup = mesh(new THREE.SphereGeometry(0.0095, 10, 8), pupilMat, false); pup.position.z = 0.041; g.add(pup);
      var lid = mesh(new THREE.SphereGeometry(0.045, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), skinMat, false);
      lid.scale.set(1, 0.8, 0.7); lid.position.y = 0.006; g.add(lid);
      var bag = mesh(new THREE.SphereGeometry(0.036, 12, 10), blushMat, false);
      bag.scale.set(1.05, 0.4, 0.4); bag.position.set(0, -0.042, 0.012); g.add(bag);
      g.userData = { lid: lid, bag: bag };
      return g;
    }
    var eyeL = makeEye(-1), eyeR = makeEye(1);
    headG.add(eyeL); headG.add(eyeR);

    // obočí
    var browL = mesh(new THREE.BoxGeometry(0.075, 0.014, 0.022), browMat, false);
    browL.position.set(-0.085, 0.105, 0.205); headG.add(browL);
    var browR = browL.clone(); browR.position.x = 0.085; headG.add(browR);

    // ústa
    var mouth = mesh(new THREE.TorusGeometry(0.048, 0.011, 8, 22, Math.PI), mouthMat, false);
    mouth.position.set(0, -0.10, 0.198); headG.add(mouth);

    // tváře (ruměnec / alkohol)
    var cheekL = mesh(new THREE.SphereGeometry(0.055, 12, 10), blushMat, false);
    cheekL.scale.set(1, 0.7, 0.35); cheekL.position.set(-0.115, -0.035, 0.175); headG.add(cheekL);
    var cheekR = cheekL.clone(); cheekR.position.x = 0.115; headG.add(cheekR);

    // vlasy
    var hairCap = mesh(new THREE.SphereGeometry(0.243, 30, 22, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
    hairCap.scale.set(0.96, 1.1, 1.0); hairCap.position.y = 0.012; headG.add(hairCap);
    var hairLong = mesh(new THREE.CapsuleGeometry(0.17, 0.22, 6, 18), hairMat);
    hairLong.scale.set(1, 1, 0.62); hairLong.position.set(0, -0.13, -0.075); headG.add(hairLong);

    /* ── JÁDRO VITALITY ── */
    var core = mesh(new THREE.IcosahedronGeometry(0.075, 1), coreMat, false);
    core.position.set(0, 0.60, 0.29); upper.add(core);
    var coreLight = new THREE.PointLight(0x2ba87d, 1.1, 2.4);
    coreLight.position.copy(core.position); upper.add(coreLight);

    /* ── CIGARETA (v pravé ruce) ── */
    var cigG = new THREE.Group();
    cigG.position.set(0, -0.36, 0.05); cigG.rotation.set(0.35, 0, 0.3);
    var cigBody = mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.13, 10), new THREE.MeshStandardMaterial({ color: 0xf6f2e8, roughness: 0.8 }), false);
    cigBody.rotation.z = Math.PI * 0.5; cigG.add(cigBody);
    var cigFilter = mesh(new THREE.CylinderGeometry(0.0115, 0.0115, 0.035, 10), new THREE.MeshStandardMaterial({ color: 0xc79a4e, roughness: 0.9 }), false);
    cigFilter.rotation.z = Math.PI * 0.5; cigFilter.position.x = -0.078; cigG.add(cigFilter);
    var cigEmber = mesh(new THREE.SphereGeometry(0.013, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff6a1e }), false);
    cigEmber.position.x = 0.068; cigG.add(cigEmber);
    var emberLight = new THREE.PointLight(0xff6a1e, 0, 0.5); emberLight.position.x = 0.068; cigG.add(emberLight);
    armR.userData.fore.add(cigG);

    // kouř — v prostoru scény, poloha se dopočítává z konce cigarety
    var SMOKE_N = 26;
    var smokeGeo = new THREE.BufferGeometry();
    var smokePos = new Float32Array(SMOKE_N * 3);
    var smokeSeed = new Float32Array(SMOKE_N);
    for (var si = 0; si < SMOKE_N; si++) { smokeSeed[si] = Math.random(); smokePos[si * 3 + 1] = Math.random() * 0.6; }
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
    var smokeMat = new THREE.PointsMaterial({ color: 0xbfc4c9, size: 0.05, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true });
    var smoke = new THREE.Points(smokeGeo, smokeMat);
    root.add(smoke);

    /* ── SKLENICE PIVA (v levé ruce) ── */
    var drinkG = new THREE.Group();
    drinkG.position.set(0.01, -0.40, 0.06); drinkG.rotation.z = -0.12;
    var glass = mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.14, 16, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xdfeaf2, roughness: 0.12, transmission: 0.85, transparent: true, opacity: 0.55, thickness: 0.2 }), false);
    drinkG.add(glass);
    var beer = mesh(new THREE.CylinderGeometry(0.043, 0.034, 0.10, 16), new THREE.MeshStandardMaterial({ color: 0xd98d18, roughness: 0.35 }), false);
    beer.position.y = -0.016; drinkG.add(beer);
    var foam = mesh(new THREE.CylinderGeometry(0.045, 0.043, 0.028, 16), new THREE.MeshStandardMaterial({ color: 0xfaf3e2, roughness: 0.85 }), false);
    foam.position.y = 0.05; drinkG.add(foam);
    armL.userData.fore.add(drinkG);

    /* ── AURA (zdraví) + JISKŘIČKY (doplňky) ── */
    function makePoints(n, color, size) {
      var g = new THREE.BufferGeometry();
      var p = new Float32Array(n * 3), sd = new Float32Array(n * 2);
      for (var i = 0; i < n; i++) { sd[i * 2] = Math.random() * Math.PI * 2; sd[i * 2 + 1] = 0.35 + Math.random() * 2.0; }
      g.setAttribute("position", new THREE.BufferAttribute(p, 3));
      var m = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      var pts = new THREE.Points(g, m); pts.userData = { seed: sd, n: n };
      root.add(pts); return pts;
    }
    var aura = makePoints(200, 0x2ba87d, 0.033);
    var sparks = makePoints(60, 0xffd98a, 0.026);

    /* ── ZEM ── */
    var ground = new THREE.Mesh(new THREE.CircleGeometry(2.3, 48), new THREE.ShadowMaterial({ opacity: 0.17 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x3b8cc4, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.09, 64), ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.004; scene.add(ring);

    /* ── otáčení tahem ── */
    var dragging = false, lastX = 0, vel = 0, yaw = 0, idle = 0;
    function down(e) { dragging = true; lastX = e.touches ? e.touches[0].clientX : e.clientX; }
    function move(e) { if (!dragging) return; var x = e.touches ? e.touches[0].clientX : e.clientX; vel = (x - lastX) * 0.008; yaw += vel; lastX = x; idle = 0; }
    function up() { dragging = false; }
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);

    /* ── plynule dojížděný stav ── */
    var cur = {
      fat: 1, muscle: 0.5, slump: 0, health: 0.5, vit: 0.5, cold: 0, sauna: 0,
      smoke: 0, alcohol: 0, supp: 0, sleepy: 0, mouth: 0.2, fem: 0,
      skin: new THREE.Color(0xf0d0a8), core: new THREE.Color(0x2ba87d), hair: new THREE.Color(0x3a2518),
    };
    var hairDark = new THREE.Color(0x3a2518), hairGrayC = new THREE.Color(0xbcc3ca), tmp = new THREE.Color();
    var tipWorld = new THREE.Vector3();

    var raf, t0 = performance.now();
    function animate(now) {
      raf = requestAnimationFrame(animate);
      var t = (now - t0) / 1000;
      var p = paramsRef.current, k = 0.075;

      cur.fat += (p.fat - cur.fat) * k;
      cur.muscle += (p.muscle - cur.muscle) * k;
      cur.slump += (p.slump - cur.slump) * k;
      cur.health += (p.health - cur.health) * k;
      cur.vit += (p.vit - cur.vit) * k;
      cur.cold += (p.cold - cur.cold) * k;
      cur.sauna += (p.sauna - cur.sauna) * k;
      cur.smoke += (p.smoke - cur.smoke) * k;
      cur.alcohol += (p.alcohol - cur.alcohol) * k;
      cur.supp += (p.supp - cur.supp) * k;
      cur.sleepy += (p.sleepy - cur.sleepy) * k;
      cur.fem += ((p.female ? 1 : 0) - cur.fem) * k;
      cur.skin.lerp(p.skin, k);
      cur.core.lerp(p.core, k);
      tmp.copy(hairDark).lerp(hairGrayC, p.hairGray); cur.hair.lerp(tmp, k);
      var mouthTarget = p.happy * 1.0 - p.sad * 0.85 + 0.12;
      cur.mouth += (mouthTarget - cur.mouth) * k;

      /* dýchání + opilecké houpání */
      var breath = 1 + Math.sin(t * (p.sleepy > 0.5 ? 1.15 : 1.85)) * 0.017;
      var sway = cur.alcohol * Math.sin(t * 1.25) * 0.055;

      /* trup: šířka ramen roste svaly, pas/břicho tukem */
      var shoulderW = 0.30 + cur.muscle * 0.085 - cur.fem * 0.022;
      var waistW = 0.235 + (cur.fat - 0.82) * 0.42 + cur.fem * 0.012;
      chest.scale.set((shoulderW / 0.30) * breath, 1, (0.80 + cur.fat * 0.22) * breath);
      chestTop.scale.set((shoulderW / 0.30), 0.62, 0.82);
      belly.scale.set((waistW / 0.235) * 1.0, 0.9 + (cur.fat - 0.82) * 0.5, (0.80 + cur.fat * 0.3));
      belly.position.y = 0.24 - (cur.fat - 0.82) * 0.05;
      hips.scale.set(0.95 + (cur.fat - 0.82) * 0.5 + cur.fem * 0.12, 1, 0.9 + (cur.fat - 0.82) * 0.4);

      var dx = 0.30 + cur.muscle * 0.075;
      deltL.position.x = -dx; deltR.position.x = dx;
      var ds = 0.85 + cur.muscle * 0.5;
      deltL.scale.setScalar(ds); deltR.scale.setScalar(ds);

      /* paže */
      var ax = dx + 0.025;
      armL.position.x = -ax; armR.position.x = ax;
      var at = 0.85 + cur.muscle * 0.42;
      armL.userData.up.scale.set(at, 1, at); armR.userData.up.scale.set(at, 1, at);
      armL.userData.lo.scale.set(at * 0.95, 1, at * 0.95); armR.userData.lo.scale.set(at * 0.95, 1, at * 0.95);

      /* nohy */
      var lt = 0.9 + cur.muscle * 0.28 + (cur.fat - 0.82) * 0.45;
      [legL, legR].forEach(function (lg) { lg.userData.thigh.scale.set(lt, 1, lt); lg.userData.shin.scale.set(lt * 0.92, 1, lt * 0.92); });

      /* držení těla */
      upper.rotation.x = cur.slump + Math.sin(t * 0.85) * 0.01;
      upper.rotation.z = sway * 0.35;
      body.rotation.z = sway * 0.25;
      body.position.y = Math.sin(t * 1.85) * 0.011;
      headG.rotation.x = -cur.slump * 0.55 + cur.sleepy * 0.16;
      headG.rotation.z = Math.sin(t * 0.55) * 0.02 + sway * 0.4;

      /* ruce: klidová poloha, opilec drží sklenici výš */
      var baseArm = 0.10 + cur.muscle * 0.30;
      armL.rotation.z = baseArm + Math.sin(t * 1.8) * 0.015;
      armR.rotation.z = -(baseArm + Math.sin(t * 1.8 + 1) * 0.015);
      // kuřák si nese ruku s cigaretou mírně dopředu
      armR.rotation.x = -cur.smoke * 0.30;
      armR.userData.fore.rotation.x = -cur.smoke * 0.55;
      // sklenice: předloktí pokrčené nahoru
      armL.rotation.x = -cur.alcohol * 0.22;
      armL.userData.fore.rotation.x = -(p.heavyDrink ? 0.75 : 0) * clamp(cur.alcohol * 1.6, 0, 1);

      /* obličej */
      var blink = (Math.sin(t * 2.7) > 0.975) ? 0.15 : 1;
      var openness = clamp(1 - cur.sleepy * 0.65, 0.25, 1) * blink;
      [eyeL, eyeR].forEach(function (e) {
        e.userData.lid.position.y = 0.006 + (1 - openness) * 0.032;
        e.userData.lid.scale.y = 0.8 + (1 - openness) * 0.55;
        e.userData.bag.material.opacity = cur.sleepy * 0.30;
      });
      // obočí: smutek nahoru vnitřně, radost uvolněné
      browL.rotation.z = -0.06 - p.sad * 0.22 + p.happy * 0.05;
      browR.rotation.z = 0.06 + p.sad * 0.22 - p.happy * 0.05;
      browL.position.y = browR.position.y = 0.105 - cur.sleepy * 0.012;
      browL.material.color.copy(cur.hair);

      var mo = cur.mouth;
      mouth.scale.set(1 + Math.abs(mo) * 0.25, Math.max(Math.abs(mo), 0.12), 1);
      mouth.rotation.x = mo >= 0 ? Math.PI : 0;

      /* materiály */
      skinMat.color.copy(cur.skin);
      hairMat.color.copy(cur.hair);
      hairLong.visible = cur.fem > 0.5;
      hairCap.scale.set(0.96, 1.1 + cur.fem * 0.03, 1.0);
      // ruměnec: sauna + alkohol + zdraví
      var blushAmt = clamp(cur.alcohol * 0.65 + cur.sauna * 0.22 + Math.max(cur.health - 0.6, 0) * 0.3, 0, 0.85);
      blushMat.opacity = blushAmt;
      blushMat.color.setRGB(0.86, 0.42 - cur.alcohol * 0.12, 0.36 - cur.alcohol * 0.1);
      // tričko: barevnější se zdravím, žena jiný odstín
      tmp.setHSL(0.55 - cur.fem * 0.42, 0.25 + cur.health * 0.45, 0.36 + cur.health * 0.16);
      shirtMat.color.copy(tmp);

      /* jádro vitality */
      coreMat.color.copy(cur.core); coreLight.color.copy(cur.core);
      var pulse = 1 + Math.sin(t * (1.1 + cur.vit * 1.7)) * 0.17;
      core.scale.setScalar(pulse * (0.8 + cur.vit * 0.45));
      core.rotation.y = t * 0.8; core.rotation.x = t * 0.5;
      coreLight.intensity = 0.35 + cur.vit * 1.35;

      /* prostředí */
      rimCold.intensity = cur.cold * 1.7;
      rimWarm.intensity = cur.sauna * 1.25;
      ringMat.opacity = 0.07 + cur.vit * 0.15;
      ring.scale.setScalar(1 + Math.sin(t * 1.15) * 0.018);

      /* CIGARETA */
      var cigOn = cur.smoke > 0.75; // pouze aktivní kuřák
      cigG.visible = cigOn;
      emberLight.intensity = cigOn ? 0.55 + Math.sin(t * 3) * 0.25 : 0;
      cigEmber.material.color.setRGB(1, 0.35 + Math.sin(t * 3) * 0.12, 0.1);
      smokeMat.opacity = cigOn ? 0.34 : 0;
      if (cigOn) {
        cigEmber.getWorldPosition(tipWorld);
        smoke.position.copy(root.worldToLocal(tipWorld.clone()));
        var sarr = smokeGeo.attributes.position.array;
        for (var i = 0; i < SMOKE_N; i++) {
          var life = (t * 0.28 + smokeSeed[i]) % 1;
          sarr[i * 3] = Math.sin(t * 0.8 + i) * 0.05 * life;
          sarr[i * 3 + 1] = life * 0.62;
          sarr[i * 3 + 2] = Math.cos(t * 0.7 + i * 1.3) * 0.04 * life;
        }
        smokeGeo.attributes.position.needsUpdate = true;
        smokeMat.size = 0.045 + 0.03;
      }

      /* SKLENICE */
      drinkG.visible = p.heavyDrink && cur.alcohol > 0.4;

      /* aura + jiskřičky */
      function updatePts(pts, opacity, radius, speed, yOff) {
        pts.material.opacity = opacity;
        if (opacity <= 0.01) return;
        var arr = pts.geometry.attributes.position.array, sd = pts.userData.seed, n = pts.userData.n;
        for (var i = 0; i < n; i++) {
          var a = sd[i * 2] + t * speed * (0.5 + (i % 5) * 0.12);
          var y = sd[i * 2 + 1];
          var r = radius + Math.sin(y * 2.3 + t * 0.7) * 0.09;
          arr[i * 3] = Math.cos(a) * r;
          arr[i * 3 + 1] = y + Math.sin(t * 0.8 + i) * 0.04 + yOff;
          arr[i * 3 + 2] = Math.sin(a) * r;
        }
        pts.geometry.attributes.position.needsUpdate = true;
      }
      updatePts(aura, Math.max(cur.health - 0.45, 0) * 1.35, 0.66, 0.28, 0);
      aura.material.color.copy(cur.core);
      updatePts(sparks, Math.max(cur.supp - 0.25, 0) * 0.85, 0.48, 0.55, 0.25);

      /* rotace */
      if (!dragging) { vel *= 0.94; yaw += vel; idle += 1 / 60; }
      if (idle > 2 && !dragging) yaw += 0.0035;
      root.rotation.y += (yaw - root.rotation.y) * 0.12;

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    var ro = new ResizeObserver(function () {
      var w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
    ro.observe(mount);

    return function () {
      cancelAnimationFrame(raf); ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("touchstart", down);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) { if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); }); else o.material.dispose(); }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  var p = paramsRef.current;
  var badges = [];
  if (inputs.smokingStatus === 2) badges.push(["🚬", "kuřák"]);
  else if (inputs.smokingStatus === 1) badges.push(["🚭", "bývalý kuřák"]);
  if (inputs.alcoholScore >= 8) badges.push(["🍺", "hodně alkoholu"]);
  if (inputs.sleepScore < 4) badges.push(["😴", "nevyspalý"]);
  if (inputs.exerciseDays * inputs.exerciseIntensity / 10 >= 3.5) badges.push(["💪", "vytrénovaný"]);
  if (inputs.supplementScore >= 7) badges.push(["✨", "doplňky"]);

  return (
    <div>
      <div ref={mountRef} style={{ width: "100%", height: height || 380, touchAction: "pan-y" }} />
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
