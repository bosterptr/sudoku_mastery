/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
type ErrorData = { [key: string]: unknown };

export class CustomError extends Error {
  constructor(
    public message: string,
    public code: string | number = 'INTERNAL_ERROR',
    public status: number = 500,
    public data: ErrorData = {},
    public validationErrors?: {
      path?: string | undefined;
      message: string;
    }[]
  ) {
    super();
  }
}

export class BadUserInputError extends CustomError {
  constructor(
    errorData: {
      path?: string | undefined;
      message: string;
    }[]
  ) {
    super(
      'There were validation errors.',
      'BAD_USER_INPUT',
      400,
      undefined,
      errorData
    );
  }
}

export class WrongCredentialsError extends CustomError {
  constructor(message = 'Provide correct email and password.') {
    super(message, 'WRONG_CREDENTIALS', 400);
  }
}

export class EmailIsAlreadyTakenError extends CustomError {
  constructor(message = 'Email is already taken.') {
    super(message, 'EMAIL_IS_ALREADY_TAKEN', 400);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message = 'The Authentication token is invalid.') {
    super(message, 'INVALID_TOKEN', 400);
  }
}

export class UnactivatedUserError extends CustomError {
  constructor(message = 'Activate your account.') {
    super(message, 'UNACTIVATED_USER', 401);
  }
}

export class DeviceAndNetworkAddressAreNotLinkedError extends CustomError {
  constructor(
    message = "That's the first time you are using that IP address and device. Please check your email."
  ) {
    super(message, 'NEW_DEVICE_AND_NETWORK_ADDRESS', 401);
  }
}

export class DeviceIsNotLinkedError extends CustomError {
  constructor(
    message = "That's the first time you are using that device. Please check your email."
  ) {
    super(message, 'NEW_DEVICE', 401);
  }
}

export class NetworkAddressIsNotLinkedError extends CustomError {
  constructor(
    message = "That's the first time you are using that IP address. Please check your email."
  ) {
    super(message, 'NEW_NETWORK_ADDRESS', 401);
  }
}

export class WrongTokenError extends CustomError {
  constructor(message = 'Wrong code.') {
    super(message, 'WRONG_TOKEN', 401);
  }
}

export class WrongNetworkAddressCodeError extends CustomError {
  constructor(message = 'Wrong code.') {
    super(message, 'WRONG_NETWORK_ADDRESS_CODE', 401);
  }
}

export class NonExistentUA extends CustomError {
  constructor(message = 'Non-existent User-Agent Header') {
    super(message, 'NON_EXISTENT_UA', 401);
  }
}

export class NonExistentRefreshToken extends CustomError {
  constructor(message = 'You need to log in') {
    super(message, 'UNAUTHENTICATED', 401);
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(entityName: string) {
    super(`${entityName} not found.`, 'ENTITY_NOT_FOUND', 404);
  }
}

export class NotPermittedError extends CustomError {
  constructor(message = 'Not Permitted') {
    super(message, 'NOT_PERMITED', 401);
  }
}
