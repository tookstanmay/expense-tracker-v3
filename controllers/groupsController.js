import pg from "pg";
import crypto from "crypto";

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "budgetbook",
  port: 5432, // Default PostgreSQL port
});

//---------------Creating a controller to all groups of the person--------------------//
export const allGroups = async (req, res) => {
  try {
    const userID = await req.body.user_id;
    const getAllGroupsQuery = `SELECT * FROM "group" WHERE user_id = $1;`;
    const groupDetails = [];
    const getAllGroupsResult = await pool.query(getAllGroupsQuery, [userID]);
    if (getAllGroupsResult.rows.length > 0) {
      getAllGroupsResult.rows.map((group) =>
        groupDetails.push({
          group_id: group.group_id,
          group_name: group.group_name,
        })
      );

      res.status(200).send({
        success: true,
        message: "Groups Fetched Successfully",
        groupDetails: groupDetails,
      });
    } else {
      res.status(400).send({
        message: "Error in loading the groups of the user",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error,
      message: "Internal Server Error Error in getting the user groups",
    });
  }
};

export const splitFunction = async (req, res) => {
  const user_id = await req.body.user_id;
  const data = await req.body.updatedBalances;
  try {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const userId = key; // The key is the user ID
        const balance = data[key]; // The value is the balance

        const getUserQuery = "SELECT * FROM account WHERE user_id = $1";
        const getUserResult = await pool.query(getUserQuery, [userId]);

        const oldBalance = parseFloat(await getUserResult.rows[0].user_balance);
        const newBalance = oldBalance + parseFloat(balance);

        const updateBalanceQuery =
          "UPDATE account SET user_balance = $1 WHERE user_id = $2";
        const updateBalanceResult = await pool.query(updateBalanceQuery, [
          newBalance,
          userId,
        ]);
      }
    }

    const findBalanceQuery = "SELECT * FROM account WHERE user_id = $1";
    const findBalanceResult = await pool.query(findBalanceQuery, [user_id]);

    const balance_to_send = await findBalanceResult.rows[0].user_balance;

    res.status(200).json({
      success: true,
      message: "Successfully split the amount!",
      newBalance: await balance_to_send,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while splitting the amount",
    });
  }
};

//-------Controller for getting the members of a particular group------------//
export const memberInAGroup = async (req, res) => {
  try {
    const groupID = await req.body.group_id;

    const getAllMembersQuery = `
    SELECT "group".user_id, account.user_name
    FROM "group"
    INNER JOIN account ON "group".user_id = account.user_id
    WHERE "group".group_id = $1;
  `;

    const getAllMembersResult = await pool.query(getAllMembersQuery, [groupID]);
    if (getAllMembersResult.rows.length > 0) {
      const members = getAllMembersResult.rows;

      res.status(200).send({
        success: true,
        message: "Members of a group Fetched Successfully",
        groupID: groupID,
        members: members,
      });
    } else {
      res.status(400).send({
        message: "Error in loading the members of the group",
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message: "Internal Server Error ,Error in getting the members of a group",
    });
  }
};

//----------Controller for assigning amount paid by a particular user ------------
export const amountPaidByAUserInAGroup = async (req, res) => {
  try {
    const groupID = await req.body.group_id;
    const paymentDetails = [...(await req.body.updatedBalances)];

    const getAllMembersQuery = `SELECT * FROM "group" WHERE group_id = $1;`;
    const insertAmountQuery = `UPDATE "group" SET pool_amount = $1 WHERE group_id = $2 AND user_id = $3;`;

    const getAllMembersResult = await pool.query(getAllMembersQuery, [groupID]);

    if (getAllMembersResult.rows.length > 0) {
      const response = await Promise.all(
        paymentDetails.map(async (member) => {
          try {
            console.log(member.user_id);
            return await pool.query(insertAmountQuery, [
              member.pool_amount,
              groupID,
              member.user_id,
            ]);
          } catch (error) {
            // Handle the query error here, you might want to log it or take appropriate action
            console.error("Error updating pool amount:", error);
            throw error; // Rethrow the error to propagate it back
          }
        })
      );

      if (response) {
        res.status(200).send({
          success: true,
          message: "Pool Amount Added For All Members Successfully",
        });
      }
    } else {
      res.status(400).send({
        message: "Error in Setting the Pool Amount of the Members",
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message:
        "Internal Server Error, Error in setting the amount of each member in a group",
    });
  }
};

//-------Controller to check the Average of the group----------
export const averageOfTheGroup = async (req, res) => {
  try {
    const groupID = await req.body.group_id;
    const groupAverageQuery = `SELECT AVG(pool_amount) FROM "group" WHERE group_id = $1 AND balance_amount != -1;`;
    const groupAverageResult = await pool.query(groupAverageQuery, [groupID]);
    const averageValue = groupAverageResult.rows[0];
    if (groupAverageResult.rows.length > 0) {
      res.status(200).send({
        success: true,
        message: "Average of the group is calculated successfully",
        averageValue: averageValue,
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message:
        "Internal Server Error, Error in Calculating the average of the average",
    });
  }
};

//-------Controller for changing status of payment and amount left ---------
export const changeRemainingBalanceAndStatus = async (req, res) => {
  try {
    const averageValue = await req.body.average;
    const groupID = await req.body.group_id;
    const userID = await req.body.user_id;
    // const enterBalance = await req.body.balance_amount;
    const checkBalanceQuery = `SELECT * FROM "group" WHERE user_id = $1 AND group_id = $2;`;
    const setStatusQuery = `UPDATE TABLE "group" SET status = $1 WHERE user_id = $2 AND group_id = $3;`;
    const checkBalanceResult = await pool.query(checkBalanceQuery, [
      userID,
      groupID,
    ]);
    const setBalanceQuery = `UPDATE TABLE "group" SET balance_amount=$1 WHERE user_id = $2 AND group_id = $3;`;
    if (checkBalanceResult.rows.length > 0) {
      const balance = checkBalanceResult.rows[0].balance_amount;
      const status = checkBalanceResult.rows[0].status;
      const poolAmount = checkBalanceResult.rows[0].pool_amount;
      const diff = poolAmount - averageValue;
      if (poolAmount >= averageValue) {
        await pool.query(setStatusQuery, [0, userID, groupID]);
        res.status(200).send({
          success: true,
          message: "No Amount need to be paid",
        });
      } else if (poolAmount < averageValue) {
        await pool.query(setStatusQuery, [1, userID, groupID]);
        await pool.query(setBalanceQuery, [diff, userID, groupID]);
        res.status(200).send({
          success: true,
          message: "Difference amount need to be paid",
          diff: diff,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      error,
      message:
        "Internal Server Error, Error in changing the remaining balance and status",
    });
  }
};

//-------Controller to check status of the Balance of a person in all the groups-------
export const checkStatusOfBalance = async (req, res) => {
  try {
    const userID = await req.body.user_id;
    const groupIDs = [...(await req.body.groupIDs)];
    const checkStatusQuery = `SELECT * FROM "group" WHERE user_id = $1 AND group_id = $2;`;
    const alertOnGroups = [];

    if (groupIDs) {
      for (const group of groupIDs) {
        const checkStatusResult = await pool.query(checkStatusQuery, [
          userID,
          group.group_id,
        ]);
        if (checkStatusResult.rows[0].status === 1) {
          alertOnGroups.push(group);
        }
      }
      res.status(200).send({
        success: true,
        message: "The groups to be alerted are sent",
        alertOnGroups: alertOnGroups,
      });
    } else {
      res.status(400).send({
        message: "Error in checking the status",
      });
    }
  } catch (error) {
    res.status(500).send({
      error,
      message:
        "Internal Server Error, Error in checking status of each member in each group",
    });
  }
};

// -------- Create a group -------- //
export const createGroup = async (req, res) => {
  const user_id = await req.body.user_id;
  const group_name = await req.body.group_name;

  try {
    const group_id = crypto.randomUUID();
    const createGroupQuery =
      'INSERT INTO "group" (group_id, group_name, user_id) VALUES ($1, $2, $3);';

    const createGroupResult = await pool.query(createGroupQuery, [
      group_id,
      group_name,
      user_id,
    ]);

    res.status(201).send({
      message: "Group created!",
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

//------Adding a member into already existing group--------//
export const addMemberGroup = async (req, res) => {
  const email = await req.body.email;
  const group_id = await req.body.group_id;
  const group_name = await req.body.group_name;

  try {
    // check if user is registered or not
    const registrationQuery = "SELECT * FROM account WHERE user_email = $1";
    const registrationResult = await pool.query(registrationQuery, [email]);

    if (registrationResult.rows.length === 0) {
      res.status(404).send({
        status: false,
        message: "User not in database!",
      });
    }

    // Check if the user_id is already in group
    const emailCheckQuery = 'SELECT * FROM "group" WHERE user_id = $1;';
    const emailCheckResult = await pool.query(emailCheckQuery, [
      registrationResult.rows[0].user_id,
    ]);

    if (emailCheckResult.rows.length > 0) {
      res.status(400).send({
        status: false,
        message: "User already present in group!",
      });
    }

    const insertIntoGroupQuery = `INSERT INTO "group" (group_id, group_name, user_id) VALUES($1, $2, $3);`;

    const insertIntoGroupResult = await pool.query(insertIntoGroupQuery, [
      group_id,
      group_name,
      registrationResult.rows[0].user_id,
    ]);

    res.status(200).send({
      status: true,
      message: "Successfully added into group!",
    });
  } catch (error) {
    console.error(error);
  }
};
