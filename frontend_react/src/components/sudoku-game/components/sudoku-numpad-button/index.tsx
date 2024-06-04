import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.button`
  background-color: ${(p) => p.theme.palette.background.primary};
  border-radius: 5px;
  border: 0;
  color: ${(p) => p.theme.palette.primary.main};
  cursor: pointer;
  flex-basis: 32%;
  font-size: 3.2em;
  font-weight: 700;
  height: auto;
  margin: 1%;
  padding: 0px;
  text-align: center;
  transition:
    background-color 0.1s ease-in-out,
    color 0.1s ease-in-out;
  @media (max-width: 400px) {
    font-size: 2.4em;
  }
  @media (min-width: 801px) {
    &:nth-child(3n-2) {
      margin-left: 0;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:first-child,
    &:nth-child(2),
    &:nth-child(3) {
      margin-top: 0;
    }
    &:nth-child(7),
    &:nth-child(8),
    &:nth-child(9) {
      margin-bottom: 0;
    }
  }
  &:hover {
    background-color: ${(p) => p.theme.palette.background.canvas};
    color: ${(p) => p.theme.palette.primary.main};
  }
  &:active {
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
  }
`;

export interface IPublicProps {
  onClick: (index: string) => void;
  children: ReactNode;
  index: number;
  className?: string;
}

export const SudokuNumpadButton = forwardRef<HTMLButtonElement, IPublicProps>(
  ({ children, onClick, index, className }, ref) => {
    const handleClick = () => {
      onClick(index.toString());
    };
    return (
      <Container onClick={handleClick} ref={ref} className={className}>
        {children}
      </Container>
    );
  },
);
