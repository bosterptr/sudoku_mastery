import { forwardRef } from 'react';

export const VideoComponent = forwardRef<HTMLVideoElement>((_, ref) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      autoPlay
      playsInline
      ref={ref}
      style={{ transform: 'scaleX(-1)', width: 500, height: 500 }}
    />
  );
});
