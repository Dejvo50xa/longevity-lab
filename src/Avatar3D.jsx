import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { targetParams } from "./avatar-params.js";

/* ═══════════════════════════════════════════════════════════════
   AVATAR 3D — realistic MakeHuman person (built by blender/build_avatar.py)
   The GLB has one mesh per part (body, clothes, hair, ...) and the same
   morph targets on every part. The calculator inputs set their weights:
     muscle / soft   ← exercise           heavy / thin ← diet (+ heavy drinking)
     old             ← biological age      smile / sad / tired ← social, sleep
   plus skin tint, greying hair, a cigarette, a glass and sauna steam.
   Loaded lazily; App falls back to the 2D avatar if anything fails.
   ═══════════════════════════════════════════════════════════════ */

var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
var MODELS = {};  // sex -> Promise<gltf>, shared between mounts

function loadModel(sex) {
  if (!MODELS[sex]) {
    var draco = new DRACOLoader();  // three bundles its own decoder (found via import.meta.url)
    var loader = new GLTFLoader().setDRACOLoader(draco);
    MODELS[sex] = loader.loadAsync("/models/avatar-" + sex + ".glb");
    MODELS[sex].catch(function () { delete MODELS[sex]; });
  }
  return MODELS[sex];
}

/* calculator inputs -> morph weights and looks */
function looks(inputs, gained) {
  var p = targetParams(inputs, gained || 0);
  var R0 = 252, G0 = 226, B0 = 186;  // skin colour of the healthiest setting in avatar-params = texture as is
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
    smoke: p.smoke >= 1 ? 1 : 0,
    glass: p.heavy,
    steam: p.sauna > 0.55 ? 1 : 0,
  };
}

/* small procedural props attached to the hand anchors */
function makeCigarette() {
  var g = new THREE.Group();
  var paper = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.07, 10), new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.8 }));
  var filter = new THREE.Mesh(new THREE.CylinderGeometry(0.0043, 0.0043, 0.022, 10), new THREE.MeshStandardMaterial({ color: 0xd99a4e, roughness: 0.7 }));
  filter.position.y = -0.046;
  var ember = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.004, 10), new THREE.MeshBasicMaterial({ color: 0xff5a1f }));
  ember.position.y = 0.037;
  g.add(paper, filter, ember);
  g.rotation.z = Math.PI / 2.2;
  return g;
}

function makeGlass() {
  var g = new THREE.Group();
  var glass = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.13, 24, 1, true),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, thickness: 0.004, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  var beer = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.028, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xd9901c, roughness: 0.3, transparent: true, opacity: 0.85 }));
  beer.position.y = -0.012;
  var foam = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.033, 0.02, 24), new THREE.MeshStandardMaterial({ color: 0xfbf6e8, roughness: 0.9 }));
  foam.position.y = 0.046;
  g.add(glass, beer, foam);
  return g;
}

function puffTexture() {
  var c = document.createElement("canvas");
  c.width = c.height = 64;
  var x = c.getContext("2d");
  var gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,0.9)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makePuffs(count, tex, color) {
  var g = new THREE.Group();
  for (var i = 0; i < count; i++) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: color, transparent: true, depthWrite: false, opacity: 0 }));
    s.userData.phase = i / count;
    g.add(s);
  }
  return g;
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

export default function Avatar3D({ inputs, gained, height, label, onReady, onFail }) {
  var mountRef = useRef(null);
  var stateRef = useRef(null);  // three.js objects of the running scene
  var sex = inputs.sex === "female" ? "female" : "male";

  // keep the latest look in a ref; the render loop eases towards it
  var wantRef = useRef(looks(inputs, gained));
  useEffect(function () {
    wantRef.current = looks(inputs, gained);
    if (stateRef.current) stateRef.current.kick();
  }, [inputs, gained]);

  var cbRef = useRef({ onReady: onReady, onFail: onFail });
  useEffect(function () { cbRef.current = { onReady: onReady, onFail: onFail }; }, [onReady, onFail]);

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
    var meshes = [], skinMats = [], hairMats = [], anchors = {};
    var cur = null;  // eased copy of the look
    var props = {};
    var puffTex = puffTexture();
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadModel(sex).then(function (gltf) {
      if (!alive) return;
      var model = gltf.scene.clone(true);
      model.traverse(function (o) {
        if (o.name && o.name.indexOf("anchor_") === 0) anchors[o.name] = o;
        if (!o.isMesh) return;
        var PARTS = ["body", "clothes", "shoes", "hair", "eyebrows", "eyelashes", "eyes"];
        var part = o.name.split(/[_.]/)[0];
        if (PARTS.indexOf(part) < 0 && o.parent) part = o.parent.name.split(/[_.]/)[0];
        o.material = o.material.clone();
        var m = o.material;
        m.envMapIntensity = 0.8;
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
        if (part === "clothes" || part === "shoes") {
          m.side = THREE.DoubleSide;  // some MakeHuman garments have a few flipped faces
        }
        if (part === "hair" || part === "eyebrows") {
          // greying: blend the texture colour towards a light, desaturated grey
          m.userData.gray = { value: 0 };
          m.onBeforeCompile = function (shader) {
            shader.uniforms.uGray = m.userData.gray;
            shader.fragmentShader = "uniform float uGray;\n" + shader.fragmentShader.replace(
              "#include <map_fragment>",
              "#include <map_fragment>\nfloat lum = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11));\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(lum * 0.55 + 0.42), uGray);");
          };
          hairMats.push(m);
        }
        if (part === "eyes") { m.color.setRGB(0.74, 0.72, 0.7); m.envMapIntensity = 0.35; m.roughness = 0.35; }  // MakeHuman irises read too bright under the studio light
        if (part === "body") skinMats.push(m);
        if (o.morphTargetDictionary) meshes.push(o);
      });
      root.add(model);

      props.cig = makeCigarette();
      props.glass = makeGlass();
      props.smoke = makePuffs(6, puffTex, 0xd8dde2);
      props.steam = makePuffs(10, puffTex, 0xffffff);
      if (anchors.anchor_hand_R) { anchors.anchor_hand_R.add(props.cig); props.cig.position.set(0.02, -0.06, 0.05); anchors.anchor_hand_R.add(props.smoke); props.smoke.position.set(0.05, -0.04, 0.06); }
      if (anchors.anchor_hand_L) { anchors.anchor_hand_L.add(props.glass); props.glass.position.set(-0.01, -0.07, 0.05); }
      if (anchors.anchor_head) { anchors.anchor_head.add(props.steam); }

      cur = JSON.parse(JSON.stringify(wantRef.current));
      apply(1);
      kick();
      cbRef.current.onReady && cbRef.current.onReady();
    }).catch(function () {
      if (alive) cbRef.current.onFail && cbRef.current.onFail();
    });

    function apply(k) {
      var want = wantRef.current;
      var moving = false;
      function ease(a, b) { var n = a + (b - a) * k; if (Math.abs(b - n) > 0.002) moving = true; return Math.abs(b - n) < 0.0005 ? b : n; }
      for (var name in want.morph) cur.morph[name] = ease(cur.morph[name] || 0, want.morph[name]);
      for (var i = 0; i < 3; i++) cur.skin[i] = ease(cur.skin[i], want.skin[i]);
      cur.gray = ease(cur.gray, want.gray);
      ["smoke", "glass", "steam"].forEach(function (p) { cur[p] = ease(cur[p], want[p]); });
      meshes.forEach(function (o) {
        var d = o.morphTargetDictionary;
        for (var n in cur.morph) if (d[n] !== undefined) o.morphTargetInfluences[d[n]] = cur.morph[n];
      });
      skinMats.forEach(function (m) { m.color.setRGB(cur.skin[0], cur.skin[1], cur.skin[2]); });
      hairMats.forEach(function (m) { m.userData.gray.value = cur.gray; });
      props.cig.visible = cur.smoke > 0.05; props.cig.scale.setScalar(Math.max(cur.smoke, 0.001));
      props.glass.visible = cur.glass > 0.05; props.glass.scale.setScalar(Math.max(cur.glass, 0.001));
      return moving;
    }

    var clock = new THREE.Clock();
    var raf = 0, visible = true, idleUntil = 0;
    function kick() { idleUntil = performance.now() + 1500; if (!raf && visible) raf = requestAnimationFrame(frame); }
    function frame() {
      raf = 0;
      if (!alive) return;
      var dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
      var moving = cur ? apply(1 - Math.exp(-dt * 5)) : false;
      if (cur && !reduced) {
        if (!interacting) root.rotation.y = Math.sin(t * 0.35) * 0.18;  // slow look-around
        root.position.y = Math.sin(t * 1.5) * 0.003;                    // breathing
        [["smoke", cur.smoke, 0.35, 0.05], ["steam", cur.steam, 0.45, 0.16]].forEach(function (s) {
          var grp = props[s[0]];
          grp.children.forEach(function (p) {
            var u = (t * s[2] + p.userData.phase) % 1;
            var rise = s[0] === "steam" ? -0.3 + u * 0.35 : 0.05 + u * 0.35;  // steam drifts past the face, stays in frame
            p.position.set(Math.sin((u + p.userData.phase) * 9) * s[3] * (s[0] === "steam" ? 1.6 : 0.5), rise, Math.cos(p.userData.phase * 20) * s[3]);
            p.scale.setScalar(0.04 + u * 0.12);
            p.material.opacity = s[1] * Math.sin(u * Math.PI) * 0.35;
          });
        });
      }
      controls.update();
      renderer.render(scene, camera);
      var animate = cur && !reduced;
      if (visible && (animate || moving || interacting || performance.now() < idleUntil)) raf = requestAnimationFrame(frame);
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

    stateRef.current = { kick: kick };
    return function () {
      alive = false;
      stateRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      controls.dispose();
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map && m.map !== puffTex) m.map.dispose(); m.dispose(); });
      });
      puffTex.dispose(); envRT.dispose(); pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [sex, height]);

  return <div ref={mountRef} role="img" aria-label={label} style={{ width: "100%", height: height || 360, cursor: "grab" }} />;
}
