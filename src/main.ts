import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { maplibreTileAdapterProtocol, epsg4326ToEpsg3857Presets } from '../lib';
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="map"></div>
  <div class="legend">
    <label class="legendItem">
      <input type="checkbox" class="layerCheckbox" name="basic4326-layer" checked />
      EPSG:4326
    </label>
    <label class="legendItem">
      <input type="checkbox" class="layerCheckbox" name="local4326-layer" />
      EPSG:4326 (Local)
    </label>
  </div>
`;

const { protocol, loader } = maplibreTileAdapterProtocol({
  tileSize: 256,
  interval: [256, 1],
  ...epsg4326ToEpsg3857Presets()
});

maplibregl.addProtocol(protocol, loader);

const map = new maplibregl.Map({
  container: document.getElementById('map')!,
  style: {
    version: 8,
    sources: {
      'osm': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        scheme: 'xyz'
      },
      'basic4326': {
        type: 'raster',
        tiles: [`mta://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://https://api.maptiler.com/maps/basic-4326/256/{sz}/{sx}/{sy}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`],
        tileSize: 256,
        scheme: 'xyz'
      },
      'local4326': {
        type: 'raster',
        tiles: ['mta://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}://http://localhost:5173/maptiler-epsg4326/{sz}/{sx}/{sy}.png'],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 12,
        scheme: 'xyz'
      },
    },
    layers: [
      {
        id: 'osm-layer',
        source: 'osm',
        type: 'raster',
      },
      {
        id: 'basic4326-layer',
        source: 'basic4326',
        type: 'raster',
      },
      {
        id: 'local4326-layer',
        source: 'local4326',
        type: 'raster',
        layout: {
          visibility: 'none'
        }
      },
    ]
  },
  center: [0, 45],
  zoom: 3
});

function updateVisibility(layerId: string, isVisible: boolean) {
  const visibility = isVisible ? 'visible' : 'none';
  map.setLayoutProperty(layerId, 'visibility', visibility);
}

function handleLayerCheckboxChange(event: any) {
  updateVisibility(event.target.name, event.target.checked)
};

const checkboxes = document.getElementsByClassName('layerCheckbox');

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', handleLayerCheckboxChange);
}
