import e, { Router } from "express";
import {
  checkAuth,
  getUser,
  signIn,
  signOut,
  signUp,
} from "../controller/users.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/signout").post(authMiddleware, signOut);
router.route("/getuser").get(authMiddleware, getUser);
router.route("/check-auth").get(checkAuth);

export { router };
