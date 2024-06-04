import styled, { css } from 'styled-components';

export const Header = styled.div`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

export const RotateOnDrag = styled.div<{ isBeingDragged: boolean }>`
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  ${(p) =>
    p.isBeingDragged &&
    css`
      box-shadow: 5px 10px 30px 0 rgba(9, 30, 66, 0.15);
      transform: rotate(5deg);
    `}
`;

export const SectionTitle = styled.div`
  margin: 24px 0 5px;
  text-transform: uppercase;
`;
