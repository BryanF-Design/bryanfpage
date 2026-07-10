"use client";

import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";

import { requestStageFrame, useThreeStage } from "@/lib/three/stage";

interface LaptopSceneProps {
  /** 0 = tapa cerrada, 1 = abierta. Lo escribe el hero con el scroll. */
  progressRef: MutableRefObject<number>;
  className?: string;
}

const OPEN_ANGLE = THREE.MathUtils.degToRad(108);

/**
 * Laptop estilizada construida con primitivas (sin GLTF que descargar):
 * la tapa se abre siguiendo el scroll del hero y la pantalla "construye"
 * un sitio en vivo — el pitch del estudio contado por la máquina misma.
 * Arrastrable con el mouse/touch horizontal (pan-y deja pasar el scroll).
 */
export function LaptopScene({ progressRef, className }: LaptopSceneProps) {
  const dragYaw = useRef(0);
  const dragging = useRef(false);

  const { containerRef } = useThreeStage({
    fov: 33,
    cameraZ: 5.4,
    build: ({ scene, camera, container }) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      camera.position.set(0, 1.55, 5.4);
      camera.lookAt(0, 0.32, 0);

      // Luces: cálida frontal + rim lima trasero, sobre materiales grafito.
      scene.add(new THREE.HemisphereLight(0xf1f2e9, 0x06110c, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.35);
      key.position.set(2.5, 4, 4);
      scene.add(key);
      const rim = new THREE.PointLight(0xb4e332, 14, 12);
      rim.position.set(-2.2, 1.6, -2.6);
      scene.add(rim);

      const laptop = new THREE.Group();
      scene.add(laptop);

      const graphite = new THREE.MeshStandardMaterial({
        color: 0x161d18,
        metalness: 0.72,
        roughness: 0.38,
      });

      // Base
      const baseW = 3.0;
      const baseD = 2.05;
      const baseH = 0.12;
      const base = new THREE.Mesh(new THREE.BoxGeometry(baseW, baseH, baseD), graphite);
      base.position.y = baseH / 2;
      laptop.add(base);

      // Teclado: textura canvas sobre la cara superior de la base.
      const deckTexture = makeDeckTexture();
      const deck = new THREE.Mesh(
        new THREE.PlaneGeometry(baseW * 0.94, baseD * 0.9),
        new THREE.MeshStandardMaterial({ map: deckTexture, metalness: 0.4, roughness: 0.7 })
      );
      deck.rotation.x = -Math.PI / 2;
      deck.position.y = baseH + 0.002;
      laptop.add(deck);

      // Luz de encendido en el frente.
      const powerLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.02, 0.01),
        new THREE.MeshBasicMaterial({ color: 0xb4e332 })
      );
      powerLed.position.set(0, baseH * 0.55, baseD / 2 + 0.006);
      laptop.add(powerLed);

      // Tapa: grupo con bisagra en el borde trasero.
      const lid = new THREE.Group();
      lid.position.set(0, baseH + 0.015, -baseD / 2 + 0.02);
      laptop.add(lid);

      const lidD = 1.95;
      const lidPanel = new THREE.Mesh(new THREE.BoxGeometry(baseW, 0.06, lidD), graphite);
      lidPanel.position.z = lidD / 2;
      lid.add(lidPanel);

      // Pantalla: textura canvas emisiva en la cara interna de la tapa —
      // mira al teclado cuando está cerrada y al visitante cuando abre.
      const screen = makeScreen();
      const screenMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(baseW * 0.9, lidD * 0.86),
        new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false })
      );
      screenMesh.rotation.x = Math.PI / 2;
      screenMesh.position.set(0, -0.035, lidD / 2);
      lid.add(screenMesh);

      // Resplandor tenue de la pantalla al abrir (sin lavar el teclado).
      const glow = new THREE.PointLight(0xb4e332, 0, 5);
      glow.position.set(0, 1.5, 1.2);
      laptop.add(glow);

      // Sombra suave falsa (gradiente radial) — sin shadow maps.
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 3.4),
        new THREE.MeshBasicMaterial({
          map: makeShadowTexture(),
          transparent: true,
          depthWrite: false,
        })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.02;
      scene.add(shadow);

      laptop.rotation.y = -0.28;

      // Interacción: arrastre horizontal gira la laptop (touch-action pan-y
      // deja el scroll vertical intacto en móvil).
      const el = container;
      el.style.touchAction = "pan-y";
      el.style.cursor = "grab";
      let lastX = 0;
      const onDown = (e: PointerEvent) => {
        dragging.current = true;
        lastX = e.clientX;
        el.style.cursor = "grabbing";
        el.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging.current) return;
        dragYaw.current += (e.clientX - lastX) * 0.006;
        dragYaw.current = THREE.MathUtils.clamp(dragYaw.current, -0.9, 0.9);
        lastX = e.clientX;
        requestStageFrame(el);
      };
      const onUp = (e: PointerEvent) => {
        dragging.current = false;
        el.style.cursor = "grab";
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      let lidAngle = reduced ? OPEN_ANGLE : 0;
      let lastScreenDraw = -1;

      return (dt, elapsed) => {
        const progress = reduced ? 1 : THREE.MathUtils.clamp(progressRef.current, 0, 1);

        // La tapa persigue el scroll con un pequeño suavizado.
        const target = progress * OPEN_ANGLE;
        lidAngle += (target - lidAngle) * Math.min(1, dt * 7);
        lid.rotation.x = -lidAngle;

        const openness = lidAngle / OPEN_ANGLE;
        glow.intensity = openness * 1.8;

        // Flotación sutil + regreso elástico del arrastre.
        laptop.position.y = reduced ? 0 : Math.sin(elapsed * 0.9) * 0.035;
        if (!dragging.current) dragYaw.current *= 1 - Math.min(1, dt * 1.4);
        laptop.rotation.y = -0.28 + dragYaw.current + (reduced ? 0 : Math.sin(elapsed * 0.35) * 0.045);

        // La pantalla se redibuja solo cuando cambia algo (apertura o caret).
        const screenKey = Math.round(openness * 40) + Math.floor(elapsed * 2) * 100;
        if (screenKey !== lastScreenDraw) {
          lastScreenDraw = screenKey;
          screen.draw(openness, elapsed);
        }
      };
    },
  });

  return <div ref={containerRef} className={className} aria-hidden />;
}

/* ---------- Texturas canvas (todo generado, nada que descargar) ---------- */

const INK = "#08120d";
const PANEL = "#0f1a14";
const BONE = "rgba(241,242,233,";
const LIME = "#b4e332";

function makeDeckTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 352;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#131a15";
  ctx.fillRect(0, 0, 512, 352);
  // Teclas
  const rows = 5;
  const cols = 14;
  const pad = 26;
  const kw = (512 - pad * 2) / cols;
  const kh = 34;
  ctx.fillStyle = "#0c1310";
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      ctx.roundRect(pad + col * kw + 3, 26 + r * (kh + 6), kw - 6, kh, 5);
      ctx.fill();
    }
  }
  // Trackpad
  ctx.strokeStyle = "rgba(241,242,233,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(512 / 2 - 80, 236, 160, 96, 8);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 2;
  return tex;
}

function makeShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/**
 * Pantalla: un mini-sitio que se "construye" conforme la tapa se abre —
 * primero el esqueleto, luego contenido, al final el CTA en lima.
 */
function makeScreen() {
  const W = 640;
  const H = 400;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const texture = new THREE.CanvasTexture(c);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;

  function draw(openness: number, elapsed: number) {
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);

    if (openness < 0.08) {
      texture.needsUpdate = true;
      return;
    }

    // Barra de navegador
    ctx.fillStyle = PANEL;
    ctx.fillRect(0, 0, W, 34);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(20 + i * 16, 17, 4, 0, Math.PI * 2);
      ctx.fillStyle = `${BONE}0.25)`;
      ctx.fill();
    }
    ctx.fillStyle = "#0a140f";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 130, 8, 260, 18, 9);
    ctx.fill();
    ctx.fillStyle = `${BONE}0.5)`;
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText("bryanfdesign.com.mx", W / 2, 21);

    const stage = (openness - 0.08) / 0.92;

    // 1. Esqueleto
    if (stage > 0.05) {
      ctx.fillStyle = `${BONE}0.07)`;
      ctx.fillRect(28, 62, 240, 16);
      ctx.fillRect(28, 90, 320, 34);
      ctx.fillRect(28, 134, 280, 12);
      ctx.fillRect(28, 154, 250, 12);
      ctx.fillRect(370, 62, 242, 150);
    }
    // 2. Contenido
    if (stage > 0.42) {
      ctx.fillStyle = `${BONE}0.9)`;
      ctx.textAlign = "left";
      ctx.font = "700 30px sans-serif";
      ctx.fillText("HAZ QUE", 28, 116);
      ctx.fillStyle = LIME;
      ctx.fillText("PASE.", 168, 116);
      ctx.fillStyle = `${BONE}0.45)`;
      ctx.fillRect(28, 134, 280, 8);
      ctx.fillRect(28, 150, 250, 8);
      ctx.fillStyle = "#101c15";
      ctx.fillRect(370, 62, 242, 150);
      ctx.strokeStyle = "rgba(180,227,50,0.5)";
      ctx.strokeRect(370.5, 62.5, 241, 149);
      ctx.strokeStyle = "rgba(180,227,50,0.35)";
      ctx.beginPath();
      ctx.moveTo(388, 190);
      ctx.lineTo(430, 140);
      ctx.lineTo(470, 168);
      ctx.lineTo(530, 100);
      ctx.lineTo(594, 130);
      ctx.stroke();
    }
    // 3. CTA + footer
    if (stage > 0.75) {
      ctx.fillStyle = LIME;
      ctx.beginPath();
      ctx.roundRect(28, 182, 132, 32, 4);
      ctx.fill();
      ctx.fillStyle = "#0b140a";
      ctx.font = "600 13px sans-serif";
      ctx.fillText("Arma tu web", 46, 202);
      ctx.fillStyle = `${BONE}0.12)`;
      for (let i = 0; i < 3; i++) ctx.fillRect(28 + i * 200, 250, 184, 96);
      // Caret parpadeante: la obra sigue viva.
      if (Math.floor(elapsed * 2) % 2 === 0) {
        ctx.fillStyle = LIME;
        ctx.fillRect(172, 188, 3, 20);
      }
    }

    // Scanline sutil
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    for (let y = 40; y < H; y += 4) ctx.fillRect(0, y, W, 1);

    texture.needsUpdate = true;
  }

  draw(0, 0);
  return { texture, draw };
}
