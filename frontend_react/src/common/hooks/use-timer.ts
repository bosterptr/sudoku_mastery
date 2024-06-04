import { useCallback, useEffect, useState } from 'react';

type IPublicProps = (startActive: boolean) => {
  seconds: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
};

const useTimer: IPublicProps = (startActive) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(startActive);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((actionPayload) => actionPayload + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  return { seconds, start, pause, reset, isRunning: isActive };
};

export default useTimer;
