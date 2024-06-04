import { getConnection, getManager } from 'typeorm';
import Device from '../db/entities/Device';
import NetworkAddress from '../db/entities/NetworkAddress';
import User from '../db/entities/User';
import redis from '../redis';
import { UnactivatedUser } from '../types/models';

export const addNetworkAddressToUser = async (userId: string, ip: string) => {
  let networkAddress = await NetworkAddress.findOne({
    where: { ip },
    select: ['ip'],
  });
  if (!networkAddress) {
    networkAddress = await NetworkAddress.create({ ip }).save();
  }
  return getConnection()
    .createQueryBuilder()
    .relation(User, 'networkAddresses')
    .of(userId)
    .add(networkAddress.ip);
};

export const addDeviceAndNetworkAddressToUser = async (
  userId: string,
  ip: string,
  deviceId: string
) => {
  let networkAddress = await NetworkAddress.findOne({
    where: { ip },
    select: ['ip'],
  });
  if (!networkAddress) {
    networkAddress = await NetworkAddress.create({ ip }).save();
  }
  let device = await Device.findOne({
    where: { id: deviceId },
    select: ['id'],
  });
  if (!device) {
    device = await Device.create({ id: deviceId }).save();
  }
  return getManager().transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager
      .createQueryBuilder()
      .relation(User, 'networkAddresses')
      .of(userId)
      .add(networkAddress);
    await transactionalEntityManager
      .createQueryBuilder()
      .relation(User, 'devices')
      .of(userId)
      .add(device);
  });
};

export const addDeviceToUser = async (userId: string, deviceId: string) =>
  getConnection()
    .createQueryBuilder()
    .relation(User, 'devices')
    .of(userId)
    .add(deviceId);

export const createUser = async (
  userData: {
    email: string;
    hashedPassword: string;
    displayName: string;
  },
  deviceId: string,
  ip: string
) => {
  let networkAddress = await NetworkAddress.findOne({
    where: { ip },
    select: ['ip'],
  });
  const device = await Device.findOne({ where: { id: deviceId } });
  if (!device) throw new Error('device doesnt exist');
  if (!networkAddress) {
    networkAddress = await NetworkAddress.create({ ip }).save();
  }
  const user = await User.create({
    ...userData,
    networkAddresses: [networkAddress],
    devices: [device],
  }).save();
  return { user, device };
};

export const deleteUser = async (id: string) => User.delete({ id });

export const changePassword = async (
  userId: string,
  hashedPassword: string,
  tokenVersion: number
) =>
  getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ hashedPassword, tokenVersion })
    .where('user.id = :id', { id: userId })
    .execute();

export const createUnactivatedUser = async ({
  email,
  displayName,
  hashedPassword,
  activationToken,
  deviceId,
}: {
  email: string;
  displayName: string;
  hashedPassword: string;
  activationToken: string;
  deviceId: string;
}) => {
  const outdatedToken = await redis.hget(
    `unactivated_user:${email}`,
    'activationToken'
  );
  if (outdatedToken) await redis.del(`activation_token:${outdatedToken}`);
  await redis
    .pipeline()
    .hset(`activation_token:${activationToken}`, 'email', email)
    .hset(
      `unactivated_user:${email}`,
      'displayName',
      displayName,
      'hashedPassword',
      hashedPassword,
      'activationToken',
      activationToken,
      'deviceId',
      deviceId
    )
    .expire(`activation_token:${activationToken}`, 3600)
    .expire(`unactivated_user:${email}`, 3600)
    .exec();
};

/**
 * Returns UnactivatedUser if unauthenticated user exists or returns null,
 * after fetching content of activation_token:token and unactivated_user:email deletes them from the DB.
 * @param token unique token required to activate a user
 *
 * @returns UnactivatedUser | null
 */
export const getUnactivatedUser = async (token: string): Promise<UnactivatedUser | null> => {
  let result = await redis
    .pipeline()
    .hget(`activation_token:${token}`, 'email')
    .del(`activation_token:${token}`)
    .exec();
  if (!result) return null;
  const email = result[0][1] as string | null;;
  if (!email) return null;
  result = await redis
    .pipeline()
    .hgetall(`unactivated_user:${email}`)
    .del(`unactivated_user:${email}`)
    .exec();
  if (!result) return null;
  const unactivatedUser: UnactivatedUser | null = result[0][1] as UnactivatedUser | null;
  if (!unactivatedUser) throw new Error('unactivatedUser is null');
  unactivatedUser.email = email;
  return unactivatedUser;
};

export const checkIfUserIsUnactivated = async (email: string) =>
  redis.hget(`unactivated_user:${email}`, 'activationToken');

export const createNotApprovedDevice = async (
  deviceId: string,
  userId: string,
  token: string
) =>
  redis
    .pipeline()
    .hset(
      `not_approved_device:${token}`,
      'userId',
      userId,
      'deviceId',
      deviceId
    )
    .expire(`not_approved_device:${token}`, 3600)
    .exec();

export const getNotApprovedDevice = async (token: string) => {
  const result = await redis.hgetall(`not_approved_device:${token}`);
  return result as { userId: string; deviceId: string } | Record<string, never>;
};

export const deleteNotApprovedDevice = async (token: string) =>
  redis.del(`not_approved_device:${token}`);

export const createNotApprovedNetworkAddress = async (
  networkAddress: string,
  userId: string,
  token: string
) =>
  redis
    .pipeline()
    .hset(
      `not_approved_network_address:${token}`,
      'userId',
      userId,
      'networkAddress',
      networkAddress
    )
    .expire(`not_approved_network_address:${token}`, 3600)
    .exec();

export const deleteNotApprovedNetworkAddress = async (token: string) =>
  redis.del(`not_approved_network_address:${token}`);

export const getNotApprovedNetworkAddress = async (token: string) => {
  const result = await redis.hgetall(`not_approved_network_address:${token}`);
  return result as
    | { userId: string; networkAddress: string }
    | Record<string, never>;
};

export const createNotApprovedDeviceAndNetworkAddress = async ({
  ip,
  deviceId,
  userId,
  token,
}: {
  ip: string;
  deviceId: string;
  userId: string;
  token: string;
}) =>
  redis
    .pipeline()
    .hset(
      `not_approved_device_and_network_address:${token}`,
      'userId',
      userId,
      'ip',
      ip,
      'deviceId',
      deviceId
    )
    .expire(`not_approved_device_and_network_address:${token}`, 3600)
    .exec();

export const getNotApprovedDeviceAndNetworkAddress = async (token: string) => {
  const result = await redis.hgetall(
    `not_approved_device_and_network_address:${token}`
  );
  return result as
    | { userId: string; ip: string; deviceId: string }
    | Record<string, never>;
};

export const createNewPasswordToken = async (userId: string, token: string) =>
  redis
    .pipeline()
    .hset(`new_password_token:${token}`, 'userId', userId)
    .expire(`new_password_token:${token}`, 3600)
    .exec();

export const getNewPasswordToken = async (token: string) =>
  redis.hget(`new_password_token:${token}`, 'userId');

export const isEmailTaken = async (email: string) => {
  const emailIsTaken = await User.findOne({
    where: { email },
    select: ['id'],
  });
  return Boolean(emailIsTaken);
};

export const findUserByEmail = async (email: string) =>
  (await User.findOne({
    where: { email },
    select: [
      'id',
      'email',
      'displayName',
      'email',
      'hashedPassword',
      'tokenVersion',
    ],
    relations: ['networkAddresses', 'devices'],
  })) as unknown as Pick<
    User,
    | 'id'
    | 'email'
    | 'displayName'
    | 'hashedPassword'
    | 'tokenVersion'
  > & {
    networkAddresses: Array<Pick<NetworkAddress, 'ip'>>;
    devices: Array<Pick<Device, 'id' | 'ua'>>;
  };

export const findUserById = async (id: string) =>
  (await User.findOne({
    where: { id },
    select: [
      'id',
      'displayName',
      'email',
      'hashedPassword',
      'tokenVersion',
    ],
    relations: ['networkAddresses', 'devices'],
  })) as Pick<
    User,
    | 'id'
    | 'displayName'
    | 'email'
    | 'hashedPassword'
    | 'tokenVersion'
  > & {
    networkAddresses: Array<Pick<NetworkAddress, 'ip'>>;
    devices: Array<Pick<Device, 'id' | 'ua'>>;
  };

export const createDevice = (newDeviceUA: string) =>
  Device.create({ ua: newDeviceUA.slice(0, 256) }).save();

export const getUserProfile = async (id: string) =>
  (await User.findOne({
    where: { id },
    select: [
      'id',
      'blocked',
      'displayName',
      'email',
      'profileBio',
      'createdAt',
      'updatedAt',
    ],
  })) as unknown as Pick<
    User,
    | 'id'
    | 'blocked'
    | 'displayName'
    | 'email'
    | 'profileBio'
    | 'createdAt'
    | 'updatedAt'
  >;

export const updateUser = async (
  userId: string,
  data: Partial<
    Pick<
      User,
      | 'id'
      | 'email'
      | 'profileBio'
    >
  >
) =>
  getConnection()
    .createQueryBuilder()
    .update(User)
    .set(data)
    .where('id = :id', { id: userId })
    .execute();
