import { cn } from "@/lib/utils";

/**
 * Iconos dibujados píxel a píxel: cada fila es un renglón del sprite y cada
 * "X" un píxel encendido. Se pintan con `crispEdges`, así que a cualquier
 * tamaño entero se ven nítidos, como en una consola de 8 bits.
 */
const SPRITES = {
  arrowUp: [
    "....XX....",
    "...XXXX...",
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XXX.XX.XXX",
    "....XX....",
    "....XX....",
    "....XX....",
    "....XX....",
    "....XX....",
  ],
  person: [
    "....XX....",
    "...XXXX...",
    "....XX....",
    "..........",
    "XXXXXXXXXX",
    "....XX....",
    "....XX....",
    "...XXXX...",
    "...X..X...",
    "..XX..XX..",
  ],
  close: [
    "XX......XX",
    "XXX....XXX",
    ".XXX..XXX.",
    "..XXXXXX..",
    "...XXXX...",
    "...XXXX...",
    "..XXXXXX..",
    ".XXX..XXX.",
    "XXX....XXX",
    "XX......XX",
  ],
} as const;

export type PixelIconName = keyof typeof SPRITES;

export function PixelIcon({
  name,
  className,
}: {
  name: PixelIconName;
  className?: string;
}) {
  const rows = SPRITES[name];
  const width = rows[0].length;
  const cells: Array<[number, number]> = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === "X") cells.push([x, y]);
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      className={cn("h-5 w-5 fill-current", className)}
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
      ))}
    </svg>
  );
}
