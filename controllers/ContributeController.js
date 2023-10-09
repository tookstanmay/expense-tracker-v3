import pg from "pg";

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "budgetbook",
  port: 5432, // Default PostgreSQL port
});

export const contributor = async (req, res) => {
  const email = await req.body.email;

  try {
    // Check if the user_email is already registered
    const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      const username = emailCheckResult.rows[0].user_name;
      return res
        .status(200)
        .json({ success: true, message: "User found!", username: username });
    }

    res.status(400).json({ success: false, message: "User not found!" });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const contributeAmount = async (req, res) => {
  const sender_id = await req.body.user_id;
  const email = await req.body.email;
  const amount = parseFloat(await req.body.amount);

  try {
    const emailCheckQuery = "SELECT * FROM account WHERE user_email = $1";
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      // check if sender's balance is more than amount he's trying to send.
      const checkBalanceQuery = "SELECT * FROM account WHERE user_id = $1";
      const checkBalanceResult = await pool.query(checkBalanceQuery, [
        sender_id,
      ]);

      if (parseFloat(checkBalanceResult.rows[0].user_balance) < amount) {
        res.status(300).json({
          success: false,
          message: "User doesn't have sufficient balance!",
        });
      } else {
        // update balance of reciever
        const oldBalance = emailCheckResult.rows[0].user_balance;
        const newBalance = parseFloat(oldBalance) + amount;
        const id = await emailCheckResult.rows[0].user_id;
        const updateBalanceQuery =
          "UPDATE account SET user_balance = $1 WHERE user_id = $2";
        const updateBalanceResult = await pool.query(updateBalanceQuery, [
          newBalance,
          id,
        ]);

        // update balance of sender
        const sender_oldBalance = checkBalanceResult.rows[0].user_balance;
        const sender_newBalance = parseFloat(sender_oldBalance) - amount;
        const updateSenderBalanceQuery =
          "UPDATE account SET user_balance = $1 WHERE user_id = $2";
        const updateSenderBalanceResult = await pool.query(
          updateSenderBalanceQuery,
          [sender_newBalance, sender_id]
        );

        return res
          .status(200)
          .json({ success: true, message: "Balance updated!" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};
