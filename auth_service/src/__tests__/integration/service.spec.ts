import cookie from 'cookie-signature';
import { faker } from '@faker-js/faker';
import fc from 'fast-check';
import { Server } from 'http';
import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import app from '../../app';
import {
  maxConsecutiveFailsByUsernameAndIP,
  maxWrongAttemptsByIPperDay,
} from '../../constants/rateLimit';
import { Device, NetworkAddress, User } from '../../db/entities';
import * as DAL from '../../domain/DAL';
import { createUnactivatedUser } from '../../domain/DAL';
import { connectKafkaClient, disconnectKafkaClient } from '../../mq';
import * as eventbusClient from 'eventbus_client';
import redis from '../../redis';
import createTestDatabaseConn from '../../testUtils/createTestDatabaseConn';
import hashPassword from '../../utils/hashPassword';
import randomString from '../../utils/randomToken';

faker.seed(Date.now());
// const mobilePhone = '+48794446666';
const localhosstIpAddr = '::ffff:127.0.0.1';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36';
const UAHeader = {
  'user-agent': UA,
};
const deviceId = 'c3fba805-1753-4d66-81a3-f8f6c61e6c20';
const deviceCookie = (id = deviceId) => ({
  Cookie: `device=s%3A${cookie.sign(
    id,
    process.env.COOKIE_PARSER_SECRET
  )}; Max-Age=315360000; Path=/; Expires=Mon, 10 Feb 2031 11:26:01 GMT; Secure;`,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('API Routes', () => {
  let server: Server;
  let connection: Connection;
  let userData: {
    email: string;
    hashedPassword: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  // clean up database before each test
  async function reloadDatabase() {
    if (!connection) throw new Error('connection is undefined');
    await connection.synchronize(true);
    await delay(10000);
  }

  // eslint-disable-next-line jest/no-done-callback
  beforeAll(async () => {
    connection = await createTestDatabaseConn();
    await delay(5000);
    const password = `${faker.internet.password()}2@`;
    const hashedPassword = await hashPassword(password);
    const email = faker.internet.email();
    userData = {
      email,
      hashedPassword,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password,
    };
    await connectKafkaClient();
    // await createKafkaTopics();
    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
  }, 10000);
  
  // eslint-disable-next-line jest/no-done-callback
  afterAll(async () => {
    await getConnection().close();
    // await deleteKafkaTopics();
    await disconnectKafkaClient();
    await new Promise<void>(resolve => server.close(() => resolve()));
  });
  describe('/register', () => {
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    it('should register a user', async () => {
      // Arrange
      const mockedUser = {
        email: faker.internet.email(),
        password: `${faker.internet.password(10)}2@`,
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({});
      expect(response.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');
    });
    it('should register a user even when we try to do that 2 times with the same email', async () => {
      // Arrange
      const mockedUser = {
        email: faker.internet.email(),
        password: `${faker.internet.password(10)}2@`,
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({});
      expect(response.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');

      // and then once again

      // Act
      const response2 = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      expect(response2.status).toEqual(201);
      expect(response2.body).toMatchObject({});
      expect(response2.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');
    });
    it('should not register when an email is already taken', async () => {
      // Arrange
      const device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      const networkAddress = await NetworkAddress.create({
        ip: localhosstIpAddr,
      }).save();
      const user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
        // firstName: userData.firstName,
        // lastName: userData.lastName,
        devices: [device],
        networkAddresses: [networkAddress],
      });
      await user.save();

      const mockedUser = {
        email: user.email,
        password: userData.password,
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      // We are faking registration of a user
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({});
    });
    it('property based test', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 4, maxLength: 251 }),
          async (email, password) => {
            // Arrange
            const input = {
              email,
              password: `1!Aa${password}`,
              // mobilePhone: '+48794446460', // faker does not supply correct numbers
            };
            // Act
            const response = await request(server)
              .post('/api/auth/register')
              .set(UAHeader)
              .send(input);
            // Assert
            expect(response.status).toEqual(201);
            expect(response.body).toEqual({});
          }
        )
      );
    }, 60000);
    it('should throw an error when we dont send User-UA', async () => {
      // Arrange
      const mockedUser = {
        email: faker.internet.email(),
        password: `${faker.internet.password(10)}2@`,
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NON_EXISTENT_UA');
    });
    it('should catch validation errors (email)', async () => {
      // Arrange
      const userToRegistration = {
        email: 'wrongemail.wrong.wrong',
        password: `${faker.internet.password(10)}2@`,
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(userToRegistration);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
    it('should catch validation errors (password)', async () => {
      // Arrange
      const userToRegistration = {
        email: faker.internet.email(),
        password: faker.internet.password(6), // too short
        // mobilePhone,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/register')
        .set(UAHeader)
        .send(userToRegistration);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
    // it('should catch validation errors (mobilePhone)', async () => {
    //   // Arrange
    //   const userToRegistration = {
    //     email: faker.internet.email(),
    //     password: `${faker.internet.password(10)}2@`,
    //     // mobilePhone: '43542',
    //   };
    //   // Act
    //   const response = await request(server)
    //     .post('/api/auth/register')
    //     .set(UAHeader)
    //     .send(userToRegistration);
    //   // Assert
    //   expect(response.status).toEqual(400);
    //   expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    // });
  });
  describe('/activate', () => {
    let activationToken: string;
    let device: Device;
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    beforeEach(async () => {
      device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      await NetworkAddress.create({ ip: localhosstIpAddr }).save();
      activationToken = randomString(64);
      const hashedPassword = await hashPassword(
        `${faker.internet.password(10)}2@`
      );
      await createUnactivatedUser({
        email: faker.internet.email(),
        hashedPassword,
        displayName: 'test',
        activationToken,
        deviceId,
      });
    });
    it('should activate an account (with a device cookie) and should not return a set-cookie header', async () => {
      // Arrange
      const mockedRequestData = {
        token: activationToken,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .set(deviceCookie())
        .set(UAHeader)
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({});
      expect(response.headers['set-cookie']).toEqual(undefined);
    });
    it('should not activate an account when the token does not exist in DB', async () => {
      // Arranges
      const mockedRequestData = {
        token: randomString(64),
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .set(deviceCookie())
        .set(UAHeader)
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('INVALID_TOKEN');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not activate an account (without a device cookie and a UA header) and should not return a set-cookie header', async () => {
      // Arranges
      const mockedRequestData = {
        token: activationToken,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NON_EXISTENT_UA');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should activate an account (without a device cookie and with a UA header) and should return a set-cookie header', async () => {
      // Arrange
      const mockedRequestData = {
        token: activationToken,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .set(UAHeader)
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');
    });
    it('should activate an account even when the network address isnt set in the DB', async () => {
      // Arrange
      await NetworkAddress.delete(localhosstIpAddr);
      const mockedRequestData = {
        token: activationToken,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .set(UAHeader)
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');
    });
    it('should not activate an account (with a device cookie) when the device does not exist in DB ( even though the device cookie is correct)', async () => {
      // Arrange
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Device)
        .where('id = :id', { id: device.id })
        .execute();
      const mockedRequestData = {
        token: activationToken,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .set(deviceCookie())
        .set(UAHeader)
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(500);
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should catch token validation errors', async () => {
      // Arrange
      const mockedRequestData = {
        token: faker.random.alphaNumeric(60), // too short
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
    it('should catch firstName validation errors', async () => {
      // Arrange
      const mockedRequestData = {
        token: faker.random.alphaNumeric(64),
        firstName: faker.random.alphaNumeric(2), // too short
        lastName: faker.name.lastName(),
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
    it('should catch lastName validation errors', async () => {
      // Arrange
      const mockedRequestData = {
        token: faker.random.alphaNumeric(64),
        firstName: faker.name.firstName(),
        lastName: faker.random.alphaNumeric(2), // too short
      };
      // Act
      const response = await request(server)
        .post('/api/auth/activate')
        .send(mockedRequestData);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
  });
  describe('/login', () => {
    let user: User;
    let device: Device;
    let networkAddress: NetworkAddress;
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    beforeEach(async () => {
      device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      networkAddress = await NetworkAddress.create({
        ip: localhosstIpAddr,
      }).save();
      user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
        // firstName: userData.firstName,
        // lastName: userData.lastName,
        devices: [device],
        networkAddresses: [networkAddress],
      });
      await user.save();
    });
    it('should log in', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(201);
      expect(typeof response.body.accessToken).toEqual('string');
      expect(response.headers['set-cookie'][0].slice(0, 14)).toEqual(
        'refresh-token='
      );
      expect(response.headers['set-cookie'][1]).toBeUndefined();
    });
    it('should not log in when passwords dont match', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: `${faker.internet.password()}2@`,
        });
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when the account is unactivated', async () => {
      // Arrange
      const email = faker.internet.email();
      const password = 'password1!';
      const hashedPassword = await hashPassword(password);
      await DAL.createUnactivatedUser({
        email,
        displayName: 'test',
        hashedPassword,
        activationToken: randomString(64),
        deviceId,
      });
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email,
          password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('UNACTIVATED_USER');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when user with that email does not exist', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: faker.internet.email(),
          password: `${faker.internet.password()}2@`,
        });
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when the request has a device cookie, even though that does not have a UA', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        // .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(201);
      expect(typeof response.body.accessToken).toEqual('string');
      expect(response.headers['set-cookie'][0].slice(0, 14)).toEqual(
        'refresh-token='
      );
      expect(response.headers['set-cookie'][1]).toBeUndefined();
    });
    it('should not log in when the request does not have a device cookie', async () => {
      // Arrange
      const spy = jest.spyOn(eventbusClient, 'sendDetectedNotApprovedDeviceEvent');
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        // .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(spy).toHaveBeenCalled();
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NEW_DEVICE');
      expect(response.headers['set-cookie'][0].slice(0, 7)).toEqual('device=');
      expect(response.headers['set-cookie'][1]).toBeUndefined();
    });
    it('should not log in when the request does not have a device cookie and a UA', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        // .set(deviceCookie())
        // .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NON_EXISTENT_UA');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when the request does not have a linked device cookie and a network address', async () => {
      // Arrange
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .relation(User, 'devices')
        .of(user.id)
        .remove(device.id);
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .relation(User, 'networkAddresses')
        .of(user.id)
        .remove(networkAddress.ip);
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual(
        'NEW_DEVICE_AND_NETWORK_ADDRESS'
      );
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when the request does not have a linked device cookie', async () => {
      // Arrange
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .relation(User, 'devices')
        .of(user.id)
        .remove(device.id);
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NEW_DEVICE');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not log in when the request does not have a linked network address', async () => {
      // Arrange
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .relation(User, 'networkAddresses')
        .of(user.id)
        .remove(networkAddress.ip);
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NEW_NETWORK_ADDRESS');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should catch validation errors', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/login')
        // .set(deviceCookie())
        // .set(UAHeader)
        .send({
          email: userData.email,
          password: userData.password,
        });
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NON_EXISTENT_UA');
      expect(response.headers['set-cookie']).toBeUndefined();
    });
    it('should not rate limit when < maxConsecutiveFailsByUsernameAndIP', async () => {
      for (let i = 0; i < maxConsecutiveFailsByUsernameAndIP; i += 1) {
        // Act
        // eslint-disable-next-line no-await-in-loop
        const response = await request(server)
          .post('/api/auth/login')
          .set(deviceCookie())
          .set(UAHeader)
          .send({
            email: userData.email,
            password: `${faker.internet.password()}2@`,
          });
        // Assert
        expect(response.status).toEqual(400);
        expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
        expect(response.headers['set-cookie']).toBeUndefined();
        expect(response.headers['x-ratelimit-limit-ip']).toEqual(
          maxWrongAttemptsByIPperDay.toString()
        );
        expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
          maxConsecutiveFailsByUsernameAndIP.toString()
        );
        expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
          (maxWrongAttemptsByIPperDay - i).toString()
        );
        expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
          (maxConsecutiveFailsByUsernameAndIP - i).toString()
        );
      }
    }, 20000);
    it('should rate limit when >= maxConsecutiveFailsByUsernameAndIP', async () => {
      // Act
      for (let i = 0; i < maxConsecutiveFailsByUsernameAndIP; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const response = await request(server)
          .post('/api/auth/login')
          .set(deviceCookie())
          .set(UAHeader)
          .send({
            email: userData.email,
            password: `${faker.internet.password()}2@`,
          });
        expect(response.status).toEqual(400);
        expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
        expect(response.headers['set-cookie']).toBeUndefined();
        expect(response.headers['x-ratelimit-limit-ip']).toEqual(
          maxWrongAttemptsByIPperDay.toString()
        );
        expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
          maxConsecutiveFailsByUsernameAndIP.toString()
        );
        expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
          (maxWrongAttemptsByIPperDay - i).toString()
        );
        expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
          (maxConsecutiveFailsByUsernameAndIP - i).toString()
        );
      }
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email: userData.email,
          password: `${faker.internet.password()}2@`,
        });
      // Assert
      expect(response.status).toEqual(429);
      expect(response.body).toEqual({});
      expect(response.headers['x-ratelimit-limit-ip']).toEqual(
        maxWrongAttemptsByIPperDay.toString()
      );
      expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
        maxConsecutiveFailsByUsernameAndIP.toString()
      );
      expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
        (maxWrongAttemptsByIPperDay - 10).toString()
      );
      expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
        (maxConsecutiveFailsByUsernameAndIP - 10).toString()
      );
      expect(response.headers['x-ratelimit-reset-ip']).toEqual(
        expect.any(String)
      );
      expect(parseInt(response.headers['x-ratelimit-reset-ip'], 10)).toEqual(
        expect.any(Number)
      );
      expect(response.headers['set-cookie']).toBeUndefined();
    }, 20000);
    it('should not rate limit when < maxWrongAttemptsByIPperDay', async () => {
      for (
        let i = 0;
        i < maxWrongAttemptsByIPperDay / maxConsecutiveFailsByUsernameAndIP;
        i += 1
      ) {
        // Arrange
        const email = faker.internet.email();
        user = User.create({
          email,
          hashedPassword: userData.hashedPassword,
       // firstName: userData.firstName,
       // lastName: userData.lastName,
          devices: [device],
          networkAddresses: [networkAddress],
        });
        // eslint-disable-next-line no-await-in-loop
        await user.save();
        for (let j = 0; j < maxConsecutiveFailsByUsernameAndIP; j += 1) {
          // Act
          // eslint-disable-next-line no-await-in-loop
          const response = await request(server)
            .post('/api/auth/login')
            .set(deviceCookie())
            .set(UAHeader)
            .send({
              email,
              password: `${faker.internet.password(10)}2@`,
            });
          // Assert
          expect(response.status).toEqual(400);
          expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
          expect(response.headers['set-cookie']).toBeUndefined();
          expect(response.headers['x-ratelimit-limit-ip']).toEqual(
            maxWrongAttemptsByIPperDay.toString()
          );
          expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
            maxConsecutiveFailsByUsernameAndIP.toString()
          );
          expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
            (
              maxWrongAttemptsByIPperDay -
              i * maxConsecutiveFailsByUsernameAndIP -
              j
            ).toString()
          );
          expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
            (maxConsecutiveFailsByUsernameAndIP - j).toString()
          );
        }
      }
    }, 150000);
    it('should rate limit when >= maxWrongAttemptsByIPperDay', async () => {
      // Arrange
      let email;
      for (let i = 0; i < maxWrongAttemptsByIPperDay / 10; i += 1) {
        // Arrange
        email = faker.internet.email();
        user = User.create({
          email,
          hashedPassword: userData.hashedPassword,
       // firstName: userData.firstName,
       // lastName: userData.lastName,
          devices: [device],
          networkAddresses: [networkAddress],
        });
        // eslint-disable-next-line no-await-in-loop
        await user.save();
        for (let j = 0; j < 10; j += 1) {
          // Act
          // eslint-disable-next-line no-await-in-loop
          const response = await request(server)
            .post('/api/auth/login')
            .set(deviceCookie())
            .set(UAHeader)
            .send({
              email,
              password: `${faker.internet.password(10)}2@`,
            });
          // Assert
          expect(response.status).toEqual(400);
          expect(response.body.error.code).toEqual('WRONG_CREDENTIALS');
          expect(response.headers['set-cookie']).toBeUndefined();
          expect(response.headers['x-ratelimit-limit-ip']).toEqual(
            maxWrongAttemptsByIPperDay.toString()
          );
          expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
            maxConsecutiveFailsByUsernameAndIP.toString()
          );
          expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
            (maxWrongAttemptsByIPperDay - i * 10 - j).toString()
          );
          expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
            (maxConsecutiveFailsByUsernameAndIP - j).toString()
          );
        }
      }
      email = faker.internet.email();
      user = User.create({
        email,
        hashedPassword: userData.hashedPassword,
     // firstName: userData.firstName,
     // lastName: userData.lastName,
        devices: [device],
        networkAddresses: [networkAddress],
      });
      const response = await request(server)
        .post('/api/auth/login')
        .set(deviceCookie())
        .set(UAHeader)
        .send({
          email,
          password: `${faker.internet.password()}2@`,
        });
      // Assert
      expect(response.status).toEqual(429);
      expect(response.body).toEqual({});
      expect(response.headers['x-ratelimit-limit-ip']).toEqual(
        maxWrongAttemptsByIPperDay.toString()
      );
      expect(response.headers['x-ratelimit-limit-ip-email']).toEqual(
        maxConsecutiveFailsByUsernameAndIP.toString()
      );
      expect(response.headers['x-ratelimit-remaining-ip']).toEqual(
        (maxWrongAttemptsByIPperDay - 100).toString()
      );
      expect(response.headers['x-ratelimit-remaining-ip-email']).toEqual(
        maxConsecutiveFailsByUsernameAndIP.toString()
      );
      expect(response.headers['x-ratelimit-reset-ip']).toEqual(
        expect.any(String)
      );
      expect(response.headers['x-ratelimit-reset-ip']).toEqual(
        expect.any(String)
      );
      expect(parseInt(response.headers['x-ratelimit-reset-ip'], 10)).toEqual(
        expect.any(Number)
      );
      expect(response.headers['set-cookie']).toBeUndefined();
    }, 150000);
  });
  describe('/forgotPassword', () => {
    beforeEach(async () => {
      await reloadDatabase();
    });
    beforeEach(async () => {
      await redis.flushdb();
    });
    beforeEach(async () => {
      const device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      const networkAddress = await NetworkAddress.create({
        ip: localhosstIpAddr,
      }).save();
      const user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
     // firstName: userData.firstName,
     // lastName: userData.lastName,
        devices: [device],
        networkAddresses: [networkAddress],
      });
      await user.save();
    });
    it('should accept an email (email does exist in DB)', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/forgotPassword')
        .send({
          email: userData.email,
        });
      // Assert
      expect(response.status).toEqual(201);
    });
    it('should accept an email (email does not exist in DB)', async () => {
      // Act
      const response = await request(server)
        .post('/api/auth/forgotPassword')
        .send({
          email: faker.internet.email(),
        });
      // Assert
      expect(response.status).toEqual(201);
    });
  });
  describe('/newPassword', () => {
    let newPasswordToken: string;
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    beforeEach(async () => {
      const device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      const networkAddress = await NetworkAddress.create({
        ip: localhosstIpAddr,
      }).save();
      const user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
     // firstName: userData.firstName,
     // lastName: userData.lastName,
        devices: [device],
        networkAddresses: [networkAddress],
      });
      await user.save();
      newPasswordToken = randomString(64);
      await DAL.createNewPasswordToken(user.id, newPasswordToken);
    });
    it('should accept new password', async () => {
      // Arrange
      const mockedUser = {
        token: newPasswordToken,
        password: `${faker.internet.password(10)}2@`,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .set(UAHeader)
        .set(deviceCookie())
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({});
      expect(response.headers['set-cookie'][0].slice(0, 14)).toEqual(
        'refresh-token='
      );
    });
    it('should refuse when the sent token does not exist in the DB', async () => {
      // Arrange
      const mockedUser = {
        token: randomString(64),
        password: `${faker.internet.password(10)}2@`,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .set(UAHeader)
        .set(deviceCookie())
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('INVALID_TOKEN');
    });
    it('should refuse when sent when a user does not exist', async () => {
      // Arrange
      await User.delete({ email: userData.email });
      const mockedUser = {
        token: newPasswordToken,
        password: `${faker.internet.password(10)}2@`,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .set(UAHeader)
        .set(deviceCookie())
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.error.code).toEqual('ENTITY_NOT_FOUND');
    });
    it('should throw an error when User-UA isnt sent', async () => {
      // Arrange
      const mockedUser = {
        token: newPasswordToken,
        password: `${faker.internet.password(10)}2@`,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('NON_EXISTENT_UA');
    });
    it('should catch validation errors (token)', async () => {
      // Arrange
      const mockedUser = {
        token: randomString(70), // too long
        password: `${faker.internet.password(10)}2@`,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
    it('should catch validation errors (password)', async () => {
      // Arrange
      const mockedUser = {
        token: newPasswordToken,
        password: `${faker.internet.password(5)}`, // too short etc,
      };
      // Act
      const response = await request(server)
        .post('/api/auth/newPassword')
        .set(UAHeader)
        .send(mockedUser);
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
  });
  describe('/activateDevice', () => {
    let newDeviceToken: string;
    let user: User;
    let device: Device;
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    beforeEach(async () => {
      device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      const networkAddress = await NetworkAddress.create({
        ip: localhosstIpAddr,
      }).save();
      user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
     // firstName: userData.firstName,
     // lastName: userData.lastName,
        networkAddresses: [networkAddress],
      });
      await user.save();
      newDeviceToken = randomString(10);
      await DAL.createNotApprovedDevice(device.id, user.id, newDeviceToken);
    });
    it('should activate the device', async () => {
      // Act
      const response = await request(server)
        .post(`/api/auth/activateDevice/${newDeviceToken}`)
        .set(UAHeader)
        .set(deviceCookie(device.id))
        .send();
      // Assert
      expect(response.status).toEqual(201);
      const userFromDB = await User.findOne({
        where: { id: user.id },
        relations: ['devices'],
        select: ['id'],
      });
      expect(userFromDB).not.toBeUndefined();
      expect(userFromDB).toMatchObject<{
        id: string;
        devices: { id: string; ua: string }[];
      }>({
        id: user.id,
        devices: [{ id: deviceId, ua: UA }],
      });
    });
    it('should refuse non-existent token', async () => {
      // Arrange
      const fakeToken = randomString(10);
      // Act
      const response = await request(server)
        .post(`/api/auth/activateDevice/${fakeToken}`)
        .set(UAHeader)
        .set(deviceCookie(device.id))
        .send();
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('WRONG_TOKEN');
    });
    it('should catch validation error', async () => {
      // Act
      const response = await request(server)
        .post(`/api/auth/activateDevice/45654ugfhgdd`)
        .set(UAHeader)
        .set(deviceCookie())
        .send();
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
  });
  describe('/activateNetworkAddress', () => {
    let newNetworkAddressToken: string;
    let user: User;
    beforeEach(async () => {
      await reloadDatabase();
      await redis.flushdb();
    });
    beforeEach(async () => {
      const device = await Device.create({
        id: deviceId,
        ua: UA,
      }).save();
      await NetworkAddress.create({ ip: localhosstIpAddr }).save();
      user = User.create({
        email: userData.email,
        hashedPassword: userData.hashedPassword,
     // firstName: userData.firstName,
     // lastName: userData.lastName,
        devices: [device],
      });
      await user.save();
      newNetworkAddressToken = randomString(10);
      await DAL.createNotApprovedNetworkAddress(
        localhosstIpAddr,
        user.id,
        newNetworkAddressToken
      );
    });
    it('should activate the network address', async () => {
      // Act
      const response = await request(server)
        .post(`/api/auth/activateNetworkAddress/${newNetworkAddressToken}`)
        .set(UAHeader)
        .set(deviceCookie())
        .send();
      // Assert
      expect(response.status).toEqual(201);
      const userFromDB = await User.findOne({
        where: { id: user.id },
        relations: ['networkAddresses'],
        select: ['id'],
      });
      expect(userFromDB).not.toBeUndefined();
      expect(userFromDB).toMatchObject<{
        id: string;
        networkAddresses: { ip: string }[];
      }>({
        id: user.id,
        networkAddresses: [{ ip: `${localhosstIpAddr}/128` }],
      });
    });
    it('should activate the network address and create a new one if the IP address does not exist in the DB', async () => {
      // Arrange
      await NetworkAddress.delete(localhosstIpAddr);
      // Act
      const response = await request(server)
        .post(`/api/auth/activateNetworkAddress/${newNetworkAddressToken}`)
        .set(UAHeader)
        .set(deviceCookie())
        .send();
      // Assert
      expect(response.status).toEqual(201);
      const userFromDB = await User.findOne({
        where: { id: user.id },
        relations: ['networkAddresses'],
        select: ['id'],
      });
      expect(userFromDB).not.toBeUndefined();
      expect(userFromDB).toMatchObject<{
        id: string;
        networkAddresses: { ip: string }[];
      }>({
        id: user.id,
        networkAddresses: [{ ip: `${localhosstIpAddr}/128` }],
      });
    });
    it('should refuse non-existent token', async () => {
      // Arrange
      const fakeToken = randomString(10);
      // Act
      const response = await request(server)
        .post(`/api/auth/activateNetworkAddress/${fakeToken}`)
        .set(UAHeader)
        .set(deviceCookie())
        .send();
      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.error.code).toEqual('WRONG_NETWORK_ADDRESS_CODE');
    });
    it('should catch validation error', async () => {
      // Act
      const response = await request(server)
        .post(`/api/auth/activateNetworkAddress/45654ugfhgdd`)
        .set(UAHeader)
        .set(deviceCookie())
        .send();
      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual('BAD_USER_INPUT');
    });
  });
});
