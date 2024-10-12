import type { DestinationTileToSourceTilesFn, DestinationToPixelFn, DestinationToSourceFn, MapTileAdapterContext, PixelToDestinationFn, SourceToPixelFn } from "lib/types";
import { fetchImage, TileCache } from "lib/util";
import { loader } from "./loader";

const MTA_PROTOCOL = "mta";

export interface MaplibreTileAdapterOptions {
  protocol?: string;
  cacheSize?: number;
  destinationTileSize?: number;
  destinationTileToSourceTiles: DestinationTileToSourceTilesFn;
  destinationToPixel: DestinationToPixelFn;
  destinationToSource: DestinationToSourceFn;
  interval?: number[];
  pixelToDestination: PixelToDestinationFn;
  sourceTileSize?: number;
  sourceToPixel: SourceToPixelFn;
  tileSize?: number;
}

export const maplibreTileAdapterProtocol = (options: MaplibreTileAdapterOptions) => {
  const cache = new TileCache<HTMLImageElement | null>({
    fetchTile: (url) => fetchImage(url),
    maxCache: options.cacheSize ?? 10
  });
  const destinationTileSize = options?.destinationTileSize ?? options?.tileSize ?? 256;
  const ctx: MapTileAdapterContext = {
    cache,
    destinationTileSize,
    destinationTileToSourceTiles: options.destinationTileToSourceTiles,
    destinationToPixel: options.destinationToPixel,
    destinationToSource: options.destinationToSource,
    interval: options?.interval ?? [destinationTileSize, destinationTileSize],
    pixelToDestination: options.pixelToDestination,
    sourceTileSize: options?.sourceTileSize ?? destinationTileSize,
    sourceToPixel: options.sourceToPixel
  };
  return {
    protocol: `${options?.protocol ?? MTA_PROTOCOL}`,
    tileUrlPrefix: `${options?.protocol ?? MTA_PROTOCOL}://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}`,
    loader: loader.bind(null, ctx)
  };
};
