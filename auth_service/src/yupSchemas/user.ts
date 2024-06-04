import isMobilePhone from 'validator/lib/isMobilePhone';
import * as yup from 'yup';
import {
  maxDisplayNameLength,
  maxEmailLength,
  // maxFirstNameLength,
  // maxLastNameLength,
  maxPasswordLength,
  maxProfileBioLength,
  minDisplayNameLength,
  // minFirstNameLength,
  // minLastNameLength,
  minPasswordLength,
  minProfileBioLength,
} from './constants';
import { tooLong, tooShort } from './messages';

declare module 'yup' {
  // Extend the existing StringSchema interface
  interface StringSchema {
    // Define the signature of your custom method
    isMobilePhone(msg: string): StringSchema;
  }
}
const invalidId = 'Invalid ID';

// eslint-disable-next-line func-names
yup.addMethod<yup.StringSchema>(
  yup.string,
  'isMobilePhone',
  function (message) {
    return this.test({
      name: 'isMobilePhone',
      message,
      test: (value) =>
        value ? isMobilePhone(value, 'any', { strictMode: true }) : false,
    });
  }
);

const invalidEmail = 'email must be a valid email';
const alphanumericError = 'Display name can only contain letters and numbers.';
// const numberIsRequired = 'password must contain at least 1 number.';
// const lowerCaseIsRequired =
//   'password must contain at least 1 lowercase letter.';
// const upperCaseIsRequired =
//   'password must contain at least 1 uppercase letter.';
// const specialCharacterIsRequired =
//   'password must contain at least 1 special character.';
// const incorrectMobilePhoneNumber =
//   'password must contain at least 1 special character.';

export const registerPasswordValidation = yup
  .string()
  .min(minPasswordLength, tooShort(minPasswordLength, 'password'))
  .max(maxPasswordLength, tooLong(maxPasswordLength, 'password'))
  // .matches(/[0-9]/, numberIsRequired)
  // .matches(/[a-z]/, lowerCaseIsRequired)
  // .matches(/[A-Z]/, upperCaseIsRequired)
  // .matches(/[^A-Za-z0-9]/, specialCharacterIsRequired)
  .required();

export const registerUserSchema = yup.object().shape({
  email: yup
    .string()
    .max(maxEmailLength, tooLong(maxEmailLength, 'email'))
    .email(invalidEmail)
    .required(),
    displayName: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9]*$/, alphanumericError)
    .max(maxDisplayNameLength, tooLong(maxDisplayNameLength, 'displayName'))
    .min(minDisplayNameLength, tooShort(minDisplayNameLength, 'displayName'))
    .required(),
  password: registerPasswordValidation,
  // mobilePhone: yup
  //   .string()
  //   .isMobilePhone(incorrectMobilePhoneNumber)
  //   .required(),
});

const invalidLogin = 'invalid login';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .max(255, tooLong(maxEmailLength, 'email'))
    .email(invalidLogin)
    .required(),
  password: yup
    .string()
    .min(minPasswordLength, tooShort(minPasswordLength, 'password'))
    .max(maxPasswordLength, tooLong(maxPasswordLength, 'password'))
    .required(),
});

const invalidToken = 'Please enter a valid token';

export const activationSchema = yup.object().shape({
  token: yup.string().length(64, invalidToken).required(),
  // firstName: yup
  //   .string()
  //   .min(3, tooShort(minFirstNameLength, 'firstName'))
  //   .max(64, tooLong(maxFirstNameLength, 'firstName'))
  //   .required(),
  // lastName: yup
  //   .string()
  //   .min(3, tooShort(minLastNameLength, 'lastName'))
  //   .max(64, tooLong(maxLastNameLength, 'lastName'))
  //   .required(),
});

const invalidCode = 'invalid code';
export const activateDeviceSchema = yup.object().shape({
  token: yup.string().length(10, invalidCode).required(),
});

export const activateNetworkAddressSchema = yup.object().shape({
  token: yup.string().length(10, invalidCode).required(),
});

export const userIdSchema = yup.object().shape({
  userId: yup.string().uuid(invalidId).required(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().max(255).email(invalidEmail).required(),
});

export const newPasswordSchema = yup.object().shape({
  password: registerPasswordValidation,
  token: yup.string().length(64, invalidCode).required(),
});

export const changePasswordSchema = yup.object().shape({
  password: registerPasswordValidation,
  newPassword: registerPasswordValidation,
});

export const updateUserSchema = yup.object().shape({
  profileBio: yup
    .string()
    .min(minProfileBioLength, tooShort(minProfileBioLength, 'profileBio'))
    .max(maxProfileBioLength, tooLong(maxProfileBioLength, 'profileBio'))
    .optional(),
});
