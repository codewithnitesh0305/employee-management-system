import { CalendarDays, X } from "lucide-react";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function DatePicker({
  label,
  required = false,
  selected,
  onChange,
  placeholder = "Select Date",
  error,
  disabled = false,
  dateFormat = "dd-MM-yyyy",
  minDate,
  maxDate,
  clearable = true,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-800">
          {label}

          {required && (
            <span className="ml-1 text-indigo-600">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat={dateFormat}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          isClearable={false}
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          wrapperClassName="w-full"
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
            transition
            placeholder:text-slate-400
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100
            disabled:cursor-not-allowed
            disabled:bg-slate-50
            ${
              error
                ? "border-red-400"
                : "border-slate-300"
            }
          `}
        />

        <CalendarDays
          size={17}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-indigo-500
          "
        />

        {clearable && selected && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="
              absolute
              right-9
              top-1/2
              -translate-y-1/2
              text-slate-400
              hover:text-slate-600
            "
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default DatePicker;