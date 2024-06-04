// // A macro to provide `println!(..)`-style syntax for `console.log` logging.
// #[macro_export]
// macro_rules! log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t )* ).into());
//     }
// }

// // A macro to provide `println!(..)`-style syntax for `console.error` logging.
// #[macro_export]
// macro_rules! err {
//     ( $( $t:tt )* ) => {
//         web_sys::console::error_1(&format!( $( $t )* ).into());
//     }
// }

#[cfg(debug_assertions)]
#[macro_export]
macro_rules! unwrap_result_abort {
    ($expr:expr) => {
        $expr.unwrap()
    };
}

#[cfg(not(debug_assertions))]
#[macro_export]
macro_rules! unwrap_result_abort {
    ($expr:expr) => {
        match $expr {
            Ok(val) => val,
            Err(_) => std::process::abort(),
        }
    };
}

#[cfg(debug_assertions)]
#[macro_export]
macro_rules! unwrap_option_abort {
    ($expr:expr) => {
        $expr.unwrap()
    };
}

#[cfg(not(debug_assertions))]
#[macro_export]
macro_rules! unwrap_option_abort {
    ($expr:expr) => {
        match $expr {
            Some(val) => val,
            None => std::process::abort(),
        }
    };
}
