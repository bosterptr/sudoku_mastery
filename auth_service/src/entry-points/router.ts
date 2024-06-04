import { Router } from 'express';
import {
  activateAccount,
  activateDevice,
  activateDeviceAndNetworkAddress,
  activateNetworkAddress,
  changePassword,
  forgotPassword,
  getOrCreateDevice,
  getSessions,
  getUser,
  login,
  newPassword,
  register,
  updateUser,
} from '../domain/service';
import { BadUserInputError } from '../errors';
import authentication from '../middleware/authentication';
import {
  getEmailIPkey,
  limiterConsecutiveFailsByUsernameAndIP,
  limiterSlowBruteByIP,
  rateLimit,
} from '../middleware/rateLimiter';
import {
  ActivateDeviceAndNetworkAddressReqBody,
  ActivateDeviceAndNetworkAddressReqParams,
  ActivateDeviceAndNetworkAddressResBody,
  ActivateDeviceReqBody,
  ActivateDeviceReqParams,
  ActivateDeviceResBody,
  ActivateNetworkAddressReqBody,
  ActivateNetworkAddressReqParams,
  ActivateNetworkAddressResBody,
  ActivateReqBody,
  ActivateReqParams,
  ActivateResBody,
  ChangePasswordReqBody,
  ChangePasswordReqParams,
  ChangePasswordResBody,
  ForgotPasswordReqBody,
  ForgotPasswordReqParams,
  ForgotPasswordResBody,
  GetSessionsReqBody,
  GetSessionsReqParams,
  GetSessionsResBody,
  GetUserReqBody,
  GetUserReqParams,
  GetUserResBody,
  LoginReqBody,
  LoginReqParams,
  LoginResBody,
  NewPasswordReqBody,
  NewPasswordReqParams,
  NewPasswordResBody,
  RefreshTokenReqBody,
  RefreshTokenReqParams,
  RefreshTokenResBody,
  RegisterReqBody,
  RegisterReqParams,
  RegisterResBody,
  UpdateUserReqBody,
  UpdateUserReqParams,
  UpdateUserResBody,
} from '../types';
import authenticate from '../utils/authenticate';
import delay from '../utils/delay';
import formatYupError from '../utils/formatYupError';
import getDeviceId from '../utils/getDeviceId';
import getIp from '../utils/getIp';
import getNewDevice from '../utils/getNewDevice';
import createAccessTokenFromRefreshToken from '../utils/getRefreshToken';
import setDeviceCookie from '../utils/setDeviceCookie';
import setRateLimitHeaders from '../utils/setRateLimitHeaders';
import {
  activateDeviceSchema,
  activateNetworkAddressSchema,
  activationSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  newPasswordSchema,
  registerUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../yupSchemas/user';

const router = Router();

router.post<RegisterReqParams, RegisterResBody, RegisterReqBody>(
  '/register',
  async (req, res, next) => {
    try {
      const startTime = new Date().getTime();
      const input = await registerUserSchema
        .validate(req.body, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const device = await getOrCreateDevice(
        getDeviceId(req),
        getNewDevice(req)
      );
      if (device.id !== getDeviceId(req)) setDeviceCookie(res, device.id);
      await register({
        args: input,
        deviceId: device.id,
        deviceUA: req.headers['user-agent'] || '',
        ip: getIp(req),
      });
      await delay(startTime + 1000 - new Date().getTime());
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  }
);

router.post<ActivateReqParams, ActivateResBody, ActivateReqBody>(
  '/activate',
  async (req, res, next) => {
    try {
      const input = await activationSchema
        .validate(req.body, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const device = await getOrCreateDevice(
        getDeviceId(req),
        getNewDevice(req)
      );
      if (device.id !== getDeviceId(req)) setDeviceCookie(res, device.id);
      await activateAccount({
        args: input,
        ip: getIp(req),
        deviceId: device.id,
      });
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  }
);

router.post<LoginReqParams, LoginResBody, LoginReqBody>(
  '/login',
  rateLimit,
  async (req, res, next) => {
    try {
      const startTime = new Date().getTime();
      const input = await loginSchema
        .validate(req.body, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const device = await getOrCreateDevice(
        getDeviceId(req),
        getNewDevice(req)
      );
      if (device.id !== getDeviceId(req)) setDeviceCookie(res, device.id);
      const authenticatedUser = await login({
        args: input,
        ip: getIp(req),
        deviceId: device.id,
        newDeviceUA: getNewDevice(req),
      }).catch(async (err) => {
        await limiterSlowBruteByIP.consume(getIp(req));
        setRateLimitHeaders(res, res.resUsernameAndIP, res.resSlowByIP);
        throw err;
      });
      if (
        res.resUsernameAndIP !== null &&
        res.resUsernameAndIP.consumedPoints > 0
      ) {
        // Reset on successful authentication
        await limiterConsecutiveFailsByUsernameAndIP.delete(
          getEmailIPkey(input.email, getIp(req))
        );
      }
      if (res.resSlowByIP !== null && res.resSlowByIP.consumedPoints > 0) {
        // Reset on successful authentication
        await limiterSlowBruteByIP.delete(getIp(req));
      }
      await delay(startTime + 1000 - new Date().getTime());
      await authenticate(res, authenticatedUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post<
  ForgotPasswordReqParams,
  ForgotPasswordResBody,
  ForgotPasswordReqBody
>('/forgotPassword', async (req, res, next) => {
  try {
    const startTime = new Date().getTime();
    const input = await forgotPasswordSchema
      .validate(req.body, { abortEarly: false })
      .catch((err) => {
        throw new BadUserInputError(formatYupError(err));
      });
    await forgotPassword(input);
    await delay(startTime + 1000 - new Date().getTime());
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.post<NewPasswordReqParams, NewPasswordResBody, NewPasswordReqBody>(
  '/newPassword',
  async (req, res, next) => {
    try {
      const input = await newPasswordSchema
        .validate(req.body, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const device = await getOrCreateDevice(
        getDeviceId(req),
        getNewDevice(req)
      );
      if (device.id !== getDeviceId(req)) setDeviceCookie(res, device.id);
      const user = await newPassword({
        args: input,
        ip: getIp(req),
        deviceId: device.id,
        newDeviceUA: getNewDevice(req),
      });
      await authenticate(res, user);
    } catch (err) {
      next(err);
    }
  }
);

router.post<
  ActivateDeviceReqParams,
  ActivateDeviceResBody,
  ActivateDeviceReqBody
>('/activateDevice/:token', async (req, res, next) => {
  try {
    const { token } = await activateDeviceSchema
      .validate(req.params, { abortEarly: false })
      .catch((err) => {
        throw new BadUserInputError(formatYupError(err));
      });
    await activateDevice(token);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.post<
  ActivateNetworkAddressReqParams,
  ActivateNetworkAddressResBody,
  ActivateNetworkAddressReqBody
>('/activateNetworkAddress/:token', async (req, res, next) => {
  try {
    const { token } = await activateNetworkAddressSchema
      .validate(req.params, { abortEarly: false })
      .catch((err) => {
        throw new BadUserInputError(formatYupError(err));
      });
    await activateNetworkAddress(token);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.post<
  ActivateDeviceAndNetworkAddressReqParams,
  ActivateDeviceAndNetworkAddressResBody,
  ActivateDeviceAndNetworkAddressReqBody
>('/activateDeviceAndNetworkAddress/:token', async (req, res, next) => {
  try {
    const { token } = await activateNetworkAddressSchema
      .validate(req.params, { abortEarly: false })
      .catch((err) => {
        throw new BadUserInputError(formatYupError(err));
      });
    await activateDeviceAndNetworkAddress(token);
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.post<RefreshTokenReqParams, RefreshTokenResBody, RefreshTokenReqBody>(
  '/refresh_token',
  async (req, res, next) => {
    try {
      const accessToken = await createAccessTokenFromRefreshToken(
        req.signedCookies['refresh-token']
      );
      res.status(201).send({ accessToken });
    } catch (err) {
      next(err);
    }
  }
);

router.post<
  ChangePasswordReqParams,
  ChangePasswordResBody,
  ChangePasswordReqBody
>('/changePassword', authentication, async (req, res, next) => {
  try {
    const input = await changePasswordSchema
      .validate(req.body, { abortEarly: false })
      .catch((err) => {
        throw new BadUserInputError(formatYupError(err));
      });
    const device = await getOrCreateDevice(getDeviceId(req), getNewDevice(req));
    if (device.id !== getDeviceId(req)) setDeviceCookie(res, device.id);
    await changePassword({
      args: input,
      ip: getIp(req),
      deviceId: device.id,
      newDeviceUA: getNewDevice(req),
      currentUserId: req.currentUser.id,
    });
    res.status(201).end();
  } catch (err) {
    next(err);
  }
});

router.get<GetSessionsReqParams, GetSessionsResBody, GetSessionsReqBody>(
  '/sessions',
  authentication,
  async (req, res, next) => {
    try {
      const { devices, networkAddresses } = await getSessions(
        req.currentUser.id
      );
      res.status(200).send({ devices, networkAddresses });
    } catch (err) {
      next(err);
    }
  }
);

router.get<GetUserReqParams, GetUserResBody, GetUserReqBody>(
  '/user/:userId',
  async (req, res, next) => {
    try {
      const params = await userIdSchema
        .validate(req.params, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const user = await getUser(params);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

router.patch<UpdateUserReqParams, UpdateUserResBody, UpdateUserReqBody>(
  '/user/:userId',
  authentication,
  async (req, res, next) => {
    try {
      const params = await userIdSchema
        .validate(req.params, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const input = await updateUserSchema
        .validate(req.body, { abortEarly: false })
        .catch((err) => {
          throw new BadUserInputError(formatYupError(err));
        });
      const { affected } = await updateUser(
        params.userId,
        input,
        req.currentUser
      );
      res.status(200).send({ affected });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
