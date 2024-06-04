pub struct GrayImage<T> {
    pub width: usize,
    pub height: usize,
    pub data: Vec<T>,
}

impl<T: Clone + Copy + num_traits::Zero> GrayImage<T> {
    pub fn new(width: usize, height: usize) -> GrayImage<T> {
        GrayImage {
            data: vec![T::zero(); width * height],
            width,
            height,
        }
    }
    pub fn from(width: usize, height: usize, data: Vec<T>) -> GrayImage<T> {
        GrayImage {
            width,
            height,
            data,
        }
    }
    #[inline]
    pub fn get_pixel(&self, x: usize, y: usize) -> T {
        self.data[self.width * y + x]
    }
    #[inline]
    pub fn get_pixel_unchecked(&self, x: usize, y: usize) -> T {
        unsafe { *self.data.get_unchecked(self.width * y + x) }
    }
    #[inline]
    pub fn put_pixel(&mut self, x: usize, y: usize, pixel: T) {
        self.data[self.width * y + x] = pixel;
    }
}
