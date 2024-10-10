import path from "node:path";
import fs from "node:fs";
import { Canvas, loadImage } from "canvas";
import { Tile } from "lib/types";

/**
 * Gets the png buffer for a test canvas which is typeds as HTMLCanvasElement but is actually a Canvas fron node-canvas
 * @param canvas node-canvas in disguise
 * @returns
 */
export const createTestCanvasImage = (canvas: HTMLCanvasElement) => {
  const buffer = (canvas as unknown as Canvas).toBuffer();
  return buffer;
};

export const getMaptilerEpsg4326Url = ([x, y, z]: Tile): string => {
  return path.resolve(__dirname, `./assets/maptiler-epsg4326/${z}/${x}/${y}.png`);
};

export const getTestHTMLImageElement = async (url: string): Promise<HTMLImageElement | null> => {
  if (!fs.existsSync(url)) return null;
  const image = (await loadImage(url)) as unknown as HTMLImageElement;
  return image;
};
