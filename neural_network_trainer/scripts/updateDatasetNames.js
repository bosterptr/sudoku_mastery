const fs = require('fs');

const datasetPath = './src/dataset';
const testDatasetPath = './src/testDataset';
const testDatasetExport = './src/testDatasetExport.ts';
const outputPath = './src/datasetExport.ts';

try {
  const files = fs.readdirSync(datasetPath);
  fs.writeFile(outputPath, files.map((filename,index) => `import png${index} from './dataset/${filename}';`).join('\n')+`
  export default [
    ${files.map((_,index) => `png${index}\n`)}]`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File saved successfully:', outputPath);
    }
  });
  const testDataset = fs.readdirSync(testDatasetPath);
  fs.writeFile(testDatasetExport, testDataset.map((filename,index) => `import png${index} from './testDataset/${filename}';`).join('\n')+`
  export default [
    ${testDataset.map((_,index) => `png${index}\n`)}]`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File saved successfully:', testDatasetExport);
    }
  });
} catch (err) {
  console.error('Error reading the folder:', err);
}