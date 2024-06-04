import {
  forwardRef,
  MutableRefObject,
  ReactNode,
  RefAttributes,
  useLayoutEffect,
  useState,
} from 'react';
import * as ReactDOM from 'react-dom';

export interface PortalProps {
  children?: ReactNode & RefAttributes<HTMLElement>;
  /**
   * @default document.body
   */
  container?: HTMLElement | null;
}

function setRef<T>(
  ref: MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // eslint-disable-next-line no-param-reassign
    ref.current = value;
  }
}

const Portal = forwardRef<HTMLElement, PortalProps>(({ children, container }, ref) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (container) setMountNode(container);
    else setMountNode(document.body);
  }, [container]);

  useLayoutEffect(() => {
    if (mountNode) {
      setRef(ref, mountNode);
      return () => {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode]);

  return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode;
});

export default Portal;
