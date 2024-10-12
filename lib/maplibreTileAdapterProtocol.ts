import type { MapTileAdapterContext, MapTileAdapterOptions } from "lib/types";
import { fetchImage, TileCache } from "lib/util";
import { loader } from "./loader";

const MTA_PROTOCOL = "mta";

interface MaplibreTileAdapterOptions extends MapTileAdapterOptions {
  protocol?: string;
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
