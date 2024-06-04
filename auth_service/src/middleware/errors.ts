/* eslint-disable import/prefer-default-export */
import { ErrorRequestHandler } from 'express';
import { pick } from 'lodash';
import { CustomError } from '../errors';
import logger from '../utils/logger';

export const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  const isErrorSafeForClient = error instanceof CustomError;
  const clientError = isErrorSafeForClient
    ? pick(error, ['message', 'code', 'status', 'data', 'validationErrors'])
    : {
        message: 'Something went wrong, please contact our support.',
        code: 'INTERNAL_ERROR',
        status: 500,
        data: {},
      };
  if (!isErrorSafeForClient) {
    logger.error(error.toString());
  }

  return res.status(clientError.status).json({ error: clientError });
};
