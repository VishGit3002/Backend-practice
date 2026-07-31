"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import useExpenseStore from "@/store/expenseStore";
import { useToast } from "@/components/Toast";

export default function ExpenseModal({ isOpen, onClose, expense = null }) {
  const { createExpense, updateExpense, categories } = useExpenseStore();
  const toast = useToast();
  const isEditing = !!expense;

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || "",
        amount: expense.amount?.toString() || "",
        category: expense.category || "Other",
      });
    } else {
      setForm({ title: "", amount: "", category: "Other" });
    }
  }, [expense, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;

    setIsSubmitting(true);

    let result;
    if (isEditing) {
      result = await updateExpense(expense._id, form);
    } else {
      result = await createExpense(form);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast(
        isEditing ? "Expense updated successfully!" : "Expense added successfully!",
        "success"
      );
      onClose();
    } else {
      toast(result.message || "Something went wrong", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-2xl w-full max-w-md border border-border shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {isEditing ? "Edit Expense" : "Add New Expense"}
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-all"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Expense Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g., Grocery shopping"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover hover:text-foreground transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                        ? "Update Expense"
                        : "Add Expense"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
