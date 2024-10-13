import type { TileCache } from "./util/cache";

/**
 * [x, y, z]
 */
export type Tile = number[] | [number, number, number];

/**
 * [xmin, ymin, xmax, ymax]
 */
export type Bbox = number[] | [number, number, number, number];

export type DestinationToPixelFn = ([dx, dy]: number[], zoom: number, tileSize: number) => number[];
export type PixelToDestinationFn = ([px, py]: number[], zoom: number, tileSize: number) => number[];
export type DestinationToSourceFn = ([dx, dy]: number[]) => number[];
export type SourceToPixelFn = ([sx, sy]: number[], zoom: number, tileSize: number) => number[];

export type DestinationTileToSourceTilesFn = (
  destinationRequest: {
    tile: Tile;
    bbox: Bbox;
  },
  zoomOffset?: number
) => { tile: Tile; bbox: Bbox }[];

export interface ProtocolContext {
  cache: TileCache<HTMLImageElement | null>;
  destinationTileSize: number;
  destinationTileToSourceTiles: DestinationTileToSourceTilesFn;
  destinationToPixel: DestinationToPixelFn;
  destinationToSource: DestinationToSourceFn;
  interval: number[];
  pixelToDestination: PixelToDestinationFn;
  sourceTileSize: number;
  sourceToPixel: SourceToPixelFn;
  zoomOffset?: number;
}
