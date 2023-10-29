import pg from "pg";
import pgPromise from "pg-promise";
const Pool = pg.Pool;
const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    database: "budgetbook",
    port: 5432, // Default PostgreSQL port
});
export const smsEntryController = async (req, res) => {
    const user_email = await req.body.email;
    const sms_amount = await req.body.amount;
    const sms_date = await req.body.date;
    const sms_type = await req.body.type;

    try {
        // Insert the new SMS detail into the database
        const smsEntryQuery = "INSERT INTO sms (user_email,sms_amount,sms_date,sms_type) VALUES ($1,$2,$3,$4) RETURNING sms_id";
        const smsEntryResult = await pool.query(smsEntryQuery, [user_email, sms_amount, sms_date, sms_type]);
        const newSMSId = smsEntryResult.rows[0].sms_id;
        res
            .status(201)
            .json({ message: "SMS Entry DONE", sms_id: newSMSId });
    } catch (error) {
        console.error("Error Entring sms details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

