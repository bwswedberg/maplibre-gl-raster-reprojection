import type { GetResourceResponse, RequestParameters } from "maplibre-gl";
import type { MapTileAdapterContext, MapTileAdapterOptions } from "lib/types";
import { canvasToArrayBuffer, fetchImage, TileCache } from "lib/util";
import { loadTile } from "./loadTile";
import { parseCustomProtocolRequestUrl, getImageUrl } from "./util/url";

const MTA_PROTOCOL = "mta";

const loader = async (
  ctx: MapTileAdapterContext,
  reqParams: RequestParameters,
  abortController: AbortController
): Promise<GetResourceResponse<any>> => {
  const request = parseCustomProtocolRequestUrl(reqParams.url);
  const _ctx: MapTileAdapterContext = {
    ...ctx,
    sourceTileSize: request.sourceTileSize ?? ctx.sourceTileSize,
    destinationTileSize: request.destinationTileSize ?? ctx.destinationTileSize,
    interval: request.interval ?? ctx.interval
  };

  const sourceRequests = _ctx
    .destinationTileToSourceTiles({
      bbox: request.bbox,
      tile: request.tile
    })
    .map((d) => ({
      ...d,
      url: getImageUrl(request.urlTemplate, d.tile, d.bbox)
    }));

  const destination = await loadTile({
    ctx: _ctx,
    sourceRequests,
    destinationRequest: { tile: request.tile, bbox: request.bbox },
    checkCanceled: () => abortController.signal.aborted
  });
  if (!destination) return { data: null };
  const img = await canvasToArrayBuffer(destination.canvas);
  return { data: img };
};

interface MaplibreTileAdapterOptions extends MapTileAdapterOptions {
  protocol?: string;
}

export const maplibreTileAdapterProtocol = (options: MaplibreTileAdapterOptions) => {
  const cache = new TileCache<HTMLImageElement | null>({
    fetchTile: (url) => fetchImage(url),
    maxCache: options.cacheSize ?? 10
  });
  const destinationTileSize = options?.destinationTileSize ?? options?.tileSize ?? 256;
  const ctx: MapTileAdapterContext = {
    cache,
    destinationTileSize,
    destinationTileToSourceTiles: options.destinationTileToSourceTiles,
    destinationToPixel: options.destinationToPixel,
    destinationToSource: options.destinationToSource,
    interval: options?.interval ?? [destinationTileSize, destinationTileSize],
    pixelToDestination: options.pixelToDestination,
    sourceTileSize: options?.sourceTileSize ?? destinationTileSize,
    sourceToPixel: options.sourceToPixel
  };
  return {
    protocol: `${options?.protocol ?? MTA_PROTOCOL}`,
    tileUrlPrefix: `${options?.protocol ?? MTA_PROTOCOL}://bbox={bbox-epsg-3857}&z={z}&x={x}&y={y}`,
    loader: loader.bind(null, ctx)
  };
};
