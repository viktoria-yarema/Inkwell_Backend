import express from "express";
import { check } from "express-validator";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
} from "../controllers/tagController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", getTags);

router.get("/:id", getTagById);

router.post(
  "/",
  [
    auth,
    check("title", "Title is required").not().isEmpty().trim().escape(),
  ],
  createTag
);

router.put(
  "/:id",
  [
    auth,
    check("title", "Title is required").not().isEmpty().trim().escape(),
  ],
  updateTag
);

router.delete("/:id", auth, deleteTag);

export default router; 