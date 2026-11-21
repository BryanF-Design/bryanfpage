/**
 * La pantalla del dispositivo de la intro: un <canvas> 2D que three.js usa
 * como textura. Repite el preloader del sitio (logotipo blanco que se revela
 * sobre tinta y barra lima, ver `.site-preloader` en globals.css) tras una
 * línea de encendido. Con el scroll el contenido se retira y la pantalla pasa
 * de tinta al color de la hoja, para fundirse con la web que hay detrás.
 */

export interface ScreenStrings {
  sequence: string;
  aligning: string;
  ready: string;
  enter: string;
}

export interface ScreenFonts {
  display: string;
  sans: string;
}

export interface ScreenFrame {
  /** 0 apagada → 1 encendida (incluye el destello de arranque). */
  power: number;
  /** 0 → 1 avance del preloader. */
  load: number;
  /** Segundos, para el parpadeo de la pista. */
  time: number;
  /** 0 → 1 el contenido se retira y la pantalla toma el color de la hoja. */
  exit: number;
}

// Tokens de globals.css: --ink, --lime, --sheet.
const INK: [number, number, number] = [16, 30, 25];
const SHEET: [number, number, number] = [238, 241, 233];
const LIME = "#b4e332";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

export function createScreenCanvas(width: number, height: number, logo: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const portrait = height > width;
  const unit = portrait ? width : height;

  function spaced(text: string, x: number, y: number, spacing: number, align: "left" | "center" | "right") {
    const chars = Array.from(text);
    const widths = chars.map((ch) => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * Math.max(0, chars.length - 1);
    let cx = align === "left" ? x : align === "right" ? x - total : x - total / 2;
    ctx.textAlign = "left";
    chars.forEach((ch, i) => {
      ctx.fillText(ch, cx, y);
      cx += widths[i] + spacing;
    });
  }

  function draw(frame: ScreenFrame, strings: ScreenStrings, fonts: ScreenFonts) {
    const w = width;
    const h = height;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    if (frame.power <= 0) return;

    const exit = easeInOut(clamp01(frame.exit));

    // ── Arranque: una línea lima se abre y deja la tinta encendida.
    const boot = clamp01(frame.power / 0.4);
    ctx.globalAlpha = easeOut(boot);
    ctx.fillStyle = mix(INK, SHEET, exit);
    ctx.fillRect(0, 0, w, h);
    if (boot < 1) {
      const lh = Math.max(2, h * easeOut(boot));
      ctx.globalAlpha = 0.85 * (1 - boot);
      ctx.fillStyle = LIME;
      ctx.fillRect(0, h / 2 - lh / 2, w, lh);
      ctx.globalAlpha = 1;
      return;
    }

    const alpha = clamp01((frame.power - 0.4) / 0.6) * (1 - easeOut(clamp01(frame.exit * 1.6)));
    if (alpha <= 0.001) return;
    const load = clamp01(frame.load);
    const ready = load >= 1;
    const m = unit * 0.075;

    // Halo lima muy tenue detrás del logotipo.
    const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, unit * 0.7);
    glow.addColorStop(0, "rgba(180, 227, 50, 0.10)");
    glow.addColorStop(1, "rgba(180, 227, 50, 0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Logotipo revelándose de izquierda a derecha, como el telón del sitio.
    const logoW = w * (portrait ? 0.68 : 0.4);
    const logoH = logo.naturalWidth ? logoW * (logo.naturalHeight / logo.naturalWidth) : logoW * 0.35;
    const lx = (w - logoW) / 2;
    const ly = h * (portrait ? 0.46 : 0.47) - logoH / 2;
    const reveal = easeOut(clamp01(load / 0.75));
    if (logo.complete && logo.naturalWidth) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(lx, ly - 2, logoW * reveal, logoH + 4);
      ctx.clip();
      ctx.globalAlpha = alpha;
      ctx.drawImage(logo, lx, ly, logoW, logoH);
      ctx.restore();
    }

    // Barra lima bajo el logotipo.
    const barH = Math.max(3, unit * 0.011);
    const barY = ly + logoH + unit * 0.045;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    roundRect(lx, barY, logoW, barH);
    ctx.fillStyle = LIME;
    roundRect(lx, barY, logoW * load, barH);

    // Contador bajo la barra.
    const pctSize = unit * (portrait ? 0.07 : 0.065);
    ctx.font = `800 ${pctSize}px ${fonts.display}`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.textAlign = "right";
    ctx.fillText(`${String(Math.round(load * 100)).padStart(3, "0")}%`, lx + logoW, barY + barH * 2.2);

    const smallSize = unit * (portrait ? 0.03 : 0.028);
    ctx.font = `600 ${smallSize}px ${fonts.sans}`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    spaced((ready ? strings.ready : strings.aligning).toUpperCase(), lx, barY + barH * 2.2 + pctSize * 0.3, smallSize * 0.12, "left");

    // Tira superior y pista inferior.
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    spaced(strings.sequence.toUpperCase(), w / 2, m, smallSize * 0.18, "center");
    if (ready) {
      const blink = 0.5 + 0.5 * Math.sin(frame.time * 4.2);
      ctx.fillStyle = `rgba(180, 227, 50, ${0.45 + 0.55 * blink})`;
      ctx.font = `700 ${smallSize * 1.1}px ${fonts.sans}`;
      ctx.textBaseline = "bottom";
      spaced(`${strings.enter.toUpperCase()}  ↓`, w / 2, h - m, smallSize * 0.18, "center");
    }
    ctx.globalAlpha = 1;
  }

  function roundRect(x: number, y: number, w: number, h: number) {
    if (w <= 0) return;
    const r = Math.min(h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.fill();
  }

  return { canvas, draw, portrait };
}
