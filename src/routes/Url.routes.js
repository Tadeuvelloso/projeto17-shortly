import { Router } from "express";
import { checkUrl } from "../middlewares/Url.middleware.js";
import { postUrl } from "../controllers/url.controllers.js";

const router = Router();

router.post("/urls/shorten", checkUrl, postUrl);
router.get("/urls/:id", );
router.get("/urls/open/:shortUrl");
router.delete("/urls/:id")

export default router;