import { Icon, IconProps } from './Icon';

export const Done = (props: IconProps) => (
  <Icon
    // eslint-disable-next-line prettier/prettier, react/jsx-props-no-spreading
    {...props}
    viewBox="0 0 24 24"
  >
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </Icon>
);
