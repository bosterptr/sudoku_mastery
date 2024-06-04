extern crate prost_build;

fn main() {
    prost_build::compile_protos(
        &[
            "src/proto/auth/v1/auth.device.added_to_user.proto",
            "src/proto/auth/v1/auth.device.detected_not_approved.proto",
            "src/proto/auth/v1/auth.device_and_network_address.detected_not_approved.proto",
            "src/proto/auth/v1/auth.network_address.added_to_user.proto",
            "src/proto/auth/v1/auth.network_address.detected_not_approved.proto",
            "src/proto/auth/v1/auth.user.changed_password.proto",
            "src/proto/auth/v1/auth.user.created.proto",
            "src/proto/auth/v1/auth.user.created_not_activated.proto",
            "src/proto/auth/v1/auth.user.email_is_already_registered.proto",
            "src/proto/auth/v1/auth.user.requested_new_password.proto",
            "src/proto/auth/v1/auth.user.updated.proto",
        ],
        &["src/"],
    )
    .unwrap();
}
