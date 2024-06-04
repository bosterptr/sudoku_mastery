/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import { app, config, logger } from 'app/core/App';
import { RefreshTokenResBody } from 'app/core/api/types/API_User';
import {
  getAuthTokenCookie,
  getRefreshTokenExpirationCookie,
  removeAuthCookies,
  setAuthTokenCookie,
} from 'app/core/auth/cookies';
import SessionActions from 'app/core/redux/modules/session/actions';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

const lazyAxios = () => {
  let axios: AxiosStatic | undefined;
  let agent: AxiosInstance | undefined;
  let refreshTokenAgent: AxiosInstance | undefined;
  const ensureAxiosIsLoaded = async () => {
    if (!axios) {
      const module = await import(/* webpackChunkName: "axios" */ 'axios');
      axios = module.default;
      axios.defaults.baseURL = app.config.apiBaseURL;
      axios.defaults.timeout = 5000;
      agent = axios.create({
        withCredentials: false,
        baseURL: app.config.apiBaseURL,
      });
      refreshTokenAgent = axios.create({
        withCredentials: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setupInterceptors(agent);
    }
  };
  const getAgent = async () => {
    await ensureAxiosIsLoaded();
    if (!agent) throw new Error();
    return agent;
  };
  const getAgentwithRequest = async (requestConfig: AxiosRequestConfig<any>) => {
    await ensureAxiosIsLoaded();
    if (!agent || !requestConfig) throw new Error();
    return agent(requestConfig);
  };
  const getRefreshTokenAgent = async () => {
    await ensureAxiosIsLoaded();
    if (!refreshTokenAgent) throw new Error();
    return refreshTokenAgent;
  };
  const getAxios = async () => {
    await ensureAxiosIsLoaded();
    if (!axios) throw new Error();
    return axios;
  };
  return {
    delete: async <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      requestConfig?: AxiosRequestConfig<D>,
    ): Promise<R> => (await getAgent()).delete(url, requestConfig),
    get: async <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      requestConfig?: AxiosRequestConfig<D>,
    ): Promise<R> => {
      return (await getAgent()).get(url, requestConfig);
    },
    post: async <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      requestConfig?: AxiosRequestConfig<D>,
    ): Promise<R> => (await getAgent()).post(url, data, requestConfig),
    put: async <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      requestConfig?: AxiosRequestConfig<D>,
    ): Promise<R> => (await getAgent()).put(url, data, requestConfig),
    patch: async <T = any, R = AxiosResponse<T>, D = any>(
      url: string,
      data?: D,
      requestConfig?: AxiosRequestConfig<D>,
    ): Promise<R> => (await getAgent()).patch(url, data, requestConfig),
    getRefreshTokenAgent,
    getAgent,
    getAxios,
    getAgentwithRequest,
    loadAxiosInstance: ensureAxiosIsLoaded,
  };
};

function setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(
    (axiosConfig) => {
      const accessToken = getAuthTokenCookie();
      if (accessToken && axiosConfig.headers) {
        // eslint-disable-next-line no-param-reassign
        axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      // eslint-disable-next-line no-param-reassign
      (axiosConfig as unknown as { _retry: boolean })._retry = false;
      return axiosConfig;
    },
    (error) => Promise.reject(error),
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);
      if (!error.response) {
        logger.warn('Please check your internet connection.');
        return Promise.reject(error.response);
      }
      if (
        error.isAxiosError === true &&
        error.response.status === 401 &&
        error.response.data.error &&
        error.response.data.error.code !== 'NOT_PERMITED' &&
        !originalRequest._retry
      ) {
        const refreshTokenExpirationDate = getRefreshTokenExpirationCookie();
        if (refreshTokenExpirationDate && refreshTokenExpirationDate < Date.now()) {
          logger.debug('isRefreshTokenExpired');
          app.store.dispatchAction(SessionActions.setSessionUser(null));
          removeAuthCookies({ config });
          return Promise.resolve(error.response);
        }
        // eslint-disable-next-line no-underscore-dangle
        originalRequest._retry = true;
        try {
          const res = await (
            await lazyAxios().getRefreshTokenAgent()
          ).post<RefreshTokenResBody>('/auth/refresh_token');
          if (res.status === 201) {
            const { accessToken, expirationDate } = res.data;
            setAuthTokenCookie(accessToken, { logger, config }, expirationDate);
            (await lazyAxios().getAgent()).defaults.headers.common.Authorization =
              `Bearer ${accessToken}`;
            return await lazyAxios().getAgentwithRequest(originalRequest);
          }
          logger.debug('isRefreshTokenExpired');
          app.store.dispatchAction(SessionActions.setSessionUser(null));
          return Promise.resolve(error.response);
        } catch (err) {
          if (typeof err === 'object' && (err as AxiosError).isAxiosError === true) {
            const axiosError = err as AxiosError<any>;
            if (axiosError?.response?.data.error.code === 'INVALID_TOKEN') {
              app.store.dispatchAction(SessionActions.setSessionUser(null));
            }
          }
          logger.debug('catch isRefreshTokenExpired');
          return Promise.resolve(error.response);
        }
      }
      return Promise.resolve(error.response);
    },
  );
  return axiosInstance;
}

export interface ErrorResponse<T> {
  error: T;
}

export default lazyAxios;
