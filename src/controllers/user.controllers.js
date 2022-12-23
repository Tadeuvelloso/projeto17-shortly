import { connectionDB } from "../database/db.js";

export async function getAllUrlsFromUser(req, res) {
    const user = res.locals.user;

    try {
        const allUrls = await connectionDB.query(`SELECT * FROM links WHERE "userId"=$1;`, [user.userId]);
        const userData = await connectionDB.query(`SELECT * FROM users WHERE id=$1;`, [user.userId])
        const rankingUser = await connectionDB.query(`SELECT * FROM ranking WHERE "userId"=$1;`, [user.userId]);


        const obj = {
            id: userData.rows[0].id,
            name: userData.rows[0].name,
            visitCount: rankingUser.rows[0].allVisitCount,
            shortenedUrls: allUrls.rows
          }

        res.send(obj)

    } catch (err) {
        return res.status(500).send(err.message);
    }
}