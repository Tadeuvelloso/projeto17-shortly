import { Router } from "express";
import { authBodyValidation } from "../middlewares/Auth.middleware.js";
import { signUp } from "../controllers/signUp.controllers.js";

const router = Router();

router.post("/signup", authBodyValidation, signUp);
// router.post("/signin", signIn);

export default router;