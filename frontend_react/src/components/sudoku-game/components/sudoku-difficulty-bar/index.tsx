import { alpha } from 'app/core/themes/colorManipulator';
import * as duration from 'app/core/themes/duration';
import * as transitions from 'app/core/themes/transitions';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { SudokuDifficulty } from '../../types';

const DifficultyBlock = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${(p) => p.theme.palette.text.secondary};
`;

const Button = styled.div<{ $pressed: boolean }>`
  align-items: center;
  border-radius: 3px;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  justify-content: center;
  line-height: 1.75;
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    filter 0.2s ease;
  user-select: none;
  padding: 6px 8px;
  font-size: 14px;
  cursor: pointer;
  color: ${(p) => p.theme.palette.primary.main};
  transition: ${transitions.create(['background-color', 'box-shadow', 'color'], {
    duration: duration.short,
  })};
  &:focus {
    outline: none;
    text-decoration: none;
  }
  &:hover {
    color: ${(p) => p.theme.palette.primary.contrastText};
    background-color: ${(p) =>
      alpha(p.theme.palette.primary.dark, p.theme.palette.action.hoverOpacity)};
    text-decoration: none;
  }
  &:active {
    background-color: ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.contrastText};
    box-shadow: ${(p) => p.theme.shadows.z2};
  }
  ${(p) =>
    p.$pressed &&
    css`
      background-color: ${p.theme.palette.background.primary};
    `}
`;

export interface IPublicProps {
  difficulty: ISudoku['difficulty'];
  onChangeGameType: (difficulty: ISudoku['difficulty']) => void;
}

const DifficultyButton = ({
  activeDifficulty,
  difficulty,
  onClick,
  text,
}: {
  activeDifficulty: ISudoku['difficulty'];
  difficulty: ISudoku['difficulty'];
  onClick: (sudokuDifficulty: ISudoku['difficulty']) => void;
  text: string;
}) => {
  const handleClick = () => onClick(difficulty);
  return (
    <Button onClick={handleClick} $pressed={activeDifficulty === difficulty}>
      {text}
    </Button>
  );
};

export const SudokuDifficultyBar = ({ difficulty, onChangeGameType }: IPublicProps) => {
  const intl = useIntl();
  return (
    <DifficultyBlock>
      <HeaderText>
        <FormattedMessage defaultMessage="Difficulty:" />
      </HeaderText>
      <DifficultyButton
        activeDifficulty={difficulty}
        difficulty={SudokuDifficulty.Easy}
        onClick={onChangeGameType}
        text={intl.formatMessage({ defaultMessage: 'Easy' })}
      />
      <DifficultyButton
        activeDifficulty={difficulty}
        difficulty={SudokuDifficulty.Medium}
        onClick={onChangeGameType}
        text={intl.formatMessage({ defaultMessage: 'Medium' })}
      />
      <DifficultyButton
        activeDifficulty={difficulty}
        difficulty={SudokuDifficulty.Hard}
        onClick={onChangeGameType}
        text={intl.formatMessage({ defaultMessage: 'Hard' })}
      />
      <DifficultyButton
        activeDifficulty={difficulty}
        difficulty={SudokuDifficulty.Expert}
        onClick={onChangeGameType}
        text={intl.formatMessage({ defaultMessage: 'Expert' })}
      />
    </DifficultyBlock>
  );
};
