#![deny(clippy::all)]
#![warn(clippy::pedantic)]
#![warn(clippy::cargo)]

mod approximate_polygon_dp;
mod constants;
mod contours;
mod gray_image;
mod macros;
mod point;
mod polygon;
pub mod rendering_engine;
mod utils;
mod warp;
mod solve;

// use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
// pub fn main_js() -> Result<(), JsValue> Gg{
//     utils::set_panic_hook();
//     Ok(())
// }
