import { fireEvent, render, screen } from 'app/tests/utils';
import TabComponent from './index';

describe('TabComponent', () => {
  const onClickMock = jest.fn();

  it('renders nothing when show is false', () => {
    const { container } = render(
      <TabComponent active={false} show={false}>
        Click Me
      </TabComponent>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly and responds to click events', () => {
    render(
      <TabComponent active={false} onClick={onClickMock}>
        Click Me
      </TabComponent>,
    );
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('displays the active style when active', () => {
    const { getByText } = render(<TabComponent active>Active Tab</TabComponent>);
    const tabLabel = getByText('Active Tab').parentNode;
    expect(tabLabel).toHaveStyleRule('color', undefined); // Active tabs do not change text color based on theme
    expect(tabLabel).toContainElement(screen.getByText('Active Tab'));
  });

  it('applies correct padding if provided', () => {
    render(
      <TabComponent active padding={30}>
        Padded Tab
      </TabComponent>,
    );
    expect(screen.getByText('Padded Tab').parentNode).toHaveStyle('padding: 0 30px');
  });

  it('uses default padding if not provided', () => {
    render(<TabComponent active>Default Padding Tab</TabComponent>);
    expect(screen.getByText('Default Padding Tab').parentNode).toHaveStyle('padding: 0 20px');
  });
});
