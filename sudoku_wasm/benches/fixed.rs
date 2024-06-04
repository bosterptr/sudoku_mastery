use criterion::{black_box, criterion_group, criterion_main, Criterion};
use sudoku_wasm::rendering_engine::project;
// use lazy_static::lazy_static;
// lazy_static! {
//     static ref TEST_IMAGE: Vec<u8> =
//         image::io::Reader::open("./test3.png")
//     .unwrap()
//     .decode()
//     .unwrap().to_luma8().to_vec();
// }

fn bench_project(c: &mut Criterion) {
    let test_image = image::io::Reader::open("./test3.png")
        .unwrap()
        .decode()
        .unwrap()
        .to_luma8()
        .to_vec();
    let mut group = c.benchmark_group("project");
    let image_data = black_box(test_image);
    // group.bench_function("dynamic_project", |b|
    //     b.iter(|| project(image_data.clone(), 1000,720,0.04)));
    group.bench_function("fixed_project", |b| {
        b.iter(|| project(image_data.clone(), 1000, 720, 0.02))
    });
}

criterion_group!(benches, bench_project);
criterion_main!(benches);
