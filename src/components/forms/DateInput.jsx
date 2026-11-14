import { CalendarDays } from "lucide-react";

function DateInput({
  label,
  required = false,
  error,
  id,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-[14px] font-medium leading-5 text-slate-800"
        >
          {label}

          {required && (
            <span className="ml-0.5 text-indigo-600">*
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="date"
          aria-invalid={error ? "true" : "false"}
          className={`
            h-10
            w-full
            rounded-lg
            border
            bg-white
            px-3
            pr-10
            text-sm
            text-slate-800
            outline-none
            transition-all
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }
            ${className}
          `}
          {...props}
        />

        <CalendarDays
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-slate-400
          "
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default DateInput;