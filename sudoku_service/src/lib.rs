pub mod auth;
pub mod configuration;
pub mod controllers;
pub mod database;
pub mod middleware;
// pub mod telemetry;
pub mod kafka;
pub mod models;
pub mod proto_constants;
pub mod routes;
pub mod startup;
#[cfg(test)]
pub mod test_utils;
pub mod utils;

pub fn load_env_vars() {
    static START: std::sync::Once = std::sync::Once::new();

    START.call_once(|| {
        dotenv::dotenv().unwrap_or_else(|_| {
            panic!("ERROR: Could not load environment variables from dotenv file");
        });
    });
}

pub mod kafka_messages {
    pub mod user {
        include!(concat!(env!("OUT_DIR"), "/org.sudoku.auth.v1.user.rs"));
    }
    pub mod network_address {
        include!(concat!(
            env!("OUT_DIR"),
            "/org.sudoku.auth.v1.network_address.rs"
        ));
    }
    pub mod device {
        include!(concat!(env!("OUT_DIR"), "/org.sudoku.auth.v1.device.rs"));
    }
    pub mod device_and_network_address {
        include!(concat!(
            env!("OUT_DIR"),
            "/org.sudoku.auth.v1.device_and_network_address.rs"
        ));
    }
}
