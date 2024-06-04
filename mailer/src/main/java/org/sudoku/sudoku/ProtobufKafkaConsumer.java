package org.sudoku.sudoku;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.DeviceAndNetworkAddressProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.network_address.NetworkAddressProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.user.UserProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.device.DeviceProto;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;

public class ProtobufKafkaConsumer {
    public static void main(String[] args) {
        Properties properties = new Properties();
        String bootstrapServers = System.getenv("KAFKA_BOOTSTRAP_SERVERS");
        if (bootstrapServers == null || bootstrapServers.isEmpty()) {
            bootstrapServers = "localhost:9092";
            System.out
                    .println("Environment variable KAFKA_BOOTSTRAP_SERVERS not set. Using default " + bootstrapServers);
                }
        String baseUrl = System.getenv("BASE_URL");
        if (baseUrl == null || baseUrl.isEmpty()) {
            baseUrl = "http://localhost";
            System.out.println("Environment variable BASE_URL not set. Using default " + baseUrl);
        }
        String appName = System.getenv("APP_NAME");
        if (appName == null || appName.isEmpty()) {
            appName = "Sudoku Mastery";
            System.out.println("Environment variable APP_NAME not set. Using default " + appName);
        }
        properties.setProperty("bootstrap.servers", bootstrapServers);
        properties.setProperty("group.id", "mailer");
        properties.setProperty("auto.offset.reset", "earliest");
        properties.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.setProperty("value.deserializer", "org.apache.kafka.common.serialization.ByteArrayDeserializer");

        KafkaConsumer<String, byte[]> consumer = new KafkaConsumer<>(properties);
        consumer.subscribe(Arrays.asList("auth.fct.user.created_not_activated.0",
        "auth.fct.device_and_network_address.detected_not_approved.0",
        "auth.fct.device.detected_not_approved.0",
        "auth.fct.network_address.created_not_activated.0",
        "auth.fct.user.requested_new_password.0",
        "auth.fct.user.email_is_already_registered.0"));
        System.out.println("Subscribed to topics");
        EmailController controller = new EmailController(baseUrl, appName);
        try {
            while (true) {
                ConsumerRecords<String, byte[]> records = consumer.poll(Duration.ofMillis(100));
                if (records.isEmpty()) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException ie) {
                        System.err.println("Consumer interrupted: " + ie.getMessage());
                        Thread.currentThread().interrupt();
                    }
                } else {
                    for (ConsumerRecord<String, byte[]> record : records) {
                        System.out.println("record" + record.topic());
                        switch (record.topic()) {
                            case "auth.fct.user.created_not_activated.0":
                                try {
                                    UserProto.created_not_activated eventData = UserProto.created_not_activated
                                            .parseFrom(record.value());
                                    controller.sendActivationEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            case "auth.fct.device_and_network_address.detected_not_approved.0":
                                try {
                                    DeviceAndNetworkAddressProto.detected_not_approved eventData = DeviceAndNetworkAddressProto.detected_not_approved
                                            .parseFrom(record.value());
                                    controller.sendDeviceAndNetworkConfirmationEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            case "auth.fct.device.detected_not_approved.0":
                                try {
                                    DeviceProto.detected_not_approved eventData = DeviceProto.detected_not_approved
                                            .parseFrom(record.value());
                                    controller.sendDeviceConfirmationEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            case "auth.fct.network_address.created_not_activated.0":
                                try {
                                    NetworkAddressProto.detected_not_approved eventData = NetworkAddressProto.detected_not_approved
                                            .parseFrom(record.value());
                                    controller.sendNetworkConfirmationEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            case "auth.fct.user.requested_new_password.0":
                                try {
                                    UserProto.requested_new_password eventData = UserProto.requested_new_password
                                            .parseFrom(record.value());
                                    controller.sendNewPasswordnEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            case "auth.fct.user.email_is_already_registered.0":
                                try {
                                    UserProto.email_is_already_registered eventData = UserProto.email_is_already_registered
                                            .parseFrom(record.value());
                                    controller.sendEmailIsAreadyRegisteredEmail(eventData);
                                } catch (Exception e) {
                                    System.err.println("Error parsing the message: " + e.getMessage());
                                }
                                break;
                            default:
                                System.out.println("Unknown topic: " + record.topic());
                        }
                    }
                }
            }
        } finally {
            consumer.close();
        }
    }
}
