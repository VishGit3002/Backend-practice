"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiCurrencyRupee,
  HiReceiptPercent,
  HiChartBar,
  HiBanknotes,
  HiPlus,
  HiArrowRight,
} from "react-icons/hi2";
import Link from "next/link";
import useExpenseStore from "@/store/expenseStore";
import useAuthStore from "@/store/authStore";
import StatsCard from "@/components/StatsCard";
import ExpenseChart from "@/components/ExpenseChart";
import CategoryBadge from "@/components/CategoryBadge";
import ExpenseModal from "@/components/ExpenseModal";

export default function DashboardPage() {
  const { expenses, isLoading, fetchExpenses, categoryColors } =
    useExpenseStore();
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Compute stats
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expenseCount = expenses.length;
  const avgExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;
  const balance = user?.balance || 0;

  // Category breakdown for chart
  const breakdown = {};
  expenses.forEach((exp) => {
    const cat = exp.category || "Other";
    breakdown[cat] = (breakdown[cat] || 0) + exp.amount;
  });
  const chartData = Object.entries(breakdown).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || categoryColors.Other,
  }));

  // Recent 5 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          icon={HiCurrencyRupee}
          label="Total Spent"
          value={totalSpent}
          prefix="₹"
          color="#8b5cf6"
          delay={0}
        />
        <StatsCard
          icon={HiReceiptPercent}
          label="Total Expenses"
          value={expenseCount}
          color="#06b6d4"
          delay={0.1}
        />
        <StatsCard
          icon={HiChartBar}
          label="Average Expense"
          value={avgExpense}
          prefix="₹"
          color="#f472b6"
          delay={0.2}
        />
        <StatsCard
          icon={HiBanknotes}
          label="Balance"
          value={balance}
          prefix="₹"
          color="#34d399"
          delay={0.3}
        />
      </div>

      {/* Chart + Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Spending by Category
          </h3>
          <ExpenseChart data={chartData} />
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Expenses
            </h3>
            <Link
              href="/dashboard/expenses"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors font-medium"
            >
              View all
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                <HiCurrencyRupee className="w-8 h-8 text-primary" />
              </div>
              <p className="text-text-secondary text-sm mb-1">
                No expenses yet
              </p>
              <p className="text-muted text-xs">
                Add your first expense to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense, i) => (
                <motion.div
                  key={expense._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-surface-hover transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          categoryColors[expense.category] ||
                          categoryColors.Other,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {expense.title}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(expense.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <CategoryBadge
                      category={expense.category}
                      colors={categoryColors}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      ₹{expense.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* FAB - Add Expense */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-shadow z-50"
      >
        <HiPlus className="w-6 h-6" />
      </motion.button>

      <ExpenseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
