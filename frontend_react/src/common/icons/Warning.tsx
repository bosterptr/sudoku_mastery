import { Icon, IconProps } from './Icon';

export const Warning = (props: IconProps) => (
  <Icon
    // eslint-disable-next-line prettier/prettier, react/jsx-props-no-spreading
    {...props}
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </Icon>
);
