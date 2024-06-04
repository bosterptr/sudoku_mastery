/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Producer } from 'kafkajs';
import authSubjects from './constants/auth/v1/auth';
import { org } from './proto';

export const sendCreatedUnauthenticatedUser =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated_not_activated
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated;
  const topic = authSubjects['user.created_not_activated'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendDetectedNotApprovedDeviceAndNetworkAddressEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.Idetected_not_approved
) => {
  const Message =
    org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address
      .detected_not_approved;
  const topic =
    authSubjects['device_and_network_address.detected_not_approved'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendDetectedNotApprovedDeviceEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.device.Idetected_not_approved
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved;
  const topic = authSubjects['device.detected_not_approved'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendDetectedNotApprovedNetworkAddressEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Idetected_not_approved
) => {
  const Message =
    org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved;
  const topic = authSubjects['network_address.detected_not_approved'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendCreatedUserEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.user.created;
  const topic = authSubjects['user.created'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendUpdatedUserEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iupdated
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.user.updated;
  const topic = authSubjects['user.updated'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendUserIsAlreadyRegisteredEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iemail_is_already_registered
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered;
  const topic = authSubjects['user.email_is_already_registered'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendAddedNetworkAddressToUserEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Iadded_to_user
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user;
  const topic = authSubjects['network_address.added_to_user'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendAddedDeviceToUserEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.device.Iadded_to_user
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user;
  const topic = authSubjects['device.added_to_user'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};

export const sendRequestedNewPasswordEvent =  async (producer:Producer,
  data: org.sudoku.sudoku.eventbus.events.auth.v1.user.Irequested_new_password
) => {
  const Message = org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password;
  const topic = authSubjects['user.requested_new_password'];
  const message = Message.create(data);
  const uint8array = Message.encode(message).finish();
  await producer.send({
    topic,
    messages: [{ value: Buffer.from(uint8array) }],
  });
};
