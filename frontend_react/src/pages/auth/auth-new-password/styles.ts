import styled, { css } from 'styled-components';

export const NewPasswordContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: 0.5rem auto 2rem;
  position: relative;
  width: 27rem;
  @media (max-width: 800px) {
    width: 20rem;
  }
`;

export const Tooltip = styled.span<{ valid: boolean }>`
  transition:
    visibility 0s,
    opacity 0.3s linear;
  position: absolute;
  z-index: 3;
  line-height: 1.25rem;
  padding: 0.6rem;
  text-align: left;
  color: rgba(53, 53, 53, 0.9);
  border: 0.06rem solid #d5d3d3;
  background: #fff;
  border-radius: 0.3rem;
  text-shadow: rgba(0, 0, 0, 0.1) 0.06rem 0.06rem 0.06rem;
  box-shadow: rgba(0, 0, 0, 0.39) 0.2rem 0.2rem 0.5rem 0.06rem;
  left: 0;
  top: 110%;
  visibility: hidden;
  opacity: 0;
  z-index: 3;
  ${(p) =>
    p.valid
      ? css`
          opacity: 0 !important;
          visibility: hidden;
          z-index: -1;
        `
      : ''}
  &::after {
    content: ' ';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -0.3rem;
    border-width: 0.3rem;
    border-style: solid;
    border-color: transparent transparent #404040 transparent;
  }
`;

export const TooltipLine = styled.span`
  display: block;
`;

export const NewPasswordTitle = styled.h2`
  margin: 1rem 0;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 1rem;
  max-height: 5rem;
  opacity: 1;
  position: relative;
  transition: all 1s ease-in-out;
  &:focus-within {
    ${Tooltip} {
      opacity: 1;
      visibility: visible;
    }
  }
  ${(p) => {
    if (p.hidden) {
      return css`
        margin: 0rem 0.5rem;
        max-height: 0;
        opacity: 0;
        transform: translateY(0.3rem);
        visibility: hidden;
      `;
    }
    return null;
  }};
`;
