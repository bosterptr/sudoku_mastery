import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';
import * as tfvis from '@tensorflow/tfjs-vis';
import '@tensorflow/tfjs-backend-webgl';
import { getBatch } from './data';
import datasetExport from'./datasetExport';
import testdatasetExport from'./testDatasetExport';
import testDatasetExport from './testDatasetExport';

const WIDTH = 20;
const HEIGHT = 20;

async function renderImage(
  container: HTMLElement,
  tensor: tf.Tensor<tf.Rank> | string
) {
  if (!container) throw new Error();
  if (typeof tensor === 'string') {
    const span = document.createElement('span');
    span.innerText = tensor;
    span.style.cssText = 'height:40px; width:40px;margin:4px;';
    container.appendChild(span);
  } else {
    const resized = tf.image
      .resizeNearestNeighbor(tensor as tf.Tensor3D, [HEIGHT, WIDTH])
      .clipByValue(0.0, 1.0);
    const canvas = document.createElement('canvas');
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    canvas.style.cssText = 'height:40px; width:40px; margin:4px;';
    tf.browser.toPixels(resized as tf.Tensor2D, canvas);
    resized.dispose();
    container.appendChild(canvas);
    tensor.dispose();
  }
}

// async function resetLayerWeights(layer: tf.layers.Layer): Promise<void> {
//   try {
//     console.log(layer.name);
//     layer.setWeights(
//       layer.getWeights().map((tensor) =>
//         tf.initializers
//           .varianceScaling({
//             scale: 1.0,
//             mode: 'fanAvg',
//             distribution: 'uniform',
//           })
//           .apply(tensor.shape),
//       ),
//     );
//   } catch (error) {
//     console.error('Error while loading or resetting the model:', error);
//   }
// }

async function showExamples(drawArea:HTMLElement) {
  const trainExamples = await getBatch(testdatasetExport);
  const numExamples = trainExamples.xs.shape[0];
  for (let i = 0; i < numExamples; i += 1) {
    const imageTensor = trainExamples.xs
      .slice([i, 0], [1, trainExamples.xs.shape[1]])
      .reshape([20, 20, 1]);
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 20;
    tf.browser.toPixels(imageTensor as tf.Tensor2D, canvas);
    imageTensor.dispose();
    drawArea.appendChild(canvas);
  }
  trainExamples.labels.dispose();
  trainExamples.xs.dispose();
}

function getConvActivation(
  input: tf.Tensor<tf.Rank>,
  model: tf.LayersModel,
  layer: {
    kernel: {
      val: tfc.Variable;
    };
    output: tf.SymbolicTensor | tf.SymbolicTensor[];
  }
): tf.Tensor<tf.Rank> {
  const activationModel = tf.model({
    inputs: model.input,
    outputs: layer.output,
  });
  const activation = activationModel.predict(input) as tf.Tensor<tf.Rank>;
  if (Array.isArray(activation)) throw new Error();
  return activation;
}

function getDepthwiseActivation(
  input: tf.Tensor<tf.Rank>,
  model: tf.LayersModel,
  layer: {
    depthwiseKernel: {
      val: tfc.Variable;
    };
    output: tf.SymbolicTensor | tf.SymbolicTensor[];
  }
): tf.Tensor<tf.Rank> {
  const activationModel = tf.model({
    inputs: model.input,
    outputs: layer.output,
  });
  const activation = activationModel.predict(input) as tf.Tensor<tf.Rank>;
  if (Array.isArray(activation)) throw new Error();
  return activation;
}
async function getConvActivationTable(
  epoch: number,
  drawArea: HTMLElement,
  model: tf.LayersModel,
  layerName: string
) {
  console.log(tf.memory());
  const layer = model.getLayer(layerName) as unknown as {
    kernel: { val: tfc.Variable };
    output: tf.SymbolicTensor | tf.SymbolicTensor[];
  };
  let filters: (tf.Tensor<tf.Rank> | string)[] = tf.tidy(() =>
    layer.kernel.val.transpose([3, 0, 1, 2]).unstack()
  );
  if (typeof filters[0] === 'string') throw new Error();
  if (!filters[0].shape[2]) throw new Error();
  if (filters[0].shape[2] > 3) {
    filters = filters.map((_, i) => `${i + 1}`);
  }
  filters.unshift('Input');
  const testData =await getBatch(testdatasetExport);
  const numExamples = testData.xs.shape[0];
  const xs = testData.xs.reshape([numExamples, HEIGHT, WIDTH, 1]);

  const activations = getConvActivation(xs, model, layer);
  const unstackedActivations = activations.unstack();
  activations.dispose();
  const activationImageSize = unstackedActivations[0].shape[0];
  const numFilters = unstackedActivations[0].shape[2];
  const filterActivations = unstackedActivations.map((activation, i) => {
    return tf.tidy(() => {
      const unpackedActivations = Array(numFilters)
        .fill(0)
        .map((_, filterIndex) =>
          activation.slice(
            [0, 0, filterIndex],
            [activationImageSize, activationImageSize, 1]
          )
        );
      const inputExample = xs.slice([i], [1]).reshape([HEIGHT, WIDTH, 1]);

      unpackedActivations.unshift(inputExample);
      return unpackedActivations;
    });
  });
  testData.xs.dispose();
  testData.labels.dispose();
  xs.dispose();
  tf.tidy(() => {
    const epochDiv = document.createElement('div');
    drawArea.appendChild(epochDiv);
    epochDiv.style.cssText =
      'display:inline-flex; justify-content: center; width:100%;';
    const span = document.createElement('span');
    span.innerText = `Epoch ${epoch}`;
    span.style.cssText = 'font-weight: bold;';
    epochDiv.appendChild(span);
    const headerDiv = document.createElement('div');
    drawArea.appendChild(headerDiv);
    headerDiv.style.cssText = 'display:inline-flex; flex-direction:row;';
    for (const filter of filters) {
      renderImage(headerDiv, filter);
      if (typeof filter !== 'string') filter.dispose();
    }
    const bodyDiv = document.createElement('div');
    bodyDiv.style.cssText = 'display:flex; flex-direction:column;';
    drawArea.appendChild(bodyDiv);
    for (const filterActivation of filterActivations) {
      const rowDiv = document.createElement('div');
      bodyDiv.appendChild(rowDiv);
      rowDiv.style.cssText = 'display:inline-flex; flex-direction:row;';
      for (const tensor of filterActivation) {
        renderImage(rowDiv, tensor);
        tensor.dispose();
      }
    }
  });
  unstackedActivations.forEach((activation) => activation.dispose());
  filterActivations.forEach((filterActivation) =>
    filterActivation.forEach((activation) => activation.dispose())
  );
}

async function getDepthwiseActivationTable(
  epoch: number,
  drawArea: HTMLElement,
  model: tf.LayersModel,
  layerName: string
) {
  console.log(tf.memory());
  const layer = model.getLayer(layerName) as unknown as {
    depthwiseKernel: { val: tfc.Variable };
    output: tf.SymbolicTensor | tf.SymbolicTensor[];
  };
  let filters: (tf.Tensor<tf.Rank> | string)[] = tf.tidy(() =>
    layer.depthwiseKernel.val.transpose([3, 0, 1, 2]).unstack()
  );
  if (typeof filters[0] === 'string') throw new Error();
  if (!filters[0].shape[2]) throw new Error();
  if (filters[0].shape[2] > 3) {
    filters = filters.map((_, i) => `${i + 1}`);
  }
  filters.unshift('Input');
  const testData = await getBatch(testdatasetExport);
  const numExamples = testData.xs.shape[0];
  const xs = testData.xs.reshape([numExamples, HEIGHT, WIDTH, 1]);

  const activations = getDepthwiseActivation(xs, model, layer);
  const unstackedActivations = activations.unstack();
  activations.dispose();
  const activationImageSize = unstackedActivations[0].shape[0];
  const numFilters = unstackedActivations[0].shape[2];
  const filterActivations = unstackedActivations.map((activation, i) => {
    return tf.tidy(() => {
      const unpackedActivations = Array(numFilters)
        .fill(0)
        .map((_, filterIntex) =>
          activation.slice(
            [0, 0, filterIntex],
            [activationImageSize, activationImageSize, 1]
          )
        );
      const inputExample = xs.slice([i], [1]).reshape([HEIGHT, WIDTH, 1]);

      unpackedActivations.unshift(inputExample);
      return unpackedActivations;
    });
  });
  testData.xs.dispose();
  testData.labels.dispose();
  xs.dispose();
  tf.tidy(() => {
    const epochDiv = document.createElement('div');
    drawArea.appendChild(epochDiv);
    epochDiv.style.cssText =
      'display:inline-flex; justify-content: center; width:100%;';
    const span = document.createElement('span');
    span.innerText = `Epoch ${epoch}`;
    span.style.cssText = 'font-weight: bold;';
    epochDiv.appendChild(span);
    const headerDiv = document.createElement('div');
    drawArea.appendChild(headerDiv);
    headerDiv.style.cssText = 'display:inline-flex; flex-direction:row;';
    for (const filter of filters) {
      renderImage(headerDiv, filter);
      if (typeof filter !== 'string') filter.dispose();
    }
    const bodyDiv = document.createElement('div');
    bodyDiv.style.cssText = 'display:flex; flex-direction:column;';
    drawArea.appendChild(bodyDiv);
    for (const filterActivation of filterActivations) {
      const rowDiv = document.createElement('div');
      bodyDiv.appendChild(rowDiv);
      rowDiv.style.cssText = 'display:inline-flex; flex-direction:row;';
      for (const tensor of filterActivation) {
        renderImage(rowDiv, tensor);
        tensor.dispose();
      }
    }
  });
  unstackedActivations.forEach((activation) => activation.dispose());
  filterActivations.forEach((filterActivation) =>
    filterActivation.forEach((activation) => activation.dispose())
  );
}

// async function renderImageTable(drawArea: HTMLElement, headerTensors: (tf.Tensor<tf.Rank> | string)[], dataTensors: tf.Tensor<tf.Rank>[][]) {
//   const headerDiv = document.createElement('div')
//   drawArea.appendChild(headerDiv)
//   headerDiv.style.cssText = 'display:inline-flex; flex-direction:row;'
//   console.log(tf.memory())
//   for (const data of headerTensors) {
//     await renderImage(headerDiv, data)
//     if (typeof data !== 'string')
//     data.dispose()
//   }
//   console.log(tf.memory())
//   for (const data of dataTensors) {
//     const rowDiv = document.createElement('div')
//     drawArea.appendChild(rowDiv)
//     rowDiv.style.cssText = 'display:inline-flex; flex-direction:row;'
//     for (const tensor of data) {
//       await renderImage(rowDiv, tensor)
//       tensor.dispose()
//     }
//   }
//   console.log(tf.memory())
// }

function getModel() {
  const model = tf.sequential();

  const IMAGE_WIDTH = 20;
  const IMAGE_HEIGHT = 20;
  const IMAGE_CHANNELS = 1;

  model.add(
    tf.layers.conv2d({
      name: 'conv2d_1',
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling',
    })
  );
  model.add(
    tf.layers.depthwiseConv2d({
      name: 'depthwise2d_1',
      kernelSize: 3,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling',
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      name: 'maxPooling2d_1',
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );
  model.add(
    tf.layers.conv2d({
      name: 'conv2d_2',
      kernelSize: 3,
      filters: 32,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling',
    })
  );
  model.add(
    tf.layers.depthwiseConv2d({
      name: 'depthwise2d_2',
      kernelSize: 3,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling',
    })
  );
  // model.add(tf.layers.conv2d({
  //   name: 'conv2d_1',
  //   inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
  //   kernelSize: 5,
  //   filters: 4,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'varianceScaling'
  // }));
  // model.add(tf.layers.depthwiseConv2d({
  //   name: 'depthwise2d_1',
  //   kernelSize: 3,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'varianceScaling'
  // }));
  // model.add(tf.layers.maxPooling2d({
  //   name: 'maxPooling2d_1',
  //   poolSize: [2, 2], strides: [2, 2]
  // }));
  // model.add(tf.layers.conv2d({
  //   name: 'conv2d_2',
  //   kernelSize: 5,
  //   filters: 8,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'varianceScaling'
  // }));
  // model.add(tf.layers.depthwiseConv2d({
  //   name: 'depthwise2d_2',
  //   kernelSize: 3,
  //   strides: 1,
  //   activation: 'relu',
  //   kernelInitializer: 'varianceScaling'
  // }));
  // model.add(tf.layers.maxPooling2d({
  //   name: 'maxPooling2d_2',
  //   poolSize: [2, 2], strides: [2, 2]
  // }));
  model.add(tf.layers.flatten());

  // (1, 2, 3, 4, 5, 6, 7, 8, 9, empty).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(
    tf.layers.dense({
      name: 'dense_1',
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax',
    })
  );
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

async function train(model: tf.LayersModel) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = {
    name: 'Model Training',
    styles: { height: '1000px' },
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

  const BATCH_SIZE = 256;

  const datasetBatch = await getBatch(datasetExport);
  const [trainXs, trainYs] = [datasetBatch.xs.reshape([datasetExport.length * 81, 20, 20, 1]), datasetBatch.labels];

  const testDatasetBatch = await getBatch(testDatasetExport);
  const [testXs, testYs] = [testDatasetBatch.xs.reshape([testDatasetExport.length * 81, 20, 20, 1]), testDatasetBatch.labels];

  // tf.tidy(() => {
  //   getConvActivationTable(
  //     -1,
  //     tfvis.visor().surface({
  //       name: 'Conv2D1 Activations',
  //       tab: 'Conv2D1 Activations',
  //       styles: {
  //         width: '100%',
  //         height: '100%',
  //       },
  //     }).drawArea,
  //     model,
  //     'conv2d_1'
  //   );
  //   getDepthwiseActivationTable(
  //     -1,
  //     tfvis.visor().surface({
  //       name: 'Depthwise2D1 Activations',
  //       tab: 'Depthwise2D1 Activations',
  //       styles: {
  //         width: '100%',
  //         height: '100%',
  //       },
  //     }).drawArea,
  //     model,
  //     'depthwise2d_1'
  //   );
  //   getConvActivationTable(
  //     -1,
  //     tfvis.visor().surface({
  //       name: 'Conv2D2 Activations',
  //       tab: 'Conv2D2 Activations',
  //       styles: {
  //         width: '100%',
  //         height: '100%',
  //       },
  //     }).drawArea,
  //     model,
  //     'conv2d_2'
  //   );
  //   getDepthwiseActivationTable(
  //     -1,
  //     tfvis.visor().surface({
  //       name: 'Depthwise2D2 Activations',
  //       tab: 'Depthwise2D2 Activations',
  //       styles: {
  //         width: '100%',
  //         height: '100%',
  //       },
  //     }).drawArea,
  //     model,
  //     'depthwise2d_2'
  //   );
  // });
  const panel = tfvis.visor().surface({
    name: 'Panel',
    tab: 'Panel',
    styles: {
      width: '100%',
      height: '100%',
    },
  }).drawArea;
  const downloadButton = document.createElement('button');
  downloadButton.innerText = `Download Model`;
  downloadButton.style.cssText = 'font-weight: bold;';
  downloadButton.onclick = () => model.save('downloads://model');
  panel.appendChild(downloadButton);
  const showLayersButton = document.createElement('button');
  showLayersButton.innerText = `Show Layers`;
  showLayersButton.style.cssText = 'font-weight: bold;';
  showLayersButton.onclick = () => 
  tf.tidy(() => {
      getConvActivationTable(
        0,
        tfvis.visor().surface({
          name: 'Conv2D1 Activations',
          tab: 'Conv2D1 Activations',
          styles: {
            width: '100%',
            height: '100%',
          },
        }).drawArea,
        model,
        'conv2d_1'
      );
      getDepthwiseActivationTable(
        0,
        tfvis.visor().surface({
          name: 'Depthwise2D1 Activations',
          tab: 'Depthwise2D1 Activations',
          styles: {
            width: '100%',
            height: '100%',
          },
        }).drawArea,
        model,
        'depthwise2d_1'
      );
      getConvActivationTable(
        0,
        tfvis.visor().surface({
          name: 'Conv2D2 Activations',
          tab: 'Conv2D2 Activations',
          styles: {
            width: '100%',
            height: '100%',
          },
        }).drawArea,
        model,
        'conv2d_2'
      );
      getDepthwiseActivationTable(
        0,
        tfvis.visor().surface({
          name: 'Depthwise2D2 Activations',
          tab: 'Depthwise2D2 Activations',
          styles: {
            width: '100%',
            height: '100%',
          },
        }).drawArea,
        model,
        'depthwise2d_2'
      );
    });
  panel.appendChild(showLayersButton);
  const showExamplesButton = document.createElement('button');
  showExamplesButton.innerText = `Show examples`;
  showExamplesButton.style.cssText = 'font-weight: bold;';
  showExamplesButton.onclick = () => showExamples(panel);
  panel.appendChild(showExamplesButton);
  
  await model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 100,
    shuffle: true,
    callbacks: [
      fitCallbacks,
      {
        onEpochEnd: async (epoch: number) => {
          // tf.tidy(() => {
          //   getConvActivationTable(
          //     epoch,
          //     tfvis.visor().surface({
          //       name: 'Conv2D1 Activations',
          //       tab: 'Conv2D1 Activations',
          //       styles: {
          //         width: '100%',
          //         height: '100%',
          //       },
          //     }).drawArea,
          //     model,
          //     'conv2d_1'
          //   );
          //   getDepthwiseActivationTable(
          //     epoch,
          //     tfvis.visor().surface({
          //       name: 'Depthwise2D1 Activations',
          //       tab: 'Depthwise2D1 Activations',
          //       styles: {
          //         width: '100%',
          //         height: '100%',
          //       },
          //     }).drawArea,
          //     model,
          //     'depthwise2d_1'
          //   );
          //   // await getConvActivationTable(epoch,  tfvis.visor().surface({
          //   //   name: 'Max Pooling 1', tab: 'Max Pooling 1',
          //   //   styles: {
          //   //     width: '100%',
          //   //     height: '100%',
          //   //   }
          //   // }).drawArea, model, 'maxPooling2d_1', data);
          //   getConvActivationTable(
          //     epoch,
          //     tfvis.visor().surface({
          //       name: 'Conv2D2 Activations',
          //       tab: 'Conv2D2 Activations',
          //       styles: {
          //         width: '100%',
          //         height: '100%',
          //       },
          //     }).drawArea,
          //     model,
          //     'conv2d_2'
          //   );
          //   getDepthwiseActivationTable(
          //     epoch,
          //     tfvis.visor().surface({
          //       name: 'Depthwise2D2 Activations',
          //       tab: 'Depthwise2D2 Activations',
          //       styles: {
          //         width: '100%',
          //         height: '100%',
          //       },
          //     }).drawArea,
          //     model,
          //     'depthwise2d_2'
          //   );
          //   // await getConvActivationTable(epoch,  tfvis.visor().surface({
          //   //   name: 'Max Pooling 2', tab: 'Max Pooling 2',
          //   //   styles: {
          //   //     width: '100%',
          //   //     height: '100%',
          //   //   }
          //   // }).drawArea, model, 'maxPooling2d_2', data);
          // });
        },
      },
    ],
  });
  trainXs.dispose();
  trainYs.dispose();
  testXs.dispose();
  testYs.dispose();
  console.log(tf.memory());
}

const classNames = [
  'Empty',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
];

async function doPrediction(
  model: tf.LayersModel,
  testDataSize = 1
): Promise<[tf.Tensor1D, tf.Tensor1D]> {
  const IMAGE_WIDTH = 20;
  const IMAGE_HEIGHT = 20;
  const testData = await getBatch(datasetExport);
  const testxs = testData.xs.reshape([
    testDataSize,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    1,
  ]);
  const { labels } = testData;
  const prediction = model.predict(testxs);
  if (Array.isArray(prediction)) throw new Error();
  testData.labels.dispose();
  testData.xs.dispose();
  testxs.dispose();
  return [prediction.argMax(-1), labels.argMax(-1)];
}

async function showAccuracy(model: tf.LayersModel) {
  const [preds, labels] = await doPrediction(model);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: 'Accuracy', tab: 'Evaluation' };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

  labels.dispose();
}

async function showConfusion(model: tf.LayersModel) {
  const [preds, labels] = await doPrediction(model);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: 'Confusion Matrix', tab: 'Evaluation' };
  tfvis.render.confusionMatrix(container, { values: confusionMatrix });

  labels.dispose();
}

async function run() {
  // const model = await tf.loadLayersModel('/models/model5.json');
  // model.getLayer('conv2d_1').trainable = false
  // model.layers.forEach(layer => {
  //   if(layer.name === 'conv2d_1') return
  //   // Call the function to load the model and reset the layer weights.
  //   resetLayerWeights(layer);
  // })
  // model.compile({
  //   optimizer: tf.train.adam(),
  //   loss: 'categoricalCrossentropy',
  //   metrics: ['accuracy'],
  // });

  const model = getModel();
  tfvis.show.modelSummary({ name: 'Model Architecture' }, model);

  await train(model);
  await model.save('downloads://model');

  await showAccuracy(model);
  await showConfusion(model);
}

document.addEventListener('DOMContentLoaded', run);
