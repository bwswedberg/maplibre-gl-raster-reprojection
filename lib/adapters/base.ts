import { drawTile } from "lib/draw";
import type { Bbox, MapTileAdapterContext, Tile } from "lib/types";

interface Props {
  ctx: MapTileAdapterContext;
  destinationRequest: { tile: Tile, bbox: Bbox };
  sourceRequests: { tile: Tile; bbox: Bbox; url: string }[];
  checkCanceled: () => boolean,
}

export const loadTile = async ({ 
  ctx,
  destinationRequest,
  sourceRequests,
  checkCanceled
}: Props): Promise<{ canvas: HTMLCanvasElement, translate: number[], zoom: number } | null> => {
  // Bail when already canceled 
  if (checkCanceled()) return null;

  // Fetch all source tiles required to reproject
  let sources = await Promise.all(
    sourceRequests.map(async source => {
      const image = await ctx.cache.getTile(source.url)
        .catch(() => null);
      return { ...source, image };
    })
  );

  // Return all sources with an image
  sources = sources.filter(source => source.image);

  // Validate sources before continue
  // - Bail when no remaining sources
  // - Bail when canceled after async source tile fetching
  if (!sources?.length || checkCanceled()) return null;

  // Reproject source tiles to destination tile
  return drawTile(ctx, sources, destinationRequest);
}