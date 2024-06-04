import { useCallback, useLayoutEffect, useRef } from 'react';
import { getCameraResolution } from './utils';
import { CanvasProcessor } from './webgl';
import { VideoComponent } from '../VideoComponent';

interface Props {
  onComplete: (mission: string) => void;
}
export function SudokuCameraCreator({ onComplete }: Props) {
  const videoComponentRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement & { transferredToOffscreenCanvas: boolean }>(
    null,
  );
  const CanvasProcessorRef = useRef<CanvasProcessor | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoPlaying = useRef<boolean>(false);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const startCamera = useCallback(
    async () =>
      new Promise((resolve, reject) => {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              facingMode: 'environment',
              ...getCameraResolution(),
              noiseSuppression: false,
            },
          })
          .then(async (mediaStream) => {
            mediaStreamRef.current = mediaStream;
            if (videoComponentRef.current) {
              if (!canvasRef.current) throw new Error();
              const canvasCtx = canvasRef.current.getContext('2d', {
                willReadFrequently: true,
                desynchronized: false,
                alpha: false,
              });
              if (!canvasCtx) throw new Error();
              // canvasCtx.drawImage(videoComponentRef.current, 0, 0);
              const videoSettings = mediaStream.getVideoTracks()[0].getSettings();
              canvasRef.current.width = videoSettings.width || 0;
              canvasRef.current.height = videoSettings.height || 0;
              videoComponentRef.current.srcObject = mediaStream;
              videoComponentRef.current.play();
              videoPlaying.current = true;
              if (!webglCanvasRef.current) throw new Error();
              if (!videoSettings.width || !videoSettings.height) throw new Error();
              webglCanvasRef.current.width = videoSettings.width;
              webglCanvasRef.current.height = videoSettings.height;
              webglCanvasRef.current.transferredToOffscreenCanvas = true;
              // webglCanvasRef.current.style.visibility = 'hidden';
              const canvasProcessor = await new CanvasProcessor(
                webglCanvasRef.current,
                videoSettings.width,
                videoSettings.height,
              ).init();
              CanvasProcessorRef.current = canvasProcessor;
              canvasCtxRef.current = canvasCtx;
              videoComponentRef.current.onloadedmetadata = () => {
                if (!videoComponentRef.current) throw new Error();
                videoComponentRef.current.play();
                resolve(videoComponentRef.current);
              };
            }
          })
          .catch((err) => {
            reject(err);
          });
      }),
    [],
  );

  const setup = useCallback(async () => {
    if (!canvasRef.current) return;
    stopCamera();
    await startCamera();
  }, [startCamera]);
  useLayoutEffect(() => {
    let timerId: number;
    const run = async () => {
      await setup();
      const animate = async () => {
        if (
          !canvasRef.current ||
          !videoComponentRef.current ||
          !canvasCtxRef.current ||
          !CanvasProcessorRef.current
        )
          return;
        if (videoComponentRef.current.readyState >= 2) {
          const mission = await CanvasProcessorRef.current.run(videoComponentRef.current);
          if (mission) onComplete(mission);
        }
        requestAnimationFrame(animate);
      };
      timerId = requestAnimationFrame(animate);
    };
    run();
    return () => {
      cancelAnimationFrame(timerId);
      stopCamera();
    };
  }, [setup, onComplete]);
  return (
    <>
      <VideoComponent ref={videoComponentRef} />
      <div style={{ height: 0, width: 0, visibility: 'hidden' }}>
        <canvas
          style={{ height: 0, width: 0, visibility: 'hidden' }}
          id="webglCanvasRef"
          ref={webglCanvasRef}
        />
        <canvas style={{ height: 0, width: 0, visibility: 'hidden' }} id="canvas" ref={canvasRef} />
        <div id="tensorTest" />
      </div>
    </>
  );
}
