import { Canvas } from "canvas";
import { epsg4326ToEpsg3857Presets } from "lib/presets";
import { MapTileAdapterContext } from "lib/types";
import { TileCache } from "lib/util";
import trondheim from "test/assets/trondheim.json";
import { createTestCanvasImage, getMaptilerEpsg4326Url, getTestHTMLImageElement } from "test/util";
import { drawTile } from "..";

vi.mock("lib/util/dom");

const { destinationTileSize, sourceTileSize } = trondheim.metadata;

const createMapTileAdapterContext = (
  props: Partial<MapTileAdapterContext> = {}
): MapTileAdapterContext => {
  return {
    cache: new TileCache<HTMLImageElement | null>({
      fetchTile: () => Promise.resolve(null),
      maxCache: 10
    }),
    destinationTileSize,
    interval: [256, 256],
    sourceTileSize,
    ...epsg4326ToEpsg3857Presets(),
    ...props
  };
};

describe("drawTile", () => {
  test("should return with simple props", async () => {
    const { destination, sources } = trondheim.mappings[2];

    const sourceRequests = await Promise.all(
      sources.map(async ({ tile, bbox }) => {
        const image = await getTestHTMLImageElement(getMaptilerEpsg4326Url(tile));
        return { tile, bbox, image };
      })
    );

    const ctx = createMapTileAdapterContext();

    const output = drawTile(ctx, sourceRequests, {
      tile: destination.tile,
      bbox: destination.bbox
    });

    expect(output.zoom).toBe(destination.tile[2]);
    expect(output.translate).toStrictEqual([
      destination.tile[0] * destinationTileSize,
      destination.tile[1] * destinationTileSize
    ]);
    expect(output.canvas).toBeInstanceOf(Canvas);
    expect(output.canvas.width).toBe(destinationTileSize);
    expect(output.canvas.height).toBe(destinationTileSize);

    expect(createTestCanvasImage(output.canvas)).toMatchImageSnapshot();
  });

  test.each(trondheim.mappings.slice(2).map((d) => [d.destination.tile[2], d]))(
    `should return source canvas for zoom %j`,
    async (_label, mapping) => {
      const { destination, sources } = mapping;

      const sourceRequests = await Promise.all(
        sources.map(async ({ tile, bbox }) => {
          const image = await getTestHTMLImageElement(getMaptilerEpsg4326Url(tile));
          return { tile, bbox, image };
        })
      );

      const ctx = createMapTileAdapterContext({
        interval: [256, 1]
      });

      const output = drawTile(ctx, sourceRequests, {
        tile: destination.tile,
        bbox: destination.bbox
      });

      expect(output.zoom).toBe(destination.tile[2]);
      expect(output.translate).toStrictEqual([
        destination.tile[0] * destinationTileSize,
        destination.tile[1] * destinationTileSize
      ]);
      expect(output.canvas).toBeInstanceOf(Canvas);
      expect(output.canvas.width).toBe(destinationTileSize);
      expect(output.canvas.height).toBe(destinationTileSize);

      expect(createTestCanvasImage(output.canvas)).toMatchImageSnapshot();
    }
  );
});
