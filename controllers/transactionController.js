import pg from "pg";
import pgPromise from "pg-promise";
export const createTransactionController = async (req, res) => {
  const pgp = pgPromise();
  try {
    const Pool = pg.Pool;
    const pool = new Pool({
      user: "postgres",
      password: "postgres",
      host: "localhost",
      database: "budgetbook",
      port: 5432, // Default PostgreSQL port
    });
    const client = await pool.connect();
    if (client) {
      console.log("Connection established");
    }
    const { expense_name, expense_amount, category_id, user_id } = req.body;
    if (!expense_name) {
      return res.send({ message: "Expense Name is required" });
    }
    if (!expense_amount) {
      return res.send({ message: "Expense amount is required" });
    }
    if (!category_id) {
      return res.send({ message: "Category Id is required" });
    }
    if (!user_id) {
      return res.send({ message: "User Id is required" });
    }

    const date_ob = new Date();
    const createTransactionQuery = `
        INSERT INTO "expense" 
        ("expense_name","expense_amount","category_id","user_id")
        VALUES(
            $1,
            $2,
            $3,
            $4
 
        )  RETURNING "expense_id";
        `;
    const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_id=$1
        ;
        `;

    //check for existing user
    const existingUser = await pool.query(checkUserQuery, [user_id]);
    if (existingUser.rows.length == 0) {
      console.log("working");
    }
    if (existingUser.rows.length == 0) {
      res.status(200).send({
        success: false,
        message: "User Do not exist",
      });
    } else {
      const transaction = await pool.query(createTransactionQuery, [
        expense_name,
        expense_amount,
        category_id,
        user_id,
      ]);
      //send the response
      const finalTransactionID = transaction.rows[0].expense_id;
      res.status(200).send({
        success: true,
        message: "Transaction Saved successfully",
        finalTransactionID,
      });
    } //save the user
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "sorry error occured",
      error,
    });
  }
};
export const deleteTransactionController = async (req, res) => {
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
    const { user_email, expense_id } = req.body;
    if (!user_email) {
      return res.send({ message: "Email is required" });
    }
    if (!expense_id) {
      return res.send({ message: "Expense ID  is required" });
    }
    const deleteTransactionQuery = `
        DELETE FROM "expense" 
        WHERE expense_id=$1;
        `;
    const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        ;
        `;
    //check for existing user
    const existingUser = await pool.query(checkUserQuery, [user_email]);

    if (existingUser.rows.length > 0) {
      await pool.query(deleteTransactionQuery, [expense_id]);
      return res.status(200).send({
        success: true,
        message: "Transaction Deleted Successfully",
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Enter a valid User Email",
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
