import pg from "pg";
import crypto from "crypto";

export const deleteCategoryController = async (req, res) => {
  try {
    const Pool = pg.Pool;
    const pool = new Pool({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      database: "budgetbook",
      port: 5432, // Default PostgreSQL port
    });
    pool.connect();
    const { user_id, category_name } = req.body;

    if (!user_id) {
      return res.send({ message: "User ID is Required" });
    }
    if (!category_name) {
      return res.send({ message: "Category Name is Required" });
    }

    const deleteCategoryQuery = `
        DELETE FROM "category"
        WHERE category_id=$1
        `;
    const checkCategoryQuery = `
        SELECT category_id FROM "category" 
        WHERE category_name=$1 AND
        user_id=$2
        ;
        `;
    //check for existing category
    const existingCategory = await pool.query(checkCategoryQuery, [
      category_name,
      user_id,
    ]);

    if (existingCategory.rows.length === 0) {
      return res.status(200).send({
        success: false,
        message: "Category Do not exist",
      });
    } else {
      const categoryId = existingCategory.rows[0].category_id;
      const category = await pool.query(deleteCategoryQuery, [categoryId]);
      //send the response
      return res.status(200).send({
        success: true,
        message: "Category Deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "sorry error occured",
      error,
    });
  }
};

export const createCategoryController = async (req, res) => {
  const category_name = await req.body.category;
  const category_limit = await req.body.amount;
  const user_id = await req.body.userID;

  try {
    const Pool = pg.Pool;
    const pool = new Pool({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      database: "budgetbook",
      port: 5432,
    });

    await pool.connect();

    if (!category_name) {
      return res.send({ message: "Category Name is required" });
    }
    if (!category_limit) {
      return res.send({ message: "Category Limit is required" });
    }
    if (!user_id) {
      return res.send({ message: "user Id  is required" });
    }

    const category_id = crypto.randomUUID();
    const createCategoryQuery = `
        INSERT INTO category (category_id, category_name,category_limit,user_id)VALUES(
            $1,
            $2,
            $3,
            $4
        )  
        RETURNING category_id;
        `;
    const checkCategoryQuery = `
        SELECT * FROM category 
        WHERE category_name = $1
        ;
        `;
    //check for existing category
    const existingCategory = await pool.query(checkCategoryQuery, [
      category_name,
    ]);

    if (existingCategory.rows.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exists",
      });
    } else {
      const categoryDetails = await pool.query(createCategoryQuery, [
        category_id,
        category_name,
        category_limit,
        user_id,
      ]);
      //send the response
      res.status(200).send({
        success: true,
        message: "Category Created successfully",
        id: category_id,
      });
    } //save the user
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "sorry error occured",
    });
  }
};
