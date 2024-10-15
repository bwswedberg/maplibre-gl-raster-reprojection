import * as tilebelt from "tilebelt-wgs84";
import type {
  Bbox,
  DestinationTileToSourceTilesFn,
  DestinationToPixelFn,
  DestinationToSourceFn,
  PixelToDestinationFn,
  SourceToPixelFn,
  Tile
} from "lib/types";
import {
  metersToPixels,
  metersToLngLat,
  pixelsToMeters,
  pixelsToScreenPixels,
  screenPixelsToPixels
} from "./epsg3857";

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

const destinationTileToSourceTiles: DestinationTileToSourceTilesFn = (
  destinationRequest,
  zoomOffset = 0
) => {
  const lngLatBbox = [
    ...metersToLngLat([destinationRequest.bbox[0], destinationRequest.bbox[1]]),
    ...metersToLngLat([destinationRequest.bbox[2], destinationRequest.bbox[3]])
  ];
  const zoom = destinationRequest.tile[2];
  const sourceTiles: Tile[] = tilebelt.bboxToTiles(lngLatBbox, zoom + zoomOffset);
  return sourceTiles.map((tile) => {
    const bbox: Bbox = tilebelt.tileToBBox(tile);
    return { tile, bbox };
  });
};

export const epsg4326ToEpsg3857Presets = {
  destinationToPixel,
  pixelToDestination,
  destinationToSource,
  sourceToPixel,
  destinationTileToSourceTiles,
  zoomOffset: -1
};
