import { authSchema, authBodySignInSchema } from "../models/auth.validation.js";
import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";

export function authBodyValidation (req, res, next){
    const auth = req.body;


    if (!auth) {
        return res.sendStatus(400);
    }

    const { error } = authSchema.validate(auth, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    
    res.locals.auth = auth
    next();
}

export async function checkDataInDataBase (req, res, next) {
    const auth = res.locals.auth;

    try{
        const authEmailExist = await connectionDB.query("SELECT * FROM users WHERE email=$1 ;", [auth.email])
        
        if(authEmailExist.rows[0]){
            return res.sendStatus(409);
        }

    } catch (err) {
        return res.status(500).send(err.message);
    }
    res.locals.auth = auth;
    next();
}

export async function checkBodySignInObj (req, res, next){
    const auth = req.body;
   
    if (!auth) {
        return res.sendStatus(400);
    }

    const { error } = authBodySignInSchema.validate(auth, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    
    try{
        const userData = await connectionDB.query("SELECT * FROM users WHERE email=$1 ;", [auth.email]);

        if(!userData.rows[0]){
            return res.sendStatus(401);
        }

        const passwordValidation = bcrypt.compareSync(auth.password, userData.rows[0].password);

        if (!passwordValidation) {
            return res.sendStatus(401);
        }

        

        res.locals.userId = userData.rows[0].id;
        next();
    } catch (err) {
        return res.status(500).send(err.message);
    }

    
}