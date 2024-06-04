import { ADAPTIVE_THRESHOLD_DELTA } from 'app/core/constants/sudoku';
import { Remote, wrap } from 'comlink';
import { getGrayScaleFromUint8Array, ITexFbPair, readPixelsAsync, setAttributes } from './utils';
import ComlinkWorker, { WebWorkerProcessor } from './webgl.worker';

const webworkerProcessorWorker: Worker = new ComlinkWorker();
const WebworkerProcessorApi = wrap<typeof WebWorkerProcessor>(webworkerProcessorWorker);

const vertShaderWithVTexCoordSource = `#version 300 es
in vec2 position;
out vec2 vTexCoord;
void main() {
  vTexCoord = (position + 1.0) / 2.0;
  gl_Position = vec4(position, 0, 1.0);
}`;

const fragShaderGrayScaleSource = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vTexCoord;
out vec4 out_color;
uniform sampler2D u_src;
void main() {
  vec4 pixel = texture(u_src,vTexCoord);
  float luminance = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b;
  out_color=vec4(luminance,luminance,luminance,1.0);
}`;

const fragShaderGaussianBlurSource = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vTexCoord;
out vec4 out_color;
uniform sampler2D u_src;
const int kernelSize = 17; // Adjust the kernel size as needed
const float sigma = 2.0; // Adjust the standard deviation as needed
void main() {
vec2 texelSize = 1.0 / vec2(textureSize(u_src, 0));
float kernel[kernelSize];
float totalWeight = 0.0;
for (int i = 0; i < kernelSize; ++i) {
  float offset = float(i - (kernelSize - 1) / 2);
  kernel[i] = exp(-offset * offset / (2.0 * sigma * sigma));
  totalWeight += kernel[i];
}
for (int i = 0; i < kernelSize; ++i) {
  kernel[i] /= totalWeight;
}
vec4 result = vec4(0.0);
for (int i = 0; i < kernelSize; ++i) {
  for (int j = 0; j < kernelSize; ++j) {
    vec2 offset = vec2(float(i - (kernelSize - 1) / 2), float(j - (kernelSize - 1) / 2));
    result += texture(u_src, vTexCoord + texelSize * offset).rgba * kernel[i] * kernel[j];
  }
}
out_color=result;
}`;
const fragShaderDilateSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 out_color;
uniform sampler2D u_src;
void main() {
  vec2 texelSize = 1.0 / vec2(textureSize(u_src, 0));
  vec4 centerPixel = texture(u_src, vTexCoord);
  // Perform dilation by checking neighboring pixels
  vec4 result = centerPixel;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 offset = vec2(i, j) * texelSize;
      vec4 neighbor = texture(u_src, vTexCoord + offset);
      result = max(result, neighbor);
    }
  }
  out_color = result;
}`;
const fragShaderErodeSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 out_color;
uniform sampler2D u_src;
void main() {
  vec2 texelSize = 1.0 / vec2(textureSize(u_src, 0));
  vec4 centerPixel = texture(u_src, vTexCoord);
  vec4 result = centerPixel;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 offset = vec2(i, j) * texelSize;
      vec4 neighbor = texture(u_src, vTexCoord + offset);
      result = min(result, neighbor);
    }
  }
  out_color = result;
}`;

const fragShaderThresholdSource = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vTexCoord;
out vec4 out_color;
uniform sampler2D u_src;
uniform sampler2D u_mean;
const float delta = ${ADAPTIVE_THRESHOLD_DELTA / 255};
void main() {
  float srcR = texture(u_src,vTexCoord).r;
  float meanR = texture(u_mean,vTexCoord).r;
  float result = mix(0.0, 1.0, ((srcR - meanR) > -delta));
  out_color = vec4(result,result,result,1.0);
}`;

export class CanvasProcessor {
  private canvas: HTMLCanvasElement;

  private programs: WebGLProgram[];

  private texFBPairs: ITexFbPair[];

  private buffers: WebGLBuffer[];

  private gl: WebGL2RenderingContext;

  private videoTexture: WebGLTexture;

  private cachedUint8Array: Uint8Array;

  private cachedGrayScaleUintArray: Uint8Array;

  private cachedGrayScaleSize: number;

  private webWorkerProcessor: Remote<WebWorkerProcessor> | null;

  constructor(webGlCanvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = webGlCanvas;
    this.programs = [];
    this.texFBPairs = [];
    this.webWorkerProcessor = null;
    const createProgramFromSources = (gl: WebGL2RenderingContext, shaders: [string, string]) => {
      const vertShader = gl.createShader(gl.VERTEX_SHADER);
      const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!vertShader) throw new Error('vertShader');
      if (!fragShader) throw new Error('fragShader');
      gl.shaderSource(vertShader, shaders[0]);
      gl.shaderSource(fragShader, shaders[1]);

      gl.compileShader(vertShader);
      if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile Shader.\n\n${gl.getShaderInfoLog(vertShader)}`);
      }
      gl.compileShader(fragShader);
      if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile Shader.\n\n${gl.getShaderInfoLog(fragShader)}`);
      }

      const program = gl.createProgram();
      if (!program) throw new Error('program');
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);

      gl.linkProgram(program);
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw new Error(`Could not compile WebGL program. \n\n${info}`);
      }
      return program;
    };

    const createTextureAndFramebuffer = (
      gl: WebGL2RenderingContext,
      textureWidth: number,
      textureHeight: number,
    ): ITexFbPair => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        textureWidth,
        textureHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (!tex || !fb) throw new Error('tex,fb');
      const texFBPair = { tex, fb };
      return texFBPair;
    };

    const gl: WebGL2RenderingContext | null = webGlCanvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error('');
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.clearColor(1.0, 0.5, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const grayScaleProgram = createProgramFromSources(gl, [
      vertShaderWithVTexCoordSource,
      fragShaderGrayScaleSource,
    ]);
    const gaussianBlurProgram = createProgramFromSources(gl, [
      vertShaderWithVTexCoordSource,
      fragShaderGaussianBlurSource,
    ]);
    const morphDilateProgram = createProgramFromSources(gl, [
      vertShaderWithVTexCoordSource,
      fragShaderDilateSource,
    ]);
    const morphErodeProgram = createProgramFromSources(gl, [
      vertShaderWithVTexCoordSource,
      fragShaderErodeSource,
    ]);
    const thresholdProgram = createProgramFromSources(gl, [
      vertShaderWithVTexCoordSource,
      fragShaderThresholdSource,
    ]);
    this.programs = [
      grayScaleProgram,
      gaussianBlurProgram,
      morphDilateProgram,
      morphErodeProgram,
      thresholdProgram,
    ];
    const texFbPair1 = createTextureAndFramebuffer(gl, webGlCanvas.width, webGlCanvas.height);
    const texFbPair2 = createTextureAndFramebuffer(gl, webGlCanvas.width, webGlCanvas.height);
    const texFbPair3 = createTextureAndFramebuffer(gl, webGlCanvas.width, webGlCanvas.height);
    const texFbPair4 = createTextureAndFramebuffer(gl, webGlCanvas.width, webGlCanvas.height);
    const texFbPair5 = createTextureAndFramebuffer(gl, webGlCanvas.width, webGlCanvas.height);
    this.texFBPairs = [texFbPair1, texFbPair2, texFbPair3, texFbPair4, texFbPair5];
    const buf = gl.createBuffer();
    if (!buf) throw new Error('');
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    this.buffers = [buf];
    this.gl = gl;
    const videoTexture = gl.createTexture();
    if (!videoTexture) throw new Error('');
    this.videoTexture = videoTexture;
    this.cachedUint8Array = new Uint8Array(width * height * 4);
    this.cachedGrayScaleUintArray = new Uint8Array(width * height);
    this.cachedGrayScaleSize = width * height;
  }

  public async init(): Promise<CanvasProcessor> {
    this.webWorkerProcessor = await new WebworkerProcessorApi();
    this.webWorkerProcessor.init();
    return this;
  }

  public async run(imageData: HTMLVideoElement): Promise<string | null> {
    const [
      grayScaleProgram,
      gaussianBlurProgram,
      morphDilateProgram,
      morphErodeProgram,
      thresholdProgram,
    ] = this.programs;
    const [texFbPair1, texFbPair2, texFbPair3, texFbPair4, texFbPair5] = this.texFBPairs;
    const { gl } = this;
    setAttributes(gl, grayScaleProgram, 'position');
    gl.useProgram(grayScaleProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(grayScaleProgram, 'u_src'), 0);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair1.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texFbPair2.fb);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(gaussianBlurProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setAttributes(gl, gaussianBlurProgram, 'position');
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(gaussianBlurProgram, 'u_src'), 0);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair2.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texFbPair3.fb);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(thresholdProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setAttributes(gl, thresholdProgram, 'position');
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(thresholdProgram, 'u_src'), 0);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair2.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(gl.getUniformLocation(thresholdProgram, 'u_mean'), 1);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair3.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texFbPair4.fb);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(morphErodeProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setAttributes(gl, morphErodeProgram, 'position');
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(morphErodeProgram, 'u_src'), 0);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair4.tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texFbPair5.fb);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.useProgram(morphDilateProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    setAttributes(gl, morphDilateProgram, 'position');
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(morphDilateProgram, 'u_src'), 0);
    gl.bindTexture(gl.TEXTURE_2D, texFbPair5.tex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const pixels = await readPixelsAsync(
      gl,
      imageData.videoWidth,
      imageData.videoHeight,
      // I'm using the cachedUint8Array that is created only once, so GC will deallocate the array only after the CanvasProcessor's death.
      this.cachedUint8Array,
    );
    if (!this.webWorkerProcessor)
      throw new Error("CanvasProcessor need's to be initialized first!");
    return this.webWorkerProcessor.getSudoku(
      getGrayScaleFromUint8Array(
        pixels,
        imageData.videoWidth,
        imageData.videoHeight,
        this.cachedGrayScaleUintArray,
        this.cachedGrayScaleSize,
      ),
      imageData.videoWidth,
      imageData.videoHeight,
    );
  }

  public replaceCanvas() {
    const { canvas } = this;
    const newCanvas = canvas.cloneNode();
    if (canvas.parentNode) {
      canvas.parentNode.insertBefore(newCanvas, canvas);
      canvas.parentNode.removeChild(canvas);
    }
    this.canvas = newCanvas as HTMLCanvasElement;
  }

  public async destroy() {
    const { gl } = this;
    this.programs.forEach((program) => {
      gl.deleteProgram(program);
    });
    this.programs = [];
    this.buffers.forEach((buffer) => {
      gl.deleteBuffer(buffer);
    });
    this.buffers = [];
    gl.deleteTexture(this.videoTexture);
    this.texFBPairs.forEach((texFBPair) => {
      gl.deleteTexture(texFBPair.tex);
      gl.deleteFramebuffer(texFBPair.fb);
    });
    this.texFBPairs = [];
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.replaceCanvas();
  }
}
