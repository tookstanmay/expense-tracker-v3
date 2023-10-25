import pg from "pg";

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "budgetbook",
  port: 5432, // Default PostgreSQL port
});

// Controller for user registration
export const registerController = async (req, res) => {
  const user_email = await req.body.email;
  const user_name = await req.body.username;
  const user_password = await req.body.password;
  const user_balance = await req.body.balance;

  try {
    // Check if the user_email is already registered
    const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [user_email]);

    if (emailCheckResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    // Insert the new user into the database
    const insertUserQuery =
      "INSERT INTO account (user_email, user_password, user_name, user_balance) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const insertUserResult = await pool.query(insertUserQuery, [
      user_email,
      user_password,
      user_name,
      user_balance,
    ]);

    const newUserId = insertUserResult.rows[0].user_id;

    res
      .status(201)
      .json({ message: "User registered successfully", user_id: newUserId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginController = async (req, res) => {
  const user_email = await req.body.email;
  const user_password = await req.body.password;

  try {
    const userQuery =
      "SELECT * FROM account WHERE user_email = $1 AND user_password = $2";
    const { rows } = await pool.query(userQuery, [user_email, user_password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // setUser(user_email);
    // console.log(rows[0].user_id);
    res.status(200).json({
      user_id: rows[0].user_id,
      balance: rows[0].user_balance,
      user_name: rows[0].user_name,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    await pool.connect();
    const { user_email } = req.body;
    if (!user_email) {
      return res.send({ message: "Email is required" });
    }
    const deleteUserQuery = `
        DELETE FROM account 
        WHERE user_email=$1;
        `;
    const checkUserQuery = `
        SELECT * FROM account
        WHERE user_email=$1
        ;
        `;
    //check for existing user
    const existingUser = await pool.query(checkUserQuery, [user_email]);

    if (existingUser.rows.length > 0) {
      await pool.query(deleteUserQuery, [user_email]);
      return res.status(200).send({
        success: true,
        message: "User Deleted Successfully",
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

// get user details
export const userDetails = async (req, res) => {
  try {
    const user_id = await req.params.id;

    const query = "SELECT * FROM account WHERE user_id = $1";
    const values = [user_id];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user_name = result.rows[0].user_name;
      // console.log(user_name);
      res.json({ user_name });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const setZeroBalance = async (req, res) => {
  const user_email = await req.body.email;
  const zeroBalance = await req.body.zeroBalance;

  try {
    const fetchBalanceQuery = "SELECT * FROM account WHERE user_email = $1";
    const fetchBalanceResult = await pool.query(fetchBalanceQuery, [
      user_email,
    ]);

    const initialBalance = parseFloat(
      await fetchBalanceResult.rows[0].user_balance
    );

    const newBalance = parseFloat(zeroBalance) + parseFloat(initialBalance);

    const updateBalanceQuery =
      "UPDATE account SET user_balance = $1 WHERE user_email = $2";
    const updateBalanceResult = await pool.query(updateBalanceQuery, [
      newBalance,
      user_email,
    ]);

    res.status(200).json({
      message: "Successfully updated User Balance!",
      zeroBalance: parseFloat(zeroBalance),
    });
  } catch (error) {
    console.error(error);
  }
};

// enter all categories
export const logout = async (req, res) => {
  const user_id = await req.body.id;
  const balance = parseFloat(await req.body.balance);
  try {
    // Retrieve user data from local storage
    const categories = await req.body.budgets;
    const expenses = await req.body.expenses;

    // delete past entries of user;
    const delete_expense_query = "DELETE FROM expense WHERE user_id = $1";
    const delete_expense_values = [user_id];

    const delete_expense_result = await pool.query(
      delete_expense_query,
      delete_expense_values
    );

    const delete_category_query = "DELETE FROM category WHERE user_id = $1";
    const delete_category_values = [user_id];

    const delete_category_result = await pool.query(
      delete_category_query,
      delete_category_values
    );

    // Insert categories and expenses into the database

    if (categories !== null) {
      for (const category of categories) {
        await pool.query(
          "INSERT INTO category (category_id, category_name, category_created_at, category_limit, category_color, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            category.category_id,
            category.category_name,
            category.category_created_at,
            category.category_limit,
            category.category_color,
            user_id,
          ]
        );
      }
    }

    if (expenses !== null) {
      for (const expense of expenses) {
        await pool.query(
          "INSERT INTO expense (expense_id, expense_name, expense_created_at, expense_amount, category_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            expense.expense_id,
            expense.expense_name,
            expense.expense_created_at,
            expense.expense_amount,
            expense.category_id,
            user_id,
          ]
        );
      }
    }

    // updating user's balance
    const userBalanceQuery =
      "UPDATE account SET user_balance = $1 WHERE user_id = $2";
    const userBalanceResult = await pool.query(userBalanceQuery, [
      balance,
      user_id,
    ]);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchBudgets = async (req, res) => {
  const user_id = await req.body.user_id;
  let budgets = [];
  let expenses = [];
  try {
    const query = "SELECT * FROM account WHERE user_id = $1";
    const values = [user_id];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const category_query = "SELECT * FROM category WHERE user_id = $1";
      const category_values = [user_id];

      const category_result = await pool.query(category_query, category_values);

      if (category_result.rows.length > 0) {
        category_result.rows.forEach((category) => {
          budgets.push(category);
        });
      }

      const expense_query = "SELECT * FROM expense WHERE user_id = $1";
      const expense_values = [user_id];

      const expense_result = await pool.query(expense_query, expense_values);

      if (expense_result.rows.length > 0) {
        expense_result.rows.forEach((expense) => {
          expenses.push(expense);
        });
      }

      res.status(200).json({
        message: "Found budgets from database!",
        budgets: budgets,
        expenses: expenses,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
  }
};
