import { useCallback, useEffect, useState } from 'react';

type OpenAction = () => void;
type CloseAction = () => void;
export type ILifecycleStage = (typeof lifecycleStages)[keyof typeof lifecycleStages];
export interface ILifecycleStageState {
  lifecycleStage: ILifecycleStage;
  isClosed: boolean;
  isOpen: boolean;
}

export const lifecycleStages = {
  INITIAL: 0,
  CLOSING: 1,
  CLOSED: 2,
} as const;

function useLifecycle(
  initialState?: ILifecycleStage,
): [ILifecycleStageState, OpenAction, CloseAction] {
  const [lifecycleStage, setLifecycleStage] = useState<ILifecycleStage>(
    initialState || lifecycleStages.CLOSED,
  );
  const handleClose = useCallback(() => setLifecycleStage(lifecycleStages.CLOSING), []);
  const handleOpen = useCallback(() => setLifecycleStage(lifecycleStages.INITIAL), []);
  useEffect(() => {
    if (lifecycleStage === lifecycleStages.CLOSING)
      setTimeout(() => setLifecycleStage(lifecycleStages.CLOSED), 300);
  }, [lifecycleStage]);
  return [
    {
      lifecycleStage,
      isOpen: lifecycleStage === lifecycleStages.INITIAL,
      isClosed: lifecycleStage === lifecycleStages.CLOSED,
    },
    handleOpen,
    handleClose,
  ];
}

export default useLifecycle;
