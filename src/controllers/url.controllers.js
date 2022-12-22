import { connectionDB } from "../database/db.js";
import { nanoid } from 'nanoid';

export async function postUrl(req, res) {
   const { url } = res.locals.url;
   const userId = res.locals.userId;
   const visitCount = 0;

   const shortUrl = nanoid(8);

   try {
      await connectionDB.query(`INSERT INTO links ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4);`, [userId, url, shortUrl, visitCount]);
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

      res.redirect(shortUrlInDb.rows[0].url);
   } catch (err) {
      return res.status(500).send(err.message);
   }

}

export async function deleteUrl(req, res) {
   const  id  = res.locals.id;
   console.log(id)
   try {
      await connectionDB.query(`DELETE FROM links WHERE id=$1 ;`, [id]);
      console.log("excluido")
      res.status(204).send("excluido");
   } catch (err) {
      return res.status(500).send(err.message);
   }
}