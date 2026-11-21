import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";
import { targetParams } from "./avatar-params.js";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 3D — realistic MakeHuman person (built by blender/build_avatar.py)
   One GLB per sex and clothing style (sport / lawyer / gangster). Each has
   one skinned mesh per part with the same morph targets, a skeleton, props
   in the hands and two arm animations:
     morphs  muscle / soft ← exercise      heavy / thin ← diet (+ heavy drinking)
             old ← biological age           smile / sad / tired ← social, sleep
     smoke   right hand from hold (t=0) to the lips (t=1)
     drink   left hand from hold (t=0) to a sip (t=1)
   The web plays the animations by setting their time, so the smoking cycle
   (raise, inhale with a glowing tip, lower, exhale) is driven from here.
   Loaded lazily; App falls back to the 2D avatar if anything fails.
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
var smooth = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
var MODELS = {};  // "sex-style" -> Promise<gltf>, shared between mounts
var STYLES = ["sport", "lawyer", "gangster"];
var SMOKES = { sport: "vape", lawyer: "cigarette", gangster: "cigar" };
var DRINKS = { sport: "beer", lawyer: "wine", gangster: "whisky" };
var SMOKE_PROPS = ["cigarette", "cigar", "vape"], DRINK_PROPS = ["beer", "wine", "whisky", "shot"];
// bones the two animations may move (names as three.js sanitises them: "wrist.R" -> "wristR")
var ARM = ["clavicle", "shoulder01", "upperarm01", "upperarm02", "lowerarm01", "lowerarm02", "wrist",
  "metacarpal1", "metacarpal2", "metacarpal3", "metacarpal4"];
for (var f = 1; f <= 5; f++) for (var k = 1; k <= 3; k++) ARM.push("finger" + f + "-" + k);
var CYCLE = 8;  // seconds per smoking cycle; the sip comes half a cycle later

function loadModel(sex, style) {
  var key = sex + "-" + style;
  if (!MODELS[key]) {
    var draco = new DRACOLoader();  // three bundles its own decoder (found via import.meta.url)
    var loader = new GLTFLoader().setDRACOLoader(draco);
    MODELS[key] = loader.loadAsync("/models/avatar-" + key + ".glb");
    MODELS[key].catch(function () { delete MODELS[key]; });
  }
  return MODELS[key];
}

/* calculator inputs -> morph weights and looks */
function looks(inputs, gained, style) {
  var p = targetParams(inputs, gained || 0);
  var R0 = 252, G0 = 226, B0 = 186;  // skin colour of the healthiest setting in avatar-params = texture as is
  var drink = inputs.alcoholScore >= 10 ? "shot" : DRINKS[style];
  var props = {};
  SMOKE_PROPS.concat(DRINK_PROPS).forEach(function (n) { props[n] = 0; });
  if (p.smoke >= 1) props[SMOKES[style]] = 1;
  if (p.heavy) props[drink] = 1;
  return {
    morph: {
      // MakeHuman's "muscle 1.0" is subtle at this size, so the key is pushed a bit past it (checked visually)
      muscle: clamp((p.muscle - 0.4) / 0.6, 0, 1) * 1.6,
      soft: clamp((0.3 - p.muscle) / 0.3, 0, 1) * 0.7,
      heavy: clamp((p.fat - 1) / 0.16, 0, 1) * 1.2 + p.heavy * 0.2,
      thin: clamp((1 - p.fat) / 0.18, 0, 1) * 0.8,
      old: clamp((p.bioAge - 27) / 53, 0, 1),
      smile: p.happy,
      sad: p.sad,
      tired: p.sleepy * 0.9,
    },
    skin: [clamp(p.sr / R0, 0.6, 1.08), clamp(p.sg / G0, 0.6, 1.08), clamp(p.sb / B0, 0.6, 1.08)],
    gray: p.hairGray,
    props: props,
    smoke: p.smoke >= 1 ? 1 : 0,   // right arm in the smoking animation
    drink: p.heavy,                 // left arm holding a drink
    steam: p.sauna > 0.55 ? 1 : 0,
  };
}

function puffTexture() {
  var c = document.createElement("canvas");
  c.width = c.height = 64;
  var x = c.getContext("2d");
  var gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,0.9)");
  gr.addColorStop(0.5, "rgba(255,255,255,0.35)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* a small pool of soft sprites for smoke and steam; particles live in world space */
function makeParticles(count, tex) {
  var group = new THREE.Group();
  var list = [];
  for (var i = 0; i < count; i++) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
    s.visible = false;
    group.add(s);
    list.push({ sprite: s, age: 1, life: 1, vel: new THREE.Vector3(), size0: 0.02, size1: 0.1, alpha: 0.3, spin: 0 });
  }
  var next = 0;
  return {
    group: group,
    emit: function (pos, vel, life, size0, size1, alpha, color) {
      var p = list[next];
      next = (next + 1) % list.length;
      p.sprite.position.copy(pos);
      p.vel.copy(vel);
      p.age = 0; p.life = life; p.size0 = size0; p.size1 = size1; p.alpha = alpha;
      p.spin = (Math.random() - 0.5) * 0.6;
      p.sprite.material.color.set(color);
      p.sprite.visible = true;
    },
    update: function (dt, t) {
      var alive = false;
      list.forEach(function (p, i) {
        if (p.age >= p.life) { p.sprite.visible = false; return; }
        alive = true;
        p.age += dt;
        var u = p.age / p.life;
        p.vel.multiplyScalar(Math.exp(-dt * 1.6));             // the puff slows down...
        p.vel.y += dt * 0.05;                                   // ...and drifts up
        p.sprite.position.addScaledVector(p.vel, dt);
        p.sprite.position.x += Math.sin(t * 1.3 + i) * dt * 0.012;  // gentle curl
        p.sprite.scale.setScalar(p.size0 + (p.size1 - p.size0) * Math.sqrt(u));
        p.sprite.material.rotation += p.spin * dt;
        p.sprite.material.opacity = p.alpha * Math.min(u * 6, 1) * (1 - u) * (1 - u);
      });
      return alive;
    },
  };
}

function groundShadow() {
  var c = document.createElement("canvas");
  c.width = c.height = 128;
  var x = c.getContext("2d");
  var gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(12,45,72,0.35)");
  gr.addColorStop(1, "rgba(12,45,72,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 128, 128);
  var m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.002;
  return m;
}

/* materials of the props: glass and liquids see-through, embers and the e-cig light glowing */
function propMaterial(m, glow) {
  var n = m.name;
  if (n === "glass") {
    Object.assign(m, { transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.8 });
  } else if (n === "wine" || n === "whisky" || n === "spirit" || n === "ice") {
    Object.assign(m, { transparent: true, opacity: { wine: 0.92, whisky: 0.8, spirit: 0.3, ice: 0.55 }[n], roughness: 0.08, envMapIntensity: 1.4 });
  } else if (n === "ember" || n === "led") {
    m.emissiveIntensity = n === "ember" ? 1 : 0.6;
    glow.push(m);
  }
}

export default function Avatar3D({ inputs, gained, style, height, label, onReady, onFail }) {
  var mountRef = useRef(null);
  var stateRef = useRef(null);  // three.js objects of the running scene
  var sex = inputs.sex === "female" ? "female" : "male";
  style = STYLES.indexOf(style) >= 0 ? style : "sport";

  // keep the latest look in a ref; the render loop eases towards it
  var wantRef = useRef(looks(inputs, gained, style));
  useEffect(function () {
    wantRef.current = looks(inputs, gained, style);
    if (stateRef.current) stateRef.current.kick();
  }, [inputs, gained, style]);

  var cbRef = useRef({ onReady: onReady, onFail: onFail });
  useEffect(function () { cbRef.current = { onReady: onReady, onFail: onFail }; }, [onReady, onFail]);

  /* ---------------- scene, camera, render loop (lives as long as the component) */
  useEffect(function () {
    var mount = mountRef.current;
    var alive = true;
    var w = mount.clientWidth || 300, h = height || 360;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      cbRef.current.onFail && cbRef.current.onFail();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    var envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.75;
    var key = new THREE.DirectionalLight(0xfff2e6, 1.6);
    key.position.set(-1.6, 2.6, 2.4);
    var rim = new THREE.DirectionalLight(0xcfe6ff, 1.1);
    rim.position.set(1.8, 2.0, -2.2);
    scene.add(key, rim, groundShadow());

    var camera = new THREE.PerspectiveCamera(26, w / h, 0.05, 30);
    camera.position.set(0, 1.0, 4.7);
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.93, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.update();
    renderer.domElement.style.touchAction = "pan-y";  // vertical swipes still scroll the page on phones
    var interacting = false;
    controls.addEventListener("start", function () { interacting = true; kick(); });
    controls.addEventListener("end", function () { interacting = false; });
    controls.addEventListener("change", function () { kick(); });

    var root = new THREE.Group();
    scene.add(root);
    var puffTex = puffTexture();
    var smoke = makeParticles(70, puffTex);
    var steam = makeParticles(24, puffTex);
    scene.add(smoke.group, steam.group);
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var fig = null;   // the current figure: { model, mixer, actions, meshes, skinMats, hairMats, props, tips, mouth, head, glow }
    var cur = null;   // eased copy of the look
    var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

    function setModel(gltf) {
      var model = cloneSkinned(gltf.scene);
      var f = { model: model, meshes: [], skinMats: [], hairMats: [], props: {}, tips: {}, glow: [], mouth: null, head: null };
      model.traverse(function (o) {
        if (o.name === "mouth") f.mouth = o;
        if (o.name === "anchor_head") f.head = o;
        var pn = o.name.slice(5);  // prop_<name>; the part meshes inside are called prop_<name>002 and so on
        if (o.name.indexOf("prop_") === 0 && (SMOKE_PROPS.indexOf(pn) >= 0 || DRINK_PROPS.indexOf(pn) >= 0)) f.props[pn] = o;
        if (o.name.indexOf("tip_") === 0) f.tips[o.name.slice(4)] = o;
        if (!o.isMesh) return;
        var prop = false;
        for (var a = o; a; a = a.parent) if (a.name.indexOf("prop_") === 0) prop = true;
        o.material = o.material.clone();
        var m = o.material;
        m.envMapIntensity = 0.8;
        if (prop) { propMaterial(m, f.glow); if (m.name === "glass") o.renderOrder = 2; return; }
        o.frustumCulled = false;  // the raised arm moves outside the bind-pose bounds
        var PARTS = ["body", "clothes", "shoes", "hat", "hair", "eyebrows", "eyelashes", "eyes"];
        var part = o.name.split(/[_.]/)[0];
        if (PARTS.indexOf(part) < 0 && o.parent) part = o.parent.name.split(/[_.]/)[0];
        // the exporter marks most MakeHuman materials as blended; draw skin and clothes opaque and the
        // textured cut-outs (hair, brows, lashes, the eyes' see-through cornea) with an alpha test
        m.transparent = false; m.depthWrite = true; m.side = THREE.FrontSide;
        if (part === "hair" || part === "eyebrows" || part === "eyelashes" || part === "eyes") {
          m.alphaTest = part === "hair" ? 0.45 : part === "eyes" ? 0.5 : 0.3;
          m.side = part === "eyes" ? THREE.FrontSide : THREE.DoubleSide;
          m.alphaToCoverage = part !== "eyes";  // softer strand edges with MSAA
        } else {
          m.alphaTest = 0;
        }
        if (part === "clothes" || part === "shoes" || part === "hat") m.side = THREE.DoubleSide;  // a few flipped faces
        if (part === "hair" || part === "eyebrows") {
          // greying: blend the texture colour towards a light, desaturated grey
          m.userData.gray = { value: 0 };
          m.onBeforeCompile = function (shader) {
            shader.uniforms.uGray = m.userData.gray;
            shader.fragmentShader = "uniform float uGray;\n" + shader.fragmentShader.replace(
              "#include <map_fragment>",
              "#include <map_fragment>\nfloat lum = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11));\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(lum * 0.55 + 0.42), uGray);");
          };
          f.hairMats.push(m);
        }
        if (part === "eyes") { m.color.setRGB(0.74, 0.72, 0.7); m.envMapIntensity = 0.35; m.roughness = 0.35; }  // MakeHuman irises read too bright under the studio light
        if (part === "body") f.skinMats.push(m);
        if (o.morphTargetDictionary) f.meshes.push(o);
      });
      // keep only each animation's own arm (the exporter writes every bone into both clips)
      f.mixer = new THREE.AnimationMixer(model);
      f.actions = {};
      gltf.animations.forEach(function (clip) {
        var side = clip.name === "smoke" ? "R" : "L";
        var keep = {};
        ARM.forEach(function (b) { keep[b + side] = true; });
        var c = clip.clone();
        c.tracks = c.tracks.filter(function (tr) {
          var dot = tr.name.lastIndexOf(".");
          return keep[tr.name.slice(0, dot)] && tr.name.slice(dot) === ".quaternion";
        });
        var act = f.mixer.clipAction(c);
        act.play();
        act.paused = true;
        act.setEffectiveWeight(0);
        f.actions[clip.name] = act;
      });

      if (fig) {
        root.remove(fig.model);
        disposeTree(fig.model);
      }
      fig = f;
      root.add(model);
      if (!cur) cur = JSON.parse(JSON.stringify(wantRef.current));
      apply(1, 0);
      kick();
    }

    /* ease the look towards the calculator inputs and pose the arms */
    function apply(k, t) {
      var want = wantRef.current;
      var moving = false;
      function ease(a, b) { var n = a + (b - a) * k; if (Math.abs(b - n) > 0.002) moving = true; return Math.abs(b - n) < 0.0005 ? b : n; }
      for (var name in want.morph) cur.morph[name] = ease(cur.morph[name] || 0, want.morph[name]);
      for (var i = 0; i < 3; i++) cur.skin[i] = ease(cur.skin[i], want.skin[i]);
      cur.gray = ease(cur.gray, want.gray);
      ["smoke", "drink", "steam"].forEach(function (p) { cur[p] = ease(cur[p], want[p]); });
      for (var pn in want.props) cur.props[pn] = ease(cur.props[pn] || 0, want.props[pn]);
      if (!fig) return moving;
      fig.meshes.forEach(function (o) {
        var d = o.morphTargetDictionary;
        for (var n in cur.morph) if (d[n] !== undefined) o.morphTargetInfluences[d[n]] = cur.morph[n];
      });
      fig.skinMats.forEach(function (m) { m.color.setRGB(cur.skin[0], cur.skin[1], cur.skin[2]); });
      fig.hairMats.forEach(function (m) { m.userData.gray.value = cur.gray; });
      for (var n2 in fig.props) fig.props[n2].visible = (cur.props[n2] || 0) > 0.5;

      // smoking cycle: raise (0-.15), inhale at the lips (.15-.33), lower (.33-.48), rest; the sip comes half a cycle later
      var u = reduced ? 0.6 : (t / CYCLE) % 1;
      var lift = u < 0.15 ? smooth(u / 0.15) : u < 0.33 ? 1 : smooth(1 - (u - 0.33) / 0.15);
      var v = (u + 0.5) % 1;
      var sip = v < 0.12 ? smooth(v / 0.12) : v < 0.24 ? 1 : smooth(1 - (v - 0.24) / 0.12);
      var A = fig.actions;
      if (A.smoke) { A.smoke.setEffectiveWeight(cur.smoke); A.smoke.time = lift * A.smoke.getClip().duration; }
      if (A.drink) { A.drink.setEffectiveWeight(cur.drink); A.drink.time = sip * A.drink.getClip().duration; }
      fig.mixer.update(0);
      var inhale = u > 0.17 && u < 0.33 ? Math.sin((u - 0.17) / 0.16 * Math.PI) : 0;
      fig.glow.forEach(function (m) { m.emissiveIntensity = (m.name === "ember" ? 1.2 : 0.4) + inhale * 3.5; });
      fig.u = u; fig.inhale = inhale;
      return moving;
    }

    /* smoke from the lit end, an exhaled puff after each drag, sauna steam around the head */
    var emitT = { tip: 0, mouth: 0, steam: 0 };
    function particles(dt, t) {
      if (!fig || reduced) return false;
      var smoking = SMOKE_PROPS.filter(function (n) { return (cur.props[n] || 0) > 0.5; })[0];
      var white = smoking === "vape" ? 0xffffff : 0xd5dade;
      if (smoking && smoking !== "vape" && fig.tips[smoking]) {
        emitT.tip += dt;
        while (emitT.tip > 0.09) {
          emitT.tip -= 0.09;
          fig.tips[smoking].getWorldPosition(tmp);
          tmp2.set((Math.random() - 0.5) * 0.01, 0.07 + Math.random() * 0.04, (Math.random() - 0.5) * 0.01);
          smoke.emit(tmp, tmp2, 2.6, smoking === "cigar" ? 0.016 : 0.01, 0.08, 0.3, white);
        }
      }
      // exhale: a short stream from the lips right after the hand comes down
      var u = fig.u, exhale = u > 0.36 && u < 0.56 ? Math.sin((u - 0.36) / 0.2 * Math.PI) : 0;
      if (smoking && exhale > 0 && fig.mouth) {
        emitT.mouth += dt;
        var rate = smoking === "vape" ? 0.025 : 0.04;
        while (emitT.mouth > rate) {
          emitT.mouth -= rate;
          fig.mouth.getWorldPosition(tmp);
          tmp2.set(0, 0, 1).applyQuaternion(root.quaternion);  // the way the face points (+Z in the GLB)
          tmp2.multiplyScalar((0.25 + Math.random() * 0.1) * exhale);
          tmp2.x += (Math.random() - 0.5) * 0.04; tmp2.y -= 0.03;
          smoke.emit(tmp, tmp2, smoking === "vape" ? 2.4 : 1.8, 0.02, smoking === "vape" ? 0.2 : 0.16, (smoking === "vape" ? 0.3 : 0.34) * exhale, white);
        }
      }
      if (cur.steam > 0.5 && fig.head) {
        emitT.steam += dt;
        while (emitT.steam > 0.22) {
          emitT.steam -= 0.22;
          fig.head.getWorldPosition(tmp);
          tmp.add(tmp2.set((Math.random() - 0.5) * 0.5, -0.45 + Math.random() * 0.2, (Math.random() - 0.5) * 0.2));
          steam.emit(tmp, tmp2.set((Math.random() - 0.5) * 0.02, 0.09, 0), 3.2, 0.06, 0.24, 0.3, 0xffffff);
        }
      }
      var a = smoke.update(dt, t), b = steam.update(dt, t);
      return a || b || !!smoking || cur.steam > 0.5;
    }

    var clock = new THREE.Clock();
    var raf = 0, visible = true, idleUntil = 0;
    function kick() { idleUntil = performance.now() + 1500; if (!raf && visible) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!alive) return;
      var dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
      var moving = cur ? apply(1 - Math.exp(-dt * 5), t) : false;
      var busy = false;
      if (fig && !reduced) {
        if (!interacting) root.rotation.y = Math.sin(t * 0.35) * 0.18;  // slow look-around
        root.position.y = Math.sin(t * 1.5) * 0.003;                    // breathing
        busy = particles(dt, t);
      }
      controls.update();
      renderer.render(scene, camera);
      var animate = fig && !reduced;
      if (visible && (animate || busy || moving || interacting || performance.now() < idleUntil)) raf = requestAnimationFrame(frame);
    }
    kick();

    // pause when scrolled out of view or the tab is hidden (saves battery)
    var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) kick(); });
    io.observe(mount);
    function onVis() { visible = !document.hidden; if (visible) kick(); }
    document.addEventListener("visibilitychange", onVis);
    var ro = new ResizeObserver(function () {
      var nw = mount.clientWidth || w;
      renderer.setSize(nw, h);
      camera.aspect = nw / h;
      camera.updateProjectionMatrix();
      kick();
    });
    ro.observe(mount);

    function disposeTree(obj) {  // materials are per figure; geometry and textures stay for a later switch back
      obj.traverse(function (o) { if (o.material) [].concat(o.material).forEach(function (m) { m.dispose(); }); });
    }

    stateRef.current = { kick: kick, setModel: setModel };
    return function () {
      alive = false;
      stateRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      controls.dispose();
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();  // GPU copies only; a later mount uploads the cached model again
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      puffTex.dispose(); envRT.dispose(); pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [height]);

  /* ---------------- figure for the current sex and style (swapped in place, no flash) */
  useEffect(function () {
    var cancelled = false;
    loadModel(sex, style).then(function (gltf) {
      if (cancelled || !stateRef.current) return;
      stateRef.current.setModel(gltf);
      cbRef.current.onReady && cbRef.current.onReady();
    }).catch(function () {
      if (!cancelled) cbRef.current.onFail && cbRef.current.onFail();
    });
    return function () { cancelled = true; };
  }, [sex, style, height]);

  return <div ref={mountRef} role="img" aria-label={label} style={{ width: "100%", height: height || 360, cursor: "grab" }} />;
}
