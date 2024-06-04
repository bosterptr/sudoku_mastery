import { CSSProperties, ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Image = styled.img`
  border-radius: 50%;
  display: flex;
  height: 100%;
  position: relative;
  width: 100%;
`;

const small = css`
  height: 30px;
  width: 30px;
`;
const medium = css`
  height: 40px;
  width: 40px;
`;
const large = css`
  height: 48px;
  width: 48px;
`;
const profile = css`
  height: 180px;
  width: 180px;
`;
const smallText = css`
  font-size: 12px;
`;
const mediumText = css`
  font-size: 18px;
`;
const largeText = css`
  font-size: 26px;
`;
const profileText = css`
  font-size: 80px;
`;
// eslint-disable-next-line no-shadow
export const AvatarVariant = {
  CIRCLE: 0,
  ROUNDED: 1,
  SQUARE: 2,
} as const;

type IAvatarVariantValue = (typeof AvatarVariant)[keyof typeof AvatarVariant];
const Container = styled.div<{
  size: AvatarSizeType;
  $variant?: IAvatarVariantValue;
}>`
  & > * {
    font-weight: 500;
    ${(p) => p.size === 'large' && largeText}
    ${(p) => p.size === 'medium' && mediumText}
    ${(p) => p.size === 'small' && smallText}
    ${(p) => p.size === 'profile' && profileText}
    ${(p) =>
      typeof p.size === 'number' &&
      css`
        font-size: ${Math.floor(p.size * 0.45)}px;
      `}
  }
  ${(p) => p.size === 'large' && large}
  ${(p) => p.size === 'medium' && medium}
  ${(p) => p.size === 'small' && small}
  ${(p) => p.size === 'profile' && profile}
  ${(p) =>
    typeof p.size === 'number' &&
    css`
      height: ${p.size}px;
      width: ${p.size}px;
    `}
  align-items: center;
  background-color: rgb(0 87 242);
  border-radius: ${(p) => {
    switch (p.$variant) {
      case AvatarVariant.ROUNDED:
        return '6px';
      case AvatarVariant.SQUARE:
        return '0px';
      default:
        return '50%';
    }
  }};
  border: 2px solid #fff;
  color: white;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

export type AvatarSizeType = 'small' | 'medium' | 'large' | 'profile' | number;

interface Props {
  alt?: string;
  src?: string | null;
  style?: CSSProperties;
  onClick?: () => void;
  // eslint-disable-next-line react/require-default-props
  size?: AvatarSizeType;
  className?: string;
  children?: ReactNode;
  variant?: IAvatarVariantValue;
}
export const Avatar = ({
  style,
  src,
  onClick,
  size = 'medium',
  className,
  children,
  alt,
  variant = AvatarVariant.CIRCLE,
}: Props) => {
  return (
    <Container className={className} onClick={onClick} size={size} style={style} $variant={variant}>
      {src && <Image alt={alt} src={src} />}
      {!src && <span>{children}</span>}
    </Container>
  );
};
