use core::cmp::Ordering;
use std::collections::VecDeque;

use crate::{gray_image::GrayImage, point::Point, unwrap_result_abort};

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub enum BorderType {
    /// A border between a foreground region and the backround region enclosing it.
    /// All points in the border lie within the foreground region.
    Outer,
    /// A border between a foreground region and a background region contained within it.
    /// All points in the border lie within the foreground region.
    Hole,
}

#[derive(Debug)]
pub struct Contour {
    pub border_type: BorderType,
    pub parent: Option<usize>,
    pub points: Vec<Point<i32>>,
}

impl Contour {
    /// Construct a contour.
    pub fn new(points: Vec<Point<i32>>, border_type: BorderType, parent: Option<usize>) -> Self {
        Contour {
            border_type,
            parent,
            points,
        }
    }
}

/// [Graham scan algorithm]: https://en.wikipedia.org/wiki/Graham_scan
pub fn convex_hull(points_slice: &[Point<i32>]) -> Vec<Point<i32>> {
    // if points_slice.is_empty() {
    //     return Vec::new();
    // }
    let mut points: Vec<Point<i32>> = Vec::from(points_slice);
    let mut start_point_pos = 0;
    let mut start_point = points[0];
    for (i, &point) in points.iter().enumerate().skip(1) {
        if point.y < start_point.y || point.y == start_point.y && point.x < start_point.x {
            start_point_pos = i;
            start_point = point;
        }
    }
    points.swap(0, start_point_pos);
    points.remove(0);
    points.sort_by(|a, b| match orientation(start_point, *a, *b) {
        Orientation::Collinear => {
            if start_point.distance(a) < start_point.distance(b) {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        }
        Orientation::Clockwise => Ordering::Greater,
        Orientation::CounterClockwise => Ordering::Less,
    });

    let mut iter = points.iter().peekable();
    let mut remaining_points = Vec::<Point<i32>>::new();
    while let Some(mut p) = iter.next() {
        while iter.peek().is_some()
            && orientation(
                start_point.to_i32(),
                p.to_i32(),
                iter.peek().unwrap().to_i32(),
            ) == Orientation::Collinear
        {
            p = iter.next().unwrap();
        }
        remaining_points.push(*p);
    }

    let mut stack = Vec::<Point<i32>>::new();

    for p in points {
        while stack.len() > 1
            && orientation(
                stack[stack.len() - 2].to_i32(),
                stack[stack.len() - 1].to_i32(),
                p.to_i32(),
            ) != Orientation::CounterClockwise
        {
            stack.pop();
        }
        stack.push(p);
    }
    stack
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
enum Orientation {
    Collinear,
    Clockwise,
    CounterClockwise,
}

/// Determines whether p -> q -> r is a left turn, a right turn, or the points are collinear.
fn orientation(p: Point<i32>, q: Point<i32>, r: Point<i32>) -> Orientation {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    match val.cmp(&0) {
        Ordering::Equal => Orientation::Collinear,
        Ordering::Greater => Orientation::Clockwise,
        Ordering::Less => Orientation::CounterClockwise,
    }
}
#[inline]
fn get_parent(
    parent_border_num: usize,
    contours: &[Contour],
    border_type: BorderType,
) -> Option<usize> {
    if parent_border_num > 1 {
        let parent_index = parent_border_num - 2;
        let parent_contour = &contours[parent_index];
        if (border_type == BorderType::Outer) ^ (parent_contour.border_type == BorderType::Outer) {
            Some(parent_index)
        } else {
            parent_contour.parent
        }
    } else {
        None
    }
}
#[inline]
fn check_if_is_right_edge(
    diffs: &VecDeque<Point<i32>>,
    pos3: Point<usize>,
    pos4: Point<usize>,
) -> bool {
    let mut is_right_edge = false;
    for diff in diffs.iter().rev() {
        if *diff == (pos4.to_i32() - pos3.to_i32()) {
            break;
        }
        if diff.x == 1 && diff.y == 0 {
            is_right_edge = true;
            break;
        }
    }
    is_right_edge
}

/// Finds all borders of foreground regions in an image. All pixels with intensity strictly greater
/// than `threshold` are treated as belonging to the foreground.
///
/// Based on the algorithm proposed by Suzuki and Abe: Topological Structural
/// Analysis of Digitized Binary Images by Border Following.
pub fn find(image: &GrayImage<u8>) -> Vec<Contour> {
    let mut image_values = GrayImage::from(
        image.width,
        image.height,
        image.data.iter().map(|pixel| i32::from(*pixel != 0u8)).collect(),
    );
    let mut diffs = VecDeque::from(vec![
        Point::new(-1, 0),  // w
        Point::new(-1, -1), // nw
        Point::new(0, -1),  // n
        Point::new(1, -1),  // ne
        Point::new(1, 0),   // e
        Point::new(1, 1),   // se
        Point::new(0, 1),   // s
        Point::new(-1, 1),  // sw
    ]);

    let mut contours: Vec<Contour> = Vec::with_capacity(2048);
    let mut curr_border_num = 1;

    for y in 0..image_values.height {
        let mut parent_border_num = 1;

        for x in 0..image_values.width {
            if image_values.get_pixel_unchecked(x, y) == 0 {
                continue;
            }

            if let Some((adj, border_type)) = if x > 0 && image_values.get_pixel_unchecked(x, y) == 1
                && image_values.get_pixel_unchecked(x - 1, y) == 0
            {
                Some((Point::new(x - 1, y), BorderType::Outer))
            } else if x + 1 < image_values.width &&image_values.get_pixel_unchecked(x, y) > 0
                && image_values.get_pixel_unchecked(x + 1, y) == 0
            {
                if image_values.get_pixel_unchecked(x, y) > 1 {
                    parent_border_num = image_values.get_pixel_unchecked(x, y) as usize;
                }
                Some((Point::new(x + 1, y), BorderType::Hole))
            } else {
                None
            } {
                curr_border_num += 1;

                let parent = get_parent(parent_border_num, &contours, border_type);

                let mut contour_points: Vec<Point<i32>> = Vec::new();
                let curr = Point::new(x, y);
                rotate_to_value(&mut diffs, adj.to_i32() - curr.to_i32());

                if let Some(pos1) = diffs.iter().find_map(|diff| {
                    get_position_if_non_zero_pixel(&image_values, curr.to_i32() + *diff)
                }) {
                    let mut pos2 = pos1;
                    let mut pos3 = curr;

                    loop {
                        contour_points.push(Point::new(
                            unwrap_result_abort!(i32::try_from(pos3.x)),
                            unwrap_result_abort!(i32::try_from(pos3.y)),
                        ));
                        rotate_to_value(&mut diffs, pos2.to_i32() - pos3.to_i32());
                        let pos4 = diffs
                            .iter()
                            .rev() // counter-clockwise
                            .find_map(|diff| {
                                get_position_if_non_zero_pixel(&image_values, pos3.to_i32() + *diff)
                            })
                            .unwrap();

                        let is_right_edge = check_if_is_right_edge(&diffs, pos3, pos4);

                        if pos3.x + 1 == image_values.width || is_right_edge {
                            image_values.put_pixel(pos3.x, pos3.y, -curr_border_num);
                        } else if image_values.get_pixel_unchecked(pos3.x, pos3.y) == 1 {
                            image_values.put_pixel(pos3.x, pos3.y, curr_border_num);
                        }

                        if pos4 == curr && pos3 == pos1 {
                            break;
                        }

                        pos2 = pos3;
                        pos3 = pos4;
                    }
                } else {
                    contour_points.push(Point::new(x as i32, y as i32));
                    image_values.put_pixel(x, y, -curr_border_num);
                }
                contours.push(Contour::new(contour_points, border_type, parent));
            }

            if image_values.get_pixel_unchecked(x, y) != 1 {
                parent_border_num = image_values.get_pixel_unchecked(x, y).unsigned_abs() as usize;
            }
        }
    }

    contours
}

fn rotate_to_value<T: Eq + Copy>(values: &mut VecDeque<T>, value: T) {
    let rotate_pos = values.iter().position(|x| *x == value).unwrap();
    values.rotate_left(rotate_pos);
}
// #[inline]
// fn get_position_if_non_zero_pixel(
//     image: &GrayImage<i32>,
//     curr: Point<usize>,
//     diff: Point<i32>,
// ) -> Option<Point<usize>> {
//     if diff.x == -1 || diff.y == -1 || curr.x < image.width || curr.y < image.height {
//         return None;
//     }
//     if image.get_pixel(curr.x, curr.y) != 0i32 {
//         Some(Point::new(curr.x, curr.y))
//     } else {
//         None
//     }
// }
#[inline]
fn get_position_if_non_zero_pixel(
    image: &GrayImage<i32>,
    curr: Point<i32>,
) -> Option<Point<usize>> {
    let in_bounds =
        curr.x > -1 && curr.x < image.width as i32 && curr.y > -1 && curr.y < image.height as i32;

    if in_bounds && image.get_pixel_unchecked(curr.x as usize, curr.y as usize) != 0 {
        Some(Point::new(curr.x as usize, curr.y as usize))
    } else {
        None
    }
}
