import { Icon, IconProps } from './Icon';

export const EraserIcon = (props: IconProps) => (
  <Icon
    // eslint-disable-next-line prettier/prettier, react/jsx-props-no-spreading
    {...props}
    viewBox="0 0 512 512"
  >
    <path d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 416H150.628l-80-80 124.686-124.686z" />
  </Icon>
);
