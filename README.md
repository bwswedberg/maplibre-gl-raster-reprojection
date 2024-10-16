# Maplibre Gl Raster Reprojection

![build](https://github.com/bwswedberg/maplibre-gl-raster-reprojection/actions/workflows/build.yml/badge.svg)
[![codecov](https://codecov.io/github/bwswedberg/maplibre-gl-raster-reprojection/graph/badge.svg?token=CEEP0QI6CP)](https://codecov.io/github/bwswedberg/maplibre-gl-raster-reprojection)
[![npm](https://img.shields.io/npm/v/maplibre-gl-raster-reprojection)](https://www.npmjs.com/package/maplibre-gl-raster-reprojection)

Reproject maplibre raster map tiles in the browser.

**[DEMO](https://bwswedberg.github.io/maplibre-gl-raster-reprojection/)**

## Purpose

This library is for when your maplibre map projection differs from your tile projection.

In a perfect world your map tiles would be in the same projection as your map. However, this is not always the case. Sometimes you may need to mix. For example,

- Your map and some of your tiles are in EPSG:3857 (web mercator), but you need to another tileset that is only served in EPSG:4326.
- Your map is in some exotic projection and there are only EPSG:3857 tile providers.

With `maplibre-gl-raster-reprojection` you can reproject those tiles on the fly so that you can use them.

This library is inteded to be a stopgap solution until non-mercator projections are supported in maplibre. See latest updates:

- [Roadmap - Non-Mercator Projection](https://maplibre.org/roadmap/non-mercator-projection/)
- [Bounty Direction: Custom Coordinate System/EPSG/Non-Mercator Projection #272](https://github.com/maplibre/maplibre/issues/272)

## How it works

This library uses maplibre `addProtocol` API to hook into the layer request/response lifecycle.

1. Maplibre makes a request for a tile in EPSG:3857
1. `maplibre-gl-raster-reprojection` converts that request into 1 or many tile server requests
1. `maplibre-gl-raster-reprojection` slices and reprojects the tile server responses into 1 in order to match the maplibre expected request
1. Maplibre renders the repojected tile

Key Terms

- _source_: Original tile from the tile server
- _destination_: Maplibre tile (EPSG:3857)

Maplibre does not directly pass the tile request `bbox`, `x`, `y`, and `z` params to the protocol loader function. You must add a **url prefix** and **url source params** to your tile url in order for `maplibre-gl-raster-reprojection` to receive those values and build requests.

## Install

```bash
npm install maplibre-gl-raster-reprojection
```

## Usage

You must add the following url prefix and source params to your maplibre raster source config in order for `maplibre-gl-raster-reprojection` to work:

- Add the **url prefix** to your tile url
- Use the **url source params** to your tile url

**URL Prefix:** `reproject://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://`

- `reproject`: The protocol name. Can be changed via `protocol` option.
- `bbox={bbox-epsg-3857}`: Pass destination (EPSG:3857) `bbox` to the loader function.
- `z={z}`: Pass the destination (EPSG:3857) tile `z` to the loader function.
- `x={x}`: Pass the destination (EPSG:3857) tile `x` to the loader function.
- `y={y}`: Pass the destination (EPSG:3857) tile `y` to the loader function.

**URL Source Params**:

- `{sz}`: Pass the source tile `z` to the tile server request
- `{sx}`: Pass the source tile `x` to the tile server request
- `{sy}`: Pass the source tile `y` to the tile server request
- `{sbbox}`: Pass the source tile `bbox` to the tile server request
- `{sxmin}`: Pass the source tile `xmin` to the tile server request
- `{symin}`: Pass the source tile `ymin` to the tile server request
- `{sxmax}`: Pass the source tile `xmax` to the tile server request
- `{symax}`: Pass the source tile `ymax` to the tile server request

**Example URL:**
`reproject://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://https://api.tilehost.com/map/{sz}/{sx}/{sy}.png`

```ts
import maplibregl from 'maplibre-gl';
import { createProtocol, epsg4326ToEpsg3857Presets } from 'maplibre-gl-raster-reprojection';

const { protocol, loader } = createProtocol({
  // Converts EPSG:4326 tile endpoint to EPSG:3857
  ...epsg4326ToEpsg3857Presets,
  // Draw EPSG:3857 tile in 256 pixel width by 1 pixel height intervals (more accurate latitude)
  interval: [256, 1],
});

maplibregl.addProtocol(protocol, loader);

const map = new maplibregl.Map({
  style: {
    ...,
    sources: {
      version: 8,
      epsg4326Source: {
        type: 'raster',
        tiles: ['reproject://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://https://api.tilehost.com/map/{sz}/{sx}/{sy}.png'],
        tileSize: 256,
        scheme: 'xyz'
      }
    },
    layers: [
      { id: 'reprojectedLayer', source: 'epsg4326Source', type: 'raster' }
    ]
  }
})
```

## API

### `createProtocol: (options: CreateProtocolOptions) => CreateProtocolResult`

Create and initialize input for `maplibregl.addProtocol`.

#### `CreateProtocolOptions`

| field                          | description                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `protocol`                     | `string` <br> Url prefix that identifying a custom protocol. _(Default: `'reproject'`)_                                                                                                                                                                                                     |
| `cacheSize`                    | `number` <br> Total images stored in the internal reprojection cache. _(Default: `10`)_                                                                                                                                                                                                     |
| `destinationTileSize`          | `number` <br> The destination tile size. _(Defaults to `tileSize`)_                                                                                                                                                                                                                         |
| `destinationTileToSourceTiles` | `DestinationTileToSourceTilesFn` <br> See common type below                                                                                                                                                                                                                                 |
| `destinationToPixel`           | `DestinationToPixelFn` <br> See common type below                                                                                                                                                                                                                                           |
| `destinationToSource`          | `DestinationToSourceFn` <br> See common type below                                                                                                                                                                                                                                          |
| `interval`                     | `[intervalX: number, intervalY: number]` <br> The pixel sampling interval when reprojecting the source to destination. Max interval value is the destination tile size. _(Default: `[1, 1]`)_                                                                                               |
| `pixelToDestination`           | `PixelToDestinationFn` <br> See common type below                                                                                                                                                                                                                                           |
| `sourceTileSize`               | `number` <br> The source tile size. _(Defaults to `tileSize`)_                                                                                                                                                                                                                              |
| `sourceToPixel`                | `SourceToPixelFn` <br> See common type below                                                                                                                                                                                                                                                |
| `tileSize`                     | `number` <br> Shorthand for setting `sourceTileSize` and `destinationTileSize` to the same value. _(Default: `256`)_                                                                                                                                                                        |
| `zoomOffset`                   | `number` <br> An offset zoom value applied to the reprojection which makes the tile text appear smaller or bigger. The offset is applied when determining which source tiles are needed to cover a destination tile in `destinationTileToSourceTiles`. Must be an integer. _(Default: `0`)_ |

#### `CreateProtocolResult`

| field      | description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `protocol` | `string` <br> Url prefix that identifying a custom protocol.     |
| `loader`   | `maplibregl.AddProtocolAction` <br> See maplibregl documentation |

### `epsg4326ToEpsg3857Presets: Partial<CreateProtocolOptions>`

Preset options to convert EPSG:4326 to EPSG:3857.

### Common

#### `Tile: number[] | [number, number, number]`

A reference to a map tile. [x, y, z]

#### `Bbox: number[] | [number, number, number, number]`

A bounding box. [xmin, ymin, xmax, ymax]

#### `DestinationTileToSourceTilesFn: (destinationRequest: { tile: Tile, bbox: Bbox }, zoomOffset?: number) => { tile: Tile, bbox: Bbox }[]`

Calculate the source tile references needed to cover destination tile reference. A `zoomOffset` is used to apply any source-to-destination zoom adjustments.

#### `DestinationToPixelFn: ([dx, dy]: number[], zoom: number, tileSize: number) => number[]`

Transform a destination tile reference to pixel coordinate [x, y].

#### `DestinationToSourceFn: ([dx, dy]: number[]) => number[]`

Transform a destination coordinate [x, y] to a source coordinate [x, y].

#### `PixelToDestinationFn: ([px, py]: number[], zoom: number, tileSize: number) => number[]`

Transform a pixel coordinate [x, y] to destination coordinate [x, y].

#### `SourceToPixelFn: ([sx, sy]: number[], zoom: number, tileSize: number) => number[]`

Transform a source coordinate [x, y] to a pixel coordinate [x, y].

## Tradeoffs

Map tiles are best used in their native projection. Reprojecting a tile almost always be suboptimal and most easily visualized in the following ways.

Use params like `interval`, `zoomOffset`, etc. to adjust the reprojection based on your needs.

### Visual effects

- **Text labels** will likely be distorted when reprojecting raster images. Labels are placed and "burned" into tiles. So when tile reprojects those labels will transform with the terrain. Those labels may also be smaller or larger due to scale differences.
- **Pixel precision** will likely be blured or pixelated.

## Prior Art

- [OpenLayers Image Reprojection](https://openlayers.org/doc/tutorials/raster-reprojection.html)
- [Tiles à la Google Maps](https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/) and [globalmaptiles.js](https://github.com/datalyze-solutions/globalmaptiles/blob/master/globalmaptiles.js) for map tile conversion
- [Raster Reprojection (Mike Bostock)](https://bl.ocks.org/mbostock/4329423)
- [Reprojected Raster Tiles (Jason Davies)](https://www.jasondavies.com/maps/raster/)
- [A stackoverflow deep dive on reprojecting map tiles in d3 (Andrew Reid)](https://stackoverflow.com/a/56642588)

## Tests

```bash
npm run lint
npm run test
npm run e2e
```

## Development

1. Update the `CHANGELOG.md` with new version and commit the change.
1. Run `npm version ...` or somethign similar or tag manually
1. Push tag to remote `git push --tags`
1. [Optional] Run the `publish` workflow with tag
