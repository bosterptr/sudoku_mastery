import { RefObject, useEffect, useRef } from 'react';

export const useEventListener = <
  E extends keyof WindowEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: E,
  handler: (event: WindowEventMap[E]) => void,
  element?: RefObject<T>,
) => {
  const savedHandler = useRef<(event: WindowEventMap[E]) => void>();
  useEffect(() => {
    const targetElement = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }
    const eventListener = <Z extends WindowEventMap[E]>(event: Z) => {
      if (savedHandler?.current !== undefined) {
        savedHandler.current(event);
      }
    };
    targetElement.addEventListener(eventName, eventListener);
    // eslint-disable-next-line consistent-return
    return () => targetElement.removeEventListener(eventName, eventListener);
  }, [eventName, element, handler]);
};
