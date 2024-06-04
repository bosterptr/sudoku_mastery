import { MutableRefObject, Ref, useMemo } from 'react';

function setRef<T>(
  ref: MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    // eslint-disable-next-line no-param-reassign
    ref.current = value;
  }
}

export default function useForkRef<InstanceA, InstanceB>(
  refA: Ref<InstanceA> | null | undefined | ((instance: InstanceA | null) => void),
  refB: Ref<InstanceB> | null | undefined | ((instance: InstanceB | null) => void),
): Ref<InstanceA & InstanceB> | null {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return (refValue) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}