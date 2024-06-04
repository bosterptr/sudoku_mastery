/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from 'app/common/models/global_state';
import { Action as ReduxAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type { Action as ReduxAction } from 'redux';

// interface Action<T extends string, P> extends ReduxAction<T> {
//   payload: P;
// }
export type AsyncAction<T = void> = ThunkAction<T, RootState, Record<string, any>, ReduxAction>;
// interface ActionWithError<T extends string, P, E extends object = Record<string, any>>
//   extends Action<T, P> {
//   payload: P;
//   error: E;
// }
// interface ActionsCreatorsMapObject {
//   [actionCreator: string]: (...args: any[]) => any;
// }
// type ActionsUnion<A extends ActionsCreatorsMapObject> = ReturnType<A[keyof A]>;

// interface ThunkMiddlewareAPI {
//   dispatch: ThunkDispatch<RootState, {}, ReduxAction>;
//   getState(): RootState;
// }
