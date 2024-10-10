import { Epsg4326ToEpsg3857PresetOptions, epsg4326ToEpsg3857Presets } from '../epsg4326ToEpsg3857Presets';

const origin = {
  lngLat: [0, 0],
  meters: [0, 0],
  case0: {
    tileSize: 256,
    zoom: 0,
    destinationPixels: [128, 128],
    sourcePixels: [256, 128], // zoom 0 is [2, 1] matrix
  },
  case1: {
    tileSize: 256,
    zoom: 12,
    destinationPixels: [524288, 524288],
    sourcePixels: [1048576, 524288],
  },
  case2: {
    tileSize: 512,
    zoom: 12,
    destinationPixels: [1048576, 1048576],
    sourcePixels: [2097152, 1048576],
  }
};

const nw = {
  lngLat: [-77.035278, 38.889484],
  meters: [-8575527.920078263, 4705853.444521514],
  case0: {
    tileSize: 256,
    zoom: 7,
    destinationPixels: [9372.07780693334, 12536.181123718103],
    sourcePixels: [18744.155613866664, 9304.385490488889],
    tileTms: [36, 79, 7],
    tileXyz: [36, 48, 7],
    tileBBox: [-8766409.899970295, 4696291.017841227, -8453323.832114212, 5009377.085697312],
    quadkey: '0320100' 
  }
};

const ne = {
  lngLat: [2.294694, 48.858093],
  meters: [255444.1676063798, 6250816.957680244],
  case0: {
    tileSize: 256,
    zoom: 7,
    destinationPixels: [16592.8681472, 11272.916162498423],
    sourcePixels: [33185.7362944,  7489.655603200001],
    tileTms: [64, 83, 7],
    tileXyz: [64, 44, 7],
    tileBBox: [0, 5948635.289265558, 313086.06785608083, 6261721.357121639],
    quadkey: '1202200' 
  }
};

const sw = {
  lngLat: [-43.211180, -22.951871],
  meters: [-4810246.554176482, -2626199.2859215615],
  case0: {
    tileSize: 256,
    zoom: 7,
    destinationPixels: [12450.82237155556, 18531.355268152536],
    sourcePixels: [24901.644743111112, 20562.260605155556],
    tileTms: [48, 55, 7],
    tileXyz: [48, 72, 7],
    tileBBox: [-5009377.085697312, -2817774.6107047386, -4696291.017841229, -2504688.542848654],
    quadkey: '2112000' 
  }
};

const se = {
  lngLat: [151.215256, -33.856159],
  meters: [16833205.298094492, -4009504.0084923566],
  case0: {
    tileSize: 256,
    zoom: 7,
    destinationPixels: [30147.94863502221, 19662.43724635447],
    sourcePixels: [60295.89727004444, 22547.325656177778],
    tileTms: [117, 51, 7],
    tileXyz: [117, 76, 7],
    tileBBox: [16593561.59637234, -4070118.8821290657, 16906647.66422843, -3757032.814272983],
    quadkey: '3112301' 
  }
};

type DestinationTileToSourceTilesTestCase = { 
  options?: Epsg4326ToEpsg3857PresetOptions,
  destinationTile: { tile: number[]; bbox: number[] };
  sourceTiles: { tile: number[]; bbox: number[] }[]
}

describe('destinationTileToSourceTiles', () => {
  const cases: DestinationTileToSourceTilesTestCase[] = [
    {
      destinationTile: { tile: [0, 0, 0], bbox: [-180, -90, 180, 90] },
      sourceTiles: [],
    },
    {
      destinationTile: { tile: [0, 0, 1], bbox: [-180, 0, 0, 90] },
      sourceTiles: [
        { tile: [0, 0, 0], bbox: [-180, -90, 0, 90] }, 
      ],
    },
    {
      destinationTile: { tile: nw.case0.tileXyz, bbox: nw.case0.tileBBox },
      sourceTiles: [
        { tile: [36, 17, 6], bbox: [-78.75, 39.375, -75.9375, 42.1875] }, 
        { tile: [36, 18, 6], bbox: [-78.75, 36.5625, -75.9375, 39.375] }
      ],
    },
    {
      destinationTile: { tile: ne.case0.tileXyz, bbox: ne.case0.tileBBox },
      sourceTiles: [
        { tile: [64, 14, 6], bbox: [0, 47.8125, 2.8125, 50.625] }, 
        { tile: [64, 15, 6], bbox: [0, 45, 2.8125, 47.8125] }
      ],
    },
    {
      destinationTile: { tile: sw.case0.tileXyz, bbox: sw.case0.tileBBox },
      sourceTiles: [
        { tile: [48, 39, 6], bbox: [-45, -22.5, -42.1875, -19.6875] }, 
        { tile: [48, 40, 6], bbox: [-45, -25.3125, -42.1875, -22.5] }
      ],
    },
    {
      destinationTile: { tile: se.case0.tileXyz, bbox: se.case0.tileBBox },
      sourceTiles: [
        { tile: [117, 43, 6], bbox: [149.0625, -33.75, 151.875, -30.9375] }, 
        { tile: [117, 44, 6], bbox: [149.0625, -36.5625, 151.875, -33.75] }
      ],
    },
    {
      options: { zoomOffset: 0 },
      destinationTile: { tile: [0, 0, 0], bbox: [-180, -90, 180, 90] },
      sourceTiles: [
        { tile: [0, 0, 0], bbox: [-180, -90, 0, 90] }, 
        { tile: [1, 0, 0], bbox: [0, -90, 180, 90] }
      ],
    },
    {
      destinationTile: { tile: nw.case0.tileXyz, bbox: nw.case0.tileBBox },
      options: { zoomOffset: 0 },
      sourceTiles: [
        { tile: [72, 34, 7], bbox: [-78.75, 40.78125, -77.34375, 42.1875] }, 
        { tile: [72, 35, 7], bbox: [-78.75, 39.375, -77.34375, 40.78125] },
        { tile: [72, 36, 7], bbox: [-78.75, 37.96875, -77.34375, 39.375] }, 
        { tile: [73, 34, 7], bbox: [-77.34375, 40.78125, -75.9375, 42.1875] },
        { tile: [73, 35, 7], bbox: [-77.34375, 39.375, -75.9375, 40.78125] }, 
        { tile: [73, 36, 7], bbox: [-77.34375, 37.96875, -75.9375, 39.375] },
      ],
    },
  ];

  test.each(
    cases.map(d => [
      `[${d.destinationTile.tile}]${d.options ? ' ' + JSON.stringify(d.options) : ''}`, 
      d.destinationTile, 
      d.options, 
      d.sourceTiles
    ])
  )('should return correct epsg4326 tiles - %s', (label, destinationTile, options, sourceTiles) => {
    const presets = epsg4326ToEpsg3857Presets(options);
    const output = presets.destinationTileToSourceTiles(destinationTile);
    expect(output).toStrictEqual(sourceTiles);
  });
});

describe('destinationToPixel', () => {
  test.each([
    ['origin', origin.meters, origin.case0.zoom, origin.case0.tileSize, origin.case0.destinationPixels],
    ['origin z12', origin.meters, origin.case1.zoom, origin.case1.tileSize, origin.case1.destinationPixels],
    ['origin z12 512', origin.meters, origin.case2.zoom, origin.case2.tileSize, origin.case2.destinationPixels],
    ['nw', nw.meters, nw.case0.zoom, nw.case0.tileSize, nw.case0.destinationPixels],
    ['ne', ne.meters, ne.case0.zoom, ne.case0.tileSize, ne.case0.destinationPixels],
    ['sw', sw.meters, sw.case0.zoom, sw.case0.tileSize, sw.case0.destinationPixels],
    ['se', se.meters, se.case0.zoom, se.case0.tileSize, se.case0.destinationPixels],
  ])('should convert meters to screen pixels - %s', (label, meters, zoom, tileSize, pixels) => {
    const presets = epsg4326ToEpsg3857Presets();
    const output = presets.destinationToPixel(meters, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(pixels[0], 7),
      expect.closeTo(pixels[1], 7),
    ]);
  });
});

describe('destinationToSource', () => {
  test.each([
    ['origin', origin.meters, origin.lngLat],
    ['nw', nw.meters, nw.lngLat],
    ['ne', ne.meters, ne.lngLat],
    ['sw', sw.meters, sw.lngLat],
    ['se', se.meters, se.lngLat],
  ])('should convert meters to lngLat - %s', (label, meters, lngLat) => {
    const presets = epsg4326ToEpsg3857Presets();
    const output = presets.destinationToSource(meters);
    expect(output).toStrictEqual([
      expect.closeTo(lngLat[0], 7),
      expect.closeTo(lngLat[1], 7),
    ]);
  });
});

describe('pixelToDestination', () => {
  test.each([
    ['origin', origin.case0.destinationPixels, origin.case0.zoom, origin.case0.tileSize, origin.meters],
    ['origin z12', origin.case1.destinationPixels, origin.case1.zoom, origin.case1.tileSize, origin.meters],
    ['origin z12 512', origin.case2.destinationPixels, origin.case2.zoom, origin.case2.tileSize, origin.meters],
    ['nw', nw.case0.destinationPixels, nw.case0.zoom, nw.case0.tileSize, nw.meters],
    ['ne', ne.case0.destinationPixels, ne.case0.zoom, ne.case0.tileSize, ne.meters],
    ['sw', sw.case0.destinationPixels, sw.case0.zoom, sw.case0.tileSize, sw.meters],
    ['se', se.case0.destinationPixels, se.case0.zoom, se.case0.tileSize, se.meters],
  ])('should convert screen pixels to meters - %s', (label, pixels, zoom, tileSize, meters) => {
    const presets = epsg4326ToEpsg3857Presets();
    const output = presets.pixelToDestination(pixels, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(meters[0], 7),
      expect.closeTo(meters[1], 7),
    ]);
  });
});

describe('sourceToPixel', () => {
  test.each([
    ['origin', origin.lngLat, origin.case0.zoom, origin.case0.tileSize, origin.case0.sourcePixels],
    ['origin z12', origin.lngLat, origin.case1.zoom, origin.case1.tileSize, origin.case1.sourcePixels],
    ['origin z12 512', origin.lngLat, origin.case2.zoom, origin.case2.tileSize, origin.case2.sourcePixels],
    ['nw', nw.lngLat, nw.case0.zoom, nw.case0.tileSize, nw.case0.sourcePixels],
    ['ne', ne.lngLat, ne.case0.zoom, ne.case0.tileSize, ne.case0.sourcePixels],
    ['sw', sw.lngLat, sw.case0.zoom, sw.case0.tileSize, sw.case0.sourcePixels],
    ['se', se.lngLat, se.case0.zoom, se.case0.tileSize, se.case0.sourcePixels],
  ])('should convert lngLat to screen pixels - %s', (label, lngLat, zoom, tileSize, pixels) => {
    const presets = epsg4326ToEpsg3857Presets();
    const output = presets.sourceToPixel(lngLat, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(pixels[0], 7),
      expect.closeTo(pixels[1], 7),
    ]);
  });
});
