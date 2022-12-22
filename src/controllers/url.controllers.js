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

export async function getUrlById (req, res){
   const  id  = req.params;

   try {
      const urlById = await connectionDB.query("SELECT * FROM links WHERE id=$1;", [id.id]);
      
      const obj ={
         id: urlById.rows[0].id,
         shortUrl: urlById.rows[0].shortUrl,
         url: urlById.rows[0].url
      }

      res.status(200).send(obj);
   } catch (err) {
      return res.status(500).send(err.message);
   }

}