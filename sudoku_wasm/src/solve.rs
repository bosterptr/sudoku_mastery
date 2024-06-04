use crate::utils;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[must_use]
pub fn solve(string_to_check: &str) -> String {
    utils::set_panic_hook();
    match sudoku::Sudoku::from_str_line(string_to_check) {
        Ok(sud) => match sud.solve_one() {
            Some(solved) => solved.to_string(),
            None => String::new(),
        },
        Err(_) => String::new(),
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn it_should_solve_solvable_sudoku() {
        let solvable_sudoku = "3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..";
        let solved_sudoku = "378415962429763185561928374984672531257831649613549827832157496745396218196284753";
        let result = solve(solvable_sudoku);
        assert_eq!(
            result,
            solved_sudoku
        );
    }
    #[test]
    fn it_should_empty_string_when_cant_solve() {
        let unsolvable_sudoku = "444444444444444444444444444444444444444444444444444444444444444444444444444444444";
        let result = solve(unsolvable_sudoku);
        assert_eq!(
            result,
            ""
        );
    }
    #[test]
    fn it_should_empty_string_when_errors() {
        let unsolvable_sudoku = "";
        let result = solve(unsolvable_sudoku);
        assert_eq!(
            result,
            ""
        );
    }
}
