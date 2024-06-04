use crate::{gray_image::GrayImage, unwrap_option_abort};
use approx::AbsDiffEq;

// #[inline]
// fn interpolate_nearest(image: &GrayImage<u8>, x: usize, y: usize, default: u8) -> u8 {
//     if x >= image.width || y >= image.height {
//         default
//     } else {
//         image.get_pixel(x, y)
//     }
// }

// // Classifies transformation by looking up transformation matrix coefficients
// fn class_from_matrix(mx: [f64; 9]) -> TransformationClass {
//     if (mx[6] - 0.0).abs() < 1e-10 && (mx[7] - 0.0).abs() < 1e-10 && (mx[8] - 1.0).abs() < 1e-10 {
//         if (mx[0] - 1.0).abs() < 1e-10
//             && (mx[1] - 0.0).abs() < 1e-10
//             && (mx[3] - 0.0).abs() < 1e-10
//             && (mx[4] - 1.0).abs() < 1e-10
//         {
//             TransformationClass::Translation
//         } else {
//             TransformationClass::Affine
//         }
//     } else {
//         TransformationClass::Projection
//     }
// }

fn normalize(mx: [f64; 9]) -> [f64; 9] {
    [
        mx[0] / mx[8],
        mx[1] / mx[8],
        mx[2] / mx[8],
        mx[3] / mx[8],
        mx[4] / mx[8],
        mx[5] / mx[8],
        mx[6] / mx[8],
        mx[7] / mx[8],
        1.0,
    ]
}

fn try_inverse(t: &[f64; 9]) -> Option<[f64; 9]> {
    let m00 = t[4] * t[8] - t[5] * t[7];
    let m01 = t[3] * t[8] - t[5] * t[6];
    let m02 = t[3] * t[7] - t[4] * t[6];

    let det = t[0] * m00 - t[1] * m01 + t[2] * m02;

    if det.abs() < 1e-10 {
        return None;
    }

    let m10 = t[1] * t[8] - t[2] * t[7];
    let m11 = t[0] * t[8] - t[2] * t[6];
    let m12 = t[0] * t[7] - t[1] * t[6];
    let m20 = t[1] * t[5] - t[2] * t[4];
    let m21 = t[0] * t[5] - t[2] * t[3];
    let m22 = t[0] * t[4] - t[1] * t[3];

    #[rustfmt::skip]
    let inv = [
         m00 / det, -m10 / det,  m20 / det,
        -m01 / det,  m11 / det, -m21 / det,
         m02 / det, -m12 / det,  m22 / det,
    ];

    Some(normalize(inv))
}

#[derive(Copy, Clone, Debug)]
pub struct Projection {
    transform: [f64; 9],
    inverse: [f64; 9],
}

impl Projection {
    /// Inverts the transformation.
    pub fn invert(self) -> Projection {
        Projection {
            transform: self.inverse,
            inverse: self.transform,
        }
    }

    /// Calculates a projection from a set of four control point pairs.
    pub fn from_control_points(from: [(f64, f64); 4], to: [(f64, f64); 4]) -> Option<Projection> {
        use nalgebra::{linalg::SVD, OMatrix, OVector, U8};

        #[rustfmt::skip]
        let a = OMatrix::<_, U8, U8>::from_row_slice(&[
            0.0, 0.0, 0.0, -from[0].0, -from[0].1, -1.0,  to[0].1 * from[0].0,  to[0].1 * from[0].1,
            from[0].0, from[0].1, 1.0,  0.0,  0.0,  0.0, -to[0].0 * from[0].0, -to[0].0 * from[0].1,
            0.0, 0.0, 0.0, -from[1].0, -from[1].1, -1.0,  to[1].1 * from[1].0,  to[1].1 * from[1].1,
            from[1].0, from[1].1, 1.0,  0.0,  0.0,  0.0, -to[1].0 * from[1].0, -to[1].0 * from[1].1,
            0.0, 0.0, 0.0, -from[2].0, -from[2].1, -1.0,  to[2].1 * from[2].0,  to[2].1 * from[2].1,
            from[2].0, from[2].1, 1.0,  0.0,  0.0,  0.0, -to[2].0 * from[2].0, -to[2].0 * from[2].1,
            0.0, 0.0, 0.0, -from[3].0, -from[3].1, -1.0,  to[3].1 * from[3].0,  to[3].1 * from[3].1,
            from[3].0, from[3].1, 1.0,  0.0,  0.0,  0.0, -to[3].0 * from[3].0, -to[3].0 * from[3].1,
        ]);

        let b = OVector::<_, U8>::from_row_slice(&[
            -to[0].1, to[0].0, -to[1].1, to[1].0, -to[2].1, to[2].0, -to[3].1, to[3].0,
        ]);

        SVD::try_new(a, true, true, f64::default_epsilon(), 0)
            .and_then(|svd| svd.solve(&b, f64::default_epsilon()).ok())
            .and_then(|h| {
                let mut transform = [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1.0];

                transform = normalize(transform);
                try_inverse(&transform).map(|inverse| Projection {
                    transform,
                    inverse,
                })
            })
    }

    // Helper functions used as optimization in warp.
    #[inline]
    fn map_projective(&self, x: f64, y: f64) -> (usize, usize) {
        let t = &self.transform;
        let d = t[6] * x + t[7] * y + t[8];
        (
            ((t[0] * x + t[1] * y + t[2]) / d) as usize,
            ((t[3] * x + t[4] * y + t[5]) / d) as usize,
        )
    }
}

pub fn to_square<const DEST_SIDE_LENGTH: u32>(
    image: &GrayImage<u8>,
    from: [(f64, f64); 4],
) -> GrayImage<u8> {
    let mut out_image = GrayImage::new(DEST_SIDE_LENGTH as usize, DEST_SIDE_LENGTH as usize);
    let projection = unwrap_option_abort!(Projection::from_control_points(
        from,
        [
            (0.0, 0.0),
            (f64::from(DEST_SIDE_LENGTH), 0.0),
            (f64::from(DEST_SIDE_LENGTH), f64::from(DEST_SIDE_LENGTH)),
            (0.0, f64::from(DEST_SIDE_LENGTH)),
        ]
    ));
    let projection = projection.invert();
    let mapping = |x: f64, y: f64| projection.map_projective(x, y);
    out_image
        .data
        .chunks_mut(DEST_SIDE_LENGTH as usize)
        .enumerate()
        .for_each(|(y, row)| {
            for (x, pixel) in row.iter_mut().enumerate() {
                let (px, py) = mapping(x as f64, y as f64);
                *pixel = image.get_pixel(px, py);
            }
        });
    out_image
}
