pub mod user_topics {
    pub const CREATED: &str = "auth.fct.user.created.0";
    pub const UPDATED: &str = "auth.fct.user.updated.0";
    pub const CHANGED_PASSWORD: &str = "auth.fct.user.changed_password.0";
    pub const REQUESTED_NEW_PASSWORD: &str = "auth.fct.user.requested_new_password.0";
    pub const EMAIL_IS_ALREADY_REGISTERED: &str = "auth.fct.user.email_is_already_registered.0";
}

pub mod device_topics {
    pub const DETECTED_NOT_APPROVED: &str = "auth.fct.device.detected_not_approved.0";
    pub const ADDED_TO_USER: &str = "auth.fct.device.added_to_user.0";
}
pub mod network_address_topics {
    pub const DETECTED_NOT_APPROVED: &str = "auth.fct.network_address.detected_not_approved.0";
    pub const ADDED_TO_USER: &str = "auth.fct.network_address.added_to_user.0";
}
pub mod device_and_network_address_topics {
    pub const DETECTED_NOT_APPROVED: &str =
        "auth.fct.device_and_network_address.detected_not_approved.0";
}
