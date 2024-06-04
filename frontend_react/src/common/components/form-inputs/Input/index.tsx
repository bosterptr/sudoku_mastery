import { ComponentSize } from 'app/core/themes/size';
import { pxToRem } from 'app/core/themes/typography';
import React, { forwardRef, memo, ReactNode } from 'react';
import styled, { css } from 'styled-components';

function getPropertiesForButtonSize(size?: ComponentSize) {
  switch (size) {
    case 'sm':
      return {
        fontSize: pxToRem(16),
        padding: '6px 0 6px 14px',
      };
    case 'lg':
      return {
        fontSize: pxToRem(30),
        padding: '10px 0 10px 20px',
      };
    case 'md':
    default:
      return {
        fontSize: pxToRem(18),
        padding: '8px 0 8px 16px',
        height: '36px',
      };
  }
}

function getLabelStylesForButtonSize(size?: ComponentSize) {
  switch (size) {
    case 'sm':
      return css`
        font-size: 12px;
        transform: translate(4px, -23px);
      `;
    case 'lg':
      return css`
        font-size: 12px;
        transform: translate(8px, -30px);
      `;
    case 'md':
    default:
      return css`
        font-size: 18px;
        transform: translate(8px, -30px);
      `;
  }
}

function getShrinkLabelStylesForButtonSize(size?: ComponentSize) {
  switch (size) {
    case 'sm':
      return css`
        color: ${(p) => p.theme.palette.primary.main};
        font-weight: 500;
        transform: scale(0.75) translateY(-55px);
      `;
    case 'lg':
      return css`
        color: ${(p) => p.theme.palette.primary.main};
        font-weight: 500;
        transform: scale(0.75) translateY(-47px);
      `;
    case 'md':
    default:
      return css`
        color: ${(p) => p.theme.palette.primary.main};
        font-weight: 500;
        transform: scale(0.75) translateY(-70px);
      `;
  }
}

const Tooltip = styled.span<{ valid: boolean }>`
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
    content: '';
    left: 50%;
    margin-left: -0.3rem;
    position: absolute;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  margin-top: 2rem;
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
  ${(p) =>
    p.hidden &&
    css`
      margin: 0rem 0.5rem;
      max-height: 0;
      opacity: 0;
      transform: translateY(0.3rem);
      visibility: hidden;
    `}
`;

const TextFieldInput = styled.input<{
  $variant?: 'filled' | 'outlined' | 'default';
  $size?: ComponentSize;
}>`
  background-color: transparent;
  border-bottom: 1px solid ${(p) => p.theme.palette.border.weak};
  border-radius: 0;
  border: none;
  color: ${(p) => p.theme.palette.text.primary};
  display: block;
  font-weight: 400;
  height: 100%;
  line-height: 1.3;
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  width: 100%;
  svg {
    fill: ${(p) => p.theme.palette.text.primary};
    transition: fill 0.3s ease;
  }
  ${(p) =>
    p.$variant !== 'outlined' &&
    css`
      border-bottom: 2px solid ${p.theme.palette.border.weak};
    `}
  &:required {
    box-shadow: none;
  }
  &:focus {
    outline: none;
  }
  &:focus ~ label {
    background-color: white;
    color: ${(p) => p.theme.palette.primary.main};
    font-weight: bold;
    line-height: 1;
    ${(p) => getShrinkLabelStylesForButtonSize(p.$size)}
    svg {
      fill: ${(p) => p.theme.palette.primary.main};
      transition: fill 0.3s ease;
    }
  }
  ${(p) => getPropertiesForButtonSize(p.$size)}
`;

const TextFieldLabel = styled.label<{
  readonly $hasValue: boolean;
  readonly $hasError?: boolean;
  variant?: 'filled' | 'outlined';
  $size?: ComponentSize;
}>`
  border-radius: 0 0 0.3rem 0;
  color: ${(p) => {
    if (p.$hasError !== undefined && p.$hasValue)
      return p.$hasError ? p.theme.palette.errors.main : p.theme.palette.success.main;
    return p.theme.palette.text.primary;
  }};
  font-size: 16px;
  left: 8px;
  pointer-events: none;
  position: absolute;
  font-weight: 400;
  transform: translateY(${(p) => (p.variant === 'outlined' ? '-20px' : '-23px')});
  transition: all 0.3s ease;
  background-color: white;
  line-height: 1;
  transform-origin: bottom left;
  ${(p) => getLabelStylesForButtonSize(p.$size)}
  ${(p) => p.$hasValue && getShrinkLabelStylesForButtonSize(p.$size)};
`;

const GroupContainer = styled.div<{
  disabled?: boolean;
  $error?: boolean;
  $hasValue?: boolean;
  $readOnly?: boolean;
  $variant: 'filled' | 'outlined' | 'default';
  margin?: string;
}>`
  background-color: ${(p) => p.theme.palette.background.primary};
  margin: ${(p) => (p.margin ? p.margin : '0 0 8px 0')};
  position: relative;
  transition: all 0.5s ease;
  ${(p) =>
    !p.$readOnly &&
    css`
      &:after {
        border-bottom-color: ${p.theme.palette.border.strong};
        border-bottom-style: solid;
        border-bottom-width: 1px;
        bottom: 0;
        content: ' ';
        left: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        transform: scaleX(0);
        transition: all 0.5s ease;
      }
    `}
  ${(p) =>
    p.disabled &&
    css`
      filter: blur(3px);
    `}
    ${(p) =>
    p.$variant === 'default' &&
    css`
      &:after {
        transform: scaleX(1);
      }
    `}
  ${(p) => {
    if (!p.$readOnly) {
      if (p.$variant === 'filled') {
        return css`
          background-color: rgba(153, 101, 101, 0.13);
          border-radius: 4px;
        `;
      }
      if (p.$variant === 'outlined') {
        return css`
          border-radius: 4px;
          border: 1px solid rgb(198, 190, 207);
          padding: 1px 1px 0;
          &:focus-within {
            border-color: ${p.theme.palette.primary.main};
          }
        `;
      }
    }
    return null;
  }}
${(p) =>
    !p.$readOnly &&
    p.$hasValue &&
    css`
      &:after {
        transform: scaleX(1) !important;
      }
    `}
${(p) =>
    !p.$readOnly &&
    !p.$error &&
    typeof p.$error !== 'undefined' &&
    p.$hasValue &&
    css`
      &:after {
        border-bottom-color: ${p.theme.palette.success.dark};
      }
    `}
  ${(p) => {
    if (!p.$readOnly) {
      if (p.$hasValue) {
        if (p.$error === true) {
          return css`
            &:after {
              border-bottom-color: ${p.theme.palette.errors.dark};
            }
          `;
        }
        if (p.$error === false) {
          return css`
            &:after {
              border-bottom-color: ${p.theme.palette.success.dark};
            }
          `;
        }
        return css`
          &:after {
            border-bottom-color: ${p.theme.palette.border.weak};
          }
        `;
      }
    }
    return css`
      &:after {
        border-bottom-color: ${p.theme.palette.border.weak};
      }
    `;
  }}
  &:focus-within {
    &:after {
      border-width: 3px;
      ${(p) =>
        !p.$hasValue &&
        css`
          transform: scaleX(1);
        `}
    }
  }
  &:hover {
    &:after {
      border-width: 3px;
    }
  }
  input[type='password'] {
    letter-spacing: 0.2rem;
  }
`;

interface Props {
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hidden?: boolean;
  id?: string;
  label?: string | ReactNode;
  margin?: string;
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onClick?: (
    event: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: ComponentSize;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  variant?: 'filled' | 'outlined' | 'default';
}

const InputField = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      disabled,
      error,
      id,
      label,
      onChange,
      margin,
      name,
      readOnly,
      size = 'md',
      type = 'text',
      value,
      variant = 'outlined',
      ...rest
    },
    ref,
  ) => {
    const hasValue = Boolean(value?.length);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event.target.value);
    };
    return (
      <GroupContainer
        $hasValue={hasValue}
        $readOnly={readOnly}
        $variant={variant}
        className={className}
        disabled={disabled}
        $error={error}
        margin={margin}
      >
        <TextFieldInput
          $size={size}
          $variant={variant}
          disabled={disabled}
          id={id}
          name={name}
          onChange={handleChange}
          readOnly={readOnly}
          ref={ref}
          type={type}
          value={value}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
        {label ? (
          <TextFieldLabel $hasError={error} $hasValue={hasValue} htmlFor={id || name} $size={size}>
            {label}
          </TextFieldLabel>
        ) : null}
      </GroupContainer>
    );
  },
);

export default memo(InputField);
