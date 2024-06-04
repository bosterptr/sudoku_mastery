use crate::database::DBPool;
use crate::routes::sudoku::errors::SudokuError;
use futures::try_join;
use serde::{Deserialize, Serialize};
use std::fmt;
use std::str::FromStr;
use sudoku::Sudoku as SudokuSolver;
use uuid::Uuid;
use tracing::debug;

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, utoipa::ToSchema)]
pub struct CreateSudokuRequest {
    #[schema(
        example = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
    )]
    pub body: String,
    #[schema(example = "Normal")]
    pub difficulty: Difficulty,
}

impl CreateSudokuRequest {
    pub fn validate(&self) -> Result<(), SudokuError> {
        Sudoku::validate(&self.body)
    }
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, utoipa::ToSchema)]
pub struct UpdateSudokuRequest {
    #[schema(
        example = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
    )]
    pub body: String,
    #[schema(example = "Normal")]
    pub difficulty: Difficulty,
}

impl UpdateSudokuRequest {
    pub fn validate(&self) -> Result<(), SudokuError> {
        Sudoku::validate(&self.body)
    }
}
#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, utoipa::ToSchema)]
pub struct PaginatedSudoku {
    pub items: Vec<Sudoku>,
    #[serde(rename = "totalItems")]
    #[schema(example = 1)]
    pub total_items: i64,
    /// 0-based index
    #[schema(example = 0)]
    pub page: i64,
    #[serde(rename = "pageSize")]
    #[schema(example = 1)]
    pub page_size: i64,
    #[serde(rename = "numPages")]
    #[schema(example = 1)]
    pub num_pages: i64,
}

#[tsync::tsync]
#[derive(Debug, Copy, Serialize, PartialEq, Deserialize, Clone, sqlx::Type, utoipa::ToSchema)]
#[sqlx(type_name = "sudoku_difficulty", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum Difficulty {
    Easy,
    Normal,
    Hard,
    Extreme,
}
#[derive(Debug)]
pub enum DifficultyError {
    Unknown,
}
impl FromStr for Difficulty {
    type Err = DifficultyError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "easy" => Ok(Difficulty::Easy),
            "normal" => Ok(Difficulty::Normal),
            "hard" => Ok(Difficulty::Hard),
            "extreme" => Ok(Difficulty::Extreme),
            _ => Err(DifficultyError::Unknown),
        }
    }
}

impl fmt::Display for Difficulty {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Difficulty::Easy => write!(f, "easy"),
            Difficulty::Normal => write!(f, "normal"),
            Difficulty::Hard => write!(f, "hard"),
            Difficulty::Extreme => write!(f, "extreme"),
        }
    }
}

#[tsync::tsync]
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, utoipa::ToSchema)]
pub struct GetRandomSudokuParams {
    #[schema(example = "Normal")]
    pub difficulty: Difficulty,
}

#[tsync::tsync]
#[derive(
    Clone,
    sqlx::FromRow,
    Debug,
    Deserialize,
    PartialEq,
    Serialize,
    utoipa::IntoParams,
    utoipa::ToSchema,
)]
pub struct Sudoku {
    pub id: Uuid,
    #[schema(
        example = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
    )]
    pub body: String,
    pub difficulty: Difficulty,
    #[serde(rename = "createdAt")]
    pub created_at: chrono::DateTime<chrono::Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: chrono::DateTime<chrono::Utc>,
    #[serde(rename = "userId")]
    pub user_id: Uuid,
}

impl Sudoku {
    pub async fn create(
        pool: &DBPool,
        item: &CreateSudokuRequest,
        user_id: &Uuid,
    ) -> Result<Self, sqlx::Error> {
        let item = sqlx::query_as!(Sudoku,
            r#"INSERT INTO sudokus (body,difficulty,user_id) VALUES ($1, $2, $3) RETURNING id,body,difficulty AS "difficulty!: Difficulty",created_at,updated_at,user_id"#,
            item.body,
            item.difficulty as Difficulty,
            user_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(item)
    }

    pub async fn get_by_id(pool: &DBPool, sudoku_id: &Uuid) -> Result<Self, sqlx::Error> {
        let item = sqlx::query_as!(Sudoku,r#"SELECT id,body,difficulty AS "difficulty!: Difficulty",created_at,updated_at,user_id FROM sudokus WHERE id = $1"#,
            sudoku_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(item)
    }

    /// Paginates through the table where page is a 0-based index
    pub async fn paginate(
        pool: &DBPool,
        page: i64,
        page_size: i64,
    ) -> Result<PaginatedSudoku, sqlx::Error> {
        debug!("page {page} page_size {page_size}");
        let page = if page < 0 { 0 } else { page };
        let page_size = if page_size < 1 {
            1
        } else if page_size > 100 {
            100
        } else {
            page_size
        };
        debug!("page {page} page_size {page_size}");
        let items_future = sqlx::query_as!(Sudoku,
            r#"SELECT id,body,difficulty AS "difficulty!: Difficulty",created_at,updated_at,user_id FROM sudokus LIMIT $1 OFFSET $2"#,
            page_size,
            page * page_size,
        )
        .fetch_all(pool);
        let total_result_future =
            sqlx::query!("SELECT COUNT(*) as total FROM sudokus").fetch_one(pool);
        let (items, total_result) = try_join!(items_future, total_result_future)?;
        let total_items = total_result.total.unwrap_or(0);
        debug!("total_items {total_items}");
        Ok(PaginatedSudoku {
            items,
            total_items,
            page,
            page_size,
            /* ceiling division of integers */
            num_pages: total_items / page_size + i64::from(total_items % page_size != 0),
        })
    }

    pub async fn update(
        pool: &DBPool,
        param_id: &Uuid,
        item: &UpdateSudokuRequest,
        user_id: &Uuid,
    ) -> Result<Self, sqlx::Error> {
        let item =sqlx::query_as!(Sudoku,
            r#"UPDATE sudokus SET body = $1, difficulty = ($2::text)::sudoku_difficulty WHERE user_id = $3 AND id = $4  RETURNING id,body,difficulty AS "difficulty!: Difficulty",created_at,updated_at,user_id"#,
            item.body,
            item.difficulty.to_string(),
            user_id,
            param_id,
        )
        .fetch_one(pool)
        .await?;
        Ok(item)
    }
    pub fn validate(body: &str) -> Result<(), SudokuError> {
        if body.len() != 81usize {
            return Err(SudokuError::BodyDoesNotHave81Characters);
        }
        match SudokuSolver::from_str_line(body) {
            Ok(parsed_sudoku) => {
                if parsed_sudoku.is_solved() {
                    return Err(SudokuError::BodyIsAlreadySolved);
                }

                if parsed_sudoku.some_solution().is_none() {
                    return Err(SudokuError::BodyIsNotSolvable);
                }
            }
            Err(_) => return Err(SudokuError::CouldNotParse),
        }
        Ok(())
    }
    pub async fn delete(
        pool: &DBPool,
        sudoku_id: &Uuid,
        user_id: &Uuid,
    ) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"DELETE FROM sudokus WHERE id = $1 AND user_id = $2"#,
            sudoku_id,
            user_id
        )
        .execute(pool)
        .await?;
        Ok(())
    }

    pub fn to_bytes(&self) -> String {
        format!(
            "{{\"id\":{},\"body\":{},\"difficulty\":{},\"created_at\":{},\"updated_at\":{}}}",
            self.id, self.body, self.difficulty, self.created_at, self.updated_at
        )
    }

    pub async fn clear_table(pool: &DBPool) -> Result<sqlx::postgres::PgQueryResult, sqlx::Error> {
        sqlx::query!(r#"DELETE FROM sudokus;"#).execute(pool).await
    }
    pub async fn get_random_with_difficulty(
        pool: &DBPool,
        difficulty: &Difficulty,
    ) -> Result<Option<Sudoku>, sqlx::Error> {
        let result = sqlx::query_as!(Sudoku,
            r#"
            SELECT id, body, difficulty AS "difficulty!: Difficulty", created_at, updated_at, user_id 
            FROM sudokus 
            WHERE difficulty = ($1::text)::sudoku_difficulty
            ORDER BY RANDOM() 
            LIMIT 1
            "#,
            &difficulty.to_string(),
        )
        .fetch_optional(pool)
        .await?;
        Ok(result)
    }
}
