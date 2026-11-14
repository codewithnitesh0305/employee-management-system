import { Search, X } from "lucide-react";
import "./FtsSearch.css";

function FtsSearch({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="fts-search">
      <Search size={18} className="fts-search-icon" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="fts-search-input"
      />

      {value && (
        <button
          type="button"
          className="fts-search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default FtsSearch;