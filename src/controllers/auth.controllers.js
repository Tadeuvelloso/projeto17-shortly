import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

export async function signUp(req, res) {
    const { name, email, password } = res.locals.auth;
    

    const hashPassword = bcrypt.hashSync(password, 10);

    try{
        await connectionDB.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hashPassword]);
        res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const userId  = res.locals.userId;

    let token;

    try{
        const tokenExist = await connectionDB.query(`SELECT * FROM sessions WHERE "userId"=$1;`, [userId]);
        if(tokenExist.rows[0]){
            token = tokenExist.rows[0].token
        } else {
            token = uuidV4();
            await connectionDB.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [userId, token]);
        }
        
        res.status(200).send(token)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}