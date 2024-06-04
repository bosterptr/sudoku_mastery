import * as CSS from 'csstype';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface IconProps {
  id?: string;
  inline?: boolean;
  style?: React.CSSProperties;
  width?: CSS.Property.Width;
  height?: CSS.Property.Height;
  size?: CSS.Property.Width;
  className?: string;
  color?: CSS.Property.Color;
  stroke?: CSS.Property.Color;
  fill?: CSS.Property.Color;
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

interface Props {
  id?: string;
  width?: CSS.Property.Width;
  height?: CSS.Property.Height;
  size?: CSS.Property.Width;
  viewBox?: string;
  className?: string;
  color?: CSS.Property.Color;
  fill?: CSS.Property.Color;
  stroke?: CSS.Property.Color;
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  inline?: boolean;
  strokeWidth?: number;
  children: ReactNode | ReactNode[];
  strokeLinecap?: 'inherit' | 'round' | 'butt' | 'square';
  strokeLinejoin?: 'inherit' | 'round' | 'miter' | 'bevel';
  xmlns?: string;
}

const InlineSvg = styled.svg<{
  color?: CSS.Property.Color;
  fill?: CSS.Property.Color;
  stroke?: CSS.Property.Color;
}>`
  fill: ${(p) => p.fill || p.color};
  stroke: ${(p) => p.stroke || p.stopColor};
  top: 0.25em;
  font-size: 1em;
  position: relative;
`;

const Container = styled.div`
  display: inline-flex;
  align-self: center;
`;

const Svg = styled.svg<{
  color?: CSS.Property.Color;
  fill?: CSS.Property.Color;
  stroke?: CSS.Property.Color;
}>`
  ${(p) =>
    p.fill !== 'unset' &&
    css`
      fill: ${p.fill || p.color || p.theme.palette.text.primary};
    `}
  ${(p) =>
    p.stroke !== 'unset' &&
    css`
      stroke: ${p.stroke || p.color || 'transparent'};
    `}
`;

export const Icon: React.FC<Props> = ({
  width = '16px',
  height = '16px',
  strokeWidth = 0,
  inline,
  size,
  children,
  ...rest
}) => (
  <>
    {!inline && (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Svg height={size || height} width={size || width} strokeWidth={strokeWidth} {...rest}>
        {children}
      </Svg>
    )}
    {inline && (
      <Container>
        <InlineSvg
          height={size || height}
          width={size || width}
          strokeWidth={strokeWidth}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        >
          {children}
        </InlineSvg>
      </Container>
    )}
  </>
);
