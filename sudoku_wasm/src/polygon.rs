use crate::point::Point;
use core::cmp::{max, min};
use core::f32;
use core::i32;
use image::{GenericImage, ImageBuffer};
use imageproc::definitions::Image;
use imageproc::drawing::{draw_line_segment_mut, Canvas};

/// Draws a polygon and its contents on a new copy of an image.
///
/// Draws as much of a filled polygon as lies within image bounds. The provided
/// list of points should be an open path, i.e. the first and last points must not be equal.
/// An implicit edge is added from the last to the first point in the slice.
#[must_use = "the function does not modify the original image"]
pub fn draw<I>(image: &I, poly: &[Point<i32>], color: I::Pixel) -> Image<I::Pixel>
where
    I: GenericImage,
{
    let mut out = ImageBuffer::new(image.width(), image.height());
    out.copy_from(image, 0, 0).unwrap();
    draw_mut(&mut out, poly, color);
    out
}

/// Draws a polygon and its contents on an image in place.
///
/// Draws as much of a filled polygon as lies within image bounds. The provided
/// list of points should be an open path, i.e. the first and last points must not be equal.
/// An implicit edge is added from the last to the first point in the slice.
pub fn draw_mut<C>(canvas: &mut C, poly: &[Point<i32>], color: C::Pixel)
where
    C: Canvas,
{
    if poly.is_empty() {
        return;
    }
    assert!(
        poly[0] != poly[poly.len() - 1],
        "First point == last point",
    );

    let mut y_min = i32::MAX;
    let mut y_max = i32::MIN;
    for p in poly {
        y_min = min(y_min, p.y);
        y_max = max(y_max, p.y);
    }

    let (width, height) = canvas.dimensions();

    // Intersect polygon vertical range with image bounds
    y_min = max(0, min(y_min, height as i32 - 1));
    y_max = max(0, min(y_max, height as i32 - 1));

    let mut closed: Vec<Point<i32>> = poly.to_vec();
    closed.push(poly[0]);

    let edges: Vec<&[Point<i32>]> = closed.windows(2).collect();
    let mut intersections = Vec::new();

    for y in y_min..=y_max {
        for edge in &edges {
            if edge[0].y <= y && edge[1].y >= y || edge[1].y <= y && edge[0].y >= y {
                if edge[0].y == edge[1].y {
                    // Need to handle horizontal lines specially
                    intersections.push(edge[0].x);
                    intersections.push(edge[1].x);
                } else if edge[0].y == y || edge[1].y == y {
                    if edge[1].y > y {
                        intersections.push(edge[0].x);
                    }
                    if edge[0].y > y {
                        intersections.push(edge[1].x);
                    }
                } else {
                    let fraction = (y - edge[0].y) as f32 / (edge[1].y - edge[0].y) as f32;
                    let inter = edge[0].x as f32 + fraction * (edge[1].x - edge[0].x) as f32;
                    intersections.push(inter.round() as i32);
                }
            }
        }

        intersections.sort_unstable();
        intersections.chunks(2).for_each(|range| {
            let mut from = min(range[0], width as i32);
            let mut to = min(range[1], width as i32 - 1);
            if from < width as i32 && to >= 0 {
                // draw only if range appears on the canvas
                from = max(0, from);
                to = max(0, to);

                for x in from..=to {
                    canvas.draw_pixel(x as u32, y as u32, color);
                }
            }
        });

        intersections.clear();
    }

    for edge in &edges {
        let start = (edge[0].x as f32, edge[0].y as f32);
        let end = (edge[1].x as f32, edge[1].y as f32);
        draw_line_segment_mut(canvas, start, end, color);
    }
}


#[cfg(test)]
mod tests {
    use image::{Luma, Pixel, Rgba};

    use super::*;
    #[test]
    fn return_if_poly_is_empty() {
        let color: Luma<u8> = Rgba([0, 255, 0, 255]).to_luma();
        let mut buf = ImageBuffer::new(2,2);
        let buf_to_compare = buf.clone();
        draw_mut(&mut buf,&[],color);
        assert_eq!(
            buf,
            buf_to_compare
        );
    }
   
}
