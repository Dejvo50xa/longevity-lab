import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 3D — procedural Three.js human that reacts to every slider.
   Drop-in replacement for the SVG HabitCharacter.
   Props: inputs (calculator state), gained (years vs baseline)
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };

function deriveParams(inputs, gained) {
  var ex = (inputs.exerciseDays * inputs.exerciseIntensity) / 10;
  var muscle = clamp(ex / 5, 0, 1);
  var fat = clamp(1.18 - (inputs.dietScore / 10) * 0.28, 0.8, 1.18); // 0.8 lean → 1.18 heavy
  var health = (inputs.dietScore + inputs.sleepScore + inputs.socialScore + Math.min(inputs.exerciseDays, 5) * 2) / 40;
  var smoking = inputs.smokingStatus === 2 ? 1 : inputs.smokingStatus === 1 ? 0.5 : 0;
  var sleepy = inputs.sleepScore < 4;
  var sad = inputs.socialScore < 3;
  var happy = inputs.socialScore > 5 && health > 0.5;
  var bioAge = clamp(inputs.age - gained * 0.45, 18, 100);

  // skin: healthy warm → smoker sallow; cold exposure shifts cool
  var sr = smoking === 1 ? 200 : smoking === 0.5 ? 218 : Math.round(240 + health * 15);
  var sg = smoking === 1 ? 170 : smoking === 0.5 ? 190 : Math.round(200 + health * 30);
  var sb = smoking === 1 ? 140 : smoking === 0.5 ? 158 : Math.round(165 + health * 20);
  if (inputs.coldExposure > 5) { sr *= 0.93; sg *= 0.96; sb *= 1.05; }

  // vitality core: aurora green (younger bio-age) → amber → ember red
  var vit = clamp(0.5 + gained / 30, 0, 1); // 0 bad → 1 great
  var core = new THREE.Color().setHSL(0.05 + vit * 0.38, 0.85, 0.55);

  return {
    muscle: muscle, fat: fat, health: health, smoking: smoking,
    sleepy: sleepy, sad: sad, happy: happy, bioAge: bioAge, vit: vit,
    skin: new THREE.Color(clamp(sr / 255, 0, 1), clamp(sg / 255, 0, 1), clamp(sb / 255, 0, 1)),
    core: core,
    hairGray: clamp((inputs.age - 38) / 30, 0, 1),
    cold: inputs.coldExposure / 10,
    sauna: Math.min(inputs.saunaSessions / 5, 1),
    slump: (sad ? 0.12 : 0) + (sleepy ? 0.1 : 0) - (muscle > 0.6 ? 0.05 : 0),
  };
}

function capsule(r, len, mat) {
  var m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 24), mat);
  m.castShadow = true;
  return m;
}

export default function Avatar3D({ inputs, gained, height }) {
  var mountRef = useRef(null);
  var paramsRef = useRef(deriveParams(inputs, gained || 0));
  paramsRef.current = deriveParams(inputs, gained || 0);

  useEffect(function () {
    var mount = mountRef.current;
    if (!mount) return;
    var W = mount.clientWidth, H = mount.clientHeight;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 50);
    camera.position.set(0, 2.0, 7.2);
    camera.lookAt(0, 1.65, 0);

    /* ── lights ── */
    scene.add(new THREE.HemisphereLight(0xeaf4fb, 0xb9cfdd, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.top = 4; key.shadow.camera.bottom = -1;
    key.shadow.camera.left = -3; key.shadow.camera.right = 3;
    scene.add(key);
    var rimCool = new THREE.DirectionalLight(0x6fb7ff, 0);
    rimCool.position.set(-4, 2.5, -3);
    scene.add(rimCool);
    var rimWarm = new THREE.DirectionalLight(0xffa44d, 0);
    rimWarm.position.set(4, 1.5, -3);
    scene.add(rimWarm);

    /* ── materials ── */
    var skinMat = new THREE.MeshPhysicalMaterial({ color: 0xf0d2a8, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color(0xffe8d0) });
    var shirtMat = new THREE.MeshPhysicalMaterial({ color: 0x3b8cc4, roughness: 0.7 });
    var pantsMat = new THREE.MeshPhysicalMaterial({ color: 0x1b4965, roughness: 0.75 });
    var hairMat = new THREE.MeshPhysicalMaterial({ color: 0x3a2518, roughness: 0.45 });
    var coreMat = new THREE.MeshBasicMaterial({ color: 0x2ba87d, transparent: true, opacity: 0.95 });

    var root = new THREE.Group();
    scene.add(root);
    var body = new THREE.Group();
    root.add(body);

    /* ── legs ── */
    var legL = capsule(0.13, 0.62, pantsMat); legL.position.set(-0.22, 0.55, 0); body.add(legL);
    var legR = legL.clone(); legR.position.x = 0.22; body.add(legR);
    var shoeGeo = new THREE.SphereGeometry(0.16, 20, 14);
    var shoeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.4 });
    var shoeL = new THREE.Mesh(shoeGeo, shoeMat); shoeL.scale.set(1, 0.6, 1.5); shoeL.position.set(-0.22, 0.09, 0.05); shoeL.castShadow = true; body.add(shoeL);
    var shoeR = shoeL.clone(); shoeR.position.x = 0.22; body.add(shoeR);

    /* ── upper body group (slumps as a unit) ── */
    var upper = new THREE.Group();
    upper.position.y = 1.02;
    body.add(upper);

    var hips = capsule(0.3, 0.18, pantsMat); hips.position.y = 0.06; upper.add(hips);
    var torso = capsule(0.34, 0.6, shirtMat); torso.position.y = 0.62; upper.add(torso);

    var deltGeo = new THREE.SphereGeometry(0.15, 20, 16);
    var deltL = new THREE.Mesh(deltGeo, shirtMat); deltL.position.set(-0.42, 0.95, 0); deltL.castShadow = true; upper.add(deltL);
    var deltR = deltL.clone(); deltR.position.x = 0.42; upper.add(deltR);

    var armL = new THREE.Group(); armL.position.set(-0.45, 0.95, 0); upper.add(armL);
    var armLu = capsule(0.085, 0.34, shirtMat); armLu.position.y = -0.24; armL.add(armLu);
    var armLl = capsule(0.075, 0.3, skinMat); armLl.position.y = -0.62; armL.add(armLl);
    var handL = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), skinMat); handL.position.y = -0.84; handL.castShadow = true; armL.add(handL);
    var armR = armL.clone(); armR.position.x = 0.45; upper.add(armR);

    /* ── head ── */
    var headG = new THREE.Group(); headG.position.y = 1.42; upper.add(headG);
    var neck = capsule(0.09, 0.1, skinMat); neck.position.y = -0.12; headG.add(neck);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 24), skinMat);
    head.scale.set(0.92, 1.08, 0.95); head.position.y = 0.16; head.castShadow = true; headG.add(head);
    var hair = new THREE.Mesh(new THREE.SphereGeometry(0.265, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
    hair.scale.set(0.95, 1.05, 0.97); hair.position.y = 0.2; headG.add(hair);
    var eyeGeo = new THREE.SphereGeometry(0.028, 12, 10);
    var eyeMat = new THREE.MeshBasicMaterial({ color: 0x16324a });
    var eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.085, 0.18, 0.225); headG.add(eyeL);
    var eyeR = eyeL.clone(); eyeR.position.x = 0.085; headG.add(eyeR);
    var mouth = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0xb06550 }));
    mouth.position.set(0, 0.07, 0.225); mouth.rotation.x = Math.PI; headG.add(mouth);

    /* ── vitality core ── */
    var core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.085, 1), coreMat);
    core.position.set(0, 0.85, 0.31); upper.add(core);
    var coreLight = new THREE.PointLight(0x2ba87d, 1.2, 2.5);
    coreLight.position.copy(core.position); upper.add(coreLight);

    /* ── aura particles ── */
    var N = 240;
    var pGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(N * 3), seed = new Float32Array(N * 2);
    for (var i = 0; i < N; i++) {
      seed[i * 2] = Math.random() * Math.PI * 2;
      seed[i * 2 + 1] = 0.4 + Math.random() * 2.1;
      pos[i * 3] = 0; pos[i * 3 + 1] = seed[i * 2 + 1]; pos[i * 3 + 2] = 0;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var pMat = new THREE.PointsMaterial({ color: 0x2ba87d, size: 0.035, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    var aura = new THREE.Points(pGeo, pMat);
    root.add(aura);

    /* ── ground ── */
    var ground = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x3b8cc4, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(new THREE.RingGeometry(1.06, 1.1, 64), ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.004; scene.add(ring);

    /* ── drag-to-rotate + auto-spin ── */
    var dragging = false, lastX = 0, velocity = 0, userYaw = 0, idleT = 0;
    function down(e) { dragging = true; lastX = (e.touches ? e.touches[0].clientX : e.clientX); }
    function move(e) {
      if (!dragging) return;
      var x = (e.touches ? e.touches[0].clientX : e.clientX);
      velocity = (x - lastX) * 0.008; userYaw += velocity; lastX = x; idleT = 0;
    }
    function up() { dragging = false; }
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);

    /* ── live-lerped state ── */
    var cur = {
      fat: 1, muscle: 0.5, slump: 0, health: 0.5, vit: 0.5,
      skin: new THREE.Color(0xf0d2a8), core: new THREE.Color(0x2ba87d),
      hair: new THREE.Color(0x3a2518), cold: 0, sauna: 0, mouthY: 1,
    };
    var hairDark = new THREE.Color(0x3a2518), hairGrayC = new THREE.Color(0xb6bec6);
    var tmp = new THREE.Color();

    var raf, t0 = performance.now();
    function animate(now) {
      raf = requestAnimationFrame(animate);
      var t = (now - t0) / 1000;
      var p = paramsRef.current;
      var k = 0.07; // lerp factor

      cur.fat += (p.fat - cur.fat) * k;
      cur.muscle += (p.muscle - cur.muscle) * k;
      cur.slump += (p.slump - cur.slump) * k;
      cur.health += (p.health - cur.health) * k;
      cur.vit += (p.vit - cur.vit) * k;
      cur.cold += (p.cold - cur.cold) * k;
      cur.sauna += (p.sauna - cur.sauna) * k;
      cur.skin.lerp(p.skin, k);
      cur.core.lerp(p.core, k);
      tmp.copy(hairDark).lerp(hairGrayC, p.hairGray);
      cur.hair.lerp(tmp, k);
      var targetMouth = p.happy ? 1 : p.sad ? -0.7 : 0.25;
      cur.mouthY += (targetMouth - cur.mouthY) * k;

      /* body morphing */
      var breathe = 1 + Math.sin(t * (p.sleepy ? 1.1 : 1.9)) * 0.018;
      var shoulders = 1 + cur.muscle * 0.55;
      torso.scale.set((0.78 + cur.fat * 0.35) * breathe, 1, (0.62 + cur.fat * 0.42) * breathe);
      hips.scale.set(0.7 + cur.fat * 0.38, 1, 0.62 + cur.fat * 0.4);
      deltL.position.x = -0.3 - shoulders * 0.13; deltR.position.x = -deltL.position.x;
      var ds = 0.75 + cur.muscle * 0.55;
      deltL.scale.set(ds, ds, ds); deltR.scale.set(ds, ds, ds);
      armL.position.x = deltL.position.x - 0.03; armR.position.x = -armL.position.x;
      var at = 0.8 + cur.muscle * 0.5;
      armL.scale.set(at, 1, at); armR.scale.set(at, 1, at);
      var armFlex = cur.muscle * 0.35;
      armL.rotation.z = 0.1 + armFlex + Math.sin(t * 1.9) * 0.02;
      armR.rotation.z = -armL.rotation.z;
      var lt = 0.85 + cur.muscle * 0.25 + (cur.fat - 0.8) * 0.55;
      legL.scale.set(lt, 1, lt); legR.scale.set(lt, 1, lt);
      neck.scale.set(0.85 + cur.fat * 0.3, 1, 0.85 + cur.fat * 0.3);

      /* posture & idle motion */
      upper.rotation.x = cur.slump + Math.sin(t * 0.9) * 0.012;
      headG.rotation.x = p.sleepy ? 0.22 : -cur.slump * 0.6;
      headG.rotation.z = Math.sin(t * 0.6) * 0.025;
      body.position.y = Math.sin(t * 1.9) * 0.012;

      /* eyes blink / sleepy droop */
      var blink = Math.sin(t * 2.3) > 0.985 || p.sleepy ? 0.25 : 1;
      eyeL.scale.y = blink; eyeR.scale.y = blink;
      mouth.scale.y = Math.abs(cur.mouthY);
      mouth.rotation.x = cur.mouthY >= 0 ? Math.PI : 0;

      /* materials */
      skinMat.color.copy(cur.skin);
      hairMat.color.copy(cur.hair);
      tmp.setHSL(0.55, 0.25 + cur.health * 0.45, 0.38 + cur.health * 0.18);
      shirtMat.color.copy(tmp);
      coreMat.color.copy(cur.core);
      coreLight.color.copy(cur.core);
      var pulse = 1 + Math.sin(t * (1.2 + cur.vit * 1.6)) * 0.18;
      core.scale.setScalar(pulse * (0.8 + cur.vit * 0.5));
      core.rotation.y = t * 0.8; core.rotation.x = t * 0.5;
      coreLight.intensity = 0.5 + cur.vit * 1.4;

      /* environment accents */
      rimCool.intensity = cur.cold * 1.6;
      rimWarm.intensity = cur.sauna * 1.1;
      pMat.color.copy(cur.core);
      pMat.opacity = Math.max(cur.health - 0.45, 0) * 1.4;
      ringMat.opacity = 0.08 + cur.vit * 0.16;
      ring.scale.setScalar(1 + Math.sin(t * 1.2) * 0.02);

      /* aura swirl */
      var arr = pGeo.attributes.position.array;
      for (var i = 0; i < N; i++) {
        var a = seed[i * 2] + t * (0.25 + (i % 5) * 0.06);
        var y = seed[i * 2 + 1];
        var r = 0.62 + Math.sin(y * 2.4 + t * 0.7) * 0.1 + (1 - Math.abs(y - 1.25) / 1.4) * 0.25;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 1] = y + Math.sin(t * 0.8 + i) * 0.04;
        arr[i * 3 + 2] = Math.sin(a) * r;
      }
      pGeo.attributes.position.needsUpdate = true;

      /* rotation: user drag + gentle auto-spin after idle */
      if (!dragging) { velocity *= 0.94; userYaw += velocity; idleT += 1 / 60; }
      var auto = idleT > 2 ? (idleT - 2) * 0.0018 : 0;
      root.rotation.y += ((userYaw + auto * 60 * 0.06) - root.rotation.y) * 0.12;
      if (idleT > 2 && !dragging) userYaw += 0.0035;

      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    var ro = new ResizeObserver(function () {
      var w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return function () {
      cancelAnimationFrame(raf);
      ro.disconnect();
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
  return (
    <div>
      <div ref={mountRef} style={{ width: "100%", height: height || 360, touchAction: "pan-y" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 2 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#8EAABB", fontFamily: "'JetBrains Mono',monospace" }}>CHRONOLOGICAL</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, color: "#1A3A52" }}>{inputs.age}</div>
        </div>
        <div style={{ width: 1, background: "rgba(140,170,200,0.25)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#8EAABB", fontFamily: "'JetBrains Mono',monospace" }}>BIOLOGICAL</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, color: p.bioAge <= inputs.age ? "#2BA87D" : "#D95843" }}>{Math.round(p.bioAge)}</div>
        </div>
      </div>
    </div>
  );
}
