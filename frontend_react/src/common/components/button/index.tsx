import { alpha } from 'app/core/themes/colorManipulator';
import * as duration from 'app/core/themes/duration';
import { ComponentSize } from 'app/core/themes/size';
import * as transitions from 'app/core/themes/transitions';
import { ITheme } from 'app/core/themes/types';
import { pxToRem } from 'app/core/themes/typography';
import { ThemeRichColor } from 'app/types/styled';
import { cloneElement, CSSProperties, forwardRef, MouseEventHandler, ReactNode } from 'react';
import styled, { css, CSSObject } from 'styled-components';
import { LoadingSpinner } from '../spinner';

export type ButtonCategory = 'primary' | 'secondary' | 'teriary';
export const allButtonCategories: ButtonCategory[] = ['primary', 'secondary', 'teriary'];
export type ButtonVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export const allButtonVariants: ButtonVariant[] = [
  'default',
  'success',
  'warning',
  'danger',
  'info',
];

function getPropertiesForButtonSize(size?: ComponentSize) {
  switch (size) {
    case 'xs':
      return {
        padding: '2px 4px',
        fontSize: pxToRem(11),
      };
    case 'sm':
      return {
        padding: '4px 6px',
        fontSize: pxToRem(13),
      };
    case 'lg':
      return {
        padding: '10px 13px',
        fontSize: pxToRem(15),
      };
    case 'md':
    default:
      return {
        padding: '6px 8px',
        fontSize: pxToRem(14),
      };
  }
}

function getButtonVariantStyles(
  theme: ITheme,
  color: ThemeRichColor,
  category: ButtonCategory,
): CSSObject {
  if (category === 'secondary') {
    return {
      backgroundColor: 'transparent',
      color: color.main,
      fill: color.contrastText,
      border: `2px solid ${alpha(color.main, 0.2)}`,
      transition: transitions.create(['background-color', 'box-shadow', 'color'], {
        duration: duration.short,
      }),
      '&:focus': {
        outline: 'none',
        textDecoration: 'none',
      },
      '&:hover': {
        backgroundColor: alpha(color.dark, theme.palette.action.hoverOpacity),
      },
      '&:active': {
        backgroundColor: color.main,
        color: color.contrastText,
        boxShadow: theme.shadows.z2,
      },
      '& > *': {
        stroke: color.main,
        fill: color.main,
      },
    };
  }

  if (category === 'teriary') {
    return {
      backgroundColor: 'transparent',
      color: color.main,
      fill: color.contrastText,
      border: '2px solid transparent',
      transition: transitions.create(['background-color', 'box-shadow', 'color'], {
        duration: duration.short,
      }),
      '&:focus': {
        outline: 'none',
        textDecoration: 'none',
      },
      '&:hover': {
        color: color.contrastText,
        backgroundColor: alpha(color.dark, theme.palette.action.hoverOpacity),
        textDecoration: 'none',
      },
      '&:active': {
        backgroundColor: color.main,
        color: color.contrastText,
        boxShadow: theme.shadows.z2,
        '& > *': {
          stroke: color.contrastText,
          fill: color.contrastText,
        },
      },
    };
  }
  return {
    backgroundColor: color.main,
    color: color.contrastText,
    fill: color.main,
    border: '2px solid transparent',
    transition: transitions.create(['background-color', 'box-shadow', 'color'], {
      duration: duration.short,
    }),
    '&:hover': {
      backgroundColor: color.dark,
      color: color.contrastText,
    },
    '&:active': {
      backgroundColor: 'transparent',
      color: color.main,
      boxShadow: theme.shadows.z2,
    },
    '& > *': {
      stroke: color.main,
      fill: color.contrastText,
    },
  };
}

function getPropertiesForVariant(theme: ITheme, variant: ButtonVariant, category: ButtonCategory) {
  switch (variant) {
    case 'success':
      return getButtonVariantStyles(theme, theme.palette.success, category);
    case 'warning':
      return getButtonVariantStyles(theme, theme.palette.warning, category);
    case 'danger':
      return getButtonVariantStyles(theme, theme.palette.errors, category);
    case 'info':
      return getButtonVariantStyles(theme, theme.palette.info, category);
    case 'default':
    default:
      return getButtonVariantStyles(theme, theme.palette.primary, category);
  }
}

// const danger = css`
//   background-color: ${(p) => p.theme.colors.variants.danger};
//   border: none;
//   color: white;
//   font-weight: bold;
// `;

// const confirm = css`
//   background-color: ${(p) => p.theme.colors.primary.text};
//   border: none;
//   color: #fff;
//   font-weight: bold;
// `;

// const subtle = css`
//   background-color: #e0e0e0;
//   box-shadow: none;
//   border: none;
// `;

const disabledStyles = css`
  background-color: #e2e2e2;
  color: #b1b1b1;
  cursor: not-allowed;
  filter: blur(2px);
  & > * {
    fill: #b1b1b1;
    stroke: #b1b1b1;
  }
  &:hover {
    background-color: #e2e2e2;
    color: #b1b1b1;
    fill: #b1b1b1;
    stroke: #b1b1b1;
  }
  &:active {
    background-color: #e2e2e2;
    color: #b1b1b1;
    fill: #b1b1b1;
    stroke: #b1b1b1;
  }
`;

const ButtonContainer = styled.button<{
  disabled?: boolean;
  $variant: ButtonVariant;
  $category: ButtonCategory;
  size?: ComponentSize;
  fullwidth?: boolean;
}>`
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
  &:focus:not {
    outline: 0;
  }
  ${(p) => getPropertiesForVariant(p.theme, p.$variant, p.$category)}
  ${(p) => {
    const { fontSize, padding } = getPropertiesForButtonSize(p.size);
    return css`
      font-size: ${fontSize};
      padding: ${padding};
    `;
  }}
  ${(p) =>
    p.fullwidth &&
    css`
      width: 100%;
    `}
  ${(p) => p.disabled && disabledStyles}
`;

export interface Props {
  autoFocus?: boolean;
  category?: ButtonCategory;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  fullwidth?: boolean;
  iconAfter?: JSX.Element;
  iconBefore?: JSX.Element;
  id?: string;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: ComponentSize;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      autoFocus,
      category = 'primary',
      children,
      className,
      disabled = false,
      fullwidth,
      iconAfter,
      iconBefore,
      id,
      isLoading = false,
      onClick,
      size = 'md',
      style,
      type = 'button',
      variant = 'default',
    },
    ref,
  ) => {
    let buttonContent = children;
    if (iconAfter || iconBefore) {
      buttonContent = (
        <>
          {iconBefore && cloneElement(iconBefore)}
          {children}
          {iconAfter && cloneElement(iconAfter)}
        </>
      );
    }
    return (
      <ButtonContainer
        $category={category}
        $variant={variant}
        autoFocus={autoFocus}
        className={className}
        color={disabled ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, .2)'}
        disabled={disabled}
        fullwidth={fullwidth}
        id={id}
        onClick={onClick}
        ref={ref}
        size={size}
        style={style}
        type={type}
      >
        {isLoading ? <LoadingSpinner /> : buttonContent}
      </ButtonContainer>
    );
  },
);
export default Button;
