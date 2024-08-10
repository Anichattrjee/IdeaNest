import express from "express";
import {
  deleteUser,
  signOut,
  testController,
  updateUser,
  getUsers,
  getOneUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", testController);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signOut);
router.get("/getUsers", verifyToken, getUsers);
router.get("/:userId", getOneUser);

export default router;
