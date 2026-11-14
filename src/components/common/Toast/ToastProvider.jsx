import { useCallback, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "./Toast";
import "./Toast.css";

const TOAST_DURATION = 5000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    if (typeof message !== "string" || !message.trim()) {
      throw new TypeError("Toast messages must be non-empty strings.");
    }
    if (type !== "success" && type !== "error") {
      throw new TypeError(`Unsupported toast type: "${type}".`);
    }

    const toast = {
      id: ++nextId.current,
      message: message.trim(),
      type,
    };
    setToasts((current) => [...current, toast]);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="app-toast-viewport">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
            duration={TOAST_DURATION}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
