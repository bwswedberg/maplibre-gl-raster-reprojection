import type { GetResourceResponse, RequestParameters } from "maplibre-gl";
import type { MapTileAdapterContext } from "lib/types";
import { canvasToArrayBuffer } from "lib/util";
import { loadTile } from "./loadTile";
import { parseCustomProtocolRequestUrl, getImageUrl } from "./url";

export const loader = async (
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
