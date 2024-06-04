import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { usePasswordStrength } from './usePasswordStrength';

export const barWidths = ['0%', '38%', '62%', '80%', '100%'];

type PasswordStrengthMeterContainerProps = BarProps & {
  title: string;
};

interface BarProps {
  $score: number;
}

const Bar = styled.div<BarProps>`
  background: ${(p) => p.theme.palette.border.medium};
  height: 2px;
  margin-top: 5px;
  position: relative;
  width: 100%;
  &::before {
    background: ${({ $score, theme }) => {
      switch ($score) {
        case 0:
        case 1:
          return theme.palette.warning.main;
        case 2:
          return theme.palette.success.light;
        case 3:
          return theme.palette.success.main;
        case 4:
          return theme.palette.success.dark;
        default:
          return theme.palette.background.canvas;
      }
    }};
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    top: 0;
    transition: all 0.2s ease-out;
    width: ${(props) => barWidths[props.$score]};
  }
`;

const Dividers = styled.span`
  border-left: 5px solid #fff;
  border-right: 5px solid #fff;
  bottom: 0;
  left: 19%;
  position: absolute;
  right: 19%;
  top: 0;

  &::after {
    border-left: 5px solid #fff;
    border-right: 5px solid #fff;
    bottom: 0;
    content: '';
    left: 30%;
    position: absolute;
    right: 30%;
    top: 0;
  }
`;

const Hint = styled.p`
  color: ${(p) => p.theme.palette.text.primary};
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  margin-top: 4px;
  position: relative;
  text-align: center;
`;

const Container = ({ $score, title }: PasswordStrengthMeterContainerProps) => (
  <>
    <Bar $score={$score} data-testid="bar">
      <Dividers />
    </Bar>
    <div role="status">
      <Hint>{title}</Hint>
    </div>
  </>
);

export interface PasswordStrengthMeterProps {
  displayName: string;
  email: string;
  password: string;
  passwordPwnedCount: number | null;
}

export const PasswordStrengthMeter = ({
  displayName,
  email,
  password,
  passwordPwnedCount,
}: PasswordStrengthMeterProps) => {
  const { formatMessage } = useIntl();
  const score = usePasswordStrength(password, [displayName, email]);
  const strengthLevelMessages = useMemo(
    () => [
      formatMessage({ defaultMessage: 'Password must have at least 8 characters' }),
      formatMessage({ defaultMessage: 'Weak' }),
      formatMessage({ defaultMessage: 'Fair' }),
      formatMessage({ defaultMessage: 'Good' }),
      formatMessage({ defaultMessage: 'Strong' }),
      formatMessage({ defaultMessage: 'Very strong' }),
    ],
    [formatMessage],
  );
  const getStrengthText = () => {
    if (password.length < 8) return strengthLevelMessages[0];
    if (password === email)
      return formatMessage({ defaultMessage: "Password can't match email address" });
    if (password === displayName)
      return formatMessage({ defaultMessage: "Password can't match display name" });
    if (typeof score === 'number' && score < 3) return strengthLevelMessages[score + 1];
    if (passwordPwnedCount && passwordPwnedCount !== 0) {
      return formatMessage(
        {
          defaultMessage:
            'This password has previously appeared in a data breach {passwordPwnedCount, plural, one {# time} other {# times}}. Please use a more secure alternative',
        },
        { passwordPwnedCount },
      );
    }
    return strengthLevelMessages[score + 1];
  };
  return <Container title={getStrengthText()} $score={score} />;
};
