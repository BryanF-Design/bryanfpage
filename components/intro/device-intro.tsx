"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { useLanguage } from "@/lib/i18n/context";
import {
  isReducedMotionRequested,
  subscribeReducedMotionPreference,
} from "@/lib/motion-preference";
import { useThreeStage, type ThreeStage } from "@/lib/three/stage";
import {
  createScreenCanvas,
  type ScreenFonts,
  type ScreenStrings,
} from "./screen-canvas";

type Variant = "laptop" | "phone";
type Phase = "loading" | "booting" | "ready";

/** Desde aquí el hero arranca su entrada (la pantalla ya casi llena la vista). */
const ENTER_AT = 0.7;
/** Desde aquí la escena ya es transparente y deja pasar los clics al hero. */
const DONE_AT = 0.95;
/**
 * Tiempos de la intro en escritorio (ms desde que el modelo está listo):
 * encendido + preloader en pantalla y luego la cámara entra. En total 0.8 s.
 */
const BOOT_MS = 350;
const TRAVEL_MS = 450;
/** El encendido nativo dura ~3.85 s; se acelera para caber en BOOT_MS. */
const TIME_SCALE = 3.85 / (BOOT_MS / 1000);

/** El mismo logotipo del telón del sitio (blanco sobre tinta). */
const LOGO_URL = "/img/brand/logo-light.png";

const MODELS: Record<Variant, string> = {
  laptop: "/models/intro/laptop.glb",
  phone: "/models/intro/phone.glb",
};

/**
 * 起動 — la entrada de la home, solo en escritorio.
 *
 * Una laptop se enciende con el preloader del sitio en su pantalla y la
 * cámara entra sola hasta llenarla; la escena se funde y debajo queda el
 * hero, que en ese momento arma sus paneles. Todo dura 0.8 s, con "Saltar"
 * visible desde el primer instante (el telón `.intro-veil`, que ya viene en el
 * HTML, lo trae antes de que este componente cargue).
 *
 * Quién decide si corre: el script de arranque de la home (`INTRO_BOOTSTRAP`)
 * pone `html[data-intro="pending"]` solo en escritorio con puntero fino, sin
 * movimiento reducido y una vez por sesión. En móvil este archivo (ni three.js
 * ni los modelos) nunca se descarga. Si el modelo no llega a tiempo, el
 * arranque corta solo y la página sigue en el hero.
 */
export function DeviceIntro() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const selfEnteredRef = useRef(false);
  const stringsRef = useRef<ScreenStrings>({
    sequence: "",
    aligning: "",
    ready: "",
    enter: "",
  });
  stringsRef.current = {
    sequence: t.experience.startupSequence,
    aligning: t.experience.aligning,
    ready: t.experience.systemOnline,
    enter: t.experience.enterHint,
  };

  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadPct, setLoadPct] = useState(0);
  const [gone, setGone] = useState(false);

  // WebGL y movimiento reducido (por si cambió desde el arranque).
  useEffect(() => {
    const root = document.documentElement;
    // Ya la saltaron (o cortó el tiempo) antes de que esta escena cargara.
    if (root.dataset.intro !== "pending") {
      setGone(true);
      return;
    }
    const reduced = isReducedMotionRequested();
    if (reduced || !hasWebGL()) {
      root.dataset.intro = reduced ? "off" : "entered";
      setGone(true);
      return;
    }
    setEnabled(true);
    const unsubscribe = subscribeReducedMotionPreference(() => {
      if (isReducedMotionRequested()) {
        root.dataset.intro = "off";
        setGone(true);
      }
    });
    return unsubscribe;
  }, []);

  // "Saltar" (o el corte por tiempo del arranque) cambia `data-intro`: la
  // escena se retira en ese momento.
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (root.dataset.intro !== "pending" && !selfEnteredRef.current) setGone(true);
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    return () => observer.disconnect();
  }, []);

  // Paralaje suave con el mouse mientras la laptop está a 3/4.
  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  // Con el modelo listo, la línea de tiempo corre sola (no depende del scroll).
  useEffect(() => {
    if (phase === "loading" || gone) return;
    const section = sectionRef.current;
    if (!section) return;
    const root = document.documentElement;
    // El modelo llegó tarde: la página ya está en el hero y no se tapa de nuevo.
    if (root.dataset.intro !== "pending") {
      setGone(true);
      return;
    }
    root.dataset.introLoaded = "1";
    try {
      sessionStorage.setItem("bf-intro", "1");
    } catch {
      /* sin almacenamiento: la intro puede repetirse, no pasa nada */
    }
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start - BOOT_MS) / TRAVEL_MS));
      progressRef.current = p;
      section.style.setProperty("--intro-p", p.toFixed(4));
      section.dataset.state = p >= DONE_AT ? "done" : "active";
      if (p >= ENTER_AT && root.dataset.intro === "pending") {
        selfEnteredRef.current = true;
        root.dataset.intro = "entered";
      }
      if (p >= 1) {
        window.setTimeout(() => setGone(true), 120);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase === "loading", gone]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!failed) return;
    document.documentElement.dataset.intro = "entered";
    setGone(true);
  }, [failed]);

  function skip() {
    document.documentElement.dataset.intro = "entered";
  }

  if (gone) return null;

  const statusText =
    phase === "loading"
      ? `${t.experience.modelLoading} · ${loadPct}%`
      : phase === "ready"
        ? t.experience.readyAria
        : t.experience.preparingAria;

  return (
    <section
      ref={sectionRef}
      aria-label={t.experience.introAria}
      className="device-intro"
      data-variant="laptop"
      data-state="active"
    >
      <div className="device-intro__stage">
        <div aria-hidden className="device-intro__glow" />
        {enabled && !failed && (
          <IntroCanvas
            variant="laptop"
            progressRef={progressRef}
            pointerRef={pointerRef}
            stringsRef={stringsRef}
            onLoadProgress={setLoadPct}
            onPhase={setPhase}
            onError={() => setFailed(true)}
          />
        )}

        <p role="status" aria-live="polite" className="sr-only">
          {statusText}
        </p>
        <button
          type="button"
          onClick={skip}
          className="device-intro__skip intro-skip min-h-11 rounded-full border border-white/15 bg-white/5 px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur transition-colors hover:border-lime hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          {t.experience.skip}
        </button>
      </div>
    </section>
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

interface IntroCanvasProps {
  variant: Variant;
  progressRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  stringsRef: MutableRefObject<ScreenStrings>;
  onLoadProgress: (pct: number) => void;
  onPhase: (phase: Phase) => void;
  onError: () => void;
}

function IntroCanvas(props: IntroCanvasProps) {
  const propsRef = useRef(props);
  propsRef.current = props;

  const { containerRef } = useThreeStage({
    fov: 30,
    maxDpr: props.variant === "phone" ? 1.5 : 1.75,
    build: (stage) => buildScene(stage, props.variant, propsRef),
  });

  return <div ref={containerRef} aria-hidden className="absolute inset-0" />;
}

// ════════════════════════════════════════════════════════════════════════
// Escena
// ════════════════════════════════════════════════════════════════════════

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Avance con titubeos: nunca retrocede, pero no corre parejo. */
const loadCurve = (t: number) => clamp01(t + 0.05 * Math.sin(t * Math.PI * 4) * (1 - t));

interface ScreenPose {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  up: THREE.Vector3;
  width: number;
  height: number;
}

interface VariantConfig {
  canvas: [number, number];
  target: THREE.Vector3;
  dir: THREE.Vector3;
  dist: number;
  /** Distancia del punto intermedio frente a la pantalla. */
  approach: number;
  /** <1 = la pantalla rebasa la vista (esconde esquinas redondeadas). */
  fill: number;
  /** Relación de aspecto a la que `dist` encuadra bien. */
  fitAspect: number;
  powerAt: number;
}

const CONFIG: Record<Variant, VariantConfig> = {
  laptop: {
    canvas: [1280, 800],
    target: new THREE.Vector3(0, 0.07, -0.02),
    dir: new THREE.Vector3(0.55, 0.34, 0.76).normalize(),
    dist: 0.86,
    approach: 0.62,
    fill: 0.96,
    fitAspect: 1.5,
    powerAt: 1.05,
  },
  phone: {
    canvas: [540, 1200],
    target: new THREE.Vector3(0, 0, 0),
    dir: new THREE.Vector3(0.1, 0.06, 1).normalize(),
    dist: 0.54,
    approach: 0.4,
    fill: 0.86,
    fitAspect: 0.5,
    powerAt: 0.75,
  },
};

function buildScene(
  { scene, camera, renderer }: ThreeStage,
  variant: Variant,
  propsRef: MutableRefObject<IntroCanvasProps>
) {
  const cfg = CONFIG[variant];
  const isPhone = variant === "phone";

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environment = envTexture;
  scene.environmentIntensity = 0.7;

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(0.6, 1, 0.8);
  const rim = new THREE.DirectionalLight(0xc8ec7a, 0.45);
  rim.position.set(-0.6, 0.7, -1.2);
  const screenLight = new THREE.PointLight(0xa8dc8c, 0, 0.8, 2);
  scene.add(key, rim, screenLight);

  // Pantalla: canvas 2D como textura.
  const logo = new Image();
  logo.decoding = "async";
  logo.src = LOGO_URL;
  const screen2d = createScreenCanvas(cfg.canvas[0], cfg.canvas[1], logo);
  const screenTexture = new THREE.CanvasTexture(screen2d.canvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  // El UV de la malla ya tiene v hacia arriba de la imagen.
  screenTexture.flipY = false;
  screenTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
  const fonts = readFonts();
  document.fonts?.load(`800 64px ${fonts.display}`).catch(() => undefined);
  document.fonts?.load(`700 32px ${fonts.sans}`).catch(() => undefined);

  const device = new THREE.Group();
  scene.add(device);

  let loaded = false;
  let disposed = false;
  let loadedAt = 0;
  let elapsedNow = 0;
  let lid: THREE.Object3D | null = null;
  const lidOpen = new THREE.Quaternion();
  const lidClosed = new THREE.Quaternion();
  const pose: ScreenPose = {
    center: new THREE.Vector3(),
    normal: new THREE.Vector3(0, 0, 1),
    up: new THREE.Vector3(0, 1, 0),
    width: 0.3,
    height: 0.18,
  };

  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, done, total) => {
    propsRef.current.onLoadProgress(Math.round((done / Math.max(1, total)) * 100));
  };
  new GLTFLoader(manager).load(
    MODELS[variant],
    (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      let screenMesh: THREE.Mesh | null = null;
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (mesh.name.startsWith("Pantalla")) {
          (mesh.material as THREE.Material).dispose();
          mesh.material = screenMaterial;
          screenMesh = mesh;
        }
      });
      device.add(model);

      lid = model.getObjectByName("Pivote_Tapa") ?? null;
      if (lid) lidOpen.copy(lid.quaternion);

      // La pose final se mide con todo en reposo: tapa abierta, equipo de frente.
      device.updateMatrixWorld(true);
      if (screenMesh) measureScreen(screenMesh, pose);
      if (lid) lid.quaternion.copy(lidClosed);

      if (!isPhone) device.add(contactShadow());

      loaded = true;
      loadedAt = elapsedNow;
      propsRef.current.onLoadProgress(100);
      propsRef.current.onPhase("booting");
    },
    undefined,
    () => propsRef.current.onError()
  );

  // Estado por cuadro.
  let smooth = propsRef.current.progressRef.current;
  let readyAnnounced = false;
  let lastDraw = -1;
  let lastExit = -1;
  let lastPower = -1;
  const parallax = new THREE.Vector2();
  const S = new THREE.Vector3();
  const M = new THREE.Vector3();
  const E = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const up = new THREE.Vector3();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const phoneFrom = new THREE.Euler(-1.15, 0.7, 0.35);
  const phoneRest = new THREE.Euler(-0.1, -0.42, 0.06);

  const tick = (dt: number, elapsed: number) => {
    elapsedNow = elapsed;
    if (!loaded) return false;
    const { progressRef, pointerRef, stringsRef } = propsRef.current;
    const raw = progressRef.current;
    smooth += (raw - smooth) * (1 - Math.exp(-dt * 30));
    if (Math.abs(raw - smooth) < 1e-4) smooth = raw;
    if (raw >= DONE_AT && smooth >= DONE_AT) return false;

    const t = (elapsed - loadedAt) * TIME_SCALE;
    const scrollTurn = easeInOut(clamp01(smooth / 0.5));
    const travel = easeInOut(clamp01(smooth / 0.76));

    // ── Encendido del equipo.
    const intro = easeOut(clamp01(t / 1.6));
    if (lid) lid.quaternion.slerpQuaternions(lidClosed, lidOpen, easeInOut(clamp01((t - 0.15) / 1.5)));
    if (isPhone) {
      device.rotation.set(
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(phoneFrom.x, phoneRest.x, intro), 0, scrollTurn),
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(phoneFrom.y, phoneRest.y, intro), 0, scrollTurn),
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(phoneFrom.z, phoneRest.z, intro), 0, scrollTurn)
      );
      device.position.y = THREE.MathUtils.lerp(-0.06, 0, intro) + Math.sin(elapsed * 1.3) * 0.003 * (1 - scrollTurn);
    } else {
      device.rotation.y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(-0.55, -0.16, intro), 0, scrollTurn);
    }

    // ── Pantalla.
    const power = clamp01((t - cfg.powerAt) / 0.75);
    const load = loadCurve(clamp01((t - cfg.powerAt - 0.5) / 2.3));
    const exit = clamp01((smooth - 0.18) / 0.4);
    if (load >= 1 && !readyAnnounced) {
      readyAnnounced = true;
      propsRef.current.onPhase("ready");
    }
    const busy = power < 1 || load < 1;
    const interval = busy ? 1 / 30 : 1 / 15;
    const exitChanged = Math.abs(exit - lastExit) > 0.002 || (exit >= 1 && lastExit < 1);
    const idle = !busy && exit >= 1 && lastExit >= 1 && lastPower >= 1;
    if (!idle && (elapsed - lastDraw >= interval || exitChanged)) {
      screen2d.draw({ power, load, time: elapsed, exit }, stringsRef.current, fonts);
      screenTexture.needsUpdate = true;
      lastDraw = elapsed;
      lastExit = exit;
      lastPower = power;
    }
    screenLight.position.copy(pose.center).addScaledVector(pose.normal, 0.1);
    screenLight.intensity = power * (isPhone ? 0.006 : 0.02) * (1 - 0.5 * exit);

    // ── Cámara: de la vista 3/4 al frente de la pantalla, y adentro.
    const aspect = camera.aspect;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = isPhone ? Math.max(1, aspect / cfg.fitAspect) : Math.max(1, cfg.fitAspect / aspect);
    const fillDist =
      Math.min(pose.height / (2 * tanHalf), pose.width / (2 * tanHalf * aspect)) * cfg.fill;

    parallax.x += (pointerRef.current.x - parallax.x) * (1 - Math.exp(-dt * 3));
    parallax.y += (pointerRef.current.y - parallax.y) * (1 - Math.exp(-dt * 3));
    const sway = (1 - travel) * 0.04;

    S.copy(cfg.target).addScaledVector(cfg.dir, cfg.dist * (isPhone ? 1 / fit : fit));
    S.x += parallax.x * sway;
    S.y -= parallax.y * sway;
    M.copy(pose.center).addScaledVector(pose.normal, cfg.approach);
    E.copy(pose.center).addScaledVector(pose.normal, fillDist);

    const a = 1 - travel;
    pos.set(0, 0, 0)
      .addScaledVector(S, a * a)
      .addScaledVector(M, 2 * a * travel)
      .addScaledVector(E, travel * travel);
    look.lerpVectors(cfg.target, pose.center, easeOut(travel));
    up.lerpVectors(worldUp, pose.up, travel).normalize();

    camera.position.copy(pos);
    camera.up.copy(up);
    camera.lookAt(look);
    return true;
  };

  const dispose = () => {
    disposed = true;
    envTexture.dispose();
    screenTexture.dispose();
  };

  return { tick, dispose };
}

/** Centro, normal, ejes y tamaño de la pantalla en coordenadas de mundo. */
function measureScreen(mesh: THREE.Mesh, pose: ScreenPose) {
  const geometry = mesh.geometry;
  const normals = geometry.getAttribute("normal");
  const positions = geometry.getAttribute("position");
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);

  pose.normal.fromBufferAttribute(normals, 0).applyNormalMatrix(normalMatrix).normalize();
  if (pose.normal.z < 0) pose.normal.negate();
  pose.up.set(0, 1, 0).addScaledVector(pose.normal, -pose.normal.y).normalize();
  const right = new THREE.Vector3().crossVectors(pose.up, pose.normal).normalize();

  const v = new THREE.Vector3();
  let minR = Infinity;
  let maxR = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;
  let depth = 0;
  for (let i = 0; i < positions.count; i += 1) {
    v.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
    const r = v.dot(right);
    const u = v.dot(pose.up);
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minU = Math.min(minU, u);
    maxU = Math.max(maxU, u);
    depth += v.dot(pose.normal);
  }
  depth /= Math.max(1, positions.count);

  pose.width = maxR - minR;
  pose.height = maxU - minU;
  pose.center
    .set(0, 0, 0)
    .addScaledVector(right, (minR + maxR) / 2)
    .addScaledVector(pose.up, (minU + maxU) / 2)
    .addScaledVector(pose.normal, depth);
}

/** Sombra de contacto suave bajo la laptop. */
function contactShadow() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0,0,0,0.85)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.45)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.48),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.7 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, -0.0016, 0.004);
  return mesh;
}

function readFonts(): ScreenFonts {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    display: read("--font-display", "sans-serif"),
    sans: read("--font-sans", "sans-serif"),
  };
}
