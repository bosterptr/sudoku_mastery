/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { configureStore, Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { Config } from 'app/common/config';
import { AsyncAction, ReduxAction } from 'app/common/models/actions';
import { BuildTypeDev } from 'app/common/models/build_type';
import { RootReducers, RootState } from 'app/common/models/global_state';
import { useDispatch } from 'react-redux';
import { AnyAction, compose, Dispatch, Middleware, MiddlewareAPI, Reducer, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface AppState {
  [key: string]: object;
}
type RootStateKeys = keyof RootState;
type AppliedMiddleware = (next: (action: unknown) => unknown) => (action: unknown) => unknown;
interface RegisterReducerAction<T extends string = typeof REGISTER_REDUCER> {
  name: RootStateKeys;
  type: T;
  [extraProps: string]: unknown;
}
const REGISTER_REDUCER = 'app/0';
const createDynamicMiddlewares = () => {
  const apiMiddlewares: { [key: string]: Middleware } = {};
  const appliedApiMiddlewares: { [key: string]: AppliedMiddleware } = {};
  let store: MiddlewareAPI<Dispatch<AnyAction>, any>;

  const enhancer: Middleware = (_store) => {
    store = _store;
    return (next: (action: unknown) => unknown) => (action: any) => {
      return (
        compose(...Object.values(appliedApiMiddlewares)) as (
          _next: (_action: unknown) => unknown,
        ) => (_action: unknown) => unknown
      )(next)(action);
    };
  };

  const addMiddleware = (key: string, middleware: Middleware) => {
    appliedApiMiddlewares[key] = middleware(store);
    apiMiddlewares[key] = middleware;
  };

  return {
    enhancer,
    addMiddleware,
  };
};

const dynamicMiddlewaresInstance = createDynamicMiddlewares();

export interface IAppStore {
  registerReducer: <K extends keyof RootState>(
    key: K,
    reducer: RootReducers[keyof RootReducers],
  ) => void;
  getReduxStore: () => Store<AppState, AnyAction>;
  getReduxStoreState: () => RootState;
  dispatchAction: <T extends string>(action: ReduxAction<T> | AsyncAction) => any;
}

export const AppStore = (config: Config, preloadedState?: Partial<RootState>): IAppStore => {
  const reducers: {
    [key: string]: Reducer<{}> | Slice<AppState, SliceCaseReducers<AppState>, RootStateKeys>;
  } = {};

  /**
   * The rootReducer calls each registered reducer with its state key after iterating over all of them,
   * much to combineReducers but with the flexibility to take a registration pattern.
   */
  const _rootReducer = (state: AppState, action: RegisterReducerAction) => {
    if (!state) {
      // eslint-disable-next-line no-param-reassign
      state = {};
    }

    let nextState: AppState = {};
    let hasChanged = false;

    if (action.type === REGISTER_REDUCER && typeof reducers[action.name] === 'function') {
      let reducer = reducers[action.name];
      if (typeof reducer !== 'function') reducer = reducer.reducer;
      const newState = reducer(state[action.name], {
        type: '@@INIT',
      });
      if (newState === undefined) {
        throw new Error(`Reducer for key ${action.name} returned undefined!`);
      }
      nextState = { ...state, [action.name]: newState };
      hasChanged = true;
    } else {
      for (const key in reducers) {
        if (reducers[key]) {
          let reducer = reducers[key];
          if (typeof reducer !== 'function') reducer = reducer.reducer;
          const newState = reducer(state[key], action);
          if (newState === undefined) {
            throw new Error(`Reducer for key ${key} returned undefined!`);
          }
          nextState[key] = newState;
          hasChanged = hasChanged || newState !== state[key];
        }
      }
    }
    return hasChanged ? nextState : state;
  };
  const store = configureStore({
    reducer: (_rootReducer as Reducer<AppState, RegisterReducerAction>) || {},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        // .concat(this._sagaMiddleware)
        .concat(dynamicMiddlewaresInstance.enhancer),
    devTools: config.buildType === BuildTypeDev,
    preloadedState,
  });
  /**
   * Dispatch a Redux action.
   */
  const dispatchAction = <T extends string>(action: ReduxAction<T> | AsyncAction) =>
    store.dispatch(action as any);

  /**
   * Registers a new reducer on the state.
   *
   * @param key The state key to store the reducer's state under.
   * @param reducer The reducer itself.
   */
  const registerReducer = <K extends RootStateKeys>(
    key: K,
    // it can't be RootReducers[K] because i keep getting "Expression produces a union type that is too complex to represent" error.
    reducer: RootReducers[keyof RootReducers],
    // sagas to register
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ) => {
    if (reducers[key]) return;
    reducers[key] = reducer as unknown as Reducer<{}, AnyAction>;
    // Initialize newly registered reducers by firing an action
    dispatchAction({
      type: REGISTER_REDUCER,
      name: key,
    } as RegisterReducerAction);
  };

  const getReduxStore = () => store as {} as Store<AppState>;

  /**
   * Returns the current Redux state.
   */
  const getReduxStoreState = () => store.getState() as {} as RootState;
  return {
    registerReducer,
    getReduxStore,
    getReduxStoreState,
    dispatchAction,
  };
};

export const useAppDispatch: () => ThunkDispatch<RootState, undefined, AnyAction> = useDispatch;
