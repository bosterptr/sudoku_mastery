const GL_BUFFER_STATUS_CHECK_INTERVAL = 2;

export type IOpenglSetup = [
  OffscreenCanvas,
  WebGLProgram,
  WebGLProgram,
  WebGLProgram,
  ITexFbPair,
  ITexFbPair,
  number,
];

export interface ITexFbPair {
  tex: WebGLTexture;
  fb: WebGLFramebuffer;
}
export const getGrayScaleFromUint8Array = (
  dataArray: Uint8Array,
  width: number,
  height: number,
  cachedGrayScaleUintArray: Uint8Array,
  cachedGrayScaleSize: number,
): Uint8Array => {
  if (cachedGrayScaleSize !== width * height) {
    // eslint-disable-next-line no-param-reassign
    cachedGrayScaleUintArray = new Uint8Array(width * height);
    // eslint-disable-next-line no-param-reassign
    cachedGrayScaleSize = width * height;
  }
  const { length } = dataArray;
  for (let i = 0, luminanceIndex = 0; i < length; i += 4, luminanceIndex += 1) {
    // eslint-disable-next-line no-bitwise
    const r = dataArray[i] >> 2;
    // eslint-disable-next-line no-bitwise
    const g = dataArray[i + 1] >> 1;
    // eslint-disable-next-line no-bitwise
    const b = dataArray[i + 2] >> 3;
    // const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    // luminanceData[luminanceIndex] =
    //   0.299 * dataArray[i] +
    //   0.587 * dataArray[i + 1] +
    //   0.114 * dataArray[i + 2];
    // eslint-disable-next-line no-param-reassign
    cachedGrayScaleUintArray[luminanceIndex] = r + b + g;
  }
  return cachedGrayScaleUintArray;
};

export const clientWaitAsync = (
  gl: WebGL2RenderingContext,
  sync: WebGLSync,
  flags = 0,
  intervalMs = 10,
) => {
  return new Promise<void>((resolve, reject) => {
    const check = () => {
      const res = gl.clientWaitSync(sync, flags, 0);
      if (res === gl.WAIT_FAILED) {
        reject();
        return;
      }
      if (res === gl.TIMEOUT_EXPIRED) {
        setTimeout(check, intervalMs);
        return;
      }
      resolve();
    };
    check();
  });
};

export const readPixelsAsync = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  buffer: Uint8Array,
): Promise<Uint8Array> => {
  const bufpak = gl.createBuffer();
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, bufpak);
  gl.bufferData(gl.PIXEL_PACK_BUFFER, buffer.byteLength, gl.STREAM_READ);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!sync) throw new Error('WebGLSync is empty');
  gl.flush();
  return clientWaitAsync(gl, sync, 0, GL_BUFFER_STATUS_CHECK_INTERVAL).then(() => {
    gl.deleteSync(sync);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, bufpak);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, buffer);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.deleteBuffer(bufpak);
    return buffer;
  });
};

export function setAttributes(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
  const location = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
}

export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|ie|blackberry|fennec/.test(userAgent);
}
export const getCameraResolution = () => {
  if (isMobile()) {
    return {
      width: { ideal: document.body.clientWidth > 500 ? 500 : document.body.clientWidth },
      height: { ideal: document.body.clientHeight > 500 ? 500 : document.body.clientHeight },
    };
  }
  return {
    width: { ideal: 1000 },
    height: { ideal: 1000 },
  };
};
