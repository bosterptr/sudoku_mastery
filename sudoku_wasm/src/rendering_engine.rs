use crate::constants::{
    ANGLE_TOLERANCE, CELLS_IN_A_ROW, CELLS_IN_A_ROW_F64, DEST_MAX_COORD, GRID_STROKE,
    MIN_CELL_SIDE_LENGTH, OUTPUT_SIDE_LENGTH, OUTPUT_SIZE,
};
use crate::contours::{convex_hull, Contour};
use crate::gray_image::GrayImage;
use crate::point::Point;
use crate::polygon::draw;
use crate::unwrap_option_abort;
use crate::utils;
use crate::{approximate_polygon_dp, contours, warp};
use image::Pixel;
use image::{ColorType, Luma, Rgba};
use num::integer::Roots;
use num_traits::Pow;
use num_traits::ToPrimitive;
use std::cmp::Ordering;
use std::path::Path;
use wasm_bindgen::prelude::*;

#[inline]
fn arc_length(arc: &[Point<i32>], closed: bool) -> f64 {
    let mut length = arc.windows(2).map(|pts| pts[0].distance(&pts[1])).sum();

    if arc.len() > 2 && closed {
        length += arc[0].distance(&arc[arc.len() - 1]);
    }

    length
}

fn index_of_max_value(a: &[Point<i32>]) -> Option<usize> {
    let func = |a: &Point<i32>| -> i32 { (a.x.pow(2) + a.y.pow(2)).sqrt() };

    a.iter()
        .enumerate()
        .max_by_key(|(_, x)| func(x))
        .map(|(index, _)| index)
}

fn rotate_top_right_first(contour: &[Point<i32>; 4]) -> [Point<i32>; 4] {
    let mut contour_to_rotate = *contour;
    if let Some(bottom_right) = index_of_max_value(&contour_to_rotate) {
        contour_to_rotate.rotate_left(bottom_right);
    }
    contour_to_rotate
}
#[inline]
fn calculate_angle(a: Point<i32>, b: Point<i32>, c: Point<i32>) -> f64 {
    let ab_length = a.distance(&b);
    let bc_length = b.distance(&c);
    let ca_length = c.distance(&a);
    libm::acos(
        (bc_length.pow(2) + ab_length.pow(2) - ca_length.pow(2)) / (2.0 * bc_length * ab_length),
    )
    .to_degrees()
}

/// The provided list of points should be an open path, i.e. the first and last points must not be equal.
fn check_if_contour_is_a_square(
    approximated_contour: &[Point<i32>],
    width: u16,
    height: u16,
) -> (bool, [Point<i32>; 4]) {
    let mut sides: [Point<i32>; 4] = [
        approximated_contour[0],
        Point { x: 0i32, y: 0i32 },
        Point { x: 0i32, y: 0i32 },
        Point { x: 0i32, y: 0i32 },
    ];
    let mut side_idx: usize = 0;
    let mut angle_sum: f64 = 0.0;
    for i in 1..approximated_contour.len() {
        let p1_index = i - 1;
        let p3_index = if (i + 1) == approximated_contour.len() {
            0
        } else {
            i + 1
        };
            let angle = calculate_angle(
                approximated_contour[p1_index],
                approximated_contour[i],
                approximated_contour[p3_index],
            );
            angle_sum += angle;
            if (angle < 270.0 + ANGLE_TOLERANCE && angle > 270.0 - ANGLE_TOLERANCE)
                || (angle < 90.0 + ANGLE_TOLERANCE && angle > 90.0 - ANGLE_TOLERANCE)
            {
                side_idx += 1;
                if side_idx == 4 {
                    return (false, sides);
                }
                sides[side_idx] = approximated_contour[i];
            }
    }
    if side_idx != 3 || (angle_sum - 0f64).abs() < f64::EPSILON {
        return (false, sides);
    }
    for (i, side) in sides.iter().enumerate() {
        let p3_index = if (i + 1) == sides.len() { 0 } else { i + 1 };
        if sides[i].distance(&sides[p3_index]) < MIN_CELL_SIDE_LENGTH {
            return (false, sides);
        }

    }
    (true, sides)
}

fn find_square_parent_with_the_most_children(
    parents: &mut [(usize, u32)],
    square_contours: &[(usize, f64, [Point<i32>; 4])],
) -> Option<(usize, f64, [Point<i32>; 4])> {
    parents.sort_by(|(_, a), (_, b)| b.partial_cmp(a).unwrap_or(Ordering::Equal));
    let mut max_parent = None;
    for (parent_key, parent_of) in parents.iter() {
        if *parent_of > 3u32 {
            if let Some(square_contour) = square_contours.iter().find(|(k, _, _)| *k == *parent_key)
            {
                if square_contour.1 > 4.0 * MIN_CELL_SIDE_LENGTH * CELLS_IN_A_ROW_F64 {
                    max_parent = Some(*square_contour);
                    break;
                }
            }
        }
    }
    max_parent
}

/// The provided list of points should be an open path, i.e. the first and last points must not be equal.
fn find_the_biggest_square_contour(
    contours: &[Contour],
    epsilon: f64,
    width: u16,
    height: u16,
) -> Option<(usize, f64, [Point<i32>; 4])> {
    let mut square_contours: Vec<(usize, f64, [Point<i32>; 4])> = vec![];
    let mut parents: Vec<(usize, u32)> = Vec::<(usize, u32)>::new();
    for (key, contour) in contours.iter().enumerate() {
        if contour.points.len() > 3 {
            let hull = convex_hull(&contour.points);
            let arc_length = arc_length(&hull, true);
            if arc_length > MIN_CELL_SIDE_LENGTH * 4.0 {
                let approximated_contour: Vec<Point<i32>> =
                    approximate_polygon_dp::approximate_polygon_dp(
                        &hull,
                        epsilon * arc_length,
                        true,
                    );
                if approximated_contour.len() > 3 {
                    let (is_square, square_contour) =
                        check_if_contour_is_a_square(&approximated_contour, width, height);
                    if is_square {
                        #[cfg(debug_assertions)]
                        {
                            let new_image_buffer = image::GrayImage::new(1000, 720);
                            let color: Luma<u8> = Rgba([0, 255, 0, 255]).to_luma();
                            let _ = image::save_buffer(
                                Path::new(&format!("./images/test-{key}.png")),
                                &draw(&new_image_buffer, &approximated_contour, color),
                                1000,
                                720,
                                ColorType::L8,
                            );
                            let _ = image::save_buffer(
                                Path::new(&format!("./images/test-{key}-hull.png")),
                                &draw(&new_image_buffer, &hull, color),
                                1000,
                                720,
                                ColorType::L8,
                            );
                            let _ = image::save_buffer(
                                Path::new(&format!("./images/test-{key}-contour.png")),
                                &draw(&new_image_buffer, &hull, color),
                                1000,
                                720,
                                ColorType::L8,
                            );
                        }
                        if let Some(parent_key) = contour.parent {
                            if let Some((_, value)) =
                                parents.iter_mut().find(|(k, _)| *k == parent_key)
                            {
                                *value += 1;
                            } else {
                                parents.push((parent_key, 1));
                            }
                        }
                        square_contours.push((key, arc_length, square_contour));
                    }
                }
            }
        }
    }
    find_square_parent_with_the_most_children(&mut parents, &square_contours)
}

fn remove_grid_lines<const INPUT_MAX_COORD: u32>(image_buffer: &GrayImage<u8>) -> GrayImage<u8> {
    let mut image_buffer_without_grid_lines = GrayImage::from(
        OUTPUT_SIDE_LENGTH as usize,
        OUTPUT_SIDE_LENGTH as usize,
        Vec::from([0u8; OUTPUT_SIZE as usize]),
    );
    let cell_width = (INPUT_MAX_COORD - GRID_STROKE) / 9 - GRID_STROKE;
    for i in 0..CELLS_IN_A_ROW * CELLS_IN_A_ROW {
        let x_image_buffer =
            (i % CELLS_IN_A_ROW) * cell_width + GRID_STROKE + GRID_STROKE * (i % CELLS_IN_A_ROW);
        let y_image_buffer =
            (i / CELLS_IN_A_ROW) * cell_width + GRID_STROKE + GRID_STROKE * (i / CELLS_IN_A_ROW);
        let x_without_grid_lines = (i % CELLS_IN_A_ROW) * cell_width;
        let y_without_grid_lines = (i / CELLS_IN_A_ROW) * cell_width;
        for cell_y in 0..cell_width {
            for cell_x in 0..cell_width {
                image_buffer_without_grid_lines.put_pixel(
                    (x_without_grid_lines + cell_x) as usize,
                    (y_without_grid_lines + cell_y) as usize,
                    image_buffer.get_pixel(
                        (x_image_buffer + cell_x) as usize,
                        (y_image_buffer + cell_y) as usize,
                    ),
                );
            }
        }
    }
    image_buffer_without_grid_lines
}

/// # Panics
///
/// It will panic when image_data's length is 0, or when the data length is not equal to height.
#[must_use]
#[wasm_bindgen]
pub fn project(image_data: Vec<u8>, width: u16, height: u16, epsilon: f64) -> Vec<u8> {
    utils::set_panic_hook();
    let image_data_gray = GrayImage::from(width as usize, height as usize, image_data);
    assert!(!image_data_gray.data.is_empty());
    let image_pixel_count:usize = (width.to_u32().unwrap() * height.to_u32().unwrap()).try_into().unwrap();
    assert!(image_data_gray.data.len() == image_pixel_count);
    let contours = contours::find(&image_data_gray);
    match find_the_biggest_square_contour(&contours, epsilon, width, height) {
        Some((_, _, contour)) => {
            let rotated_contour = rotate_top_right_first(&contour);
            let mirrored_contour = [
                rotated_contour[1],
                rotated_contour[0],
                rotated_contour[3],
                rotated_contour[2],
            ];
            let mut src_coords = [(0.0, 0.0); 4];
            for i in 0..mirrored_contour.len() {
                src_coords[i] = (
                    unwrap_option_abort!(mirrored_contour[i].x.to_f64()),
                    unwrap_option_abort!(mirrored_contour[i].y.to_f64()),
                );
            }
            let warped_image = warp::to_square::<DEST_MAX_COORD>(&image_data_gray, src_coords);
            let warped_image_without_lines = remove_grid_lines::<DEST_MAX_COORD>(&warped_image);
            warped_image_without_lines.data
        }
        None => Vec::new(),
    }
}

#[cfg(test)]
mod tests {
    // wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);
    fn create_empty_rectangle(
        buffer_width: usize,
        buffer_height: usize,
        center_x: usize,
        center_y: usize,
        width: usize,
        height: usize,
    ) -> Vec<Vec<u8>> {
        // Create a buffer filled with zeros
        let mut buffer: Vec<Vec<u8>> = vec![vec![0; buffer_width]; buffer_height];

        // Calculate the starting and ending positions for the rectangle
        let half_width = width / 2;
        let half_height = height / 2;

        let start_x = if half_width > center_x {
            0
        } else {
            center_x - half_width
        };
        let end_x = (center_x + half_width).min(buffer_width - 1);

        let start_y = if half_height > center_y {
            0
        } else {
            center_y - half_height
        };
        let end_y = (center_y + half_height).min(buffer_height - 1);

        // Draw the empty rectangle (only the contour)
        for i in start_x..=end_x {
            buffer[start_y][i] = 255; // Top side
            buffer[end_y][i] = 255; // Bottom side
        }

        for row in buffer.iter_mut().take(end_y + 1).skip(start_y) {
            row[start_x] = 255; // Left side
            row[end_x] = 255; // Right side
        }

        buffer
    }

    use std::path::Path;

    use image::ColorType;

    use super::*;
    #[test]
    fn find_parents_with_square_contours_should_pass() {
        let test_image = image::io::Reader::open("./test4.png")
            .unwrap()
            .decode()
            .unwrap()
            .to_luma8()
            .to_vec();
        // test_image.to_luma8().as_slice();
        // let _ = image::save_buffer(
        //     Path::new(&"./TEST_IMAGE_BUFFER.png".to_string()),
        //     &TEST_IMAGE_BUFFER,
        //     u32::try_from(TEST_IMAGE_WIDTH).unwrap(),
        //     u32::try_from(TEST_IMAGE_HEIGHT).unwrap(),
        //     ColorType::L8,
        // );
        let projected_contour = project(test_image, 1000, 720, 0.008);
        let _ = image::save_buffer(
            Path::new(&"./image.png".to_string()),
            &projected_contour,
            OUTPUT_SIDE_LENGTH,
            OUTPUT_SIDE_LENGTH,
            ColorType::L8,
        );

        // let center_x: usize = unwrap_result_abort!((CELLS_IN_A_ROW * CELL_MIN_WIDTH).try_into());
        // let center_y: usize = unwrap_result_abort!((CELLS_IN_A_ROW * CELL_MIN_WIDTH).try_into());
        // let width: usize = unwrap_result_abort!((CELLS_IN_A_ROW * CELL_DESIRED_WIDTH).try_into());
        // let height: usize = unwrap_result_abort!((CELLS_IN_A_ROW * CELL_DESIRED_WIDTH).try_into());
        // let buffer_height: usize =
        //     unwrap_result_abort!((CELLS_IN_A_ROW * CELL_MIN_WIDTH * 2).try_into());
        // let buffer_width: usize =
        //     unwrap_result_abort!((CELLS_IN_A_ROW * CELL_MIN_WIDTH * 2).try_into());
        // let rectangle_buffer: Vec<Vec<u8>> = create_empty_rectangle(
        //     buffer_width,
        //     buffer_height,
        //     center_x,
        //     center_y,
        //     width,
        //     height,
        // );

        // for row in &rectangle_buffer {
        //         print!("{cell}");
        //     }
        //     println!();
        // };
        // let default_epsilon: f64 = 0.000001;
        // for n in 1..100{
        // let image_data_gray = GrayImage::from_raw(500, 500, TEST_IMAGE_BUFFER.to_vec()).unwrap_result_abort!();
        // // let canny_result = imageproc::edges::canny(&image_data_gray,low_threshold,high_threshold);
        // let contours = find_contours(&image_data_gray);
        // let _ = image::save_buffer(Path::new(&format!("./image.png")), &image_data_gray, 500, 500, ColorType::L8);
        // let (parents_with_square_contours,image_data_gray) = find_parents_with_square_contours(&contours,image_data_gray,0.05);
        // let _ = image::save_buffer(Path::new(&format!("./image2.png")), &image_data_gray, 500, 500, ColorType::L8);

        // }
        // let contours = find_contours::<u8>(&image_buffer);
        // let square: Contour<u8> = Contour {
        //     border_type: BorderType::Outer,
        //     points: vec![
        //         Point { x: 0, y: 0 },
        //         Point { x: 0, y: 20 },
        //         Point { x: 20, y: 20 },
        //         Point { x: 20, y: 0 },
        //     ],
        //     parent: None,
        // };
        // let contours: Vec<Contour<u8>> = vec![square];
        // let result = find_parents_with_square_contours(&contours);
        // println!("{result:?}");
    }
}
