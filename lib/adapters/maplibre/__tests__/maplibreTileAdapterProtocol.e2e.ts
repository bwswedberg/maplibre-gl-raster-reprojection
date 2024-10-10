import { test, expect } from "@playwright/test";
import { maplibreTileAdapterProtocol } from "../maplibreTileAdapterProtocol";
import { epsg4326ToEpsg3857Presets } from "lib/presets";
import maplibregl from "maplibre-gl";

declare global {
  interface Window {
    maplibregl: typeof maplibregl;

    MapTileAdapter: {
      maplibreTileAdapterProtocol: typeof maplibreTileAdapterProtocol;
      epsg4326ToEpsg3857Presets: typeof epsg4326ToEpsg3857Presets;
    };
  }
}

test.describe("maplibreTileAdapterProtocol", () => {
  test("should render a maplibre map", async ({ page }, testinfo) => {
    await page.goto("http://localhost:3000/maplibre.html");

    await page.evaluate(() => {
      const { maplibreTileAdapterProtocol, epsg4326ToEpsg3857Presets } = window.MapTileAdapter;

      const mtaProtocol = maplibreTileAdapterProtocol({
        sourceTileSize: 256,
        destinationTileSize: 256,
        interval: [256, 1],
        ...epsg4326ToEpsg3857Presets()
      });

      window.maplibregl.addProtocol(mtaProtocol.protocol, mtaProtocol.loader);

      const map = new window.maplibregl.Map({
        container: "map",
        style: {
          version: 8,
          sources: {
            epsg4326source: {
              type: "raster",
              tiles: [
                `${mtaProtocol.tileUrlPrefix}://http://localhost:3000/maptiler-epsg4326/{sz}/{sx}/{sy}.png`
              ],
              tileSize: 256,
              scheme: "xyz"
            }
          },
          layers: [{ id: "epsg4326layer", source: "epsg4326source", type: "raster" }]
        },
        center: [0, 45],
        zoom: 2
      });

      // Wait on load event and add indicator to know when it's ready
      map.on("load", () => {
        const mapContainer = document.getElementById("map");
        mapContainer?.classList.add("loaded");
      });
    });

    await page.locator("#map.loaded").waitFor({ state: "visible" });

    const map = page.locator("#map");

    // By default is `process.platform` which fails when auto naming snapshots on different os
    // See https://github.com/microsoft/playwright/issues/14218
    testinfo.snapshotSuffix = "";
    expect(await map.screenshot()).toMatchSnapshot();
  });
});
