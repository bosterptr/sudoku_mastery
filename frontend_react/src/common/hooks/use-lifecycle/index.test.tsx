import { act, renderHook } from 'app/tests/utils';
import useLifecycle, { lifecycleStages } from '.';

jest.useFakeTimers(); // To mock setTimeout

describe('useLifecycle', () => {
  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useLifecycle());

    const [state] = result.current;
    expect(state.lifecycleStage).toBe(lifecycleStages.CLOSED);
    expect(state.isOpen).toBe(false);
    expect(state.isClosed).toBe(true);
  });

  it('should transition to open state when opened', () => {
    const { result } = renderHook(() => useLifecycle());

    const [, handleOpen] = result.current;
    act(() => {
      handleOpen();
    });

    const [state] = result.current;
    expect(state.lifecycleStage).toBe(lifecycleStages.INITIAL);
    expect(state.isOpen).toBe(true);
    expect(state.isClosed).toBe(false);
  });

  it('should transition to closed state when closed', () => {
    const { result } = renderHook(() => useLifecycle());

    const [, , handleClose] = result.current;
    act(() => {
      handleClose();
    });

    const [state] = result.current;
    expect(state.lifecycleStage).toBe(lifecycleStages.CLOSING);
    expect(state.isOpen).toBe(false);
    expect(state.isClosed).toBe(false);

    act(() => {
      jest.advanceTimersByTime(300); // Advance timers to trigger state change
    });

    const [newState] = result.current;
    expect(newState.lifecycleStage).toBe(lifecycleStages.CLOSED);
    expect(newState.isOpen).toBe(false);
    expect(newState.isClosed).toBe(true);
  });
});
