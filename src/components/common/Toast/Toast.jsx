import { useEffect } from "react";
import { CircleAlert, Check, X } from "lucide-react";

function Toast({ toast, onDismiss, duration }) {
  const isError = toast.type === "error";

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => onDismiss(toast.id),
      duration
    );
    return () => window.clearTimeout(timeoutId);
  }, [duration, onDismiss, toast.id]);

  return (
    <div
      className={`app-toast${isError ? " is-error" : " is-success"}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <span className="app-toast-icon" aria-hidden="true">
        {isError ? <CircleAlert size={17} /> : <Check size={17} />}
      </span>
      <p className="app-toast-message">{toast.message}</p>
      <button
        type="button"
        className="app-toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={17} />
      </button>
      <span
        className="app-toast-progress"
        style={{ "--toast-duration": `${duration}ms` }}
        aria-hidden="true"
      />
    </div>
  );
}

export default Toast;
