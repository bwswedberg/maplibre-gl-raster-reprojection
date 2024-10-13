import { Bbox, Tile } from "lib/types";
import {
  getImageUrl,
  parseCustomProtocolRequestUrl,
  ParseCustomProtocolRequestUrlOutput
} from "../../loader/url";

describe("parseCustomProtocolUrl", () => {
  const tile: Tile = [1, 2, 3]; // [x, y, z];
  const bbox: Bbox = [10, 20, 30, 40]; // [xmin, ymin, xmax, ymax]
  const urlTemplate =
    "https://https://tilehost.com/{sz}/{sx}/{sy}.png?bbox={sbbox}&xmin={sxmin}&ymin={symin}&xmax={sxmax}&ymax={symax}";

  test.each<[string, string, ParseCustomProtocolRequestUrlOutput]>([
    [
      "required",
      `mta://bbox=10,20,30,40&x=1&y=2&z=3://${urlTemplate}`,
      {
        tile,
        bbox,
        urlTemplate,
        interval: undefined,
        sourceTileSize: undefined,
        destinationTileSize: undefined,
        zoomOffset: undefined
      }
    ],
    [
      "interval",
      `mta://bbox=10,20,30,40&x=1&y=2&z=3&interval=256,1://${urlTemplate}`,
      {
        tile,
        bbox,
        urlTemplate,
        interval: [256, 1],
        sourceTileSize: undefined,
        destinationTileSize: undefined,
        zoomOffset: undefined
      }
    ],
    [
      "tile size",
      `mta://bbox=10,20,30,40&x=1&y=2&z=3&size=512://${urlTemplate}`,
      {
        tile,
        bbox,
        urlTemplate,
        interval: undefined,
        sourceTileSize: 512,
        destinationTileSize: 512,
        zoomOffset: undefined
      }
    ],
    [
      "tile size (individual)",
      `mta://bbox=10,20,30,40&x=1&y=2&z=3&ssize=512&dsize=256://${urlTemplate}`,
      {
        tile,
        bbox,
        urlTemplate,
        interval: undefined,
        sourceTileSize: 512,
        destinationTileSize: 256,
        zoomOffset: undefined
      }
    ],
    [
      "zoomOffset",
      `mta://bbox=10,20,30,40&x=1&y=2&z=3&zoffset=-2://${urlTemplate}`,
      {
        tile,
        bbox,
        urlTemplate,
        interval: undefined,
        sourceTileSize: undefined,
        destinationTileSize: undefined,
        zoomOffset: -2
      }
    ]
  ])("should parse custom protocol request url - %s", (_label, url, parsedReqUrl) => {
    const output = parseCustomProtocolRequestUrl(url);
    expect(output).toStrictEqual(parsedReqUrl);
  });
});

describe("getImageUrl", () => {
  const tile: Tile = [1, 2, 3]; // [x, y, z];
  const bbox: Bbox = [10, 20, 30, 40]; // [xmin, ymin, xmax, ymax]

  test.each([
    ["tile params", "https://tilehost.com/{sz}/{sx}/{sy}.png", "https://tilehost.com/3/1/2.png"],
    [
      "source bbox params",
      "https://tilehost.com/tiles?bbox={sbbox}",
      "https://tilehost.com/tiles?bbox=10,20,30,40"
    ],
    [
      "source bbox params enumerated",
      "https://tilehost.com/tiles?xmin={sxmin}&ymin={symin}&xmax={sxmax}&ymax={symax}",
      "https://tilehost.com/tiles?xmin=10&ymin=20&xmax=30&ymax=40"
    ]
  ])("should return valid image url - %s", (_label, urlTemplate, imageUrl) => {
    const output = getImageUrl(urlTemplate, tile, bbox);
    expect(output).toBe(imageUrl);
  });
});
