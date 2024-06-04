/* eslint-disable no-param-reassign */
import useForkRef from 'app/common/hooks/use-fork-ref';
import * as transitions from 'app/core/themes/transitions';
import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';
import { Transition } from 'react-transition-group';
import { ENTERED, ENTERING, TransitionStatus } from 'react-transition-group/Transition';
import { getAutoHeightDuration, getTransitionProps, reflow } from './utils';

function getScale(value: number) {
  return `scale(${value}, ${value ** 2})`;
}
const getStyles = (status: TransitionStatus): CSSProperties => {
  switch (status) {
    case ENTERING:
      return {
        opacity: 1,
        transform: getScale(1),
      };
    case ENTERED:
      return {
        opacity: 1,
        transform: 'none',
      };
    default:
      return {};
  }
};

type ICallbackFunc =
  | ((node: HTMLElement, isAppearing?: boolean) => void)
  | ((node: HTMLElement) => void);

interface Props {
  appear: boolean;
  children: ReactElement & RefAttributes<HTMLElement>;
  easing?: string | { enter?: string; exit?: string };
  in: boolean;
  onEnter?: (element: HTMLElement, isAppearing?: boolean) => void;
  onEntered?: (element: HTMLElement, isAppearing?: boolean) => void;
  onEntering?: (element: HTMLElement, isAppearing?: boolean) => void;
  onExit?: (element: HTMLElement) => void;
  onExited?: (element: HTMLElement, isAppearing?: boolean) => void;
  onExiting?: (element: HTMLElement, isAppearing?: boolean) => void;
  style?: CSSProperties;
  timeout?: 'auto' | number | { enter?: number | undefined; exit?: number | undefined };
}

const Grow = forwardRef<HTMLElement, Props>(
  (
    {
      appear = true,
      children,
      easing,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style,
      timeout = 'auto',
    },
    ref,
  ) => {
    const timer = useRef<NodeJS.Timeout>();
    const autoTimeout = useRef<number>();
    const nodeRef = useRef<HTMLElement>(null);
    const foreignRef = useForkRef(children.ref, ref);
    const handleRef = useForkRef(nodeRef, foreignRef);

    const normalizedTransitionCallback =
      (callback?: ICallbackFunc) => (maybeIsAppearing?: boolean) => {
        if (callback) {
          const node = nodeRef.current; // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
          if (node) {
            if (maybeIsAppearing === undefined) {
              callback(node);
            } else {
              callback(node, maybeIsAppearing);
            }
          }
        }
      };
    const handleEntering = normalizedTransitionCallback(onEntering);
    const handleEnter = normalizedTransitionCallback((node: HTMLElement, isAppearing?: boolean) => {
      reflow(node); // So the animation always start from the start.

      const {
        duration: transitionDuration,
        delay,
        easing: transitionTimingFunction,
      } = getTransitionProps(
        {
          style,
          timeout: timeout === 'auto' ? 0 : timeout,
          easing,
        },
        {
          mode: 'enter',
        },
      );
      let duration;

      if (timeout === 'auto') {
        duration = getAutoHeightDuration(node.clientHeight);
        autoTimeout.current = duration;
      } else {
        duration = transitionDuration;
      }

      node.style.transition = [
        transitions.create('opacity', {
          duration,
          delay,
        }),
        transitions.create('transform', {
          duration: typeof duration === 'number' ? duration * 0.666 : duration,
          delay,
          easing: transitionTimingFunction,
        }),
      ].join(',');

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node: HTMLElement) => {
      const {
        duration: transitionDuration,
        delay,
        easing: transitionTimingFunction,
      } = getTransitionProps(
        {
          style,
          timeout: timeout === 'auto' ? 0 : timeout,
          easing,
        },
        {
          mode: 'exit',
        },
      );
      let duration;

      if (timeout === 'auto') {
        duration = getAutoHeightDuration(node.clientHeight);
        autoTimeout.current = duration;
      } else {
        duration = transitionDuration;
      }

      node.style.transition = [
        transitions.create('opacity', {
          duration,
          delay,
        }),
        transitions.create('transform', {
          duration: typeof duration === 'number' ? duration * 0.666 : duration,
          delay: delay || (typeof duration === 'number' ? duration * 0.666 : duration),
          easing: transitionTimingFunction,
        }),
      ].join(',');
      node.style.opacity = '0';
      node.style.transform = getScale(0.75);

      if (onExit) {
        onExit(node);
      }
    });
    const handleExited = normalizedTransitionCallback(onExited);

    const handleAddEndListener = (next: () => void) => {
      if (timeout === 'auto') {
        timer.current = setTimeout(next, autoTimeout.current || 0);
      }
    };
    useEffect(
      () => () => {
        clearTimeout(timer.current);
      },
      [],
    );
    return (
      <Transition
        addEndListener={handleAddEndListener}
        appear={appear}
        in={inProp}
        nodeRef={nodeRef}
        onEnter={handleEnter}
        onEntered={handleEntered}
        onEntering={handleEntering}
        onExit={handleExit}
        onExited={handleExited}
        onExiting={handleExiting}
        timeout={timeout === 'auto' ? undefined : timeout}
      >
        {(state) =>
          cloneElement(children, {
            style: {
              opacity: '0',
              transform: getScale(0.75),
              visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
              ...style,
              ...children.props.style,
              ...getStyles(state),
            },
            ref: handleRef,
          })
        }
      </Transition>
    );
  },
);
export default Grow;
