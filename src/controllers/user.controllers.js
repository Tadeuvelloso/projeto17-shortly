import { connectionDB } from "../database/db.js";

export async function getAllUrlsFromUser(req, res) {
    const user = res.locals.user;
    

    try {
        const allUrls = await connectionDB.query(`SELECT * FROM links WHERE "userId"=$1;`, [user.id]);
        const userData = await connectionDB.query(`SELECT * FROM users WHERE id=$1;`, [user.userId])
        //Falta fazer a contagem de visualizaçãos da conta na tabela de raking.

        const obj = {
            id: userData.rows[0].id,
            name: userData.rows[0].name,
            visitCount: 5,
            shortenedUrls: allUrls.rows
          }

        res.send(obj)

    } catch (err) {
        return res.status(500).send(err.message);
    }
}