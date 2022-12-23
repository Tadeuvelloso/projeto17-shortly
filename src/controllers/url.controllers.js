import { connectionDB } from "../database/db.js";
import { nanoid } from 'nanoid';

export async function postUrl(req, res) {
   const { url } = res.locals.url;
   const userId = res.locals.userId;
   const visitCount = 0;

   const shortUrl = nanoid(8);

   try {
      await connectionDB.query(`INSERT INTO links ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4);`, [userId, url, shortUrl, visitCount]);
      const rankingUser = await connectionDB.query(`SELECT * FROM ranking WHERE "userId"=$1;`, [userId]);
      const userName = await connectionDB.query(`SELECT * FROM users WHERE "id"=$1;`, [userId]);

      if(!rankingUser.rows[0]){
         await connectionDB.query(`INSERT INTO ranking ("userId", name, "linksCount", "allVisitCount") VALUES ($1, $2, $3, $4)`, [userId, userName.rows[0].name, 1, 0]);
         res.sendStatus(201);
         
         return
      }

      await connectionDB.query(`UPDATE ranking SET "linksCount"=$1 WHERE "userId"=$2 ;`, [rankingUser.rows[0].linksCount + 1, userId]);
      
      res.sendStatus(201);
   } catch (err) {
      return res.status(500).send(err.message);
   }
}

export async function getUrlById(req, res) {
   const id = req.params;

   try {
      const urlById = await connectionDB.query("SELECT * FROM links WHERE id=$1;", [id.id]);

      if (!urlById.rows[0]) {
         return res.sendStatus(404);
      }

      const obj = {
         id: urlById.rows[0].id,
         shortUrl: urlById.rows[0].shortUrl,
         url: urlById.rows[0].url
      }

      res.status(200).send(obj);
   } catch (err) {
      return res.status(500).send(err.message);
   }

}

export async function getShortenUrl(req, res) {
   const { shortUrl } = req.params;

   try {
      const shortUrlInDb = await connectionDB.query(`SELECT * FROM links WHERE "shortUrl"=$1;`, [shortUrl]);

      if (!shortUrlInDb.rows[0]) {
         return res.sendStatus(404);
      }

      await connectionDB.query(`UPDATE links SET "visitCount"=$1 WHERE id=$2;`, [shortUrlInDb.rows[0].visitCount + 1, shortUrlInDb.rows[0].id]);
      const rankingUser = await connectionDB.query(`SELECT * FROM ranking WHERE "userId"=$1;`, [shortUrlInDb.rows[0].userId]);
      await connectionDB.query(`UPDATE ranking SET "allVisitCount"=$1 WHERE "userId"=$2 ;`, [rankingUser.rows[0].allVisitCount + 1, shortUrlInDb.rows[0].userId]);
      
      res.redirect(shortUrlInDb.rows[0].url);
   } catch (err) {
      return res.status(500).send(err.message);
   }

}

export async function deleteUrl(req, res) {
   const  id  = res.locals.id;
   const userId = res.locals.userId;

   try {
      const urlToDelete = await connectionDB.query("SELECT * FROM links WHERE id=$1;", [id])
      await connectionDB.query(`DELETE FROM links WHERE id=$1 ;`, [id]);
      const rankingUser = await connectionDB.query(`SELECT * FROM ranking WHERE "userId"=$1;`, [userId]);
      await connectionDB.query(`UPDATE ranking SET "linksCount"=$1, "allVisitCount"=$2 WHERE "userId"=$3 ;`, [rankingUser.rows[0].linksCount - 1,rankingUser.rows[0].allVisitCount - urlToDelete.rows[0].visitCount,  userId])

      res.sendStatus(204);
   } catch (err) {
      return res.status(500).send(err.message);
   }
}