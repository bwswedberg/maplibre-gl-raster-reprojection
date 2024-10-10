import type { Bbox, MapTileAdapterContext, Tile } from "lib/types";
import { drawDestination } from "./destination";
import { drawSource } from "./source";

export const drawTile = (
  ctx: MapTileAdapterContext,
  sources: { tile: Tile; image: HTMLImageElement | null; bbox: Bbox }[],
  destinationRequest: { tile: Tile; bbox: Bbox }
) => {
  // Create new tile image from source tiles
  const source = drawSource(ctx, sources);

  // Use source canvs to render destination canvas
  return drawDestination(ctx, source, destinationRequest);
};
