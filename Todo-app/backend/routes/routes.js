import express from 'express'
import { showTodo, addTodo } from '../controllers/controllers.js'

const router = express.Router()

router.get("/todo", showTodo)

router.post("/addTodo", addTodo)

export default router