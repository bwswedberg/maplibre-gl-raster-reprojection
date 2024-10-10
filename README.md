# Maplibre Gl Raster Reprojection

Reproject maplibre raster map tiles in the browser.

- **Problem:** Your map uses projection X but you've got need to use map tiles that are projected in Y.
- **Solution:** Use `maplibre-gl-raster-reprojection` to reproject your map tiles in the browser.

**[DEMO](https://bwswedberg.github.io/maplibre-gl-raster-reprojection/)**

## Purpose

This library is for when your maplibre map projection differs from your tile projection.

In a perfect world your map tiles would be in the same projection as your map. However, this is not always the case. Sometimes you may need to mix. For example,

- Your map and some of your tiles are in EPSG:3857 (web mercator), but you need to another tileset that is only served in EPSG:4326.
- Your map is in some exotic projection and there are only EPSG:3857 tile providers.

With `maplibre-gl-raster-reprojection`, you can proxy those tiles on the fly so that you can use those tiles.

## Tradeoffs

Map tiles are best used in their native projection. Reprojecting a tile almost always be suboptimal and most easily visualized in the following ways.

Use params like `interval`, `zoomOffset`, etc. to dial in the adapter to your needs.

### Visual effects

- **Text labels** will likely be distorted when reprojecting raster images. Labels are placed and "burned" into tiles. So when tile reprojects those labels will transform with the terrain. Those labels may also be smaller or larger due to scale differences.
- **Pixel precision** will likely be blured or pixelated.

### Example

```ts
import maplibregl from 'maplibre-gl';
import { maplibreRasterReprojectionProtocol, epsg4326ToEpsg3857Presets } from 'maplibre-gl-raster-reprojection';

const { protocol, loader } = maplibreRasterReprojectionProtocol({
  // Converts EPSG:4326 tile endpoint to EPSG:3857
  ...epsg4326ToEpsg3857Presets(),
  // Draw EPSG:3857 tile in 256 pixel width by 1 pixel height intervals (more accurate latitude)
  interval: [256, 1]
});

maplibregl.addProtocol(protocol, loader);

const map = new maplibregl.Map({
  style: {
    ...,
    sources: {
      version: 8,
      epsg4326Source: {
        type: 'raster',
        tiles: ['reproj://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://https://api.tilehost.com/map/{sz}/{sx}/{sy}.png'],
        tileSize: 256,
        scheme: 'xyz'
      }
    },
    layers: [
      { id: 'reprojLayer', source: 'epsg4326Source', type: 'raster' }
    ]
  }
})
```

## Prior Art

- [Tiles à la Google Maps](https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/) and [globalmaptiles.js](https://github.com/datalyze-solutions/globalmaptiles/blob/master/globalmaptiles.js) for map tile conversion
- [Raster Reprojection (Mike Bostock)](https://bl.ocks.org/mbostock/4329423)
- [Reprojected Raster Tiles (Jason Davies)](https://www.jasondavies.com/maps/raster/)
- [A stackoverflow deep dive on reprojecting map tiles in d3 (Andrew Reid)](https://stackoverflow.com/a/56642588)

## Development

1. Update the `CHANGELOG.md` with new version and commit the change.
1. Run `npm version ...` or somethign similar or tag manually
1. Push tag to remote `git push --tags`
1. Manually create a release in github which will trigger npm publish in github action
