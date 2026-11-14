import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

import "./Dropdown.css";

function Dropdown({
  value,
  options = [],
  placeholder = "Select",
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`common-dropdown ${
        disabled ? "disabled" : ""
      }`}
    >
      <button
        type="button"
        className={`common-dropdown-trigger ${
          open ? "open" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            setOpen((previous) => !previous);
          }
        }}
      >
        <span
          className={
            selectedOption
              ? "common-dropdown-value"
              : "common-dropdown-placeholder"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <span className="common-dropdown-arrow">
          {open ? (
            <ChevronUp size={17} />
          ) : (
            <ChevronDown size={17} />
          )}
        </span>
      </button>

      {open && (
        <div className="common-dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value || "all"}
              className={`common-dropdown-option ${
                value === option.value
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleSelect(option)
              }
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check size={16} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;