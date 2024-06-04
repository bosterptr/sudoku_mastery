use crate::point::{Line, Point};

/// Approximates a polygon using the [Douglas–Peucker algorithm].
///
/// [Douglas–Peucker algorithm]: https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
pub fn approximate_polygon_dp(curve: &[Point<i32>], epsilon: f64, closed: bool) -> Vec<Point<i32>> {
    if epsilon <= 0.0 {
        let epsilon = epsilon.abs();
    }

    // Find the point with the maximum distance
    let mut dmax = 0.0;
    let mut index = 0;
    let end = curve.len() - 1;
    let line = Line::from_points(curve[0].to_f64(), curve[end].to_f64());
    for (i, point) in curve.iter().enumerate().skip(1) {
        let d = line.distance_from_point(point.to_f64());
        if d > dmax {
            index = i;
            dmax = d;
        }
    }

    let mut res = Vec::new();

    // If max distance is greater than epsilon, recursively simplify
    if dmax > epsilon {
        // Recursive call
        let mut partial1 = approximate_polygon_dp(&curve[0..=index], epsilon, false);
        let mut partial2 = approximate_polygon_dp(&curve[index..=end], epsilon, false);

        // Build the result list
        partial1.pop();
        res.append(&mut partial1);
        res.append(&mut partial2);
    } else {
        res.push(curve[0]);
        res.push(curve[end]);
    }

    if closed {
        res.pop();
    }

    res
}
