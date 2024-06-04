/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as bcrypt from "bcryptjs";
import { Device, NetworkAddress } from "../db/entities";
import User from "../db/entities/User";
import {
  DeviceAndNetworkAddressAreNotLinkedError,
  DeviceIsNotLinkedError,
  EntityNotFoundError,
  InvalidTokenError,
  NetworkAddressIsNotLinkedError,
  NonExistentUA,
  NotPermittedError,
  UnactivatedUserError,
  WrongCredentialsError,
  WrongNetworkAddressCodeError,
  WrongTokenError,
} from "../errors";
import {
  getEmailIPkey,
  limiterConsecutiveFailsByUsernameAndIP,
} from "../middleware/rateLimiter";
import {
  ActivateReqBody,
  ForgotPasswordReqBody,
  LoginReqBody,
  NewPasswordReqBody,
  RegisterReqBody,
} from "../types";
import hashPassword from "../utils/hashPassword";
import randomToken from "../utils/randomToken";
import * as DAL from "./DAL";
import * as eventbusClient from "eventbus_client";
import { producer } from "../mq/index";
import { Producer } from "kafkajs";

const checkIfIpAddrAndDeviceAreApproved = async (
  producer: Producer,
  user: Pick<User, "id" | "email" | "hashedPassword" | "tokenVersion"> & {
    networkAddresses: Array<Pick<NetworkAddress, "ip">>;
    devices: Array<Pick<Device, "id" | "ua">>;
  },
  ip: string,
  deviceId: string,
  newDeviceUA: string | boolean | undefined
) => {
  let isNetworkAddressApproved = false;
  let isDeviceApproved = false;
  if (
    user.networkAddresses.find(
      (networkAddress) => networkAddress.ip.split("/")[0] === ip
    )
  )
    isNetworkAddressApproved = true;
  if (user.devices.find((deviceFromDB) => deviceFromDB.id === deviceId))
    isDeviceApproved = true;
  if (!isNetworkAddressApproved && !isDeviceApproved) {
    const token = randomToken(10);
    await DAL.createNotApprovedDeviceAndNetworkAddress({
      ip,
      deviceId,
      userId: user.id,
      token,
    });
    await eventbusClient.sendDetectedNotApprovedDeviceAndNetworkAddressEvent(
      producer,
      {
        userId: user.id,
        userEmail: user.email,
        ipv4: ip,
        deviceUa: typeof newDeviceUA === "string" ? newDeviceUA : "",
        token,
      }
    );
    throw new DeviceAndNetworkAddressAreNotLinkedError();
  }
  if (!isNetworkAddressApproved) {
    const token = randomToken(10);
    await DAL.createNotApprovedNetworkAddress(ip, user.id, token);
    await eventbusClient.sendDetectedNotApprovedNetworkAddressEvent(producer, {
      userId: user.id,
      userEmail: user.email,
      ipv4: ip,
      deviceUa: typeof newDeviceUA === "string" ? newDeviceUA : "",
      token,
    });
    throw new NetworkAddressIsNotLinkedError();
  }
  if (!isDeviceApproved) {
    const token = randomToken(10);
    await eventbusClient.sendDetectedNotApprovedDeviceEvent(producer, {
      userId: user.id,
      userEmail: user.email,
      ipv4: ip,
      deviceUa: typeof newDeviceUA === "string" ? newDeviceUA : "",
      token,
    });
    await DAL.createNotApprovedDevice(deviceId, user.id, token);
    throw new DeviceIsNotLinkedError();
  }
};

export const register = async ({
  args,
  deviceId,
  deviceUA,
  ip
}: {
  args: RegisterReqBody;
  deviceId: string;
  deviceUA: string;
  ip:string
}) => {
  const { email, password, displayName } = args;
  const user = await DAL.findUserByEmail(email);
  if (user) {
    await eventbusClient.sendUserIsAlreadyRegisteredEvent(producer, {
      deviceUa: deviceUA,
      email,
      ip
    });
    return;
  }
  const hashedPassword = await hashPassword(password);
  const activationToken = randomToken(64);
  await DAL.createUnactivatedUser({
    email,
    displayName,
    hashedPassword,
    activationToken,
    deviceId,
  });
  await eventbusClient.sendCreatedUnauthenticatedUser(producer, {
    activationToken,
    displayName,
    email,
  });
};

export const activateAccount = async ({
  args,
  ip,
  deviceId,
}: {
  args: ActivateReqBody;
  ip: string;
  deviceId: string;
}) => {
  const { token } = args;
  const unactivatedUser = await DAL.getUnactivatedUser(token);
  if (unactivatedUser === null) throw new InvalidTokenError();
  const userData = {
    email: unactivatedUser.email,
    hashedPassword: unactivatedUser.hashedPassword,
    displayName:unactivatedUser.displayName,
    // lastName,
  };
  const { user } = await DAL.createUser(userData, deviceId, ip);
  return eventbusClient.sendCreatedUserEvent(producer, {
    id: user.id,
    email: user.email,
    // firstName,
    // lastName,
  });
};

export const login = async ({
  args,
  ip,
  deviceId,
  newDeviceUA,
}: {
  args: LoginReqBody;
  ip: string;
  deviceId: string;
  newDeviceUA?: string | boolean;
}) => {
  const { email, password } = args;
  const unactivatedUser = await DAL.checkIfUserIsUnactivated(email);
  if (unactivatedUser) throw new UnactivatedUserError();
  const user = await DAL.findUserByEmail(email);
  if (!user) throw new WrongCredentialsError();
  const doPasswordsMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!doPasswordsMatch) {
    await limiterConsecutiveFailsByUsernameAndIP.consume(
      getEmailIPkey(email, ip)
    );
    throw new WrongCredentialsError();
  }
  await checkIfIpAddrAndDeviceAreApproved(
    producer,
    user,
    ip,
    deviceId,
    newDeviceUA
  ).catch((e) => {
    throw e;
  });
  return {
    id: user.id,
    tokenVersion: user.tokenVersion,
    email: user.email,
    displayName: user.displayName,
  };
};

export const forgotPassword = async (args: ForgotPasswordReqBody) => {
  const { email } = args;
  const user = await DAL.findUserByEmail(email);
  if (!user) return;
  const token = randomToken(64);
  await DAL.createNewPasswordToken(user.id, token);
  await eventbusClient.sendRequestedNewPasswordEvent(producer, {
    email,
    token,
  });
};

export const newPassword = async ({
  args,
  ip,
  deviceId,
  newDeviceUA,
}: {
  args: NewPasswordReqBody;
  ip: string;
  deviceId: string;
  newDeviceUA?: string | boolean;
}) => {
  const { token, password } = args;
  const userId = await DAL.getNewPasswordToken(token);
  if (!userId) throw new InvalidTokenError();
  const hashedPassword = await hashPassword(password);
  const user = await DAL.findUserById(userId);
  if (!user) throw new EntityNotFoundError("user");
  await checkIfIpAddrAndDeviceAreApproved(
    producer,
    user,
    ip,
    deviceId,
    newDeviceUA
  );
  await DAL.changePassword(userId, hashedPassword, user.tokenVersion + 1);
  return {
    id: user.id,
    tokenVersion: user.tokenVersion + 1,
    email: user.email,
    displayName: user.displayName,
  };
};

export const activateNetworkAddress = async (token: string) => {
  const notApprovedNetworkAddress =
    await DAL.getNotApprovedNetworkAddress(token);
  if (
    notApprovedNetworkAddress.userId !== undefined &&
    notApprovedNetworkAddress.networkAddress !== undefined
  ) {
    await DAL.addNetworkAddressToUser(
      notApprovedNetworkAddress.userId,
      notApprovedNetworkAddress.networkAddress
    );
    await eventbusClient.sendAddedNetworkAddressToUserEvent(producer, {
      userId: notApprovedNetworkAddress.userId,
      ipv4: notApprovedNetworkAddress.networkAddress,
    });
    return DAL.deleteNotApprovedNetworkAddress(token);
  }
  throw new WrongNetworkAddressCodeError();
};

export const activateDeviceAndNetworkAddress = async (token: string) => {
  const notApprovedNetworkAddressAndNetworkAddress =
    await DAL.getNotApprovedDeviceAndNetworkAddress(token);
  if (
    notApprovedNetworkAddressAndNetworkAddress.userId !== undefined &&
    notApprovedNetworkAddressAndNetworkAddress.ip !== undefined &&
    notApprovedNetworkAddressAndNetworkAddress.deviceId !== undefined
  ) {
    await DAL.addDeviceAndNetworkAddressToUser(
      notApprovedNetworkAddressAndNetworkAddress.userId,
      notApprovedNetworkAddressAndNetworkAddress.ip,
      notApprovedNetworkAddressAndNetworkAddress.deviceId
    );
    await eventbusClient.sendAddedNetworkAddressToUserEvent(producer, {
      userId: notApprovedNetworkAddressAndNetworkAddress.userId,
      ipv4: notApprovedNetworkAddressAndNetworkAddress.ip,
    });
    await eventbusClient.sendAddedDeviceToUserEvent(producer, {
      userId: notApprovedNetworkAddressAndNetworkAddress.userId,
      deviceId: notApprovedNetworkAddressAndNetworkAddress.deviceId,
    });

    return DAL.deleteNotApprovedNetworkAddress(token);
  }
  throw new WrongNetworkAddressCodeError();
};

export const activateDevice = async (token: string) => {
  const notApprovedDevice = await DAL.getNotApprovedDevice(token);
  if (
    notApprovedDevice.userId !== undefined &&
    notApprovedDevice.deviceId !== undefined
  ) {
    await DAL.addDeviceToUser(
      notApprovedDevice.userId,
      notApprovedDevice.deviceId
    );
    await eventbusClient.sendAddedDeviceToUserEvent(producer, {
      userId: notApprovedDevice.userId,
      deviceId: notApprovedDevice.deviceId,
    });
    return DAL.deleteNotApprovedDevice(token);
  }
  throw new WrongTokenError();
};

export const changePassword = async ({
  args,
  ip,
  deviceId,
  newDeviceUA,
  currentUserId,
}: {
  args: { password: string; newPassword: string };
  ip: string;
  deviceId: string;
  newDeviceUA?: string | boolean;
  currentUserId: User["id"];
}) => {
  const user = await DAL.findUserById(currentUserId);
  if (!user) throw new EntityNotFoundError("user");
  const doPasswordsMatch = await bcrypt.compare(
    args.password,
    user.hashedPassword
  );
  if (!doPasswordsMatch) throw new WrongCredentialsError();
  const hashedPassword = await hashPassword(args.newPassword);
  await checkIfIpAddrAndDeviceAreApproved(
    producer,
    user,
    ip,
    deviceId,
    newDeviceUA
  );
  await DAL.changePassword(
    currentUserId,
    hashedPassword,
    user.tokenVersion + 1
  );
  return {
    tokenVersion: user.tokenVersion + 1,
  };
};

export const getOrCreateDevice = async (
  deviceId?: string,
  newDeviceUA?: string | boolean
) => {
  if (typeof deviceId === "string") return { id: deviceId };
  if (typeof newDeviceUA === "string") return DAL.createDevice(newDeviceUA);
  throw new NonExistentUA();
};

export const getSessions = async (currentUserId: User["id"]) => {
  const user = await DAL.findUserById(currentUserId);
  if (!user) throw new EntityNotFoundError("user");
  return {
    devices: user.devices,
    networkAddresses: user.networkAddresses,
  };
};

export const getUser = async ({ userId }: { userId: User["id"] }) => {
  const user = await DAL.getUserProfile(userId);
  if (!user) throw new EntityNotFoundError("user");
  return user;
};

export const updateUser = async (
  userId: User["id"],
  data: Partial<Pick<User, "profileBio">>,
  currentUser: { id: string }
) => {
  const user = await DAL.getUserProfile(userId);
  if (!user) throw new EntityNotFoundError("user");
  if (currentUser.id !== userId) throw new NotPermittedError();
  const result = await DAL.updateUser(userId, data);
  await eventbusClient.sendUpdatedUserEvent(producer, { id: userId, ...data });
  return result;
};
