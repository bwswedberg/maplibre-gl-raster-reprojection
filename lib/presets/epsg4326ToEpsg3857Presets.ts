import {
  metersToPixels,
  metersToLngLat,
  pixelsToMeters,
  pixelsToScreenPixels,
  screenPixelsToPixels
} from "lib/proj/epsg3857";
import * as tilebelt from "lib/proj/tilebelt-wgs84";
import type {
  Bbox,
  DestinationTileToSourceTilesFn,
  DestinationToPixelFn,
  DestinationToSourceFn,
  PixelToDestinationFn,
  SourceToPixelFn,
  Tile
} from "lib/types";

interface PresetOptions {
  zoomOffset: number;
}

const destinationToPixel: DestinationToPixelFn = (xy, zoom, tileSize) => {
  const p = metersToPixels(xy, zoom, tileSize);
  return pixelsToScreenPixels(p, zoom, tileSize);
};

const pixelToDestination: PixelToDestinationFn = (xy, zoom, tileSize) => {
  const p = screenPixelsToPixels(xy, zoom, tileSize);
  return pixelsToMeters(p, zoom, tileSize);
};

const destinationToSource: DestinationToSourceFn = ([x, y]) => {
  return metersToLngLat([x, y]);
};

const sourceToPixel: SourceToPixelFn = (lngLat, zoom, tileSize) => {
  const extent = tilebelt.getExtent(zoom);
  return [
    tilebelt.normalizeLng(lngLat[0]) * extent[0] * tileSize,
    tilebelt.normalizeLat(lngLat[1]) * extent[1] * tileSize
  ];
};

const destinationTileToSourceTiles = (
  destinationRequest: { tile: Tile; bbox: Bbox },
  options: PresetOptions
) => {
  const lngLatBbox = [
    ...metersToLngLat([destinationRequest.bbox[0], destinationRequest.bbox[1]]),
    ...metersToLngLat([destinationRequest.bbox[2], destinationRequest.bbox[3]])
  ];
  const zoom = destinationRequest.tile[2];
  const sourceTiles: Tile[] = tilebelt.bboxToTiles(lngLatBbox, zoom + (options.zoomOffset ?? 0));
  return sourceTiles.map((tile) => {
    const bbox: Bbox = tilebelt.tileToBBox(tile);
    return { tile, bbox };
  });
};

const defaultOptions: PresetOptions = {
  zoomOffset: -1
};

export type Epsg4326ToEpsg3857PresetOptions = Partial<PresetOptions>;

export const epsg4326ToEpsg3857Presets = (
  options?: Epsg4326ToEpsg3857PresetOptions
): {
  destinationToPixel: DestinationToPixelFn;
  pixelToDestination: PixelToDestinationFn;
  destinationToSource: DestinationToSourceFn;
  sourceToPixel: SourceToPixelFn;
  destinationTileToSourceTiles: DestinationTileToSourceTilesFn;
} => {
  const _options: PresetOptions = {
    zoomOffset: options?.zoomOffset ?? defaultOptions.zoomOffset
  };
  return {
    destinationToPixel,
    pixelToDestination,
    destinationToSource,
    sourceToPixel,
    destinationTileToSourceTiles: (props) => destinationTileToSourceTiles(props, _options)
  };
};
