"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StatsCard({ icon: Icon, label, value, prefix = "", color, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

  useEffect(() => {
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1200;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (numericValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericValue]);

  const formatValue = (val) => {
    if (prefix === "₹") {
      return `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    }
    return `${prefix}${val.toLocaleString("en-IN", { maximumFractionDigits: val < 100 ? 1 : 0 })}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="glass rounded-2xl p-6 card-hover relative overflow-hidden group"
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}10 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {formatValue(displayValue)}
        </p>
        <p className="text-sm text-text-secondary mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
