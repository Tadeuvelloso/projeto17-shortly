import { connectionDB } from "../database/db.js";

export async function checkUserData(req, res, next){
    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send("missing token")
        return
    };

    try {
        const userRequest = await connectionDB.query(`SELECT * FROM sessions WHERE token=$1;`, [token])

        if (!userRequest.rows[0]) {
            return res.sendStatus(401);
        }

        console.log("passamos pelo middleware!")
        res.locals.user = userRequest.rows[0];
        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}