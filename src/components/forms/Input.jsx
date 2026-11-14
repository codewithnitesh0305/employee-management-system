function Input({
  label,
  required = false,
  error,
  hint,
  id,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-800"
        >
          {label}

          {required && (
            <span className="ml-1 text-indigo-600">*</span>
          )}
        </label>
      )}

      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        className={`
          h-10
          w-full
          rounded-lg
          border
          bg-white
          px-3
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
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Input;