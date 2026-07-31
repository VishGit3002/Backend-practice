"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";

const ToastContext = createContext(null);

const ICONS = {
  success: HiCheckCircle,
  error: HiXCircle,
  warning: HiExclamationTriangle,
  info: HiInformationCircle,
};

const COLORS = {
  success: "border-success/30 bg-success-light",
  error: "border-danger/30 bg-danger-light",
  warning: "border-warning/30 bg-warning-light",
  info: "border-primary/30 bg-primary-light",
};

const ICON_COLORS = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-primary",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`glass-strong rounded-xl px-4 py-3 flex items-center gap-3 border ${COLORS[toast.type]} shadow-lg`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
                <p className="text-sm text-foreground flex-1">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
