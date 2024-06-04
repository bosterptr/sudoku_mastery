/* eslint-disable no-param-reassign */
import { PROJECT_EPSILON } from 'app/core/constants/sudoku';
import { expose } from 'comlink';
import initSolverModule, { project, solve } from 'sudoku_wasm';
import { extractDigits, init as initTensorflowModel } from './utils/extractDigits';

const RGBA_CHANNELS = 4;

export default {} as typeof Worker & { new (): Worker };

export const convertGrayScaleToImageData = (
  imageCanvas: Uint8Array,
  width: number,
  height: number,
  RGBAData: Uint8ClampedArray,
  RGBADataSize: number,
): ImageData => {
  if (!RGBAData || RGBADataSize !== width * height * RGBA_CHANNELS) {
    RGBAData = new Uint8ClampedArray(width * height * RGBA_CHANNELS);
    RGBADataSize = width * height * RGBA_CHANNELS;
  }

  for (let i = 0; i < imageCanvas.length; i += 1) {
    RGBAData[i * RGBA_CHANNELS] = imageCanvas[i];
    RGBAData[i * RGBA_CHANNELS + 1] = imageCanvas[i];
    RGBAData[i * RGBA_CHANNELS + 2] = imageCanvas[i];
    RGBAData[i * RGBA_CHANNELS + 3] = 255;
  }
  return new ImageData(RGBAData, width, height);
};

export class WebWorkerProcessor {
  private loaded: boolean = false;

  public async init() {
    await initSolverModule();
    await initTensorflowModel();
    this.loaded = true;
  }

  public async getSudoku(
    imageData: Uint8Array,
    width: number,
    height: number,
  ): Promise<string | null> {
    if (!this.loaded) {
      await this.init();
    }
    const projectedImage = project(imageData, width, height, PROJECT_EPSILON);
    if (projectedImage.length !== 0) {
      const sudoku = extractDigits(projectedImage);
      const solvedSudoku = solve(sudoku);
      console.log(sudoku);
      if (solvedSudoku !== '') {
        return sudoku;
      }
    }
    return null;
  }
}

expose(WebWorkerProcessor);
