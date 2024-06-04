import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace org. */
export namespace org {

    /** Namespace sudoku. */
    namespace sudoku {

        /** Namespace sudoku. */
        namespace sudoku {

            /** Namespace eventbus. */
            namespace eventbus {

                /** Namespace events. */
                namespace events {

                    /** Namespace auth. */
                    namespace auth {

                        /** Namespace v1. */
                        namespace v1 {

                            /** Namespace device_and_network_address. */
                            namespace device_and_network_address {

                                /** Properties of a detected_not_approved. */
                                interface Idetected_not_approved {

                                    /** detected_not_approved userId */
                                    userId?: (string|null);

                                    /** detected_not_approved userEmail */
                                    userEmail?: (string|null);

                                    /** detected_not_approved deviceUa */
                                    deviceUa?: (string|null);

                                    /** detected_not_approved ipv4 */
                                    ipv4?: (string|null);

                                    /** detected_not_approved token */
                                    token?: (string|null);
                                }

                                /** Represents a detected_not_approved. */
                                class detected_not_approved implements Idetected_not_approved {

                                    /**
                                     * Constructs a new detected_not_approved.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.Idetected_not_approved);

                                    /** detected_not_approved userId. */
                                    public userId: string;

                                    /** detected_not_approved userEmail. */
                                    public userEmail: string;

                                    /** detected_not_approved deviceUa. */
                                    public deviceUa: string;

                                    /** detected_not_approved ipv4. */
                                    public ipv4: string;

                                    /** detected_not_approved token. */
                                    public token: string;

                                    /**
                                     * Creates a new detected_not_approved instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns detected_not_approved instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.Idetected_not_approved): org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved;

                                    /**
                                     * Encodes the specified detected_not_approved message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified detected_not_approved message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved;

                                    /**
                                     * Verifies a detected_not_approved message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a detected_not_approved message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns detected_not_approved
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved;

                                    /**
                                     * Creates a plain object from a detected_not_approved message. Also converts values to other types if specified.
                                     * @param message detected_not_approved
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.detected_not_approved, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this detected_not_approved to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for detected_not_approved
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }
                            }

                            /** Namespace device. */
                            namespace device {

                                /** Properties of an added_to_user. */
                                interface Iadded_to_user {

                                    /** added_to_user userId */
                                    userId?: (string|null);

                                    /** added_to_user deviceId */
                                    deviceId?: (string|null);
                                }

                                /** Represents an added_to_user. */
                                class added_to_user implements Iadded_to_user {

                                    /**
                                     * Constructs a new added_to_user.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device.Iadded_to_user);

                                    /** added_to_user userId. */
                                    public userId: string;

                                    /** added_to_user deviceId. */
                                    public deviceId: string;

                                    /**
                                     * Creates a new added_to_user instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns added_to_user instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device.Iadded_to_user): org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user;

                                    /**
                                     * Encodes the specified added_to_user message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user.verify|verify} messages.
                                     * @param message added_to_user message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.Iadded_to_user, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified added_to_user message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user.verify|verify} messages.
                                     * @param message added_to_user message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.Iadded_to_user, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes an added_to_user message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns added_to_user
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user;

                                    /**
                                     * Decodes an added_to_user message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns added_to_user
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user;

                                    /**
                                     * Verifies an added_to_user message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates an added_to_user message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns added_to_user
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user;

                                    /**
                                     * Creates a plain object from an added_to_user message. Also converts values to other types if specified.
                                     * @param message added_to_user
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.added_to_user, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this added_to_user to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for added_to_user
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of a detected_not_approved. */
                                interface Idetected_not_approved {

                                    /** detected_not_approved userId */
                                    userId?: (string|null);

                                    /** detected_not_approved userEmail */
                                    userEmail?: (string|null);

                                    /** detected_not_approved ipv4 */
                                    ipv4?: (string|null);

                                    /** detected_not_approved deviceUa */
                                    deviceUa?: (string|null);

                                    /** detected_not_approved token */
                                    token?: (string|null);
                                }

                                /** Represents a detected_not_approved. */
                                class detected_not_approved implements Idetected_not_approved {

                                    /**
                                     * Constructs a new detected_not_approved.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device.Idetected_not_approved);

                                    /** detected_not_approved userId. */
                                    public userId: string;

                                    /** detected_not_approved userEmail. */
                                    public userEmail: string;

                                    /** detected_not_approved ipv4. */
                                    public ipv4: string;

                                    /** detected_not_approved deviceUa. */
                                    public deviceUa: string;

                                    /** detected_not_approved token. */
                                    public token: string;

                                    /**
                                     * Creates a new detected_not_approved instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns detected_not_approved instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.device.Idetected_not_approved): org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved;

                                    /**
                                     * Encodes the specified detected_not_approved message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified detected_not_approved message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved;

                                    /**
                                     * Verifies a detected_not_approved message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a detected_not_approved message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns detected_not_approved
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved;

                                    /**
                                     * Creates a plain object from a detected_not_approved message. Also converts values to other types if specified.
                                     * @param message detected_not_approved
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.device.detected_not_approved, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this detected_not_approved to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for detected_not_approved
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }
                            }

                            /** Namespace network_address. */
                            namespace network_address {

                                /** Properties of an added_to_user. */
                                interface Iadded_to_user {

                                    /** added_to_user userId */
                                    userId?: (string|null);

                                    /** added_to_user ipv4 */
                                    ipv4?: (string|null);
                                }

                                /** Represents an added_to_user. */
                                class added_to_user implements Iadded_to_user {

                                    /**
                                     * Constructs a new added_to_user.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Iadded_to_user);

                                    /** added_to_user userId. */
                                    public userId: string;

                                    /** added_to_user ipv4. */
                                    public ipv4: string;

                                    /**
                                     * Creates a new added_to_user instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns added_to_user instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Iadded_to_user): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user;

                                    /**
                                     * Encodes the specified added_to_user message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user.verify|verify} messages.
                                     * @param message added_to_user message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Iadded_to_user, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified added_to_user message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user.verify|verify} messages.
                                     * @param message added_to_user message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Iadded_to_user, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes an added_to_user message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns added_to_user
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user;

                                    /**
                                     * Decodes an added_to_user message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns added_to_user
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user;

                                    /**
                                     * Verifies an added_to_user message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates an added_to_user message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns added_to_user
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user;

                                    /**
                                     * Creates a plain object from an added_to_user message. Also converts values to other types if specified.
                                     * @param message added_to_user
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.added_to_user, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this added_to_user to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for added_to_user
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of a detected_not_approved. */
                                interface Idetected_not_approved {

                                    /** detected_not_approved userId */
                                    userId?: (string|null);

                                    /** detected_not_approved userEmail */
                                    userEmail?: (string|null);

                                    /** detected_not_approved ipv4 */
                                    ipv4?: (string|null);

                                    /** detected_not_approved deviceUa */
                                    deviceUa?: (string|null);

                                    /** detected_not_approved token */
                                    token?: (string|null);
                                }

                                /** Represents a detected_not_approved. */
                                class detected_not_approved implements Idetected_not_approved {

                                    /**
                                     * Constructs a new detected_not_approved.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Idetected_not_approved);

                                    /** detected_not_approved userId. */
                                    public userId: string;

                                    /** detected_not_approved userEmail. */
                                    public userEmail: string;

                                    /** detected_not_approved ipv4. */
                                    public ipv4: string;

                                    /** detected_not_approved deviceUa. */
                                    public deviceUa: string;

                                    /** detected_not_approved token. */
                                    public token: string;

                                    /**
                                     * Creates a new detected_not_approved instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns detected_not_approved instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Idetected_not_approved): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved;

                                    /**
                                     * Encodes the specified detected_not_approved message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified detected_not_approved message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved.verify|verify} messages.
                                     * @param message detected_not_approved message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.Idetected_not_approved, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved;

                                    /**
                                     * Decodes a detected_not_approved message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns detected_not_approved
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved;

                                    /**
                                     * Verifies a detected_not_approved message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a detected_not_approved message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns detected_not_approved
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved;

                                    /**
                                     * Creates a plain object from a detected_not_approved message. Also converts values to other types if specified.
                                     * @param message detected_not_approved
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.network_address.detected_not_approved, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this detected_not_approved to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for detected_not_approved
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }
                            }

                            /** Namespace user. */
                            namespace user {

                                /** Properties of a created_not_activated. */
                                interface Icreated_not_activated {

                                    /** created_not_activated email */
                                    email?: (string|null);

                                    /** created_not_activated displayName */
                                    displayName?: (string|null);

                                    /** created_not_activated activationToken */
                                    activationToken?: (string|null);
                                }

                                /** Represents a created_not_activated. */
                                class created_not_activated implements Icreated_not_activated {

                                    /**
                                     * Constructs a new created_not_activated.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated_not_activated);

                                    /** created_not_activated email. */
                                    public email: string;

                                    /** created_not_activated displayName. */
                                    public displayName: string;

                                    /** created_not_activated activationToken. */
                                    public activationToken: string;

                                    /**
                                     * Creates a new created_not_activated instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns created_not_activated instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated_not_activated): org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated;

                                    /**
                                     * Encodes the specified created_not_activated message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated.verify|verify} messages.
                                     * @param message created_not_activated message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated_not_activated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified created_not_activated message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated.verify|verify} messages.
                                     * @param message created_not_activated message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated_not_activated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a created_not_activated message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns created_not_activated
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated;

                                    /**
                                     * Decodes a created_not_activated message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns created_not_activated
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated;

                                    /**
                                     * Verifies a created_not_activated message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a created_not_activated message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns created_not_activated
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated;

                                    /**
                                     * Creates a plain object from a created_not_activated message. Also converts values to other types if specified.
                                     * @param message created_not_activated
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.created_not_activated, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this created_not_activated to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for created_not_activated
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of a created. */
                                interface Icreated {

                                    /** created id */
                                    id?: (string|null);

                                    /** created email */
                                    email?: (string|null);

                                    /** created firstName */
                                    firstName?: (string|null);

                                    /** created lastName */
                                    lastName?: (string|null);
                                }

                                /** Represents a created. */
                                class created implements Icreated {

                                    /**
                                     * Constructs a new created.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated);

                                    /** created id. */
                                    public id: string;

                                    /** created email. */
                                    public email: string;

                                    /** created firstName. */
                                    public firstName: string;

                                    /** created lastName. */
                                    public lastName: string;

                                    /**
                                     * Creates a new created instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns created instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated): org.sudoku.sudoku.eventbus.events.auth.v1.user.created;

                                    /**
                                     * Encodes the specified created message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.created.verify|verify} messages.
                                     * @param message created message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified created message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.created.verify|verify} messages.
                                     * @param message created message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Icreated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a created message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns created
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.created;

                                    /**
                                     * Decodes a created message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns created
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.created;

                                    /**
                                     * Verifies a created message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a created message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns created
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.created;

                                    /**
                                     * Creates a plain object from a created message. Also converts values to other types if specified.
                                     * @param message created
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.created, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this created to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for created
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of an email_is_already_registered. */
                                interface Iemail_is_already_registered {

                                    /** email_is_already_registered email */
                                    email?: (string|null);

                                    /** email_is_already_registered ip */
                                    ip?: (string|null);

                                    /** email_is_already_registered deviceUa */
                                    deviceUa?: (string|null);
                                }

                                /** Represents an email_is_already_registered. */
                                class email_is_already_registered implements Iemail_is_already_registered {

                                    /**
                                     * Constructs a new email_is_already_registered.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iemail_is_already_registered);

                                    /** email_is_already_registered email. */
                                    public email: string;

                                    /** email_is_already_registered ip. */
                                    public ip: string;

                                    /** email_is_already_registered deviceUa. */
                                    public deviceUa: string;

                                    /**
                                     * Creates a new email_is_already_registered instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns email_is_already_registered instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iemail_is_already_registered): org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered;

                                    /**
                                     * Encodes the specified email_is_already_registered message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered.verify|verify} messages.
                                     * @param message email_is_already_registered message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iemail_is_already_registered, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified email_is_already_registered message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered.verify|verify} messages.
                                     * @param message email_is_already_registered message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iemail_is_already_registered, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes an email_is_already_registered message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns email_is_already_registered
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered;

                                    /**
                                     * Decodes an email_is_already_registered message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns email_is_already_registered
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered;

                                    /**
                                     * Verifies an email_is_already_registered message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates an email_is_already_registered message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns email_is_already_registered
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered;

                                    /**
                                     * Creates a plain object from an email_is_already_registered message. Also converts values to other types if specified.
                                     * @param message email_is_already_registered
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.email_is_already_registered, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this email_is_already_registered to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for email_is_already_registered
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of a password_update. */
                                interface Ipassword_update {

                                    /** password_update id */
                                    id?: (string|null);
                                }

                                /** Represents a password_update. */
                                class password_update implements Ipassword_update {

                                    /**
                                     * Constructs a new password_update.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Ipassword_update);

                                    /** password_update id. */
                                    public id: string;

                                    /**
                                     * Creates a new password_update instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns password_update instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Ipassword_update): org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update;

                                    /**
                                     * Encodes the specified password_update message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update.verify|verify} messages.
                                     * @param message password_update message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Ipassword_update, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified password_update message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update.verify|verify} messages.
                                     * @param message password_update message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Ipassword_update, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a password_update message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns password_update
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update;

                                    /**
                                     * Decodes a password_update message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns password_update
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update;

                                    /**
                                     * Verifies a password_update message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a password_update message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns password_update
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update;

                                    /**
                                     * Creates a plain object from a password_update message. Also converts values to other types if specified.
                                     * @param message password_update
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.password_update, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this password_update to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for password_update
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of a requested_new_password. */
                                interface Irequested_new_password {

                                    /** requested_new_password email */
                                    email?: (string|null);

                                    /** requested_new_password token */
                                    token?: (string|null);

                                    /** requested_new_password ip */
                                    ip?: (string|null);

                                    /** requested_new_password deviceUa */
                                    deviceUa?: (string|null);
                                }

                                /** Represents a requested_new_password. */
                                class requested_new_password implements Irequested_new_password {

                                    /**
                                     * Constructs a new requested_new_password.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Irequested_new_password);

                                    /** requested_new_password email. */
                                    public email: string;

                                    /** requested_new_password token. */
                                    public token: string;

                                    /** requested_new_password ip. */
                                    public ip: string;

                                    /** requested_new_password deviceUa. */
                                    public deviceUa: string;

                                    /**
                                     * Creates a new requested_new_password instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns requested_new_password instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Irequested_new_password): org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password;

                                    /**
                                     * Encodes the specified requested_new_password message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password.verify|verify} messages.
                                     * @param message requested_new_password message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Irequested_new_password, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified requested_new_password message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password.verify|verify} messages.
                                     * @param message requested_new_password message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Irequested_new_password, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes a requested_new_password message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns requested_new_password
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password;

                                    /**
                                     * Decodes a requested_new_password message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns requested_new_password
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password;

                                    /**
                                     * Verifies a requested_new_password message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates a requested_new_password message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns requested_new_password
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password;

                                    /**
                                     * Creates a plain object from a requested_new_password message. Also converts values to other types if specified.
                                     * @param message requested_new_password
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.requested_new_password, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this requested_new_password to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for requested_new_password
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }

                                /** Properties of an updated. */
                                interface Iupdated {

                                    /** updated id */
                                    id?: (string|null);

                                    /** updated avatar */
                                    avatar?: (string|null);

                                    /** updated firstName */
                                    firstName?: (string|null);

                                    /** updated lastName */
                                    lastName?: (string|null);

                                    /** updated profileBio */
                                    profileBio?: (string|null);

                                    /** updated tokenVersion */
                                    tokenVersion?: (number|null);

                                    /** updated login */
                                    login?: (string|null);
                                }

                                /** Represents an updated. */
                                class updated implements Iupdated {

                                    /**
                                     * Constructs a new updated.
                                     * @param [properties] Properties to set
                                     */
                                    constructor(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iupdated);

                                    /** updated id. */
                                    public id: string;

                                    /** updated avatar. */
                                    public avatar: string;

                                    /** updated firstName. */
                                    public firstName: string;

                                    /** updated lastName. */
                                    public lastName: string;

                                    /** updated profileBio. */
                                    public profileBio: string;

                                    /** updated tokenVersion. */
                                    public tokenVersion: number;

                                    /** updated login. */
                                    public login: string;

                                    /**
                                     * Creates a new updated instance using the specified properties.
                                     * @param [properties] Properties to set
                                     * @returns updated instance
                                     */
                                    public static create(properties?: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iupdated): org.sudoku.sudoku.eventbus.events.auth.v1.user.updated;

                                    /**
                                     * Encodes the specified updated message. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.updated.verify|verify} messages.
                                     * @param message updated message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encode(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iupdated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Encodes the specified updated message, length delimited. Does not implicitly {@link org.sudoku.sudoku.eventbus.events.auth.v1.user.updated.verify|verify} messages.
                                     * @param message updated message or plain object to encode
                                     * @param [writer] Writer to encode to
                                     * @returns Writer
                                     */
                                    public static encodeDelimited(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.Iupdated, writer?: $protobuf.Writer): $protobuf.Writer;

                                    /**
                                     * Decodes an updated message from the specified reader or buffer.
                                     * @param reader Reader or buffer to decode from
                                     * @param [length] Message length if known beforehand
                                     * @returns updated
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): org.sudoku.sudoku.eventbus.events.auth.v1.user.updated;

                                    /**
                                     * Decodes an updated message from the specified reader or buffer, length delimited.
                                     * @param reader Reader or buffer to decode from
                                     * @returns updated
                                     * @throws {Error} If the payload is not a reader or valid buffer
                                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                     */
                                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): org.sudoku.sudoku.eventbus.events.auth.v1.user.updated;

                                    /**
                                     * Verifies an updated message.
                                     * @param message Plain object to verify
                                     * @returns `null` if valid, otherwise the reason why it is not
                                     */
                                    public static verify(message: { [k: string]: any }): (string|null);

                                    /**
                                     * Creates an updated message from a plain object. Also converts values to their respective internal types.
                                     * @param object Plain object
                                     * @returns updated
                                     */
                                    public static fromObject(object: { [k: string]: any }): org.sudoku.sudoku.eventbus.events.auth.v1.user.updated;

                                    /**
                                     * Creates a plain object from an updated message. Also converts values to other types if specified.
                                     * @param message updated
                                     * @param [options] Conversion options
                                     * @returns Plain object
                                     */
                                    public static toObject(message: org.sudoku.sudoku.eventbus.events.auth.v1.user.updated, options?: $protobuf.IConversionOptions): { [k: string]: any };

                                    /**
                                     * Converts this updated to JSON.
                                     * @returns JSON object
                                     */
                                    public toJSON(): { [k: string]: any };

                                    /**
                                     * Gets the default type url for updated
                                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                                     * @returns The default type url
                                     */
                                    public static getTypeUrl(typeUrlPrefix?: string): string;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
