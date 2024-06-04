/* eslint-disable no-param-reassign */
import * as tf from '@tensorflow/tfjs';

const CELL_SIZE = 20
const CELLS_IN_ROW = 9
const CELLS_COUNT = CELLS_IN_ROW*CELLS_IN_ROW
const IMAGE_MISSION = '012345678901234567890123456789012345678901234567890123456789012345678901234567890'
const WIDTH = 20;
const HEIGHT = 20;
const NUM_CLASSES = 10;
const IMAGE_SIZE = WIDTH * HEIGHT;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

function loadImageAndProcess(url:string):Promise<ImageData[]> {
  return new Promise((resolve, reject) => {
      var img = new Image();
      img.crossOrigin = 'Anonymous'; // Use this if you're loading images from a different origin
      img.onload = function() {

          canvas.width = img.width;
          canvas.height = img.height;
          if(!ctx) throw new Error()
          ctx.drawImage(img, 0, 0);
          // var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // var data = imageData.data;
          // var buffer = new Float32Array(data.length / 4);
          // for (let j = 0; j < imageData.data.length / 4; j += 1) {
          //   buffer[j] = imageData.data[j * 4] / 255;
          // }
          const cells:ImageData[] = [];
          for(let row = 0; row < CELLS_IN_ROW; row++) {
            for(let col = 0; col < CELLS_IN_ROW; col++) {
                // Calculate the top-left pixel of the current cell
                const x = col * WIDTH;
                const y = row * HEIGHT
                // Extract the cell image data
                const cellImageData = ctx.getImageData(x, y, CELL_SIZE, CELL_SIZE);
                cells.push(cellImageData);
            }
          }
          resolve(cells);
      };
      img.onerror = reject;
      img.src = url;
  });
}

// Function to process each URL in the array
async function processImageURLs(imageURLs:string) {
  for (let url of imageURLs) {
      try {
          const cells = await loadImageAndProcess(url);
          console.log('Processed Float32Array for URL:', url);
      } catch (error) {
          console.error('Error processing image:', url, error);
      }
  }
}


export const getBatch = async (urls:string[]) => {
  const batchSize = urls.length
  const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE * CELLS_COUNT);
  const batchLabelsArray = new Uint8Array(batchSize * CELLS_COUNT* NUM_CLASSES);

  for (let i = 0; i< urls.length;i += 1) {
    const url = urls[i]
    const cells = await loadImageAndProcess(url);
    for (let cellIdx = 0; cellIdx< cells.length;cellIdx += 1){
      const batchArrayIndex = i*CELLS_COUNT + cellIdx
      const cell= cells[cellIdx]
      const buffer= []
      for (let j = 0; j <  cell.data.length / 4; j += 1) {
        buffer[j] =  cell.data[j * 4] / 255;
      }
      batchImagesArray.set(buffer, batchArrayIndex * IMAGE_SIZE);
      const label = new Array(NUM_CLASSES).fill(0);
      label[parseInt(IMAGE_MISSION[cellIdx])] = 1;
      batchLabelsArray.set(label, batchArrayIndex * NUM_CLASSES);
    }
  }
  const xs = tf.tensor2d(batchImagesArray, [batchSize * CELLS_COUNT, IMAGE_SIZE]);
  const labels = tf.tensor2d(batchLabelsArray, [batchSize*CELLS_COUNT, NUM_CLASSES]);
  return { xs, labels };
};
