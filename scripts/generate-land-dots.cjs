// Regenera lib/three/land-dots.ts: muestreo fibonacci de la esfera contra la
// retícula mundial de dotted-map. Se corre una sola vez (o al querer cambiar
// la densidad); el resultado va commiteado para que el cliente no cargue
// geojson ni proj4.
//
//   node scripts/generate-land-dots.cjs
const DottedMap = require("dotted-map").default;
const proj4 = require("proj4");
const fs = require("fs");
const path = require("path");

const map = new DottedMap({ height: 120, grid: "vertical" });

function isLand(lat, lng) {
  const projected = proj4(map.proj4String, [lng, lat]);
  if (!projected.every(Number.isFinite)) return false;
  const [projX, projY] = projected;
  const rawX = (map.width * (projX - map.X_MIN)) / map.X_RANGE;
  const rawY = (map.height * (map.Y_MAX - projY)) / map.Y_RANGE;
  const y = Math.round(rawY / map.ystep) * map.ystep;
  const x = Math.round(rawX);
  return Boolean(map.points[`${x};${y}`]);
}

const N = 14000;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < N; i++) {
  const yUnit = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(yUnit) * 180) / Math.PI;
  const theta = GOLDEN * i;
  let lng = ((theta * 180) / Math.PI) % 360;
  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;
  if (isLand(lat, lng)) {
    out.push(Math.round(lat * 10), Math.round(lng * 10));
  }
}

const body = `// Auto-generado con scripts/generate-land-dots.cjs — muestreo fibonacci de la
// retícula mundial de dotted-map. Pares de [lat*10, lng*10] como enteros; los
// usa el globo 3D para pintar los continentes sin enviar geojson al cliente.
export const LAND_DOTS: number[] = [
${out.join(",")}
];
`;
const target = path.join(__dirname, "..", "lib", "three", "land-dots.ts");
fs.writeFileSync(target, body);
console.log(`land points: ${out.length / 2} → ${target}`);
