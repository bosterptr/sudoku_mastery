import styled from 'styled-components';
import { SudokuNumpadButton } from '../sudoku-numpad-button';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  width: 300px;
`;

export interface IPublicProps {
  onButtonClick: (index: string) => void;
  className?: string;
}
export const SudokuNumpad = ({ onButtonClick, className }: IPublicProps) => {
  return (
    <Container className={className}>
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <SudokuNumpadButton
            index={index + 1}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={onButtonClick}
          >
            {index + 1}
          </SudokuNumpadButton>
        ))}
    </Container>
  );
};
