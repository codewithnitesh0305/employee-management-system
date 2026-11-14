import { useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import "./Filter.css";

function Filter({
  filters = [],
  value = {},
  onApply,
  onReset,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(value);

  const openFilter = () => {
    setLocalFilters(value);
    setIsOpen(true);
  };

  const handleChange = (name, selectedValue) => {
    setLocalFilters((previous) => ({
      ...previous,
      [name]: selectedValue,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetValues = {};

    filters.forEach((filter) => {
      resetValues[filter.name] = "";
    });

    setLocalFilters(resetValues);
    onReset(resetValues);
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(value).filter(
    (item) => item !== "" && item !== null && item !== undefined
  ).length;

  return (
    <>
      <button
        type="button"
        className={`filter-button ${
          activeFilterCount > 0 ? "has-filter" : ""
        }`}
        onClick={openFilter}
      >
        <FilterIcon size={16} />

        <span>Filter</span>

        {activeFilterCount > 0 && (
          <span className="filter-count">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="filter-overlay">
          <div className="filter-modal">
            <div className="filter-modal-header">
              <div>
                <h3>Filter Employees</h3>
                <p>Select criteria to filter the employee list.</p>
              </div>

              <button
                type="button"
                className="filter-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="filter-modal-body">
              {filters.map((filter) => (
                <div className="filter-field" key={filter.name}>
                  <label htmlFor={filter.name}>
                    {filter.label}
                  </label>

                  <select
                    id={filter.name}
                    value={localFilters[filter.name] || ""}
                    onChange={(event) =>
                      handleChange(
                        filter.name,
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      {filter.placeholder ||
                        `All ${filter.label}`}
                    </option>

                    {filter.options?.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="filter-modal-footer">
              <button
                type="button"
                className="filter-reset-button"
                onClick={handleReset}
              >
                Reset
              </button>

              <div className="filter-footer-actions">
                <button
                  type="button"
                  className="filter-cancel-button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="filter-apply-button"
                  onClick={handleApply}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Filter;