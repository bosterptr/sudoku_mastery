//* ******************************* MODELS ********************************** */

/*
  Here we typed in simple models manually. But there are many tools out there
  for generating database models automatically, from an existing database.
  For example, schemats: https://github.com/sweetiq/schemats
*/
declare enum Gender {
  null,
  'Male',
  'Female',
  'Not Applicable',
}

export interface DeviceToUser {
  id: string;
  device: string;
  user: string;
  createdAt: Date;
}

export interface NewPasswordToken {
  id: string;
  user: string;
  token: string;
  createdAt: Date;
}

export interface UserActivationToken {
  id: string;
  token: string;
  user: string;
  createdAt: Date;
}

export interface Board {
  id: string;
  title: string;
  user: string;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  ua: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  // avatar?: string;
  // avatarColor?: string;
  blocked?: boolean;
  // dob?: Date;
  email: string;
  // firstName: string;
  firstSignIn?: boolean;
  // gender?: Gender;
  // jobTitle?: string;
  // lastName: string;
  // mobilePhone?: string;
  password: string;
  profileBio?: string;
  // signInAttempts?: number;
  // socialId?: string;
  tokenVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UnactivatedUser {
  email: string;
  mobilePhone: string;
  displayName: string
  hashedPassword: string;
}

export interface Company {
  id: string;
  name: string;
  director: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshToken {
  userId: string;
  tokenVersion: number;
}
