import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $fullWidth: boolean; $fullHeight: boolean }>`
  display: flex;
  color: ${(p) => p.theme.palette.text.secondary};
  justify-content: center;
  align-items: center;
  ${(p) =>
    p.$fullWidth &&
    css`
      width: 100%;
    `}
  ${(p) =>
    p.$fullHeight &&
    css`
      height: 100%;
    `}
`;

const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const CenteredText = styled.div`
  font-size: 16px;
`;

export interface Props {
  children?: ReactNode;
  inline?: boolean;
  message?: string;
}

export const PageError = ({ children, inline = false, message }: Props) => (
  <Root $fullWidth={!inline} $fullHeight={!inline}>
    <Container>
      <SubContainer>
        <CenteredText>{message}</CenteredText>
        {children}
      </SubContainer>
    </Container>
  </Root>
);
