import { CSSProperties } from 'react';

export const reflow = (node: Element) => node.scrollTop;

interface ComponentProps {
  easing: string | { enter?: string; exit?: string } | undefined;
  style: CSSProperties | undefined;
  timeout: number | { enter?: number; exit?: number };
}

interface Options {
  mode: 'enter' | 'exit';
}

interface TransitionProps {
  duration: string | number;
  easing: string | undefined;
  delay: string | undefined;
}

export function getTransitionProps(props: ComponentProps, options: Options): TransitionProps {
  const { timeout, easing, style = {} } = props;

  return {
    duration:
      style.transitionDuration ??
      (typeof timeout === 'number' ? timeout : timeout[options.mode] || 0),
    easing:
      style.transitionTimingFunction ??
      (typeof easing === 'object' ? easing[options.mode] : easing),
    delay: style.transitionDelay,
  };
}

export function getAutoHeightDuration(height: number) {
  if (!height) return 0;
  const constant = height / 36;
  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
