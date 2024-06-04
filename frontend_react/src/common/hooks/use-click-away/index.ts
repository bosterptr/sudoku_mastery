import { RefObject, useEffect, useRef } from 'react';

const events = ['mousedown', 'touchstart', 'click'];

export const useClickAway = <T extends HTMLElement = HTMLDivElement>(
  handler: (event: Event) => void,
  element?: RefObject<T>,
) => {
  const savedHandler = useRef<(event: Event) => void>();
  useEffect(() => {
    const eventListeners: [string, <Z extends Event>(event: Z) => void][] = [];
    const targetElement = element?.current || window;
    for (const eventName of events) {
      if (!(targetElement && targetElement.addEventListener)) {
        return;
      }
      if (savedHandler.current !== handler) {
        savedHandler.current = handler;
      }
      const eventListener = <Z extends Event>(event: Z) => {
        if (savedHandler?.current !== undefined) {
          savedHandler.current(event);
        }
      };
      targetElement.addEventListener(eventName, eventListener);
      eventListeners.push([eventName, eventListener]);
    }
    // eslint-disable-next-line consistent-return
    return () => {
      for (let i = eventListeners.length - 1; i >= 0; i -= 1) {
        targetElement.removeEventListener(eventListeners[i][0], eventListeners[i][1]);
        delete eventListeners[i];
      }
    };
  }, [element, handler]);
};
