import { LayersModel, loadLayersModel, reshape, tensor2d } from '@tensorflow/tfjs';

const indexOfMaxValue = <T>(
  a: T[],
  func: (param: T) => number = ((i) => i) as (param: T) => number,
) => a.reduce((iMax, x, i, arr) => (func(x) > func(arr[iMax]) ? i : iMax), 0);

let model: LayersModel;
const CELLS_IN_ROW = 9;
const CELL_WIDTH = 20;
const TOTAL_CELLS = CELLS_IN_ROW * CELLS_IN_ROW;
const IMAGE_WIDTH = CELLS_IN_ROW * CELL_WIDTH;
const CELL_PIXEL_COUNT = CELL_WIDTH * CELL_WIDTH;

function extractCube(src: Uint8Array, x: number, y: number): Uint8Array {
  if (x < 0 || y < 0 || x + CELL_WIDTH > IMAGE_WIDTH || y + CELL_WIDTH > IMAGE_WIDTH) {
    throw new Error('Starting point out of bounds');
  }
  const cube = new Uint8Array(CELL_WIDTH * CELL_WIDTH);
  for (let row = 0; row < CELL_WIDTH; row += 1) {
    for (let col = 0; col < CELL_WIDTH; col += 1) {
      const srcIndex = (y + row) * IMAGE_WIDTH + (x + col);
      const cubeIndex = row * CELL_WIDTH + col;
      cube[cubeIndex] = src[srcIndex];
    }
  }

  return cube;
}

const init = async () => {
  model = await loadLayersModel('./models/model6.json');
};
const extractDigits = (cells: Uint8Array) => {
  const testDataArray = new Float32Array(IMAGE_WIDTH * IMAGE_WIDTH);
  for (let i = 0; i < TOTAL_CELLS; i += 1) {
    const x = (i % CELLS_IN_ROW) * CELL_WIDTH;
    const y = Math.floor(i / CELLS_IN_ROW) * CELL_WIDTH;
    const buffer = extractCube(cells, x, y);
    testDataArray.set(buffer, i * CELL_PIXEL_COUNT);
  }
  const testTensor = tensor2d(testDataArray, [TOTAL_CELLS, CELL_PIXEL_COUNT]);
  const reshaped = reshape(testTensor, [TOTAL_CELLS, CELL_WIDTH, CELL_WIDTH, 1]);
  const tensor = model.predict(reshaped);
  if (Array.isArray(tensor)) throw new Error();
  const prediction = tensor.dataSync();
  const predictionData: number[] = [];
  for (const num of prediction) {
    predictionData.push(num);
  }
  let result = '';
  for (let i = 0; i < TOTAL_CELLS; i += 1) {
    const cellPrediction = predictionData.slice(i * 10, i * 10 + 10);
    const digit = indexOfMaxValue(cellPrediction);
    result += digit === 0 ? '.' : digit;
  }
  return result;
};

export { extractDigits, init };
