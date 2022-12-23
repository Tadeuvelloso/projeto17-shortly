import { connectionDB } from "../database/db.js";

export async function getRanking (req, res) {

    try {
        const raking = await connectionDB.query(`SELECT * FROM ranking ORDER BY "allVisitCount" DESC LIMIT 10;`);
        res.send(raking.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}