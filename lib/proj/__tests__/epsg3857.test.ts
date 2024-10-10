import * as epsg3857 from '../epsg3857';

const origin = {
  lngLat: [0, 0],
  meters: [0, 0],
  z0: {
    tileSize: 256,
    zoom: 0,
    pixels: [128, 128],
    screen: [128, 128],
    tileTms: [0, 0, 0],
    tileXyz: [0, 0, 0],
    tileBBox: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
    quadkey: '' 
  }
};

const nw = {
  lngLat: [-77.035278, 38.889484],
  meters: [-8575527.920078263, 4705853.444521514],
  z7: {
    tileSize: 256,
    zoom: 7,
    pixels: [9372.07780693334, 20231.818876281897],
    screen: [9372.07780693334, 12536.181123718103],
    tileTms: [36, 79, 7],
    tileXyz: [36, 48, 7],
    tileBBox: [-8766409.899970295, 4696291.017841227, -8453323.832114212, 5009377.085697312],
    quadkey: '0320100' 
  }
};

const ne = {
  lngLat: [2.294694, 48.858093],
  meters: [255444.1676063798, 6250816.957680244],
  z7: {
    tileSize: 256,
    zoom: 7,
    pixels: [16592.8681472, 21495.083837501577],
    screen: [16592.8681472, 11272.916162498423],
    tileTms: [64, 83, 7],
    tileXyz: [64, 44, 7],
    tileBBox: [0, 5948635.289265558, 313086.06785608083, 6261721.357121639],
    quadkey: '1202200' 
  }
};

const sw = {
  lngLat: [-43.211180, -22.951871],
  meters: [-4810246.554176482, -2626199.2859215615],
  z7: {
    tileSize: 256,
    zoom: 7,
    pixels: [12450.82237155556, 14236.644731847464],
    screen: [12450.82237155556, 18531.355268152536],
    tileTms: [48, 55, 7],
    tileXyz: [48, 72, 7],
    tileBBox: [-5009377.085697312, -2817774.6107047386, -4696291.017841229, -2504688.542848654],
    quadkey: '2112000' 
  }
};

const se = {
  lngLat: [151.215256, -33.856159],
  meters: [16833205.298094492, -4009504.0084923566],
  z7: {
    tileSize: 256,
    zoom: 7,
    pixels:   [30147.94863502221, 13105.562753645527],
    screen: [30147.94863502221, 19662.43724635447],
    tileTms: [117, 51, 7],
    tileXyz: [117, 76, 7],
    tileBBox: [16593561.59637234, -4070118.8821290657, 16906647.66422843, -3757032.814272983],
    quadkey: '3112301' 
  }
};

const leafs = {
  leaf0: {
    tileTms: [3, 4, 3],
    quadkey: '033',
  },
  leaf1: {
    tileTms: [4, 4, 3],
    quadkey: '122',
  },
  leaf2: {
    tileTms: [3, 3, 3],
    quadkey: '211',
  },
  leaf3: {
    tileTms: [4, 3, 3],
    quadkey: '300',
  },
}

describe('getResolution', () => {
  const initialResolution = 156543.03392804097;

  test.each([
    ['zoom 0', 0, 256, initialResolution],
    ['zoom 7', 7, 256, 1222.99245256282],
    ['zoom 0 different tile size', 0, 512, initialResolution / 2],
  ])('should return correct meters/pixel - %s', (label, zoom, tileSize, res) => {
    const output = epsg3857.getResolution(zoom, tileSize);
    expect(output).toBe(res);
  });
});

describe('lngLatToMeters', () => {
  test.each([
    ['origin', origin.lngLat, origin.meters],
    ['nw', nw.lngLat, nw.meters],
    ['ne', ne.lngLat, ne.meters],
    ['sw', sw.lngLat, sw.meters],
    ['se', se.lngLat, se.meters],
  ])('should return correct meters - %s', (label, lngLat, meters) => {
    const output = epsg3857.lngLatToMeters(lngLat);
    expect(output).toStrictEqual([
      expect.closeTo(meters[0], 7),
      expect.closeTo(meters[1], 7),
    ]);
  });
});

describe('metersToLngLat', () => {
  test.each([
    ['origin', origin.meters, origin.lngLat],
    ['nw', nw.meters, nw.lngLat],
    ['ne', ne.meters, ne.lngLat],
    ['sw', sw.meters, sw.lngLat],
    ['se', se.meters, se.lngLat],
  ])('should return correct decimal degrees - %s', (label, meters, lngLat) => {
    const output = epsg3857.metersToLngLat(meters);
    expect(output).toStrictEqual([
      expect.closeTo(lngLat[0], 7),
      expect.closeTo(lngLat[1], 7),
    ]);
  });
});

describe('metersToPixels', () => {
  test.each([
    ['origin', origin.meters, origin.z0.zoom, origin.z0.tileSize, origin.z0.pixels],
    ['nw', nw.meters, nw.z7.zoom, nw.z7.tileSize, nw.z7.pixels],
    ['ne', ne.meters, ne.z7.zoom, ne.z7.tileSize, ne.z7.pixels],
    ['sw', sw.meters, sw.z7.zoom, sw.z7.tileSize, sw.z7.pixels],
    ['se', se.meters, se.z7.zoom, se.z7.tileSize, se.z7.pixels],
  ])('should return correct pixels - %s', (label, meters, zoom, tileSize, pixels) => {
    const output = epsg3857.metersToPixels(meters, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(pixels[0], 7),
      expect.closeTo(pixels[1], 7),
    ]);
  });
});

describe('pixelsToMeters', () => {
  test.each([
    ['origin', origin.z0.pixels, origin.z0.zoom, origin.z0.tileSize, origin.meters],
    ['nw', nw.z7.pixels, nw.z7.zoom, nw.z7.tileSize, nw.meters],
    ['ne', ne.z7.pixels, ne.z7.zoom, ne.z7.tileSize, ne.meters],
    ['sw', sw.z7.pixels, sw.z7.zoom, sw.z7.tileSize, sw.meters],
    ['se', se.z7.pixels, se.z7.zoom, se.z7.tileSize, se.meters],
  ])('should return correct meters - %s', (label, pixels, zoom, tileSize, meters) => {
    const output = epsg3857.pixelsToMeters(pixels, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(meters[0], 7),
      expect.closeTo(meters[1], 7),
    ]);
  });
});

describe('pixelsToTile', () => {
  test.each([
    ['origin', origin.z0.pixels, origin.z0.zoom, origin.z0.tileSize, origin.z0.tileTms],
    ['nw', nw.z7.pixels, nw.z7.zoom, nw.z7.tileSize, nw.z7.tileTms],
    ['ne', ne.z7.pixels, ne.z7.zoom, ne.z7.tileSize, ne.z7.tileTms],
    ['sw', sw.z7.pixels, sw.z7.zoom, sw.z7.tileSize, sw.z7.tileTms],
    ['se', se.z7.pixels, se.z7.zoom, se.z7.tileSize, se.z7.tileTms],
  ])('should return correct tile - %s', (label, pixels, zoom, tileSize, tile) => {
    const output = epsg3857.pixelsToTile(pixels, zoom, tileSize);
    expect(output).toStrictEqual(tile);
  });
});

describe('pixelsToScreenPixels', () => {
  test.each([
    ['origin', origin.z0.pixels, origin.z0.zoom, origin.z0.tileSize, origin.z0.screen],
    ['nw', nw.z7.pixels, nw.z7.zoom, nw.z7.tileSize, nw.z7.screen],
    ['ne', ne.z7.pixels, ne.z7.zoom, ne.z7.tileSize, ne.z7.screen],
    ['sw', sw.z7.pixels, sw.z7.zoom, sw.z7.tileSize, sw.z7.screen],
    ['se', se.z7.pixels, se.z7.zoom, se.z7.tileSize, se.z7.screen],
  ])('should return correct screen pixels (origin top left) - %s', (label, pixels, zoom, tileSize, screen) => {
    const output = epsg3857.pixelsToScreenPixels(pixels, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(screen[0], 7),
      expect.closeTo(screen[1], 7),
    ]);
  });
});

describe('screenPixelsToPixels', () => {
  test.each([
    ['origin', origin.z0.screen, origin.z0.zoom, origin.z0.tileSize, origin.z0.pixels],
    ['nw', nw.z7.screen, nw.z7.zoom, nw.z7.tileSize, nw.z7.pixels],
    ['ne', ne.z7.screen, ne.z7.zoom, ne.z7.tileSize, ne.z7.pixels],
    ['sw', sw.z7.screen, sw.z7.zoom, sw.z7.tileSize, sw.z7.pixels],
    ['se', se.z7.screen, se.z7.zoom, se.z7.tileSize, se.z7.pixels],
  ])('should return correct pixels (origin bottom left) - %s', (label, screen, zoom, tileSize, pixels) => {
    const output = epsg3857.screenPixelsToPixels(screen, zoom, tileSize);
    expect(output).toStrictEqual([
      expect.closeTo(pixels[0], 7),
      expect.closeTo(pixels[1], 7),
    ]);
  });
});

describe('lngLatToTile', () => {
  test.each([
    ['origin', origin.lngLat, origin.z0.zoom, origin.z0.tileSize, origin.z0.tileTms],
    ['nw', nw.lngLat, nw.z7.zoom, nw.z7.tileSize, nw.z7.tileTms],
    ['ne', ne.lngLat, ne.z7.zoom, ne.z7.tileSize, ne.z7.tileTms],
    ['sw', sw.lngLat, sw.z7.zoom, sw.z7.tileSize, sw.z7.tileTms],
    ['se', se.lngLat, se.z7.zoom, se.z7.tileSize, se.z7.tileTms],
  ])('should return correct tile - %s', (label, lngLat, zoom, tileSize, tile) => {
    const output = epsg3857.lngLatToTile(lngLat, zoom, tileSize);
    expect(output).toStrictEqual(tile);
  });
});

describe('metersToTile', () => {
  test.each([
    ['origin', origin.meters, origin.z0.zoom, origin.z0.tileSize, origin.z0.tileTms],
    ['nw', nw.meters, nw.z7.zoom, nw.z7.tileSize, nw.z7.tileTms],
    ['ne', ne.meters, ne.z7.zoom, ne.z7.tileSize, ne.z7.tileTms],
    ['sw', sw.meters, sw.z7.zoom, sw.z7.tileSize, sw.z7.tileTms],
    ['se', se.meters, se.z7.zoom, se.z7.tileSize, se.z7.tileTms],
  ])('should return correct tile - %s', (label, meters, zoom, tileSize, tile) => {
    const output = epsg3857.metersToTile(meters, zoom, tileSize);
    expect(output).toStrictEqual(tile);
  });
});

describe('tileBbox', () => {
  test.each([
    ['origin', origin.z0.tileTms, origin.z0.tileSize, origin.z0.tileBBox],
    ['nw', nw.z7.tileTms, nw.z7.tileSize, nw.z7.tileBBox],
    ['ne', ne.z7.tileTms, ne.z7.tileSize, ne.z7.tileBBox],
    ['sw', sw.z7.tileTms, sw.z7.tileSize, sw.z7.tileBBox],
    ['se', se.z7.tileTms, se.z7.tileSize, se.z7.tileBBox],
  ])('should return correct tile bbox in meters - %s', (label, tile, tileSize, bbox) => {
    const output = epsg3857.tileBbox(tile, tileSize);
    expect(output).toStrictEqual(bbox);
  });
});

describe('tmsToXyz', () => {
  test.each([
    ['origin', [0, 0, 0], [0, 0, 0]],
    ['nw', nw.z7.tileTms, nw.z7.tileXyz],
    ['ne', ne.z7.tileTms, ne.z7.tileXyz],
    ['sw', sw.z7.tileTms, sw.z7.tileXyz],
    ['se', se.z7.tileTms, se.z7.tileXyz],
  ])('should return correct xyz tile - %s', (label, tile, tileXyz) => {
    const output = epsg3857.tmsToXyz(tile);
    expect(output).toStrictEqual(tileXyz);
  });
});

describe('xyzToTms', () => {
  test.each([
    ['origin', [0, 0, 0], [0, 0, 0]],
    ['nw', nw.z7.tileXyz, nw.z7.tileTms],
    ['ne', ne.z7.tileXyz, ne.z7.tileTms],
    ['sw', sw.z7.tileXyz, sw.z7.tileTms],
    ['se', se.z7.tileXyz, se.z7.tileTms],
  ])('should return correct tms tile - %s', (label, tileXyz, tile) => {
    const output = epsg3857.xyzToTms(tileXyz);
    expect(output).toStrictEqual(tile);
  });
});

describe('tileToQuadkey', () => {
  test.each([
    ['origin', origin.z0.tileTms, origin.z0.quadkey],
    ['leaf 0', leafs.leaf0.tileTms, leafs.leaf0.quadkey],
    ['leaf 1', leafs.leaf1.tileTms, leafs.leaf1.quadkey],
    ['leaf 2', leafs.leaf2.tileTms, leafs.leaf2.quadkey],
    ['leaf 3', leafs.leaf3.tileTms, leafs.leaf3.quadkey],
    ['nw', nw.z7.tileTms, nw.z7.quadkey],
    ['ne', ne.z7.tileTms, ne.z7.quadkey],
    ['sw', sw.z7.tileTms, sw.z7.quadkey],
    ['se', se.z7.tileTms, se.z7.quadkey],
  ])('should return correct quadkey - %s', (label, tile, quadkey) => {
    const output = epsg3857.tileToQuadkey(tile);
    expect(output).toStrictEqual(quadkey);
  });
});

describe('quadkeyToTile', () => {
  test.each([
    ['origin', origin.z0.quadkey, origin.z0.tileTms],
    ['leaf 0', leafs.leaf0.quadkey, leafs.leaf0.tileTms],
    ['leaf 1', leafs.leaf1.quadkey, leafs.leaf1.tileTms],
    ['leaf 2', leafs.leaf2.quadkey, leafs.leaf2.tileTms],
    ['leaf 3', leafs.leaf3.quadkey, leafs.leaf3.tileTms],
    ['nw', nw.z7.quadkey, nw.z7.tileTms],
    ['ne', ne.z7.quadkey, ne.z7.tileTms],
    ['sw', sw.z7.quadkey, sw.z7.tileTms],
    ['se', se.z7.quadkey, se.z7.tileTms],
  ])('should return correct tile - %s', (label, quadkey, tile) => {
    const output = epsg3857.quadkeyToTile(quadkey);
    expect(output).toStrictEqual(tile);
  });
});