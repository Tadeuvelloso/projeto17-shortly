import { connectionDB } from "../database/db.js";
import { urlSchema } from "../models/url.validation.js";

export async function checkUrl(req, res, next) {
    const url = req.body;

    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send("missing token")
        return
    };


    if (!url) {
        return res.sendStatus(400);
    }

    const { error } = urlSchema.validate(url, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const tokenValidation = await connectionDB.query("SELECT * FROM  sessions WHERE token=$1;", [token]);
        if (!tokenValidation.rows[0]) {
            return res.sendStatus(401);
        }

        res.locals.url = url;
        res.locals.userId = tokenValidation.rows[0].userId
        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function checkUrlInDb(req, res, next) {
    const { authorization } = req.headers;
    const { id } = req.params;

    const token = authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).send("missing token")
        return
    };

    try {
        const checkIdUrlInDb = await connectionDB.query(`SELECT * FROM links WHERE id=$1;`, [id]);
        const userRequest = await connectionDB.query(`SELECT * FROM sessions WHERE token=$1;`, [token])

        if (!checkIdUrlInDb.rows[0]) {
            return res.sendStatus(404);
        }

        if (checkIdUrlInDb.rows[0].userId !== userRequest.rows[0].userId) {
            return res.sendStatus(401);
        }
        res.locals.id = id;
        res.locals.userId = userRequest.rows[0].userId;
        next();

    } catch (err) {
        return res.status(500).send(err.message);
    }
}