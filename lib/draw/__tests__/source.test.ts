import { Canvas } from "canvas";
import { createTestCanvasImage, getMaptilerEpsg4326Url, getTestHTMLImageElement } from "test/util";
import trondheim from "test/assets/trondheim.json";
import { MapTileAdapterContext } from "lib/types";
import { TileCache } from "lib/util";
import { epsg4326ToEpsg3857Presets } from "lib/presets";
import { drawSource } from "../source";

vi.mock("lib/util/dom");

describe("drawSource", () => {
  test("should return a canvas with metadata", async () => {
    const zoom = 6;

    const sourceRequests = await Promise.all(
      trondheim.mappings[zoom].sources.map(async ({ tile, bbox }) => {
        const image = await getTestHTMLImageElement(getMaptilerEpsg4326Url(tile));
        return { tile, bbox, image };
      })
    );

    const ctx: MapTileAdapterContext = {
      cache: new TileCache<HTMLImageElement | null>({
        fetchTile: () => Promise.resolve(null),
        maxCache: 10
      }),
      destinationTileSize: 256,
      interval: [256, 256],
      sourceTileSize: 256,
      ...epsg4326ToEpsg3857Presets()
    };

    const output = drawSource(ctx, sourceRequests);

    expect(output.zoom).toBe(zoom - 1); // default `zoomOffset` is -1
    expect(output.translate).toStrictEqual([8448, 1024]);
    expect(output.canvas).toBeInstanceOf(Canvas);
    expect(output.canvas.width).toBe(256);
    expect(output.canvas.height).toBe(512);

    const buffer = createTestCanvasImage(output.canvas);
    expect(buffer).toMatchImageSnapshot();
  });
});
