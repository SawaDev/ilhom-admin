import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";

const router = express.Router();

//Update
router.put("/:id", verifyToken, updateUser)

//Delete
router.delete("/:id", verifyToken, deleteUser);

//GET
router.get("/find/:id", getUser);

//GET ALL
router.get("/", getUsers);

export default router;