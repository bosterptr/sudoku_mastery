import styled, { css } from 'styled-components';

export const Tooltip = styled.span<{ valid: boolean }>`
  background: #fff;
  border-radius: 0.3rem;
  border: 0.06rem solid #d5d3d3;
  box-shadow: rgba(0, 0, 0, 0.39) 0.2rem 0.2rem 0.5rem 0.06rem;
  color: rgba(53, 53, 53, 0.9);
  left: 0;
  line-height: 1.25rem;
  opacity: 0;
  padding: 0.6rem;
  position: absolute;
  text-align: left;
  text-shadow: rgba(0, 0, 0, 0.1) 0.06rem 0.06rem 0.06rem;
  top: 110%;
  transition:
    visibility 0s,
    opacity 0.3s linear;
  visibility: hidden;
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
    border-color: transparent transparent #404040 transparent;
    border-style: solid;
    border-width: 0.3rem;
    bottom: 100%;
    content: ' ';
    left: 50%;
    margin-left: -0.3rem;
    position: absolute;
  }
`;

export const TooltipLine = styled.span`
  display: block;
  font-size: 16px;
`;

export const Hide = styled.div<{ state?: boolean }>`
  opacity: 1;
  position: relative;
  transition:
    all 1s ease-in-out,
    color 0.5s ease-in-out;
  ${(p) => {
    if (p.state === true) {
      return css`
        margin: 0;
        max-height: 0;
        opacity: 0;
        transform: translateY(-3rem);
        visibility: hidden;
      `;
    }
    return null;
  }};
`;
