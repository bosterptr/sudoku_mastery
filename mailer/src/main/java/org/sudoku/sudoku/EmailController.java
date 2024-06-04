package org.sudoku.sudoku;

import java.util.HashMap;
import java.util.Map;
import javax.mail.MessagingException;

import org.sudoku.sudoku.eventbus.events.auth.v1.device.DeviceProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.device_and_network_address.DeviceAndNetworkAddressProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.network_address.NetworkAddressProto;
import org.sudoku.sudoku.eventbus.events.auth.v1.user.UserProto;

import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgent.ImmutableUserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

public class EmailController {
    private EmailTemplateService emailTemplateEngine;
    private String baseUrl;
    private String appName;
    private UserAgentAnalyzer uaa;

    public EmailController(String baseUrl, String appName) {
        this.emailTemplateEngine = new EmailTemplateService();
        this.baseUrl = baseUrl;
        this.appName = appName;
        this.uaa = UserAgentAnalyzer
                .newBuilder()
                .hideMatcherLoadStats()
                .withCache(10000)
                .build();
    }

    public void sendActivationEmail(UserProto.created_not_activated eventData) throws MessagingException {
            Map<String, Object> variables = new HashMap<>();
            variables.put("APP_NAME", appName);
            variables.put("urlWithToken",
            baseUrl + "/auth/activate/" + eventData.getActivationToken());
            String emailContent = emailTemplateEngine.buildEmail("activationEmail", variables);
        EmailUtility.sendEmail(eventData.getUserEmail(),
                "Thank you for registering your " + appName + " account.", emailContent);
    }

    public void sendEmailIsAreadyRegisteredEmail(UserProto.email_is_already_registered eventData)
            throws MessagingException {
        ImmutableUserAgent agent = uaa.parse(eventData.getDeviceUa());
        Map<String, Object> variables = new HashMap<>();
        variables.put("APP_NAME", appName);
        variables.put("ip", eventData.getIp());
        variables.put("browserName", agent.getValue(UserAgent.AGENT_NAME));
        variables.put("osName", agent.getValue(UserAgent.OPERATING_SYSTEM_NAME));
        variables.put("osVersion", agent.getValue(UserAgent.OPERATING_SYSTEM_VERSION));
        variables.put("deviceType", agent.getValue(UserAgent.DEVICE_CLASS));
        variables.put("deviceVendor", agent.getValue(UserAgent.DEVICE_BRAND));
        variables.put("deviceModel", agent.getValue(UserAgent.DEVICE_NAME));
        String emailContent = emailTemplateEngine.buildEmail("alreadyRegistered", variables);
        EmailUtility.sendEmail(eventData.getUserEmail(),
                "Someone tried to register an account with your email address.", emailContent);
    }

    public void sendDeviceAndNetworkConfirmationEmail(DeviceAndNetworkAddressProto.detected_not_approved eventData)
            throws MessagingException {
        ImmutableUserAgent agent = uaa.parse(eventData.getDeviceUa());
        Map<String, Object> variables = new HashMap<>();
        variables.put("APP_NAME", appName);
        variables.put("ip", eventData.getIpv4());
        variables.put("token", eventData.getToken());
        variables.put("browserName", agent.getValue(UserAgent.AGENT_NAME));
        variables.put("osName", agent.getValue(UserAgent.OPERATING_SYSTEM_NAME));
        variables.put("osVersion", agent.getValue(UserAgent.OPERATING_SYSTEM_VERSION));
        variables.put("deviceType", agent.getValue(UserAgent.DEVICE_CLASS));
        variables.put("deviceVendor", agent.getValue(UserAgent.DEVICE_BRAND));
        variables.put("deviceModel", agent.getValue(UserAgent.DEVICE_NAME));
        String emailContent = emailTemplateEngine.buildEmail("deviceAndNetworkConfirmation", variables);
        EmailUtility.sendEmail(eventData.getUserEmail(),
                "Access from an unknown device and network address", emailContent);
    }

    public void sendDeviceConfirmationEmail(DeviceProto.detected_not_approved eventData) throws MessagingException {
        ImmutableUserAgent agent = uaa.parse(eventData.getDeviceUa());
        Map<String, Object> variables = new HashMap<>();
        variables.put("APP_NAME", appName);
        variables.put("token", eventData.getToken());
        variables.put("ip", eventData.getIpv4());
        variables.put("browserName", agent.getValue(UserAgent.AGENT_NAME));
        variables.put("osName", agent.getValue(UserAgent.OPERATING_SYSTEM_NAME));
        variables.put("osVersion", agent.getValue(UserAgent.OPERATING_SYSTEM_VERSION));
        variables.put("deviceType", agent.getValue(UserAgent.DEVICE_CLASS));
        variables.put("deviceVendor", agent.getValue(UserAgent.DEVICE_BRAND));
        variables.put("deviceModel", agent.getValue(UserAgent.DEVICE_NAME));
        String emailContent = emailTemplateEngine.buildEmail("deviceConfirmation", variables);
        EmailUtility.sendEmail(eventData.getUserEmail(),
                "Access from an unknown device", emailContent);
    }

    public void sendNetworkConfirmationEmail(NetworkAddressProto.detected_not_approved eventData)
            throws MessagingException {
        ImmutableUserAgent agent = uaa.parse(eventData.getDeviceUa());
        Map<String, Object> variables = new HashMap<>();
        variables.put("APP_NAME", appName);
        variables.put("token", eventData.getToken());
        variables.put("ip", eventData.getIpv4());
        variables.put("browserName", agent.getValue(UserAgent.AGENT_NAME));
        variables.put("osName", agent.getValue(UserAgent.OPERATING_SYSTEM_NAME));
        variables.put("osVersion", agent.getValue(UserAgent.OPERATING_SYSTEM_VERSION));
        variables.put("deviceType", agent.getValue(UserAgent.DEVICE_CLASS));
        variables.put("deviceVendor", agent.getValue(UserAgent.DEVICE_BRAND));
        variables.put("deviceModel", agent.getValue(UserAgent.DEVICE_NAME));
        String emailContent = emailTemplateEngine.buildEmail("networkConfirmation", variables);
        EmailUtility.sendEmail(eventData.getUserEmail(),
                "Access from an unknown network address", emailContent);
    }

    public void sendNewPasswordnEmail(UserProto.requested_new_password eventData) throws MessagingException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("APP_NAME", appName);
        variables.put("urlWithToken", baseUrl + "/auth/newPassword/" + eventData.getToken());
        String emailContent = emailTemplateEngine.buildEmail("newPasswordEmail", variables);
        EmailUtility.sendEmail(eventData.getEmail(),
                "Reset your password", emailContent);
    }
}
