import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';
import { BadUserInputError } from '../errors/customErrors';
import formatYupError from '../utils/formatYupError';

export const validateBody = (resourceSchema: AnySchema) => async (req: Request, _res: Response, next: NextFunction) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadUserInputError(formatYupError(err)));
    } else {
      next(err);
    }
  }

};

export const validateParams = (resourceSchema: AnySchema) => async (req: Request, _res: Response, next: NextFunction) => {
  const resource = req.params;
  try {
    await resourceSchema.validate(resource, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      next(new BadUserInputError(formatYupError(err)));
    } else {
      next(err);
    }
  }
};
