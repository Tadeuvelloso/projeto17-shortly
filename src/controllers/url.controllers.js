import { connectionDB } from "../database/db.js";
import { nanoid } from 'nanoid';

export async function postUrl (req, res) {
    const url = res.locals.url;
    const userId = res.locals.userId;
    const visitCount = 0;

    const shortUrl = nanoid(url, 10);
     try{
        await connectionDB.query(`INSERT INTO links ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4);`, [userId, url, shortUrl, visitCount])
     } catch (err) {
        return res.status(500).send(err.message);
     }
}