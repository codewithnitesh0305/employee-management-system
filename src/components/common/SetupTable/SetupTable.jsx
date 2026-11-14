import { useEffect, useState } from "react";
import {
  LoaderCircle,
  MoreHorizontal,
  Search,
  Trash2,
  X,
} from "lucide-react";
import "./SetupTable.css";

function SetupTable({
  rows,
  columns,
  search,
  onSearchChange,
  selectedIds = [],
  onToggleRow,
  onToggleAll,
  actions = [],
  addAction,
  addActionPlacement = "end",
  onBulkDelete,
  isDeleting = false,
  isLoading = false,
  emptyMessage = "No items found.",
  filteredEmptyMessage = "No items match your search.",
  searchLabel = "Search items",
  tableLabel = "Items",
  selectable = true,
}) {
  const [openActionId, setOpenActionId] = useState(null);
  const allVisibleSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
  const columnCount =
    columns.length + (selectable ? 1 : 0) + (actions.length ? 1 : 0);

  useEffect(() => {
    const closeActionMenu = (event) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(".setup-row-actions")
      ) {
        setOpenActionId(null);
      }
    };
    const closeActionMenuOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpenActionId(null);
      }
    };

    document.addEventListener("pointerdown", closeActionMenu);
    document.addEventListener("keydown", closeActionMenuOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeActionMenu);
      document.removeEventListener("keydown", closeActionMenuOnEscape);
    };
  }, []);

  return (
    <section className="setup-table-card" aria-label={`${tableLabel} table`}>
      <div className="setup-toolbar">
        {addActionPlacement === "start" && addAction}
        <label className="setup-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={searchLabel}
          />
          {search && (
            <button
              type="button"
              className="setup-search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="setup-toolbar-actions">
          {selectedIds.length > 0 && onBulkDelete && (
            <button
              type="button"
              className="setup-bulk-delete-button"
              disabled={isDeleting}
              onClick={() => onBulkDelete(selectedIds)}
            >
              <Trash2 size={15} aria-hidden="true" />
              Delete selected ({selectedIds.length})
            </button>
          )}
          {addActionPlacement !== "start" && addAction}
        </div>
      </div>

      <div className="setup-table-scroll">
        <table className="setup-table">
          <thead>
            <tr>
              {selectable && (
                <th className="setup-checkbox-column">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={onToggleAll}
                    aria-label="Select all visible rows"
                    disabled={!rows.length || !onToggleAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.className}
                  scope="col"
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="setup-actions-column" scope="col">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="setup-empty" colSpan={columnCount}>
                  <LoaderCircle className="setup-loading-icon" size={18} />
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="setup-empty" colSpan={columnCount}>
                  {search.trim() ? filteredEmptyMessage : emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {selectable && (
                    <td className="setup-checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleRow?.(row.id)}
                        aria-label={`Select ${row.name || row.id}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={column.className}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="setup-actions-column">
                      <div
                        className={`setup-row-actions${openActionId === row.id ? " is-open" : ""}`}
                      >
                        <button
                          type="button"
                          className="setup-more-button"
                          aria-label={`Actions for ${row.name || row.id}`}
                          aria-expanded={openActionId === row.id}
                          onClick={() =>
                            setOpenActionId((current) =>
                              current === row.id ? null : row.id
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {openActionId === row.id && (
                          <div className="setup-action-menu">
                            {actions.map((action) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={action.key || action.label}
                                  type="button"
                                  disabled={action.disabled?.(row)}
                                  onClick={() => {
                                    setOpenActionId(null);
                                    action.onClick(row);
                                  }}
                                >
                                  {Icon && (
                                    <Icon size={14} aria-hidden="true" />
                                  )}
                                  {action.labelForRow
                                    ? action.labelForRow(row)
                                    : action.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SetupTable;
