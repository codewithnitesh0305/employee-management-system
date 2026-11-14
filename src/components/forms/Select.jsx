import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

function Select({
  label,
  required = false,
  placeholder = "Select option",
  options = [],
  value,
  onChange,
  searchable = false,
  disabled = false,
  clearable = true,
  error,
  id,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Focus the inline search input as soon as the dropdown opens
  useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    }
  }, [open, searchable]);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  const filteredOptions = options.filter((option) =>
    option.label
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange?.(option.value);
    setOpen(false);
    setSearch("");
  };

  const clearSelection = (event) => {
    event.stopPropagation();

    onChange?.("");
    setSearch("");
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    setOpen((previous) => !previous);
  };

  const showInlineSearch = open && searchable && !disabled;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
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

      {/* Select Trigger */}

      <button
        id={id}
        type="button"
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((previous) => !previous);
          }
          if (e.key === "Escape") {
            setOpen(false);
            setSearch("");
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={`
          flex
          h-10
          w-full
          items-center
          justify-between
          gap-2
          rounded-lg
          border
          bg-white
          px-3
          text-left
          text-sm
          outline-none
          transition
          ${disabled ? "cursor-not-allowed bg-slate-50" : "cursor-pointer"}
          ${
            open
              ? "border-indigo-500 ring-4 ring-indigo-100"
              : "border-slate-300"
          }
          ${error ? "border-red-400" : ""}
        `}
      >
        {showInlineSearch ? (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder={
              selectedOption ? selectedOption.label : placeholder
            }
            className="
              h-full
              w-full
              min-w-0
              border-none
              bg-transparent
              text-sm
              text-slate-800
              outline-none
              placeholder:text-slate-400
            "
            aria-label={label || id}
          />
        ) : (
          <span
            className={
              selectedOption
                ? "truncate text-slate-800"
                : "truncate text-slate-400"
            }
          >
            {selectedOption
              ? selectedOption.label
              : placeholder}
          </span>
        )}

        <div className="flex flex-shrink-0 items-center gap-1">
          {selectedOption && !disabled && clearable && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearSelection(e); }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear selection"
            >
              <X size={15} />
            </button>
          )}

          <ChevronDown
            size={17}
            className={`
              text-slate-400
              transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Dropdown */}

      {open && !disabled && (
        <div
          className="
            absolute
            z-50
            mt-1.5
            w-full
            overflow-hidden
            rounded-lg
            border
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected =
                  option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleSelect(option)
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-md
                      px-3
                      py-2
                      text-left
                      text-sm
                      transition
                      ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <Check
                        size={16}
                        className="text-indigo-600"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-sm text-slate-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;