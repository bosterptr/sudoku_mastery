import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.button`
  align-items: center;
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const IconContainer = styled.div<{ $state?: boolean }>`
  align-items: center;
  background-color: ${(p) => p.theme.palette.background.primary};
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.primary.main};
  cursor: pointer;
  display: flex;
  font-size: 1.8em;
  justify-content: center;
  min-height: 64px;
  min-width: 64px;
  user-select: none;
  transition:
    color 0.3s ease,
    fill 0.3s ease,
    background-color 0.3s ease;
  &:hover {
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.background.secondary};
    & > * {
      fill: ${(p) => p.theme.palette.primary.main};
    }
  }
  &:active {
    background-color: ${(p) => p.theme.palette.primary.main};
    color: #ffffff;
    & > * {
      fill: ${(p) => p.theme.palette.primary.contrastText};
    }
  }
  ${(p) =>
    p.$state &&
    css`
      background-color: ${p.theme.palette.primary.main};
      color: #ffffff;
      & > * {
        fill: ${p.theme.palette.primary.contrastText};
      }
    `}
  & > * {
    transition: fill 0.3s ease;
  }
`;

const LabelContainer = styled.div`
  color: ${(p) => p.theme.palette.text.secondary};
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
`;

const State = styled.div<{ $state?: boolean }>`
  align-items: center;
  background-color: ${(p) => p.theme.palette.primary.main};
  border-radius: 50px;
  box-shadow: ${(p) => p.theme.shadows.z1};
  color: ${(p) => p.theme.palette.primary.contrastText};
  display: flex;
  font-size: 12px;
  font-weight: 700;
  justify-content: center;
  left: 50%;
  padding: 0;
  padding: 8px;
  position: absolute;
  top: -16%;
  user-select: none;
  z-index: 1;
  transition:
    0.2s ease background-color,
    0.2s ease color;
  ${(p) =>
    !p.$state &&
    css`
      background-color: ${p.theme.palette.background.canvas};
      color: ${p.theme.palette.text.primary};
    `}
`;

export interface IPublicProps {
  children: ReactNode;
  className?: string;
  label: string;
  onClick: () => void;
  state?: boolean;
  stateText?: ReactNode;
}

export const SudokuNumpadControlButton = ({
  children,
  className,
  label,
  onClick,
  state,
  stateText,
}: IPublicProps) => {
  return (
    <Container onClick={onClick} className={className}>
      <IconContainer $state={state}>{children}</IconContainer>
      {stateText && <State $state={state}>{stateText}</State>}
      <LabelContainer>{label}</LabelContainer>
    </Container>
  );
};
