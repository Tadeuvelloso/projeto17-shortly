import { authSchema } from "../models/auth.validation.js";

export function authBodyValidation (req, res, next){
    const auth = req.body;


    if (!auth) {
        return res.sendStatus(400);
    }

    const { error } = authSchema.validate(auth, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }
    
    res.locals.auth = auth
    next();
}