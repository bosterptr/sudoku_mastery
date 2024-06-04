import { cloneElement, CSSProperties, FC, memo, useRef } from 'react';
import Transition, { ExitHandler } from 'react-transition-group/Transition';
// import './fade.css';

interface Props {
  appear?: boolean;
  children: JSX.Element;
  duration?: number;
  enter?: boolean;
  mountOnEnter?: boolean;
  onExited?: ExitHandler<HTMLDivElement>;
  style?: CSSProperties;
  unmountOnExit?: boolean;
  onEntering?: (element: HTMLElement, isAppearing: boolean) => void;
}
const FadeIn: FC<Props> = ({
  appear = true,
  children,
  duration = 300,
  enter = true,
  mountOnEnter = true,
  onExited,
  onEntering,
  style,
  unmountOnExit = true,
}) => {
  const defaultStyle: CSSProperties = {
    transition: `opacity ${duration}ms linear`,
  };

  const transitionStyles: { [str: string]: CSSProperties } = {
    exited: { opacity: 0, display: 'none' },
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
  };
  const nodeRef = useRef(null);
  return (
    <Transition
      in={enter}
      timeout={duration}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
      onExited={onExited}
      appear={appear}
      nodeRef={nodeRef}
      onEntering={onEntering}
    >
      {(state) =>
        cloneElement(children, {
          style: {
            ...defaultStyle,
            ...transitionStyles[state],
            ...style,
            ...children.props.style,
          },
        })
      }
    </Transition>
  );
};

export default memo(FadeIn);
