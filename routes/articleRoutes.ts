import express from "express";
import { check, query } from "express-validator";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  [
    auth,
    [
      query("page").isInt({ min: 1 }).optional(),
      query("limit").isInt({ min: 1 }).optional(),
    ],
  ],
  getArticles,
);

router.post(
  "/",
  [auth, [check("title", "Title is required").not().isEmpty().escape()]],
  createArticle,
);

router.put(
  "/:id",
  [auth, [check("title", "Title is required").not().isEmpty().escape()]],
  updateArticle,
);

router.delete("/:id", auth, deleteArticle);

const articleRoutes = router;

export default articleRoutes;
