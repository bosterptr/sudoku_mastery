//! A 2d point type.

use num::{Num, NumCast};
use std::ops::{Add, Sub};

use crate::unwrap_option_abort;

/// A 2d point.
#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Point<T> {
    /// x-coordinate.
    pub x: T,
    /// y-coordinate.
    pub y: T,
}

impl<T> Point<T> {
    /// Construct a point at (x, y).
    pub fn new(x: T, y: T) -> Point<T> {
        Point::<T> { x, y }
    }
}

impl<T: Num> Add for Point<T> {
    type Output = Self;

    fn add(self, other: Point<T>) -> Point<T> {
        Point::new(self.x + other.x, self.y + other.y)
    }
}

impl<T: Num> Sub for Point<T> {
    type Output = Self;

    fn sub(self, other: Point<T>) -> Point<T> {
        Point::new(self.x - other.x, self.y - other.y)
    }
}

impl<T: NumCast> Point<T> {
    /// Converts to a Point<f64>. Panics if the cast fails.
    pub fn to_f64(&self) -> Point<f64> {
        Point::new(
            unwrap_option_abort!(self.x.to_f64()),
            unwrap_option_abort!(self.y.to_f64()),
        )
    }

    /// Converts to a Point<i32>. Panics if the cast fails.
    pub fn to_i32(&self) -> Point<i32> {
        Point::new(
            unwrap_option_abort!(self.x.to_i32()),
            unwrap_option_abort!(self.y.to_i32()),
        )
    }

    /// Returns the Euclidean distance between two points.
    pub fn distance(&self, p2: &Point<T>) -> f64 {
        self.distance_sq(p2).sqrt()
    }
    /// Returns the square of the Euclidean distance between two points.
    fn distance_sq(&self, p2: &Point<T>) -> f64 {
        let self_f64 = self.to_f64();
        let p2 = p2.to_f64();
        (self_f64.x - p2.x).powf(2.0) + (self_f64.y - p2.y).powf(2.0)
    }
}

/// A line of the form Ax + By + C = 0.
#[derive(Debug, Copy, Clone, PartialEq)]
pub(crate) struct Line {
    a: f64,
    b: f64,
    c: f64,
}

impl Line {
    /// Returns the `Line` that passes through p and q.
    pub fn from_points(p1: Point<f64>, p2: Point<f64>) -> Line {
        let a_side = p1.y - p2.y;
        let b_side = p2.x - p1.x;
        let c_side = p1.x * p2.y - p2.x * p1.y;
        Line {
            a: a_side,
            b: b_side,
            c: c_side,
        }
    }

    /// Computes the shortest distance from this line to the given point.
    pub fn distance_from_point(&self, point: Point<f64>) -> f64 {
        let Line { a, b, c } = self;
        (a * point.x + b * point.y + c).abs() / (a.powf(2.0) + b.powf(2.)).sqrt()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use assert_approx_eq::assert_approx_eq;
    #[test]
    fn line_from_points() {
        let p = Point::new(5.0, 7.0);
        let q = Point::new(10.0, 3.0);
        assert_eq!(
            Line::from_points(p, q),
            Line {
                a: 4.0,
                b: 5.0,
                c: -55.0
            }
        );
    }

    #[test]
    fn distance_between_line_and_point() {
        assert_approx_eq!(
            Line {
                a: 8.0,
                b: 7.0,
                c: 5.0
            }
            .distance_from_point(Point::new(2.0_f64, 3.0f64)),
            3.951_027_647_2,
            1e-10
        );
    }
}
