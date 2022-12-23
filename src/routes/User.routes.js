import { Router } from "express";
import { checkUserData } from "../middlewares/User.middleware.js";
import { getAllUrlsFromUser } from "../controllers/user.controllers.js";

const router = Router();

router.get("/users/me", checkUserData, getAllUrlsFromUser);

export default router;