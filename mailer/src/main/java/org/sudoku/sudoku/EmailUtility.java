package org.sudoku.sudoku;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class EmailUtility {
    public static void sendEmail(String to, String subject, String content) throws MessagingException {
        String from = System.getenv("EMAIL_FROM");
        String passowrd = System.getenv("EMAIL_PASSWORD");
        String host = System.getenv("SMTP_HOST");

        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        properties.put("mail.smtp.port", System.getenv("SMTP_PORT"));
        properties.put("mail.smtp.auth", System.getenv("SMTP_AUTH"));
        properties.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, passowrd);
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        message.setSubject(subject);
        message.setText(content);

        Transport.send(message);
    }
}