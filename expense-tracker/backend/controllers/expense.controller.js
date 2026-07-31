import User from "../models/auth.model.js";
import Expense from "../models/expense.model.js";
import { expenseSchema } from "../utils/validation.js";

export async function create(req, res) {
  try {
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const { title, amount, category } = parsed.data;

    const expense = await Expense.create({
      title,
      amount,
      category,
      user: req.user.id,
    });

    res.status(201).json({
      expense,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the requesting user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const parsed = expenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const { title, amount, category } = parsed.data;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the requesting user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category },
      { new: true }
    );

    res.status(200).json({ expense: updatedExpense });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function get(req, res) {
  try {
    const user = req.user;

    console.log(user);

    const expense = await Expense.find({ user: user._id });

    res.status(200).json({ expense });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ error: "Internal server error" });
  }
}
