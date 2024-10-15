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

const defaultOptions = {
  protocol: "reproject",
  cacheSize: 10,
  interval: [1, 1],
  tileSize: 256
} satisfies Partial<CreateProtocolOptions>;

export interface CreateProtocolResult {
  protocol: string;
  loader: AddProtocolAction;
}

export const createProtocol = (_options: CreateProtocolOptions): CreateProtocolResult => {
  const options = { ..._options, ...defaultOptions };
  const cache = new TileCache<HTMLImageElement | null>({
    fetchTile: (url) => fetchImage(url),
    maxCache: options.cacheSize
  });
  const ctx: ProtocolContext = {
    cache,
    destinationTileSize: options?.destinationTileSize ?? options.tileSize,
    destinationTileToSourceTiles: options.destinationTileToSourceTiles,
    destinationToPixel: options.destinationToPixel,
    destinationToSource: options.destinationToSource,
    interval: options.interval,
    pixelToDestination: options.pixelToDestination,
    sourceTileSize: options?.sourceTileSize ?? options.tileSize,
    sourceToPixel: options.sourceToPixel,
    zoomOffset: options.zoomOffset
  };
  return {
    protocol: options.protocol,
    loader: (...args) => loader(ctx, ...args)
  };
};
