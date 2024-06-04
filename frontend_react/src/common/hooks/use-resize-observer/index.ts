import { RefObject, useLayoutEffect, useRef } from 'react';

export const useResizeObserver = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (target: T, entry: ResizeObserverEntry) => void,
  hz: number,
) => {
  const debounceTimeoutRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    const element = ref?.current;
    if (!element) {
      return;
    }
    const debouncedCallback = (entries: ResizeObserverEntry[]) => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = window.setTimeout(() => {
        callback(element, entries[0]);
      }, 1000 / hz);
    };
    const observer = new ResizeObserver((entries) => {
      debouncedCallback(entries);
    });
    observer.observe(element);
    // eslint-disable-next-line consistent-return
    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
      observer.disconnect();
    };
  }, [callback, ref, hz]);
};
