import { Router } from "express";
import { authBodyValidation, checkDataInDataBase, checkBodySignInObj } from "../middlewares/Auth.middleware.js";
import { signUp, signIn } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/signup", authBodyValidation, checkDataInDataBase, signUp);
router.post("/signin", checkBodySignInObj, signIn);

export default router;