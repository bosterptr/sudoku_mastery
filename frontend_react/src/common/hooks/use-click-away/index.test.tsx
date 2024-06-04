import { fireEvent, renderHook } from 'app/tests/utils';
import { useClickAway } from '.';

describe('useClickAway', () => {
  it('should attach event listeners to window by default', () => {
    const handler = jest.fn();
    renderHook(() => useClickAway(handler));

    fireEvent.click(window);
    expect(handler).toHaveBeenCalled();
  });

  it('should handle events on specified element', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickAway(handler, ref));

    fireEvent.mouseDown(ref.current);
    expect(handler).toHaveBeenCalled();
  });

  it('should not call handler when event is triggered on another element', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickAway(handler, ref));

    fireEvent.mouseDown(document.body);
    expect(handler).not.toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useClickAway(handler, ref));
    unmount();

    fireEvent.mouseDown(ref.current);
    expect(handler).not.toHaveBeenCalled();
  });
});
