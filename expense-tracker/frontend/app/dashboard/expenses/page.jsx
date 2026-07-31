"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiCurrencyRupee,
  HiFunnel,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import useExpenseStore from "@/store/expenseStore";
import CategoryBadge from "@/components/CategoryBadge";
import ExpenseModal from "@/components/ExpenseModal";
import { useToast } from "@/components/Toast";

export default function ExpensesPage() {
  const {
    expenses,
    isLoading,
    fetchExpenses,
    deleteExpense,
    categories,
    categoryColors,
  } = useExpenseStore();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    const result = await deleteExpense(id);
    setDeletingId(null);
    if (result.success) {
      toast("Expense deleted", "success");
    } else {
      toast(result.message || "Failed to delete", "error");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // Filter & search
  const filteredExpenses = expenses
    .filter(
      (exp) => filterCategory === "All" || exp.category === filterCategory
    )
    .filter(
      (exp) =>
        !search ||
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.category?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">All Expenses</h2>
          <p className="text-sm text-text-secondary mt-1">
            {filteredExpenses.length} expense
            {filteredExpenses.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
          <HiPlus className="w-4 h-4" />
          Add Expense
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <HiFunnel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-11 pr-8 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center border border-border"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5">
            <HiCurrencyRupee className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {expenses.length === 0
              ? "No expenses yet"
              : "No matching expenses"}
          </h3>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            {expenses.length === 0
              ? "Start by adding your first expense using the button above."
              : "Try adjusting your filters or search term."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredExpenses.map((expense, i) => (
              <motion.div
                key={expense._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.3),
                  duration: 0.3,
                  layout: { type: "spring", damping: 25, stiffness: 300 },
                }}
                className="glass rounded-xl px-5 py-4 flex items-center justify-between gap-4 border border-border card-hover group"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[expense.category] || categoryColors.Other}18`,
                    }}
                  >
                    <HiCurrencyRupee
                      className="w-5 h-5"
                      style={{
                        color:
                          categoryColors[expense.category] ||
                          categoryColors.Other,
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {expense.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(expense.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <CategoryBadge
                    category={expense.category}
                    colors={categoryColors}
                  />
                  <span className="text-base font-bold text-foreground min-w-[80px] text-right">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 rounded-lg hover:bg-primary-light text-muted hover:text-primary transition-all"
                      title="Edit"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="p-2 rounded-lg hover:bg-danger-light text-muted hover:text-danger transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === expense._id ? (
                        <div className="w-4 h-4 border-2 border-danger/30 border-t-danger rounded-full animate-spin" />
                      ) : (
                        <HiTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ExpenseModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        expense={editingExpense}
      />
    </div>
  );
}
