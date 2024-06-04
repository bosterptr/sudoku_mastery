import * as duration from 'app/core/themes/duration';
import { ComponentSize } from 'app/core/themes/types';
import styled, { css, keyframes } from 'styled-components';

export interface LoadingSpinnerProps {
  size?: ComponentSize;
  /** Delay the appearance of the loading spinner; if you unmount the component before this time has elapsed, the user will not see a loading spinner */
  delay?: number;
  inheritColor?: boolean;
  fillContent?: boolean;
}

const loadingSpinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const loadingSpinnerAppear = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const SpinnerContainer = styled.div<{ delay?: number; $fillContent?: boolean }>`
  ${({ $fillContent }) =>
    $fillContent &&
    css`
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
    `}

  ${({ delay }) =>
    Boolean(delay) &&
    css`
      animation-delay: ${delay}ms;
      animation-duration: ${duration.standard};
      animation-fill-mode: forwards;
      animation-iteration-count: 1;
      animation-name: ${loadingSpinnerAppear};
      animation-timing-function: ease;
      opacity: 0;
    `}
`;
function getPropertiesForSize(size?: ComponentSize) {
  switch (size) {
    case 'xs':
      return {
        width: '1.2rem',
        height: '1.2rem',
      };
    case 'sm':
      return {
        width: '1.6rem',
        height: '1.6rem',
      };
    case 'lg':
      return {
        width: '2.8rem',
        height: '2.8rem',
      };
    case 'md':
    default:
      return {
        width: '2.2rem',
        height: '2.2rem',
      };
  }
}

const SpinnerCircle = styled.div<{ $inheritColor?: boolean; size?: ComponentSize }>`
  border-right: 4px solid transparent;
  border-top: 4px solid #d1d1d1;
  border-radius: 50%;
  position: relative;
  transform: translateZ(0);
  animation-name: ${loadingSpinnerAnimation};
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-timing-function: linear;
  ${(p) => getPropertiesForSize(p.size)}
  ${({ $inheritColor }) =>
    $inheritColor &&
    css`
      border-top-color: ${(p) => p.theme.palette.border.weak};
      border-right-color: ${(p) => p.theme.palette.border.weak};
      border-bottom-color: ${(p) => p.theme.palette.border.weak};
      border-left-color: currentColor;
    `}
`;

export const LoadingSpinner = ({
  delay = 300,
  fillContent,
  inheritColor,
  size,
}: LoadingSpinnerProps) => (
  <SpinnerContainer delay={delay} $fillContent={fillContent} data-testid="spinner">
    <SpinnerCircle $inheritColor={inheritColor} size={size} />
  </SpinnerContainer>
);
