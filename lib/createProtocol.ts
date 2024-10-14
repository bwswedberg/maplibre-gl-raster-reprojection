import type { AddProtocolAction } from "maplibre-gl";
import type {
  DestinationTileToSourceTilesFn,
  DestinationToPixelFn,
  DestinationToSourceFn,
  ProtocolContext,
  PixelToDestinationFn,
  SourceToPixelFn
} from "lib/types";
import { fetchImage, TileCache } from "lib/util";
import { loader } from "./loader";

const PROTOCOL_NAME = "reproject";

export interface CreateProtocolOptions {
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
  zoomOffset?: number;
}

export interface CreateProtocolResult {
  protocol: string;
  tileUrlPrefix: string;
  loader: AddProtocolAction;
}

export const createProtocol = (options: CreateProtocolOptions): CreateProtocolResult => {
  const cache = new TileCache<HTMLImageElement | null>({
    fetchTile: (url) => fetchImage(url),
    maxCache: options.cacheSize ?? 10
  });
  const destinationTileSize = options?.destinationTileSize ?? options?.tileSize ?? 256;
  const ctx: ProtocolContext = {
    cache,
    destinationTileSize,
    destinationTileToSourceTiles: options.destinationTileToSourceTiles,
    destinationToPixel: options.destinationToPixel,
    destinationToSource: options.destinationToSource,
    interval: options?.interval ?? [destinationTileSize, destinationTileSize],
    pixelToDestination: options.pixelToDestination,
    sourceTileSize: options?.sourceTileSize ?? destinationTileSize,
    sourceToPixel: options.sourceToPixel,
    zoomOffset: options.zoomOffset
  };
  const protocol = `${options?.protocol ?? PROTOCOL_NAME}`;
  return {
    protocol,
    tileUrlPrefix: `${protocol}://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}`,
    loader: (...args) => loader(ctx, ...args)
  };
};
