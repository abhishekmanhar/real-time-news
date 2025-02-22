import express from "express";
import { getNews, postNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getNews);
router.post("/", postNews);

export default router; // ✅ Add default export
