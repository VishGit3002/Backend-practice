import { create } from "zustand";
import api from "@/lib/axios";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const CATEGORY_COLORS = {
  Food: "#f472b6",
  Transport: "#60a5fa",
  Shopping: "#fbbf24",
  Bills: "#f87171",
  Entertainment: "#a78bfa",
  Health: "#34d399",
  Education: "#06b6d4",
  Other: "#9ca3af",
};

const useExpenseStore = create((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,
  categories: CATEGORIES,
  categoryColors: CATEGORY_COLORS,

  // Fetch all expenses
  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/expense");
      set({ expenses: res.data.expense || [], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch expenses",
      });
    }
  },

  // Create a new expense
  createExpense: async ({ title, amount, category }) => {
    try {
      const res = await api.post("/api/expense/create", {
        title,
        amount: Number(amount),
        category,
      });
      set((state) => ({
        expenses: [res.data.expense, ...state.expenses],
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create expense",
      };
    }
  },

  // Update an expense
  updateExpense: async (id, { title, amount, category }) => {
    try {
      const res = await api.put(`/api/expense/${id}`, {
        title,
        amount: Number(amount),
        category,
      });
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp._id === id ? res.data.expense : exp
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update expense",
      };
    }
  },

  // Delete an expense
  deleteExpense: async (id) => {
    try {
      await api.delete(`/api/expense/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp._id !== id),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete expense",
      };
    }
  },

  // Derived data
  get totalSpent() {
    return get().expenses.reduce((sum, exp) => sum + exp.amount, 0);
  },

  get expenseCount() {
    return get().expenses.length;
  },

  get averageExpense() {
    const expenses = get().expenses;
    if (expenses.length === 0) return 0;
    return expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
  },

  get categoryBreakdown() {
    const expenses = get().expenses;
    const breakdown = {};
    expenses.forEach((exp) => {
      const cat = exp.category || "Other";
      breakdown[cat] = (breakdown[cat] || 0) + exp.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }));
  },
}));

export default useExpenseStore;
