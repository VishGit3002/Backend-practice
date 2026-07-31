import express from "express"
import { getuser, login, logout, signup, accessToken } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"

const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.get("/getUser",protectRoute, getuser)
authRouter.get("/accessToken", accessToken)

export default authRouter