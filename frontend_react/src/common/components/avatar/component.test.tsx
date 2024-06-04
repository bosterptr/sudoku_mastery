import { render } from 'app/tests/utils';
import { Avatar, AvatarSizeType, AvatarVariant } from './component';

describe('Avatar', () => {
  // Utility function to calculate the size value
  const getSizeValue = (size: AvatarSizeType): number => {
    if (typeof size === 'number') {
      return size;
    }
    switch (size) {
      case 'small':
        return 30;
      case 'medium':
        return 40;
      case 'large':
        return 48;
      case 'profile':
        return 180;
      default:
        return 0;
    }
  };
  it('renders with default medium size and circle variant', () => {
    const { container } = render(<Avatar />);
    const avatarElement = container.firstChild as HTMLElement;

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.tagName).toBe('DIV');
    expect(avatarElement).toHaveStyle('height: 40px');
    expect(avatarElement).toHaveStyle('width: 40px');
    expect(avatarElement).toHaveStyle('border-radius: 50%');
  });

  it.each<AvatarSizeType>(['small', 'medium', 'large', 'profile', 60])(
    'renders with size %p',
    (size) => {
      const { container } = render(<Avatar size={size} />);
      const avatarElement = container.firstChild as HTMLElement;

      expect(avatarElement).toBeInTheDocument();
      expect(avatarElement).toHaveStyle(`height: ${getSizeValue(size)}px`);
      expect(avatarElement).toHaveStyle(`width: ${getSizeValue(size)}px`);
    },
  );

  it.each<(typeof AvatarVariant)[keyof typeof AvatarVariant]>(Object.values(AvatarVariant))(
    'renders with variant %p',
    (variant) => {
      const { container } = render(<Avatar variant={variant} />);
      const avatarElement = container.firstChild as HTMLElement;

      switch (variant) {
        case AvatarVariant.CIRCLE:
          expect(avatarElement).toHaveStyle('border-radius: 50%');
          break;
        case AvatarVariant.ROUNDED:
          expect(avatarElement).toHaveStyle('border-radius: 6px');
          break;
        case AvatarVariant.SQUARE:
          expect(avatarElement).toHaveStyle('border-radius: 0px');
          break;
        default:
          break;
      }
    },
  );
});
