import { fireEvent, renderHook } from 'app/tests/utils';
import { useEventListener } from '.';

describe('useEventListener', () => {
  it('should call the event handler when the event is emitted', () => {
    const handler = jest.fn();
    const eventName = 'click';
    const element = { current: document.createElement('div') };

    renderHook(() => useEventListener(eventName, handler, element));

    fireEvent.click(element.current);

    expect(handler).toHaveBeenCalled();
  });

  it('should remove the event listener on unmount', () => {
    const handler = jest.fn();
    const eventName = 'click';
    const element = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useEventListener(eventName, handler, element));

    const removeEventListenerSpy = jest.spyOn(element.current, 'removeEventListener');
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should attach the listener to window when no element ref is provided', () => {
    const handler = jest.fn();
    const eventName = 'resize';
    const { unmount } = renderHook(() => useEventListener(eventName, handler));

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    fireEvent.resize(window);

    expect(handler).toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
