import type { Bbox, MapTileAdapterContext, Tile } from "lib/types";
import { createCanvasContext } from "lib/util/dom";

export const drawDestination = (
  ctx: MapTileAdapterContext,
  source: { canvas: HTMLCanvasElement; translate: number[]; zoom: number },
  destination: { tile: Tile; bbox: Bbox }
) => {
  const {
    destinationTileSize,
    sourceTileSize,
    interval,
    sourceToPixel,
    destinationToSource,
    pixelToDestination,
    destinationToPixel
  } = ctx;

  const destinationCanvasCtx = createCanvasContext(destinationTileSize, destinationTileSize);

  const destinationZoom = destination.tile[2];

  const dp0 = destinationToPixel(
    [destination.bbox[0], destination.bbox[1]],
    destinationZoom,
    destinationTileSize
  );
  const dp1 = destinationToPixel(
    [destination.bbox[2], destination.bbox[3]],
    destinationZoom,
    destinationTileSize
  );
  const dTranslate = [Math.min(dp0[0], dp1[0]), Math.min(dp0[1], dp1[1])];

  for (let dx = 0; dx < destinationTileSize; dx += interval[0]) {
    // Handle when tileSize is not divisible by x interval
    const dWidth = Math.min(interval[0], destinationTileSize - dx);

    for (let dy = 0; dy < destinationTileSize; dy += interval[1]) {
      // Handle when tileSize is not divisible by y interval
      const dHeight = Math.min(interval[1], destinationTileSize - dy);

      const dBbox = [
        dx + dTranslate[0],
        dy + dTranslate[1],
        dx + dTranslate[0] + dWidth,
        dy + dTranslate[1] + dHeight
      ];

      const sp0 = sourceToPixel(
        destinationToSource(
          pixelToDestination([dBbox[0], dBbox[1]], destinationZoom, destinationTileSize)
        ),
        source.zoom,
        sourceTileSize
      );
      const sp1 = sourceToPixel(
        destinationToSource(
          pixelToDestination([dBbox[2], dBbox[3]], destinationZoom, destinationTileSize)
        ),
        source.zoom,
        sourceTileSize
      );

      const sBbox = [
        Math.min(sp0[0], sp1[0]),
        Math.min(sp0[1], sp1[1]),
        Math.max(sp0[0], sp1[0]),
        Math.max(sp0[1], sp1[1])
      ];

      // Draw slice of destinaton tile
      destinationCanvasCtx.drawImage(
        source.canvas,
        sBbox[0] - source.translate[0], // sx
        sBbox[1] - source.translate[1], // sy
        sBbox[2] - sBbox[0], // sWidth
        sBbox[3] - sBbox[1], // sHeight,
        dx, // dx
        dy, // dy,
        dWidth, // dWidth,
        dHeight // dHeight
      );
    }
  }

  return {
    canvas: destinationCanvasCtx.canvas,
    translate: dTranslate,
    zoom: destinationZoom
  };
};
