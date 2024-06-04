import { ValidationError } from 'yup';

export default (err: ValidationError) => {
  const errors: Array<{ path?: string; message: string }> = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });

  return errors;
};
