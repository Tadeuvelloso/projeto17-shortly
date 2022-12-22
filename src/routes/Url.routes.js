import { Router } from "express";
import { checkUrl, checkUrlInDb } from "../middlewares/Url.middleware.js";
import { postUrl, getUrlById, getShortenUrl, deleteUrl } from "../controllers/url.controllers.js";

const router = Router();

router.post("/urls/shorten", checkUrl, postUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", getShortenUrl);
router.delete("/urls/:id", checkUrlInDb, deleteUrl)

export default router;