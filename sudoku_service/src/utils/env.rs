/// # Panics
///
/// Will panic if can't not load environment variables from dotenv file
pub fn load_env_vars() {
    static START: std::sync::Once = std::sync::Once::new();

    START.call_once(|| {
        dotenv::dotenv().unwrap_or_else(|_| {
            panic!("ERROR: Could not load environment variables from dotenv file");
        });
    });
}
