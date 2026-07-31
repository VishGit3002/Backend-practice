import express from "express"
import { create, deleteExpense, get, update } from "../controllers/expense.controller.js"
import protectRoute from "../middleware/protectRoute.js"


const expenseRouter = express.Router()

expenseRouter.use(protectRoute)

expenseRouter.get("/", get)
expenseRouter.post("/create", create)
expenseRouter.put("/:id", update)
expenseRouter.delete("/:id", deleteExpense)

export default expenseRouter