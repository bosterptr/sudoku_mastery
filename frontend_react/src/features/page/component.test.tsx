import { render, screen } from '@testing-library/react';
import * as AppCore from 'app/core/App';
import { Page } from './component';
import { TOP_NAV_HEIGHT } from '../top-nav/constants';

// Mock the TopNav component
jest.mock('app/features/top-nav', () => ({
  TopNav: () => <div>TopNav</div>,
}));

describe('Page component', () => {
  const setPageTitleSpy = jest.spyOn(AppCore.app, 'setPageTitle').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call setPageTitle with the title', () => {
    const title = 'Test Title';
    render(<Page title={title} />);
    expect(setPageTitleSpy).toHaveBeenCalledWith(title);
  });

  it('should call setPageTitle with empty string if title is undefined', () => {
    render(<Page />);
    expect(setPageTitleSpy).toHaveBeenCalledWith('');
  });

  it('should render TopNav when withoutTopNav is false', () => {
    render(<Page withoutTopNav={false} />);
    expect(screen.getByText('TopNav')).toBeInTheDocument();
  });

  it('should not render TopNav when withoutTopNav is true', () => {
    render(<Page withoutTopNav />);
    expect(screen.queryByText('TopNav')).not.toBeInTheDocument();
  });

  it('should adjust ContentWithHeader style based on withoutTopNav prop', () => {
    const { container } = render(<Page withoutTopNav />);
    const contentWithHeader = container.firstChild;
    expect(contentWithHeader).toHaveStyle(`height: calc(100% - ${TOP_NAV_HEIGHT})`);
  });

  it('should render children inside ContentWithHeader', () => {
    render(
      <Page>
        <div>Child Content</div>
      </Page>,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
