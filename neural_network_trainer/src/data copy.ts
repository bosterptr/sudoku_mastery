/* eslint-disable no-param-reassign */
import * as tf from '@tensorflow/tfjs';

const WIDTH = 20;
const HEIGHT = 20;
const IMAGE_SIZE = WIDTH * HEIGHT;
const NUM_CLASSES = 10;
const NOISE_PASSES = 1;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const setPixel = (data: Uint8ClampedArray, idx: number, color: number) => {
  data[idx * 4] = color;
  data[idx * 4 + 1] = color;
  data[idx * 4 + 2] = color;
  data[idx * 4 + 3] = 255;
};
const setPixelPatch = (data: Uint8ClampedArray, idx: number, color: number) => {
  data[idx * 4] = color;
  data[idx * 4 + 1] = color;
  data[idx * 4 + 2] = color;
  data[idx * 4 + 3] = 255;
  data[idx * 4 + 4] = color;
  data[idx * 4 + 4 + 1] = color;
  data[idx * 4 + 4 + 2] = color;
  data[idx * 4 + 4 + 3] = 255;
  data[WIDTH * 4 + idx * 4] = color;
  data[WIDTH * 4 + idx * 4 + 1] = color;
  data[WIDTH * 4 + idx * 4 + 2] = color;
  data[WIDTH * 4 + idx * 4 + 3] = 255;
  data[WIDTH * 4 + idx * 4 + 4] = color;
  data[WIDTH * 4 + idx * 4 + 4 + 1] = color;
  data[WIDTH * 4 + idx * 4 + 4 + 2] = color;
  data[WIDTH * 4 + idx * 4 + 4 + 3] = 255;
};

const createBlackishNoise = (imageData: ImageData) => {
  for (let i = 0; i < NOISE_PASSES; i += 1) {
    setPixel(
      imageData.data,
      Math.floor(Math.random() * 20 * Math.random() * 20),
      Math.floor(Math.random()) * 100 + 155,
    );
    setPixelPatch(
      imageData.data,
      Math.floor(Math.random() * 20 * Math.random() * 20),
      Math.floor(Math.random()) * 100 + 155,
    );
  }
};

const createWhiteishNoise = (imageData: ImageData) => {
  for (let i = 0; i < NOISE_PASSES; i += 1) {
    setPixel(
      imageData.data,
      Math.floor(Math.random() * 20 * Math.random() * 20),
      Math.floor(Math.random()) * 10,
    );
    setPixelPatch(
      imageData.data,
      Math.floor(Math.random() * 20 * Math.random() * 20),
      Math.floor(Math.random()) * 10,
    );
  }
};
const angle = (Math.random() - 0.5) / 10;
const p = (val: number) => val + (Math.random() - 0.5) * 4;
const translateOffsetX = (Math.random() - 0.5) * 4;
const translateOffsetY = (Math.random() - 0.5) * 4;

export const createDigit = (number: number) => {
  if (!ctx) throw new Error();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.font = `${['lighter', 'normal', 'bold', 'bolder'][Math.floor(Math.random() * 4)]} ${p(
    20,
  )}px ${
    ['san serif', 'arial', 'Times', 'Helvetica', 'Georgia', 'Tahoma', 'Verana'][
      Math.floor(Math.random() * 7)
    ]
  }`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'black';

  ctx.translate(translateOffsetX, translateOffsetY);
  ctx.rotate(angle);

  if (number !== 0) {
    ctx.fillText(number.toString(), p(6), p(3));
  }
  const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  createBlackishNoise(imageData);
  createWhiteishNoise(imageData);
  if (number === 0) {
    createBlackishNoise(imageData);
    createWhiteishNoise(imageData);
  }

  ctx.rotate(-angle);
  ctx.translate(-translateOffsetX, -translateOffsetY);
  const buffer = new Float32Array(IMAGE_SIZE);

  for (let j = 0; j < imageData.data.length / 4; j += 1) {
    buffer[j] = imageData.data[j * 4] / 255;
  }

  return buffer;
};

export const nextBatch = (batchSize: number) => {
  const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
  const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

  for (let i = 0; i < batchSize; i += 1) {
    const number = Math.floor(Math.random() * 10);
    const digit = createDigit(number);
    batchImagesArray.set(digit, i * IMAGE_SIZE);

    const label = new Array(NUM_CLASSES).fill(0);
    label[number] = 1;
    batchLabelsArray.set(label, i * NUM_CLASSES);
  }

  const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
  const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

  return { xs, labels };
};

export const createBatchForSummary = () => {
  const batchImagesArray = new Float32Array(NUM_CLASSES * IMAGE_SIZE);
  const batchLabelsArray = new Uint8Array(NUM_CLASSES * NUM_CLASSES);

  for (let i = 0; i < 10; i += 1) {
    const number = i;
    const digit = createDigit(i);
    batchImagesArray.set(digit, i * IMAGE_SIZE);

    const label = new Array(NUM_CLASSES).fill(0);
    label[number] = 1;
    batchLabelsArray.set(label, i * NUM_CLASSES);
  }

  const xs = tf.tensor2d(batchImagesArray, [NUM_CLASSES, IMAGE_SIZE]);
  const labels = tf.tensor2d(batchLabelsArray, [NUM_CLASSES, NUM_CLASSES]);

  return { xs, labels };
};
