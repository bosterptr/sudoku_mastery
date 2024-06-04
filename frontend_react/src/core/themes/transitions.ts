import * as duration from './duration';
import * as easing from './easing';

export interface CreateTransitionOptions {
  duration?: number | string;
  easing?: string;
  delay?: number | string;
}

function formatMs(milliseconds: number) {
  return `${Math.round(milliseconds)}ms`;
}

export function create(props: string | string[] = ['all'], options: CreateTransitionOptions = {}) {
  const {
    duration: durationOption = duration.standard,
    easing: easingOption = easing.easeInOut,
    delay = 0,
  } = options;

  return (Array.isArray(props) ? props : [props])
    .map(
      (animatedProp) =>
        `${animatedProp} ${
          typeof durationOption === 'string' ? durationOption : formatMs(durationOption)
        } ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`,
    )
    .join(',');
}
