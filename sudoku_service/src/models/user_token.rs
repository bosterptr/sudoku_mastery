use jsonwebtoken::DecodingKey;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::fs;
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
    // https://www.rfc-editor.org/rfc/rfc7519#page-10
    pub sub: Uuid,
    pub exp: usize,
}

pub static RSA_JWT_DECODING_KEY: Lazy<DecodingKey> = Lazy::new(|| {
    let path = ".";

    for entry in fs::read_dir(path).expect("Failed to read_dir") {
        let entry = entry.expect("Failed to read PEM file");
        let path = entry.path();

        if path.is_file() {
            println!("path  {}\n", path.display());
        }
    }
    let rsa_pem = fs::read("./cert/publickey.crt").expect("Failed to read PEM file");
    DecodingKey::from_rsa_pem(&rsa_pem).expect("Failed to create DecodingKey from PEM")
});
