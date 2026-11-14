function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
}) {
  return (
    <label
      className={`
        flex
        cursor-pointer
        items-center
        gap-2
        text-sm
        font-medium
        text-slate-700
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-checked={checked}
        className="
          h-4
          w-4
          rounded-sm
          border-slate-300
          text-indigo-600
          accent-indigo-600
          focus:ring-2
          focus:ring-indigo-100
        "
      />

      {label}
    </label>
  );
}

export default Checkbox;