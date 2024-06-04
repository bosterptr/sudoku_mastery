import styled, { css } from 'styled-components';

export const ErrorImageOverlay = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60vh;
  justify-content: center;
  width: 100%;
`;

export const ErrorImageContainer = styled.div<{ $imageurl: string }>`
  ${({ $imageurl }) => css`
    background-image: url(${$imageurl});
  `};
  background-position: center;
  background-size: cover;
  display: inline-block;
  height: 40vh;
  position: relative;
  width: 40vh;
  z-index: 1000;
`;

export const ErrorImageText = styled.h2`
  font-size: 1.75rem;
  color: #2f8e89;
`;
